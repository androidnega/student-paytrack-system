
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  PAYMENT_METHODS, 
  PAYMENT_PURPOSES, 
  PAYER_TYPES, 
  THIRD_PARTY_TYPES 
} from '@/lib/constants';
import { mockStudents } from '@/data/mockData';
import { generateTransactionCode, formatCurrency } from '@/lib/utils';
import { Item } from '@/types';

// Validation schema with index number format check
const paymentFormSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  indexNumber: z.string()
    .min(3, "Index number is required")
    .regex(/^[A-Z]{2}\/[A-Z]{3}\/\d{2}\/\d{3}$/, "Index number must be in the format BC/ITS/24/001"),
  paymentPurpose: z.enum([
    PAYMENT_PURPOSES.BOOK, 
    PAYMENT_PURPOSES.HANDOUT, 
    PAYMENT_PURPOSES.TRIP, 
    PAYMENT_PURPOSES.OTHER
  ], {
    required_error: "Payment purpose is required",
  }),
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).positive("Amount must be positive"),
  courseId: z.string().optional(),
  paymentMethod: z.enum([PAYMENT_METHODS.MOMO, PAYMENT_METHODS.CASH], {
    required_error: "Payment method is required",
  }),
  transactionReference: z.string().optional(),
  payerType: z.enum([PAYER_TYPES.SELF, PAYER_TYPES.THIRD_PARTY])
    .optional(),
  thirdPartyType: z.enum([THIRD_PARTY_TYPES.STUDENT, THIRD_PARTY_TYPES.RELATIVE])
    .optional(),
  thirdPartyDetails: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues & { transactionCode: string }) => void;
  onCancel: () => void;
}

// Enhanced sample items with course information - in a real app this would come from your API or context
const sampleItems: Item[] = [
  {
    id: "item-1",
    name: "Introduction to Programming Textbook - CSC101",
    type: PAYMENT_PURPOSES.BOOK,
    price: 50,
    courseId: "course-1"
  },
  {
    id: "item-2",
    name: "Database Management Systems Textbook - CSC201",
    type: PAYMENT_PURPOSES.BOOK,
    price: 65,
    courseId: "course-2"
  },
  {
    id: "item-3",
    name: "Software Engineering Notes - CSC301",
    type: PAYMENT_PURPOSES.HANDOUT,
    price: 20,
    courseId: "course-3"
  },
  {
    id: "item-4",
    name: "Computer Networks Notes - CSC302",
    type: PAYMENT_PURPOSES.HANDOUT,
    price: 25,
    courseId: "course-4"
  },
  {
    id: "item-5",
    name: "Industry Tour - Tech Companies",
    type: PAYMENT_PURPOSES.TRIP,
    price: 100
  },
  {
    id: "item-6",
    name: "Educational Visit - Microsoft Ghana",
    type: PAYMENT_PURPOSES.TRIP,
    price: 120
  }
];

export function PaymentForm({ onSubmit, onCancel }: PaymentFormProps) {
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentName: "",
      indexNumber: "",
      paymentPurpose: PAYMENT_PURPOSES.BOOK,
      amount: undefined,
      courseId: undefined,
      paymentMethod: PAYMENT_METHODS.MOMO,
      transactionReference: "",
      payerType: undefined,
      thirdPartyType: undefined,
      thirdPartyDetails: "",
      notes: "",
    },
  });

  const paymentPurpose = form.watch('paymentPurpose');
  const paymentMethod = form.watch('paymentMethod');
  const payerType = form.watch('payerType');
  const thirdPartyType = form.watch('thirdPartyType');
  const selectedCourseId = form.watch('courseId');
  
  // Filter items based on payment purpose
  useEffect(() => {
    const filtered = items.filter(item => item.type === paymentPurpose);
    setFilteredItems(filtered);
    
    // Clear courseId if there are no items for this purpose
    if (filtered.length === 0) {
      form.setValue('courseId', undefined);
      form.setValue('amount', undefined);
    }
  }, [paymentPurpose, form, items]);

  // Update amount when a course/item is selected
  useEffect(() => {
    if (selectedCourseId) {
      const selectedItem = items.find(item => item.id === selectedCourseId);
      if (selectedItem) {
        form.setValue('amount', selectedItem.price);
      }
    }
  }, [selectedCourseId, items, form]);

  // Reset fields when payment method changes
  useEffect(() => {
    if (paymentMethod === PAYMENT_METHODS.MOMO) {
      form.setValue('payerType', undefined);
      form.setValue('thirdPartyType', undefined);
      form.setValue('thirdPartyDetails', '');
    } else {
      form.setValue('transactionReference', '');
    }
  }, [paymentMethod, form]);

  // Reset third party fields when payerType changes
  useEffect(() => {
    if (payerType !== PAYER_TYPES.THIRD_PARTY) {
      form.setValue('thirdPartyType', undefined);
      form.setValue('thirdPartyDetails', '');
    }
  }, [payerType, form]);

  const handleSubmit = (values: PaymentFormValues) => {
    const transactionCode = generateTransactionCode();
    onSubmit({
      ...values,
      transactionCode,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Student Information */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="indexNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Index Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. BC/ITS/24/001" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Payment Purpose */}
        <FormField
          control={form.control}
          name="paymentPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you paying for?</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset course selection when purpose changes
                  form.setValue('courseId', undefined);
                  form.setValue('amount', undefined);
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PAYMENT_PURPOSES.BOOK}>Textbook</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.HANDOUT}>Handout</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.TRIP}>Trip</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course/Item selection */}
        {filteredItems.length > 0 && (
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select {paymentPurpose === PAYMENT_PURPOSES.BOOK ? 'Textbook' : 
                               paymentPurpose === PAYMENT_PURPOSES.HANDOUT ? 'Handout' : 
                               paymentPurpose === PAYMENT_PURPOSES.TRIP ? 'Trip' : 'Item'}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${paymentPurpose}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {formatCurrency(item.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Amount - will be prefilled when item is selected, but can still be modified */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (GHS)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode of Payment</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PAYMENT_METHODS.MOMO}>Mobile Money</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.CASH}>Cash</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields based on payment method */}
        {paymentMethod === PAYMENT_METHODS.MOMO && (
          <FormField
            control={form.control}
            name="transactionReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter MoMo transaction reference" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Cash payment options */}
        {paymentMethod === PAYMENT_METHODS.CASH && (
          <FormField
            control={form.control}
            name="payerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who is paying?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PAYER_TYPES.SELF}>Paying by myself (Student)</SelectItem>
                    <SelectItem value={PAYER_TYPES.THIRD_PARTY}>Third Party</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Third party type for cash payments */}
        {paymentMethod === PAYMENT_METHODS.CASH && 
         payerType === PAYER_TYPES.THIRD_PARTY && (
          <FormField
            control={form.control}
            name="thirdPartyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is the third party a student?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select third party type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={THIRD_PARTY_TYPES.STUDENT}>Yes, another student</SelectItem>
                    <SelectItem value={THIRD_PARTY_TYPES.RELATIVE}>No, not a student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Third party details */}
        {paymentMethod === PAYMENT_METHODS.CASH && 
         payerType === PAYER_TYPES.THIRD_PARTY && 
         thirdPartyType && (
          <FormField
            control={form.control}
            name="thirdPartyDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {thirdPartyType === THIRD_PARTY_TYPES.STUDENT 
                    ? "Student's Index Number" 
                    : "Third Party Name & Relationship"}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={
                      thirdPartyType === THIRD_PARTY_TYPES.STUDENT 
                        ? "e.g. BC/ITS/24/001" 
                        : "Name & Relationship to student"
                    } 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Optional notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional information about this payment" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Payment
          </Button>
        </div>
      </form>
    </Form>
  );
}
