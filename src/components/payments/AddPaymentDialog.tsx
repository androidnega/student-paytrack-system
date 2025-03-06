
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
        </DialogHeader>
        <PaymentForm 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
