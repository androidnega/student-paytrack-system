
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Payment } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { mockStudents, mockCourses } from "@/data/mockData";
import { 
  PaymentMethodBadge, 
  PaymentPurposeBadge, 
  getPaymentPurposeColor 
} from "./PaymentBadges";

interface PaymentDetailsDialogProps {
  selectedPayment: Payment | null;
  onClose: () => void;
}

export function PaymentDetailsDialog({ 
  selectedPayment, 
  onClose 
}: PaymentDetailsDialogProps) {
  const isOpen = !!selectedPayment;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
                <PaymentMethodBadge 
                  method={selectedPayment.paymentMethod} 
                  className="text-xs font-normal" 
                />
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
                <PaymentPurposeBadge purpose={selectedPayment.paymentPurpose} className="mb-2" />
                
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
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
