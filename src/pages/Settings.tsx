
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Save, 
  Bell, 
  Shield, 
  Settings as SettingsIcon, 
  User, 
  UserCog 
} from "lucide-react";
import { CURRENT_ACADEMIC_YEAR } from "@/lib/constants";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [generalSettings, setGeneralSettings] = useState({
    academicYear: CURRENT_ACADEMIC_YEAR,
    defaultPaymentAmount: "2000",
    allowPartialPayments: true,
    systemName: "TTU Computer Science Payment System",
    smtpServer: "smtp.ttu.edu.gh",
    smtpPort: "587",
    emailSender: "payments@ttu.edu.gh",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    notifyOnPayment: true,
    notifyOnRegistration: true,
    paymentReceiptTemplate: "Dear {studentName},\n\nYour payment of {amount} has been received with transaction code {transactionCode}.\n\nRemaining balance: {remainingBalance}\n\nThank you,\nTTU Computer Science Department",
    paymentReminderTemplate: "Dear {studentName},\n\nThis is a reminder that you have an outstanding balance of {remainingBalance}.\n\nPlease make your payment before the deadline.\n\nThank you,\nTTU Computer Science Department"
  });

  const handleGeneralSettingChange = (field: string, value: string | boolean) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value
    });
  };

  const handleNotificationSettingChange = (field: string, value: string | boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };

  const handleSaveGeneralSettings = () => {
    // In a real app, this would be an API call
    console.log("Saving general settings:", generalSettings);
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully.",
    });
  };

  const handleSaveNotificationSettings = () => {
    // In a real app, this would be an API call
    console.log("Saving notification settings:", notificationSettings);
    toast({
      title: "Notification settings saved",
      description: "Your notification settings have been updated successfully.",
    });
  };

  // Only super admins can access this page, redirect or show message otherwise
  if (user?.role !== "super_admin") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the settings page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact the super administrator if you need access to this section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your system's general settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="academicYear">Current Academic Year</FormLabel>
                  <Input 
                    id="academicYear" 
                    placeholder="Academic Year" 
                    value={generalSettings.academicYear}
                    onChange={(e) => handleGeneralSettingChange('academicYear', e.target.value)}
                  />
                  <FormDescription>
                    Format: YY (e.g., "24" for 2024)
                  </FormDescription>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="defaultPaymentAmount">Default Payment Amount (GHS)</FormLabel>
                  <Input 
                    id="defaultPaymentAmount" 
                    placeholder="Default Payment Amount" 
                    value={generalSettings.defaultPaymentAmount}
                    onChange={(e) => handleGeneralSettingChange('defaultPaymentAmount', e.target.value)}
                  />
                  <FormDescription>
                    Default amount for new students
                  </FormDescription>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="allowPartialPayments" 
                  checked={generalSettings.allowPartialPayments}
                  onCheckedChange={(checked) => handleGeneralSettingChange('allowPartialPayments', checked)}
                />
                <FormLabel htmlFor="allowPartialPayments">Allow Partial Payments</FormLabel>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <FormLabel htmlFor="systemName">System Name</FormLabel>
                <Input 
                  id="systemName" 
                  placeholder="System Name" 
                  value={generalSettings.systemName}
                  onChange={(e) => handleGeneralSettingChange('systemName', e.target.value)}
                />
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Email Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="smtpServer">SMTP Server</FormLabel>
                  <Input 
                    id="smtpServer" 
                    placeholder="SMTP Server" 
                    value={generalSettings.smtpServer}
                    onChange={(e) => handleGeneralSettingChange('smtpServer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="smtpPort">SMTP Port</FormLabel>
                  <Input 
                    id="smtpPort" 
                    placeholder="SMTP Port" 
                    value={generalSettings.smtpPort}
                    onChange={(e) => handleGeneralSettingChange('smtpPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <FormLabel htmlFor="emailSender">Sender Email</FormLabel>
                  <Input 
                    id="emailSender" 
                    placeholder="Sender Email" 
                    value={generalSettings.emailSender}
                    onChange={(e) => handleGeneralSettingChange('emailSender', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableEmailNotifications" 
                    checked={notificationSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('enableEmailNotifications', checked)}
                  />
                  <FormLabel htmlFor="enableEmailNotifications">Enable Email Notifications</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableSmsNotifications" 
                    checked={notificationSettings.enableSmsNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('enableSmsNotifications', checked)}
                  />
                  <FormLabel htmlFor="enableSmsNotifications">Enable SMS Notifications</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="notifyOnPayment" 
                    checked={notificationSettings.notifyOnPayment}
                    onCheckedChange={(checked) => handleNotificationSettingChange('notifyOnPayment', checked)}
                  />
                  <FormLabel htmlFor="notifyOnPayment">Notify Students on Payment</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="notifyOnRegistration" 
                    checked={notificationSettings.notifyOnRegistration}
                    onCheckedChange={(checked) => handleNotificationSettingChange('notifyOnRegistration', checked)}
                  />
                  <FormLabel htmlFor="notifyOnRegistration">Notify Students on Registration</FormLabel>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <FormLabel htmlFor="paymentReceiptTemplate">Payment Receipt Template</FormLabel>
                <Textarea 
                  id="paymentReceiptTemplate" 
                  placeholder="Payment Receipt Template" 
                  value={notificationSettings.paymentReceiptTemplate}
                  onChange={(e) => handleNotificationSettingChange('paymentReceiptTemplate', e.target.value)}
                  className="min-h-[150px]"
                />
                <FormDescription>
                  Use placeholders like {"{studentName}"}, {"{amount}"}, {"{transactionCode}"}, {"{remainingBalance}"}
                </FormDescription>
              </div>

              <div className="space-y-2">
                <FormLabel htmlFor="paymentReminderTemplate">Payment Reminder Template</FormLabel>
                <Textarea 
                  id="paymentReminderTemplate" 
                  placeholder="Payment Reminder Template" 
                  value={notificationSettings.paymentReminderTemplate}
                  onChange={(e) => handleNotificationSettingChange('paymentReminderTemplate', e.target.value)}
                  className="min-h-[150px]"
                />
                <FormDescription>
                  Use placeholders like {"{studentName}"}, {"{remainingBalance}"}
                </FormDescription>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactorAuth" />
                  <FormLabel htmlFor="twoFactorAuth">Enable Two-Factor Authentication</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sessionTimeout" />
                  <FormLabel htmlFor="sessionTimeout">Enable Session Timeout</FormLabel>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="sessionTimeoutMinutes">Session Timeout (minutes)</FormLabel>
                  <Input id="sessionTimeoutMinutes" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="passwordPolicy">Password Policy</FormLabel>
                  <Select defaultValue="strong">
                    <SelectTrigger id="passwordPolicy">
                      <SelectValue placeholder="Select a password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (min 8 characters)</SelectItem>
                      <SelectItem value="medium">Medium (min 8 chars, 1 number, 1 uppercase)</SelectItem>
                      <SelectItem value="strong">Strong (min 10 chars, 1 number, 1 uppercase, 1 special)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input id="name" placeholder="Full Name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input id="email" placeholder="Email" defaultValue={user?.email} />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <Input id="phone" placeholder="Phone Number" defaultValue={user?.phone || ''} />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Input id="role" placeholder="Role" defaultValue={user?.role} disabled />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                <Input id="currentPassword" type="password" placeholder="Current Password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                  <Input id="newPassword" type="password" placeholder="New Password" />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                  <Input id="confirmPassword" type="password" placeholder="Confirm New Password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
