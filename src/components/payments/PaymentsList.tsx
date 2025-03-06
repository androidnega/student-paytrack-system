
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Info } from "lucide-react";
import { Payment } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { mockStudents, mockCourses } from "@/data/mockData";
import { 
  PaymentMethodBadge, 
  PaymentPurposeBadge 
} from "./PaymentBadges";

interface PaymentsListProps {
  payments: Payment[];
  onViewDetails: (payment: Payment) => void;
}

export function PaymentsList({ payments, onViewDetails }: PaymentsListProps) {
  return (
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
          {payments.length > 0 ? (
            payments.map((payment) => {
              const student = mockStudents.find(s => s.id === payment.studentId);
              if (!student) return null;
              
              let courseInfo = "";
              if (payment.itemId) {
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
                    <PaymentPurposeBadge purpose={payment.paymentPurpose} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {courseInfo || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <PaymentMethodBadge method={payment.paymentMethod} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(payment)}
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
  );
}
