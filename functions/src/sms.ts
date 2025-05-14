import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const db = admin.firestore();

// Function to send SMS via Africa's Talking
interface SMSResponse {
  success: boolean;
  data: {
    SMSMessageData: {
      Message: string;
      Recipients: Array<{
        statusCode: number;
        number: string;
        status: string;
        cost: string;
        messageId: string;
      }>;
    };
  };
}

export async function sendSMS(to: string | string[], message: string): Promise<SMSResponse> {
  try {
    // Get Africa's Talking config from environment
    const username = functions.config().africastalking.username;
    const apiKey = functions.config().africastalking.apikey;
    const shortcode = functions.config().africastalking.shortcode || '';
    
    if (!username || !apiKey) {
      throw new Error('Africa\'s Talking credentials not configured');
    }
    
    // Format the recipients
    const recipients = Array.isArray(to) ? to : [to];
    
    // Prepare the request payload
    const data = {
      username,
      to: recipients.join(','),
      message,
      ...(shortcode && { from: shortcode })
    };

    // Make API request to Africa's Talking
    const response = await axios({
      method: 'POST',
      url: 'https://api.africastalking.com/version1/messaging',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': apiKey
      },
      data: new URLSearchParams(data)
    });

    // Log the successful SMS sending
    await db.collection('sms_logs').add({
      recipients,
      message,
      status: 'success',
      response: response.data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    // Log the error
    console.error('Error sending SMS:', error);
    
    // Store the error in Firestore logs
    await db.collection('sms_logs').add({
      recipients: Array.isArray(to) ? to : [to],
      message,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    throw new functions.https.HttpsError(
      'internal',
      'Failed to send SMS',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

// Helper function to format alert messages
export function formatAlertMessage(
  projectTitle: string,
  alertType: string,
  message: string
): string {
  return `UjenziIQ Alert\n${projectTitle}\nType: ${alertType}\n${message}`;
}

// Function to send bulk SMS to stakeholders
export async function sendBulkSMS(
  projectId: string,
  message: string,
  alertType: string
): Promise<void> {
  try {
    // Get project details
    const projectDoc = await db.collection('projects').doc(projectId).get();
    const project = projectDoc.data();

    if (!project) {
      throw new Error('Project not found');
    }

    // Get stakeholder phone numbers
    const stakeholderDocs = await Promise.all(
      project.stakeholders.map((id: string) => 
        db.collection('users').doc(id).get()
      )
    );

    const phoneNumbers = stakeholderDocs
      .map(doc => doc.data()?.phoneNumber)
      .filter(Boolean);

    if (phoneNumbers.length === 0) {
      console.log('No phone numbers found for stakeholders');
      return;
    }

    // Format and send the message
    const formattedMessage = formatAlertMessage(
      project.title,
      alertType,
      message
    );

    await sendSMS(phoneNumbers, formattedMessage);

  } catch (error) {
    console.error('Error sending bulk SMS:', error);
    throw error;
  }
}