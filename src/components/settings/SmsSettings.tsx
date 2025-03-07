
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Save, RefreshCw, MessageSquare } from "lucide-react";
import { SystemSettings } from '@/types';

interface SmsSettingsProps {
  settings: SystemSettings;
  onSave: (settings: SystemSettings) => void;
}

export function SmsSettings({ settings, onSave }: SmsSettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsSettings, setSmsSettings] = useState({
    smsEnabled: settings.smsEnabled || false,
    smsProvider: settings.smsProvider || "mnotify",
    smsApiKey: settings.smsApiKey || "",
    smsApiUrl: settings.smsApiUrl || "",
    smsSenderName: settings.smsSenderName || "",
    smsTemplates: {
      fullPayment: settings.smsTemplates?.fullPayment || "Dear {studentName}, your payment of {amount} has been received in full. Thank you for your payment. TTU Computer Science Dept.",
      partialPayment: settings.smsTemplates?.partialPayment || "Dear {studentName}, your partial payment of {amount} has been received. Outstanding balance: {remainingBalance}. TTU Computer Science Dept.",
      paymentReminder: settings.smsTemplates?.paymentReminder || "Dear {studentName}, this is a reminder that you have an outstanding balance of {remainingBalance}. Please make payment before {paymentDeadline}. TTU Computer Science Dept."
    }
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSmsSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (field: keyof typeof smsSettings.smsTemplates, value: string) => {
    setSmsSettings((prev) => ({
      ...prev,
      smsTemplates: {
        ...prev.smsTemplates,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSave({
        ...settings,
        ...smsSettings
      });
      
      toast({
        title: "SMS settings saved",
        description: "Your SMS settings have been updated successfully.",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const handleTestSms = () => {
    // Simulate sending a test SMS
    toast({
      title: "Test SMS",
      description: "A test SMS would be sent now if connected to a real SMS provider.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Integration Settings</CardTitle>
        <CardDescription>
          Configure how and when SMS notifications are sent to students about payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="smsEnabled" 
            checked={smsSettings.smsEnabled}
            onCheckedChange={(checked) => handleChange('smsEnabled', checked)}
          />
          <Label htmlFor="smsEnabled">Enable SMS Notifications</Label>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-md font-medium flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-primary" />
            SMS Provider Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smsProvider">SMS Provider</Label>
              <Select 
                value={smsSettings.smsProvider}
                onValueChange={(value) => handleChange('smsProvider', value)}
                disabled={!smsSettings.smsEnabled}
              >
                <SelectTrigger id="smsProvider">
                  <SelectValue placeholder="Select SMS Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mnotify">MNotify</SelectItem>
                  <SelectItem value="hubtel">Hubtel</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsSenderName">Sender Name</Label>
              <Input 
                id="smsSenderName" 
                placeholder="TTU-CS" 
                value={smsSettings.smsSenderName}
                onChange={(e) => handleChange('smsSenderName', e.target.value)}
                disabled={!smsSettings.smsEnabled}
              />
              <p className="text-xs text-muted-foreground">
                This name will appear as the sender of the SMS messages
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsApiKey">API Key</Label>
              <Input 
                id="smsApiKey" 
                type="password" 
                placeholder="••••••••••••••••"
                value={smsSettings.smsApiKey}
                onChange={(e) => handleChange('smsApiKey', e.target.value)}
                disabled={!smsSettings.smsEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsApiUrl">API URL</Label>
              <Input 
                id="smsApiUrl" 
                placeholder="https://api.provider.com/sms/send"
                value={smsSettings.smsApiUrl}
                onChange={(e) => handleChange('smsApiUrl', e.target.value)}
                disabled={!smsSettings.smsEnabled}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTestSms}
              disabled={!smsSettings.smsEnabled || !smsSettings.smsApiKey}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Test SMS
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-md font-medium flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            SMS Templates
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullPaymentTemplate">Full Payment Template</Label>
              <Textarea 
                id="fullPaymentTemplate" 
                placeholder="Full payment message template" 
                value={smsSettings.smsTemplates.fullPayment}
                onChange={(e) => handleTemplateChange('fullPayment', e.target.value)}
                className="min-h-[100px]"
                disabled={!smsSettings.smsEnabled}
              />
              <p className="text-xs text-muted-foreground">
                Use placeholders like {"{studentName}"}, {"{amount}"}, {"{transactionCode}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partialPaymentTemplate">Partial Payment Template</Label>
              <Textarea 
                id="partialPaymentTemplate" 
                placeholder="Partial payment message template" 
                value={smsSettings.smsTemplates.partialPayment}
                onChange={(e) => handleTemplateChange('partialPayment', e.target.value)}
                className="min-h-[100px]"
                disabled={!smsSettings.smsEnabled}
              />
              <p className="text-xs text-muted-foreground">
                Use placeholders like {"{studentName}"}, {"{amount}"}, {"{remainingBalance}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReminderTemplate">Payment Reminder Template</Label>
              <Textarea 
                id="paymentReminderTemplate" 
                placeholder="Payment reminder message template" 
                value={smsSettings.smsTemplates.paymentReminder}
                onChange={(e) => handleTemplateChange('paymentReminder', e.target.value)}
                className="min-h-[100px]"
                disabled={!smsSettings.smsEnabled}
              />
              <p className="text-xs text-muted-foreground">
                Use placeholders like {"{studentName}"}, {"{remainingBalance}"}, {"{paymentDeadline}"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSubmitting || !smsSettings.smsEnabled}>
          {isSubmitting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save SMS Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
