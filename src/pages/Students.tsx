
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronDown, 
  ChevronRight 
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { GROUPS, PAYMENT_STATUS, SPECIALIZATIONS } from "@/lib/constants";
import { mockStudents } from "@/data/mockData";
import { Student } from "@/types";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');

  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === 'all' || 
      student.specialization === selectedSpecialization;
    
    const matchesGroup = selectedGroup === 'all' || 
      student.group === selectedGroup;
    
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || 
      student.paymentStatus === selectedPaymentStatus;
    
    return matchesSearch && matchesSpecialization && matchesGroup && matchesPaymentStatus;
  });

  // Function to get badge color based on payment status
  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case PAYMENT_STATUS.FULL:
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case PAYMENT_STATUS.PARTIAL:
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case PAYMENT_STATUS.OUTSTANDING:
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Manage Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Specialization</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {Object.values(SPECIALIZATIONS).map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Group</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {Object.values(GROUPS).map((group) => (
                    <SelectItem key={group} value={group}>Group {group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Payment Status</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.FULL}>Full Payment</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.PARTIAL}>Partial Payment</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.OUTSTANDING}>Outstanding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Index Number</TableHead>
                  <TableHead className="hidden md:table-cell">Specialization</TableHead>
                  <TableHead className="hidden md:table-cell">Group</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.indexNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.specialization}</TableCell>
                    <TableCell className="hidden md:table-cell">Group {student.group}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatCurrency(student.totalAmountPaid)} / {formatCurrency(student.totalAmountDue)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={cn(getPaymentStatusColor(student.paymentStatus))}>
                        {student.paymentStatus === PAYMENT_STATUS.FULL ? "Paid" : 
                          student.paymentStatus === PAYMENT_STATUS.PARTIAL ? "Partial" : "Outstanding"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
