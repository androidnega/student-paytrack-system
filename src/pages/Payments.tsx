
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
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";
import { mockPayments, mockStudents } from "@/data/mockData";
import { Payment } from "@/types";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter payments based on search and filters
  const filteredPayments = mockPayments.filter(payment => {
    // Find student to get access to their name and index number
    const student = mockStudents.find(s => s.id === payment.studentId);
    if (!student) return false;

    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || 
      payment.paymentMethod === selectedPaymentMethod;
    
    return matchesSearch && matchesPaymentMethod;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
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
                  <TableHead className="hidden md:table-cell">Transaction Code</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPayments.map((payment) => {
                  const student = mockStudents.find(s => s.id === payment.studentId);
                  if (!student) return null;
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(new Date(payment.paymentDate))}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.indexNumber}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.transactionCode}</TableCell>
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
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
