
import { SmsMessage, SystemSettings } from "@/types";

export async function sendSms(
  message: SmsMessage,
  settings: SystemSettings
): Promise<{ success: boolean; message: string }> {
  if (!settings.smsEnabled || !settings.smsApiKey) {
    console.error("SMS is not enabled or API key is missing");
    return { success: false, message: "SMS is not enabled or API key is missing" };
  }

  try {
    console.log(`Sending SMS to ${message.to}: ${message.message}`);
    
    // In a real implementation, we would make an API call to the SMS provider
    // This is a mock implementation for demonstration purposes
    const provider = settings.smsProvider.toLowerCase();
    
    // Different providers might have different API formats
    let apiEndpoint = settings.smsApiUrl;
    let payload: any = {};

    switch (provider) {
      case 'mnotify':
        payload = {
          recipient: [message.to],
          sender: message.sender || settings.smsSenderName,
          message: message.message,
          key: settings.smsApiKey
        };
        break;
      
      case 'hubtel':
        payload = {
          From: message.sender || settings.smsSenderName,
          To: message.to,
          Content: message.message,
          ClientId: settings.smsApiKey,
          // Additional fields would be required for Hubtel
        };
        break;
      
      case 'twilio':
        // Twilio would typically use a different authentication approach
        apiEndpoint = `${settings.smsApiUrl}`;
        payload = {
          To: message.to,
          From: message.sender || settings.smsSenderName,
          Body: message.message
        };
        break;
      
      default:
        // Generic format for other providers
        payload = {
          to: message.to,
          from: message.sender || settings.smsSenderName,
          message: message.message,
          apiKey: settings.smsApiKey
        };
    }

    // For demonstration purposes, we're just logging the API call
    // In a real implementation, we would make an actual HTTP request
    console.log(`Would send to API: ${apiEndpoint}`, payload);

    // Mock a successful response
    return { 
      success: true, 
      message: "SMS sent successfully (simulated)" 
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { 
      success: false, 
      message: `Error sending SMS: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

export function prepareSmsTemplate(
  template: string,
  data: Record<string, string | number>
): string {
  return Object.entries(data).reduce((text, [key, value]) => {
    return text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, template);
}
