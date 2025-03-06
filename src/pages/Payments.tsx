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
  CalendarIcon,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openTransactionDetails(payment)}
                          >
                            <Info className="h-4 w-4 mr-1" />
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

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment transaction.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Transaction Code</h4>
                  <p className="text-lg font-mono bg-secondary inline-block px-2 py-1 rounded">
                    {selectedPayment.transactionCode}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                  <p>{formatDate(new Date(selectedPayment.paymentDate))}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Amount</h4>
                  <p className="text-lg font-semibold">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h4>
                  <Badge className={cn(getPaymentMethodColor(selectedPayment.paymentMethod), "text-xs font-normal")}>
                    {selectedPayment.paymentMethod === PAYMENT_METHODS.MOMO ? "Mobile Money" : "Cash"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Student Information</h4>
                <div className="border rounded-md p-3 bg-muted/40">
                  {(() => {
                    const student = mockStudents.find(s => s.id === selectedPayment.studentId);
                    return student ? (
                      <>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Index Number: {student.indexNumber}</p>
                        <p className="text-sm text-muted-foreground">Specialization: {student.specialization}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Student information not found</p>
                    );
                  })()}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Purpose</h4>
                <div className="border rounded-md p-3 bg-muted/40">
                  <Badge className={cn(getPaymentPurposeColor(selectedPayment.paymentPurpose), "mb-2")}>
                    {getPaymentPurposeDisplay(selectedPayment.paymentPurpose)}
                  </Badge>
                  
                  {selectedPayment.itemId && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Related Item</p>
                      {(() => {
                        const course = mockCourses.find(c => c.id === selectedPayment.itemId);
                        return course ? (
                          <p className="text-sm text-muted-foreground">{course.code} - {course.name}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">No related item found</p>
                        );
                      })()}
                    </div>
                  )}
                  
                  {selectedPayment.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedPayment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setSelectedPayment(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
