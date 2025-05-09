import AfricasTalking from 'africastalking';

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY || 'sandbox',
  username: process.env.AFRICAS_TALKING_USERNAME || 'sandbox',
});

export const sms = africastalking.SMS;