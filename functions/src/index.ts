import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();

// Live SMS endpoint
export const sendLiveSMS = functions.https.onRequest(async (req, res) => {
  try {
    // Validate request body
    if (!req.body?.phoneNumber || !req.body?.message) {
      throw new Error("Missing required fields: phoneNumber or message");
    }

    // Africa's Talking live credentials
    const username = "ujenziiq";
    const apiKey = "atsk_a875a7702352ea29d9ed54c4e528822d38bc726462609531487c31f5a1b58b563c95a541";
    
    // Message configuration
    const message = {
      to: req.body.phoneNumber.trim(),
      text: req.body.message.trim()
    };

    // Validate phone number format
    if (!message.to.startsWith("+")) {
      message.to = `+${message.to}`;
    }

    console.log("Attempting to send SMS with payload:", {
      username,
      to: message.to,
      messageLength: message.text.length
    });
    
    // Send SMS via Africa's Talking Live API
    const response = await axios({
      method: "POST",
      url: "https://api.africastalking.com/version1/messaging",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "apiKey": apiKey,
      },
      data: new URLSearchParams({
        username,
        to: message.to,
        message: message.text,
      }),
    });

    // Verify API response
    if (!response.data.SMSMessageData?.Recipients?.length) {
      throw new Error("Invalid response from Africa's Talking API");
    }

    console.log("API Response:", JSON.stringify(response.data, null, 2));

    // Store in Firestore
    const timestamp = admin.firestore.Timestamp.now();
    const logRef = await db.collection("sms_logs").add({
      to: message.to,
      message: message.text,
      status: "sent",
      timestamp: timestamp,
      responseData: response.data,
      environment: "production",
      messageId: response.data.SMSMessageData?.Recipients[0]?.messageId
    });

    console.log("SMS log stored with ID:", logRef.id);

    res.status(200).json({
      success: true,
      message: "Live SMS sent successfully",
      details: {
        ...message,
        timestamp: timestamp.toDate(),
        response: response.data,
        logId: logRef.id
      },
    });

  } catch (error) {
    console.error("Failed to send live SMS:", error);
    
    // Store failed attempt in Firestore
    try {
      await db.collection("sms_logs").add({
        to: req.body?.phoneNumber,
        message: req.body?.message,
        status: "failed",
        timestamp: admin.firestore.Timestamp.now(),
        error: error instanceof Error ? error.message : "Unknown error",
        environment: "production"
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS",
      timestamp: admin.firestore.Timestamp.now().toDate()
    });
  }
});