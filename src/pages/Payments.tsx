import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FileDown, 
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { mockPayments, mockStudents } from "@/data/mockData";
import { Payment, SystemSettings, Student } from "@/types";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PaymentsList } from "@/components/payments/PaymentsList";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { AddPaymentDialog } from "@/components/payments/AddPaymentDialog";
import { sendSms, prepareSmsTemplate } from "@/lib/smsUtils";
import { CURRENT_ACADEMIC_YEAR, SPECIALIZATIONS, GROUPS, PAYMENT_STATUS } from "@/lib/constants";

// Mock settings for demonstration purposes
const mockSettings: SystemSettings = {
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
  smsEnabled: true,
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

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedPaymentPurpose, setSelectedPaymentPurpose] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(mockSettings);

  useEffect(() => {
    console.log("Fetching settings...");
  }, []);

  const filteredPayments = payments.filter(payment => {
    const student = mockStudents.find(s => s.id === payment.studentId);
    if (!student) return false;

    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || 
      payment.paymentMethod === selectedPaymentMethod;
    
    const matchesPaymentPurpose = selectedPaymentPurpose === 'all' || 
      payment.paymentPurpose === selectedPaymentPurpose;
    
    return matchesSearch && matchesPaymentMethod && matchesPaymentPurpose;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    } else {
      return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
    }
  });

  const handleAddPayment = async (formData: any) => {
    let student = mockStudents.find(s => 
      s.indexNumber.toLowerCase() === formData.indexNumber.toLowerCase()
    );
    
    if (!student) {
      const newStudentId = `student-${Date.now()}`;
      student = {
        id: newStudentId,
        name: formData.studentName,
        indexNumber: formData.indexNumber,
        email: "",
        phone: "",
        specialization: formData.indexNumber.split('/')[1] as any,
        group: "A",
        academicYear: CURRENT_ACADEMIC_YEAR,
        totalAmountDue: formData.amount,
        totalAmountPaid: 0,
        paymentStatus: PAYMENT_STATUS.OUTSTANDING,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockStudents.push(student);
    }

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      studentId: student.id,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      paymentPurpose: formData.paymentPurpose,
      payerType: formData.payerType || undefined,
      thirdPartyType: formData.thirdPartyType || undefined,
      thirdPartyDetails: formData.thirdPartyDetails || undefined,
      itemId: formData.courseId,
      transactionCode: formData.transactionCode,
      paymentDate: new Date(),
      recordedBy: "current-user-id",
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    student.totalAmountPaid += formData.amount;
    if (student.totalAmountPaid >= student.totalAmountDue) {
      student.paymentStatus = PAYMENT_STATUS.FULL;
    } else if (student.totalAmountPaid > 0) {
      student.paymentStatus = PAYMENT_STATUS.PARTIAL;
    }
    student.updatedAt = new Date();

    setPayments([newPayment, ...payments]);
    setIsAddingPayment(false);
    
    toast.success(`Payment of ${formatCurrency(formData.amount)} recorded successfully`, {
      description: `Transaction code: ${newPayment.transactionCode}`,
    });

    if (student && settings.smsEnabled && student.phone) {
      const totalPaid = student.totalAmountPaid;
      const isFullPayment = totalPaid >= student.totalAmountDue;
      const remainingBalance = Math.max(0, student.totalAmountDue - totalPaid);
      
      const templateKey = isFullPayment ? 'fullPayment' : 'partialPayment';
      const template = settings.smsTemplates[templateKey];
      
      const messageText = prepareSmsTemplate(template, {
        studentName: student.name,
        amount: formatCurrency(formData.amount),
        transactionCode: newPayment.transactionCode,
        remainingBalance: formatCurrency(remainingBalance)
      });
      
      try {
        const result = await sendSms({
          to: student.phone,
          message: messageText
        }, settings);
        
        if (result.success) {
          console.log("SMS sent successfully:", result.message);
        } else {
          console.error("Failed to send SMS:", result.message);
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    }
  };

  const openTransactionDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddingPayment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            selectedPaymentPurpose={selectedPaymentPurpose}
            setSelectedPaymentPurpose={setSelectedPaymentPurpose}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <PaymentsList 
            payments={sortedPayments} 
            onViewDetails={openTransactionDetails} 
          />
        </CardContent>
      </Card>

      <AddPaymentDialog 
        isOpen={isAddingPayment} 
        onOpenChange={setIsAddingPayment}
        onSubmit={handleAddPayment}
      />

      <PaymentDetailsDialog 
        selectedPayment={selectedPayment} 
        onClose={() => setSelectedPayment(null)} 
      />
    </div>
  );
}
