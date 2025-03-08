
import { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ExclamationTriangleIcon, 
  MessageSquare, 
  Settings, 
  Clock, 
  Bell 
} from "lucide-react";
import { StudentSmsForm } from "@/components/sms/StudentSmsForm";
import { mockStudents } from "@/data/mockData";
import { SystemSettings } from "@/types";

// Mock settings for demonstration purposes - would come from a context or API in production
const mockSettings: SystemSettings = {
  academicYear: "2023/2024",
  defaultPaymentAmount: "2000",
  allowPartialPayments: true,
  systemName: "TTU Computer Science Payment System",
  smtpServer: "smtp.ttu.edu.gh",
  smtpPort: "587",
  emailSender: "payments@ttu.edu.gh",
  department: "Computer Science",
  faculty: "Applied Sciences",
  institution: "Takoradi Technical University",
  currency: "GHS",
  paymentDeadline: "2023-12-31",
  academicTerm: "Second Semester",
  contactEmail: "computerscience@ttu.edu.gh",
  contactPhone: "+233 302 123 4567",
  websiteUrl: "https://cs.ttu.edu.gh",
  // SMS settings
  smsEnabled: true, // For demo we'll set this to true
  smsProvider: "mnotify",
  smsApiKey: "demo-api-key",
  smsApiUrl: "https://api.mnotify.com/api/sms/quick",
  smsSenderName: "TTU-CS",
  smsTemplates: {
    fullPayment: "Dear {studentName}, your payment of {amount} has been received in full. Thank you for your payment. TTU Computer Science Dept.",
    partialPayment: "Dear {studentName}, your partial payment of {amount} has been received. Outstanding balance: {remainingBalance}. TTU Computer Science Dept.",
    paymentReminder: "Dear {studentName}, this is a reminder that you have an outstanding balance of {remainingBalance}. Please make payment before {paymentDeadline}. TTU Computer Science Dept."
  }
};

export default function SmsMessages() {
  const [settings, setSettings] = useState<SystemSettings>(mockSettings);
  
  useEffect(() => {
    // In a real application, we would fetch settings from an API or context
    console.log("Fetching SMS settings...");
    // setSettings(fetchedSettings);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">SMS Messages</h1>
        <p className="text-muted-foreground">
          Send bulk SMS notifications to students about payments and other important information
        </p>
      </div>

      {!settings.smsEnabled && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>SMS is disabled</AlertTitle>
          <AlertDescription>
            SMS functionality is currently disabled. Please enable it in the SMS settings page.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Send
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Scheduled
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <StudentSmsForm
            students={mockStudents}
            settings={settings}
          />
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Messages</CardTitle>
              <CardDescription>
                View and manage scheduled SMS messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Clock className="h-8 w-8 mb-2" />
                <p>No scheduled messages</p>
                <p className="text-sm">Scheduled messages will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Message Logs</CardTitle>
              <CardDescription>
                History of SMS messages sent through the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2" />
                <p>No message logs yet</p>
                <p className="text-sm">Message history will appear here after messages are sent</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
