
import { useState } from 'react';
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
import { mockPayments } from "@/data/mockData";
import { Payment } from "@/types";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PaymentsList } from "@/components/payments/PaymentsList";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { AddPaymentDialog } from "@/components/payments/AddPaymentDialog";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedPaymentPurpose, setSelectedPaymentPurpose] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

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

  const handleAddPayment = (formData: any) => {
    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      studentId: formData.studentId,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      paymentPurpose: formData.paymentPurpose,
      itemId: formData.itemId,
      transactionCode: formData.transactionCode,
      paymentDate: new Date(),
      recordedBy: "current-user-id",
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPayments([newPayment, ...payments]);
    setIsAddingPayment(false);
    toast.success(`Payment of ${formatCurrency(formData.amount)} recorded successfully`, {
      description: `Transaction code: ${formData.transactionCode}`,
    });
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

// Add the missing import
import { mockStudents } from "@/data/mockData";
