
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  CalendarIcon 
} from "lucide-react";
import { PAYMENT_METHODS, PAYMENT_PURPOSES } from "@/lib/constants";

interface PaymentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
  selectedPaymentPurpose: string;
  setSelectedPaymentPurpose: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export function PaymentFilters({
  searchTerm,
  setSearchTerm,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedPaymentPurpose,
  setSelectedPaymentPurpose,
  sortOrder,
  setSortOrder,
}: PaymentFiltersProps) {
  return (
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
  );
}
