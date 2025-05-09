import * as admin from 'firebase-admin';
import { sendSMS, formatAlertMessage } from './sms';

const db = admin.firestore();

interface Alert {
  projectId: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  stakeholders: string[];
  createdAt: admin.firestore.Timestamp;
}

export const createAlert = async (
  projectId: string,
  type: Alert['type'],
  message: string
): Promise<string> => {
  try {
    // Get project details
    const projectDoc = await db.collection('projects').doc(projectId).get();
    const project = projectDoc.data();

    if (!project) {
      throw new Error('Project not found');
    }

    // Create alert document
    const alertRef = await db.collection('alerts').add({
      projectId,
      type,
      message,
      stakeholders: project.stakeholders || [],
      createdAt: admin.firestore.Timestamp.now(),
      isRead: false
    });

    // Get stakeholder phone numbers
    const stakeholderDocs = await Promise.all(
      project.stakeholders.map((id: string) => 
        db.collection('users').doc(id).get()
      )
    );

    const phoneNumbers = stakeholderDocs
      .map(doc => doc.data()?.phoneNumber)
      .filter(Boolean);

    // Send SMS if there are phone numbers
    if (phoneNumbers.length > 0) {
      await sendSMS(
        phoneNumbers,
        formatAlertMessage(project.title, type, message)
      );
    }

    return alertRef.id;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};