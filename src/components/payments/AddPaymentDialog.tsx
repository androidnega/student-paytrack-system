
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => void;
}

export function AddPaymentDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit 
}: AddPaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Enter the payment details below to record a new transaction.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] px-6 pb-6">
          <PaymentForm 
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
