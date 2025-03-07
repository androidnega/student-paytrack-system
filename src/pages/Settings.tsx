
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
  UserCog,
  School,
  GraduationCap,
  BookOpen,
  CreditCard,
  MailCheck,
  Phone,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { CURRENT_ACADEMIC_YEAR } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SystemSettings } from '@/types';

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState<SystemSettings>({
    academicYear: CURRENT_ACADEMIC_YEAR,
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
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    notifyOnPayment: true,
    notifyOnRegistration: true,
    notifyOnDeadline: true,
    notifyAdminOnNewPayment: true,
    emailFrequency: "instant",
    smsProvider: "mnotify",
    smsApiKey: "••••••••••••••••",
    paymentReceiptTemplate: "Dear {studentName},\n\nYour payment of {amount} has been received with transaction code {transactionCode}.\n\nRemaining balance: {remainingBalance}\n\nThank you,\nTTU Computer Science Department",
    paymentReminderTemplate: "Dear {studentName},\n\nThis is a reminder that you have an outstanding balance of {remainingBalance}.\n\nPlease make your payment before the deadline.\n\nThank you,\nTTU Computer Science Department"
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    sessionTimeoutMinutes: "30",
    passwordPolicy: "strong",
    maxLoginAttempts: "5",
    lockoutDuration: "30",
    passwordExpiryDays: "90",
    enforcePasswordHistory: "3",
    auditLogging: true,
    ipRestriction: false,
    allowedIPs: "",
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

  const handleSecuritySettingChange = (field: string, value: string | boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    });
  };

  const handleSaveGeneralSettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Saving general settings:", generalSettings);
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSaveNotificationSettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Saving notification settings:", notificationSettings);
      toast({
        title: "Notification settings saved",
        description: "Your notification settings have been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSaveSecuritySettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Saving security settings:", securitySettings);
      toast({
        title: "Security settings saved",
        description: "Your security settings have been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your system preferences and application settings
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Changes to these settings will affect how the entire application works. Please be careful.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
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
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <School className="h-5 w-5 text-primary" /> 
                  Institution Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="institution">Institution Name</FormLabel>
                    <Input 
                      id="institution" 
                      value={generalSettings.institution}
                      onChange={(e) => handleGeneralSettingChange('institution', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="faculty">Faculty</FormLabel>
                    <Input 
                      id="faculty" 
                      value={generalSettings.faculty}
                      onChange={(e) => handleGeneralSettingChange('faculty', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="department">Department</FormLabel>
                    <Input 
                      id="department" 
                      value={generalSettings.department}
                      onChange={(e) => handleGeneralSettingChange('department', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="systemName">System Name</FormLabel>
                    <Input 
                      id="systemName" 
                      value={generalSettings.systemName}
                      onChange={(e) => handleGeneralSettingChange('systemName', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormLabel htmlFor="academicTerm">Current Term</FormLabel>
                    <Select 
                      value={generalSettings.academicTerm}
                      onValueChange={(value) => handleGeneralSettingChange('academicTerm', value)}
                    >
                      <SelectTrigger id="academicTerm">
                        <SelectValue placeholder="Select Term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First Semester">First Semester</SelectItem>
                        <SelectItem value="Second Semester">Second Semester</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="paymentDeadline">Payment Deadline</FormLabel>
                    <Input 
                      id="paymentDeadline" 
                      type="date" 
                      value={generalSettings.paymentDeadline}
                      onChange={(e) => handleGeneralSettingChange('paymentDeadline', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="defaultPaymentAmount">Default Payment Amount</FormLabel>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        {generalSettings.currency}
                      </span>
                      <Input 
                        id="defaultPaymentAmount" 
                        className="rounded-l-none"
                        placeholder="Default Payment Amount" 
                        value={generalSettings.defaultPaymentAmount}
                        onChange={(e) => handleGeneralSettingChange('defaultPaymentAmount', e.target.value)}
                      />
                    </div>
                    <FormDescription>
                      Default amount for new students
                    </FormDescription>
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="currency">Currency</FormLabel>
                    <Select 
                      value={generalSettings.currency}
                      onValueChange={(value) => handleGeneralSettingChange('currency', value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GHS">GHS (Ghana Cedi)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <Switch 
                    id="allowPartialPayments" 
                    checked={generalSettings.allowPartialPayments}
                    onCheckedChange={(checked) => handleGeneralSettingChange('allowPartialPayments', checked)}
                  />
                  <FormLabel htmlFor="allowPartialPayments">Allow Partial Payments</FormLabel>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <MailCheck className="h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="contactEmail">Contact Email</FormLabel>
                    <Input 
                      id="contactEmail" 
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => handleGeneralSettingChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="contactPhone">Contact Phone</FormLabel>
                    <Input 
                      id="contactPhone" 
                      value={generalSettings.contactPhone}
                      onChange={(e) => handleGeneralSettingChange('contactPhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <FormLabel htmlFor="websiteUrl">Website URL</FormLabel>
                    <Input 
                      id="websiteUrl" 
                      type="url"
                      value={generalSettings.websiteUrl}
                      onChange={(e) => handleGeneralSettingChange('websiteUrl', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <MailCheck className="h-5 w-5 text-primary" />
                  Email Configuration
                </h3>
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
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
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
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        id="notifyOnPayment" 
                        checked={notificationSettings.notifyOnPayment}
                        onCheckedChange={(checked) => handleNotificationSettingChange('notifyOnPayment', checked)}
                      />
                      <FormLabel htmlFor="notifyOnPayment">Notify Students on Payment</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notifyOnDeadline" 
                        checked={notificationSettings.notifyOnDeadline}
                        onCheckedChange={(checked) => handleNotificationSettingChange('notifyOnDeadline', checked)}
                      />
                      <FormLabel htmlFor="notifyOnDeadline">Send Payment Deadline Reminders</FormLabel>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
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
                        id="notifyOnRegistration" 
                        checked={notificationSettings.notifyOnRegistration}
                        onCheckedChange={(checked) => handleNotificationSettingChange('notifyOnRegistration', checked)}
                      />
                      <FormLabel htmlFor="notifyOnRegistration">Notify Students on Registration</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notifyAdminOnNewPayment" 
                        checked={notificationSettings.notifyAdminOnNewPayment}
                        onCheckedChange={(checked) => handleNotificationSettingChange('notifyAdminOnNewPayment', checked)}
                      />
                      <FormLabel htmlFor="notifyAdminOnNewPayment">Notify Admins on New Payments</FormLabel>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Phone className="h-5 w-5 text-primary" />
                  SMS Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="smsProvider">SMS Provider</FormLabel>
                    <Select 
                      value={notificationSettings.smsProvider}
                      onValueChange={(value) => handleNotificationSettingChange('smsProvider', value)}
                    >
                      <SelectTrigger id="smsProvider">
                        <SelectValue placeholder="Select SMS Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mnotify">MNotify</SelectItem>
                        <SelectItem value="hubtel">Hubtel</SelectItem>
                        <SelectItem value="twilio">Twilio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="smsApiKey">API Key</FormLabel>
                    <Input 
                      id="smsApiKey" 
                      type="password" 
                      value={notificationSettings.smsApiKey}
                      onChange={(e) => handleNotificationSettingChange('smsApiKey', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Bell className="h-5 w-5 text-primary" />
                  Email Frequency
                </h3>
                <div className="space-y-2">
                  <FormLabel htmlFor="emailFrequency">Email Delivery Frequency</FormLabel>
                  <Select 
                    value={notificationSettings.emailFrequency}
                    onValueChange={(value) => handleNotificationSettingChange('emailFrequency', value)}
                  >
                    <SelectTrigger id="emailFrequency">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant (Send immediately)</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <MailCheck className="h-5 w-5 text-primary" />
                  Email Templates
                </h3>
                <div className="space-y-4">
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
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </>
                )}
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
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  Authentication Settings
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorAuth', checked)}
                    />
                    <FormLabel htmlFor="twoFactorAuth">Enable Two-Factor Authentication</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sessionTimeout"
                      checked={securitySettings.sessionTimeout}
                      onCheckedChange={(checked) => handleSecuritySettingChange('sessionTimeout', checked)}
                    />
                    <FormLabel htmlFor="sessionTimeout">Enable Session Timeout</FormLabel>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <FormLabel htmlFor="sessionTimeoutMinutes">Session Timeout (minutes)</FormLabel>
                  <Input 
                    id="sessionTimeoutMinutes" 
                    placeholder="30" 
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={(e) => handleSecuritySettingChange('sessionTimeoutMinutes', e.target.value)}
                    disabled={!securitySettings.sessionTimeout}
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-primary" />
                  Password Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="passwordPolicy">Password Requirements</FormLabel>
                    <Select 
                      value={securitySettings.passwordPolicy}
                      onValueChange={(value) => handleSecuritySettingChange('passwordPolicy', value)}
                    >
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
                  <div className="space-y-2">
                    <FormLabel htmlFor="passwordExpiryDays">Password Expiry (days)</FormLabel>
                    <Input 
                      id="passwordExpiryDays" 
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) => handleSecuritySettingChange('passwordExpiryDays', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="enforcePasswordHistory">Password History</FormLabel>
                    <Input 
                      id="enforcePasswordHistory" 
                      placeholder="Last 3 passwords" 
                      value={securitySettings.enforcePasswordHistory}
                      onChange={(e) => handleSecuritySettingChange('enforcePasswordHistory', e.target.value)}
                    />
                    <FormDescription>
                      Number of previous passwords that cannot be reused
                    </FormDescription>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Account Lockout
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="maxLoginAttempts">Max Login Attempts</FormLabel>
                    <Input 
                      id="maxLoginAttempts" 
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', e.target.value)}
                    />
                    <FormDescription>
                      Number of failed attempts before account lockout
                    </FormDescription>
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="lockoutDuration">Lockout Duration (minutes)</FormLabel>
                    <Input 
                      id="lockoutDuration" 
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => handleSecuritySettingChange('lockoutDuration', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  Additional Security
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auditLogging"
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => handleSecuritySettingChange('auditLogging', checked)}
                    />
                    <FormLabel htmlFor="auditLogging">Enable Audit Logging</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="ipRestriction"
                      checked={securitySettings.ipRestriction}
                      onCheckedChange={(checked) => handleSecuritySettingChange('ipRestriction', checked)}
                    />
                    <FormLabel htmlFor="ipRestriction">Enable IP Restriction</FormLabel>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <FormLabel htmlFor="allowedIPs">Allowed IP Addresses</FormLabel>
                  <Textarea 
                    id="allowedIPs" 
                    placeholder="Enter comma-separated IP addresses or ranges" 
                    value={securitySettings.allowedIPs}
                    onChange={(e) => handleSecuritySettingChange('allowedIPs', e.target.value)}
                    disabled={!securitySettings.ipRestriction}
                  />
                  <FormDescription>
                    Format: 192.168.1.1, 10.0.0.0/24
                  </FormDescription>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecuritySettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </>
                )}
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
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
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
                    <FormDescription>
                      Role changes must be made by another super admin
                    </FormDescription>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-primary" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Current Password" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
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
