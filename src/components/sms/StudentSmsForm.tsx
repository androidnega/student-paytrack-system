
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CheckCircle, Send, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Student, SystemSettings } from "@/types";
import { sendBulkSms, sendPaymentReminders, prepareSmsTemplate } from "@/lib/smsUtils";
import { Group, Specialization } from "@/lib/constants";

interface StudentSmsFormProps {
  students: Student[];
  settings: SystemSettings;
}

export function StudentSmsForm({ students, settings }: StudentSmsFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [messageText, setMessageText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [onlyWithBalance, setOnlyWithBalance] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    
    switch (value) {
      case "fullPayment":
        setMessageText(settings.smsTemplates.fullPayment);
        break;
      case "partialPayment":
        setMessageText(settings.smsTemplates.partialPayment);
        break;
      case "paymentReminder":
        setMessageText(settings.smsTemplates.paymentReminder);
        break;
      default:
        setMessageText("");
    }
  };

  // Filter students based on selection
  const getFilteredStudents = (): Student[] => {
    return students.filter(student => {
      const matchesGroup = selectedGroup === "all" || student.group === selectedGroup;
      const matchesSpecialization = selectedSpecialization === "all" || student.specialization === selectedSpecialization;
      const matchesBalance = !onlyWithBalance || (student.totalAmountDue > student.totalAmountPaid);
      
      return matchesGroup && matchesSpecialization && matchesBalance;
    });
  };

  const handleSendSms = async () => {
    const filteredStudents = getFilteredStudents();
    
    if (filteredStudents.length === 0) {
      toast.error("No students match the selected filters");
      return;
    }

    if (!messageText.trim()) {
      toast.error("Message text cannot be empty");
      return;
    }

    setIsSending(true);

    try {
      let result;
      
      if (selectedTemplate === "paymentReminder") {
        // For payment reminders, use the specialized function
        result = await sendPaymentReminders(filteredStudents, settings);
      } else {
        // For other templates or custom messages, use the bulk send function
        result = await sendBulkSms(
          filteredStudents,
          messageText,
          {
            // Common template data
            paymentDeadline: settings.paymentDeadline,
            academicYear: settings.academicYear,
          },
          settings
        );
      }

      if (result.success) {
        toast.success(`SMS sent successfully`, {
          description: `${result.sent} messages sent, ${result.failed} failed`,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
      } else {
        toast.error(`Failed to send SMS`, {
          description: result.message,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    } catch (error) {
      toast.error("Error sending SMS", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredStudentsCount = getFilteredStudents().length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send SMS to Students</CardTitle>
        <CardDescription>
          Send SMS notifications to students based on various criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="template">Message Template</Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Message</SelectItem>
                <SelectItem value="fullPayment">Full Payment Notification</SelectItem>
                <SelectItem value="partialPayment">Partial Payment Notification</SelectItem>
                <SelectItem value="paymentReminder">Payment Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Student Group</Label>
            <Select
              value={selectedGroup}
              onValueChange={setSelectedGroup}
            >
              <SelectTrigger id="group">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {Object.values(Group).map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger id="specialization">
                <SelectValue placeholder="Select a specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {Object.values(Specialization).map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="onlyWithBalance"
              checked={onlyWithBalance}
              onCheckedChange={setOnlyWithBalance}
            />
            <Label htmlFor="onlyWithBalance">Only students with outstanding balance</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="messageText">Message Text</Label>
          <Textarea
            id="messageText"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="min-h-[150px]"
            placeholder="Enter your message here. You can use placeholders like {studentName}, {remainingBalance}, etc."
          />
          <p className="text-xs text-muted-foreground">
            Available placeholders: {"{studentName}"}, {"{indexNumber}"}, {"{totalAmountDue}"}, 
            {"{totalAmountPaid}"}, {"{remainingBalance}"}, {"{paymentDeadline}"}, {"{academicYear}"}
          </p>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Preview</h4>
          <p className="text-sm whitespace-pre-wrap">
            {messageText ? (
              prepareSmsTemplate(messageText, {
                studentName: "John Doe",
                indexNumber: "CS/2023/001",
                totalAmountDue: 2000,
                totalAmountPaid: 1000,
                remainingBalance: 1000,
                paymentDeadline: settings.paymentDeadline,
                academicYear: settings.academicYear,
              })
            ) : (
              <span className="text-muted-foreground italic">No message to preview</span>
            )}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredStudentsCount} {filteredStudentsCount === 1 ? 'student' : 'students'} selected
        </div>
        <Button 
          onClick={handleSendSms} 
          disabled={isSending || filteredStudentsCount === 0 || !messageText.trim() || !settings.smsEnabled}
          className="w-full sm:w-auto"
        >
          {isSending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send SMS
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
