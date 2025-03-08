
import { SmsMessage, SystemSettings, Student } from "@/types";

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

// New function to send bulk SMS to multiple students
export async function sendBulkSms(
  students: Student[],
  messageTemplate: string,
  templateData: Record<string, string | number>,
  settings: SystemSettings
): Promise<{ success: boolean; sent: number; failed: number; message: string }> {
  if (!settings.smsEnabled || !settings.smsApiKey) {
    console.error("SMS is not enabled or API key is missing");
    return { 
      success: false, 
      sent: 0, 
      failed: students.length,
      message: "SMS is not enabled or API key is missing" 
    };
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const student of students) {
    if (!student.phone) {
      console.warn(`Student ${student.id} has no phone number`);
      failedCount++;
      continue;
    }

    // Prepare message with student-specific data
    const studentData = {
      ...templateData,
      studentName: student.name,
      indexNumber: student.indexNumber,
      totalAmountDue: student.totalAmountDue,
      totalAmountPaid: student.totalAmountPaid,
      remainingBalance: student.totalAmountDue - student.totalAmountPaid,
    };

    const messageText = prepareSmsTemplate(messageTemplate, studentData);

    // Send the SMS
    const result = await sendSms(
      {
        to: student.phone,
        message: messageText,
      },
      settings
    );

    if (result.success) {
      sentCount++;
    } else {
      failedCount++;
      console.error(`Failed to send SMS to ${student.name} (${student.phone}):`, result.message);
    }
  }

  return {
    success: sentCount > 0,
    sent: sentCount,
    failed: failedCount,
    message: `Sent ${sentCount} SMS messages, ${failedCount} failed`
  };
}

// New function to send payment reminders to students with outstanding balances
export async function sendPaymentReminders(
  students: Student[],
  settings: SystemSettings
): Promise<{ success: boolean; sent: number; failed: number; message: string }> {
  // Filter students with outstanding balances
  const studentsWithBalance = students.filter(
    student => student.totalAmountPaid < student.totalAmountDue
  );

  if (studentsWithBalance.length === 0) {
    return {
      success: true,
      sent: 0,
      failed: 0,
      message: "No students with outstanding balances found"
    };
  }

  return sendBulkSms(
    studentsWithBalance,
    settings.smsTemplates.paymentReminder,
    {
      paymentDeadline: settings.paymentDeadline
    },
    settings
  );
}
