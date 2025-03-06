
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PAYMENT_METHODS, PAYMENT_PURPOSES } from "@/lib/constants";

export function getPaymentMethodColor(method: string) {
  switch(method) {
    case PAYMENT_METHODS.MOMO:
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    case PAYMENT_METHODS.CASH:
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
}

export function getPaymentPurposeColor(purpose: string) {
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
}

export function getPaymentPurposeDisplay(purpose: string) {
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
}

interface PaymentMethodBadgeProps {
  method: string;
  className?: string;
}

export function PaymentMethodBadge({ method, className }: PaymentMethodBadgeProps) {
  return (
    <Badge className={cn(getPaymentMethodColor(method), className)}>
      {method === PAYMENT_METHODS.MOMO ? "Mobile Money" : "Cash"}
    </Badge>
  );
}

interface PaymentPurposeBadgeProps {
  purpose: string;
  className?: string;
}

export function PaymentPurposeBadge({ purpose, className }: PaymentPurposeBadgeProps) {
  return (
    <Badge className={cn(getPaymentPurposeColor(purpose), className)}>
      {getPaymentPurposeDisplay(purpose)}
    </Badge>
  );
}
