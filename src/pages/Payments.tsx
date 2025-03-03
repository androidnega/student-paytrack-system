
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  FileDown, 
  Plus, 
  CalendarIcon 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_METHODS, PAYMENT_PURPOSES } from "@/lib/constants";
import { mockPayments, mockStudents, mockCourses } from "@/data/mockData";
import { Payment } from "@/types";
import { PaymentForm } from "@/components/PaymentForm";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedPaymentPurpose, setSelectedPaymentPurpose] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    // Find student to get access to their name and index number
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

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    } else {
      return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
    }
  });

  // Function to get payment method badge color
  const getPaymentMethodColor = (method: string) => {
    switch(method) {
      case PAYMENT_METHODS.MOMO:
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case PAYMENT_METHODS.CASH:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  // Function to get payment purpose badge color
  const getPaymentPurposeColor = (purpose: string) => {
    switch(purpose) {
      case PAYMENT_PURPOSES.BOOK:
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case PAYMENT_PURPOSES.HANDOUT:
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case PAYMENT_PURPOSES.TRIP:
        return "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20";
      case PAYMENT_PURPOSES.OTHER:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  // Get payment purpose display name
  const getPaymentPurposeDisplay = (purpose: string) => {
    switch(purpose) {
      case PAYMENT_PURPOSES.BOOK:
        return "Book";
      case PAYMENT_PURPOSES.HANDOUT:
        return "Handout";
      case PAYMENT_PURPOSES.TRIP:
        return "Trip";
      case PAYMENT_PURPOSES.OTHER:
        return "Other";
      default:
        return purpose;
    }
  };

  // Handle payment form submission
  const handleAddPayment = (formData: any) => {
    // Create a new payment entry
    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      studentId: formData.studentId,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      paymentPurpose: formData.paymentPurpose,
      itemId: formData.itemId,
      transactionCode: formData.transactionCode,
      paymentDate: new Date(),
      recordedBy: "current-user-id", // This would come from auth context in a real app
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add new payment to the list
    setPayments([newPayment, ...payments]);
    
    // Close the dialog
    setIsAddingPayment(false);
    
    // Show success message
    toast.success(`Payment of ${formatCurrency(formData.amount)} recorded successfully`, {
      description: `Transaction code: ${formData.transactionCode}`,
    });
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, index number, or transaction code..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Payment Method</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.MOMO}>Mobile Money</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.CASH}>Cash</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPaymentPurpose} onValueChange={setSelectedPaymentPurpose}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Payment Purpose</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.BOOK}>Book</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.HANDOUT}>Handout</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.TRIP}>Trip</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[150px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Sort</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden md:table-cell">Index Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Purpose</TableHead>
                  <TableHead className="hidden lg:table-cell">Course/Item</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPayments.length > 0 ? (
                  sortedPayments.map((payment) => {
                    const student = mockStudents.find(s => s.id === payment.studentId);
                    if (!student) return null;
                    
                    let courseInfo = "";
                    if (payment.itemId && (payment.paymentPurpose === PAYMENT_PURPOSES.BOOK || payment.paymentPurpose === PAYMENT_PURPOSES.HANDOUT)) {
                      const course = mockCourses.find(c => c.id === payment.itemId);
                      if (course) {
                        courseInfo = `${course.code} - ${course.name}`;
                      }
                    }
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(new Date(payment.paymentDate))}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.indexNumber}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={cn(getPaymentPurposeColor(payment.paymentPurpose))}>
                            {getPaymentPurposeDisplay(payment.paymentPurpose)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {courseInfo || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={cn(getPaymentMethodColor(payment.paymentMethod))}>
                            {payment.paymentMethod === PAYMENT_METHODS.MOMO ? "Mobile Money" : "Cash"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            onSubmit={handleAddPayment}
            onCancel={() => setIsAddingPayment(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
