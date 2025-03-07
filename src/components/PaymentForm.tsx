
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
import { mockStudents, mockCourses } from '@/data/mockData';
import { generateTransactionCode, formatCurrency } from '@/lib/utils';
import { Item } from '@/types';

const paymentFormSchema = z.object({
  studentId: z.string({
    required_error: "Student is required",
  }),
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).positive("Amount must be positive"),
  paymentMethod: z.enum([PAYMENT_METHODS.MOMO, PAYMENT_METHODS.CASH], {
    required_error: "Payment method is required",
  }),
  payerType: z.enum([PAYER_TYPES.SELF, PAYER_TYPES.THIRD_PARTY])
    .optional()
    .nullable(),
  thirdPartyType: z.enum([THIRD_PARTY_TYPES.STUDENT, THIRD_PARTY_TYPES.RELATIVE])
    .optional()
    .nullable(),
  thirdPartyDetails: z.string().optional(),
  paymentPurpose: z.enum([
    PAYMENT_PURPOSES.BOOK, 
    PAYMENT_PURPOSES.HANDOUT, 
    PAYMENT_PURPOSES.TRIP, 
    PAYMENT_PURPOSES.OTHER
  ], {
    required_error: "Payment purpose is required",
  }),
  itemId: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues & { transactionCode: string }) => void;
  onCancel: () => void;
}

// Sample items - in a real app this would come from your API or context
const sampleItems: Item[] = [
  {
    id: "item-1",
    name: "Introduction to Programming Textbook",
    type: PAYMENT_PURPOSES.BOOK,
    price: 50,
    courseId: "course-1"
  },
  {
    id: "item-2",
    name: "Software Engineering Notes",
    type: PAYMENT_PURPOSES.HANDOUT,
    price: 20,
    courseId: "course-2"
  },
  {
    id: "item-3",
    name: "Industry Tour",
    type: PAYMENT_PURPOSES.TRIP,
    price: 100
  }
];

export function PaymentForm({ onSubmit, onCancel }: PaymentFormProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      amount: undefined,
      paymentMethod: PAYMENT_METHODS.MOMO,
      payerType: null,
      thirdPartyType: null,
      thirdPartyDetails: "",
      paymentPurpose: PAYMENT_PURPOSES.BOOK,
      itemId: undefined,
      notes: "",
    },
  });

  const studentId = form.watch('studentId');
  const paymentPurpose = form.watch('paymentPurpose');
  const paymentMethod = form.watch('paymentMethod');
  const payerType = form.watch('payerType');
  const thirdPartyType = form.watch('thirdPartyType');
  const itemId = form.watch('itemId');
  
  useEffect(() => {
    if (studentId) {
      const student = mockStudents.find(s => s.id === studentId);
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId]);

  // Filter items based on payment purpose
  useEffect(() => {
    const filtered = items.filter(item => item.type === paymentPurpose);
    setFilteredItems(filtered);
    
    // Clear itemId if there are no items for this purpose
    if (filtered.length === 0) {
      form.setValue('itemId', undefined);
    }
  }, [paymentPurpose, form, items]);

  // Set amount based on selected item
  useEffect(() => {
    if (itemId) {
      const selectedItem = items.find(item => item.id === itemId);
      if (selectedItem) {
        form.setValue('amount', selectedItem.price);
      }
    }
  }, [itemId, form, items]);

  useEffect(() => {
    if (paymentMethod === PAYMENT_METHODS.MOMO) {
      form.setValue('payerType', null);
      form.setValue('thirdPartyType', null);
      form.setValue('thirdPartyDetails', '');
    }
  }, [paymentMethod, form]);

  useEffect(() => {
    if (payerType !== PAYER_TYPES.THIRD_PARTY) {
      form.setValue('thirdPartyType', null);
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
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.indexNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedStudent && (
          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="font-medium mb-1">Student Information</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Index Number:</span> {selectedStudent.indexNumber}
              </div>
              <div>
                <span className="text-muted-foreground">Program:</span> {selectedStudent.specialization}
              </div>
              <div>
                <span className="text-muted-foreground">Academic Year:</span> {selectedStudent.academicYear}
              </div>
              <div>
                <span className="text-muted-foreground">Group:</span> {selectedStudent.group}
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Outstanding Balance:</span> {" "}
                <span className="font-medium text-destructive">
                  {formatCurrency(selectedStudent.totalAmountDue - selectedStudent.totalAmountPaid)}
                </span>
              </div>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="paymentPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Purpose</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PAYMENT_PURPOSES.BOOK}>Book</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.HANDOUT}>Handout</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.TRIP}>Trip</SelectItem>
                  <SelectItem value={PAYMENT_PURPOSES.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {filteredItems.length > 0 && (
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Item</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${paymentPurpose}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - GHS {item.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
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

        {paymentMethod === PAYMENT_METHODS.CASH && (
          <FormField
            control={form.control}
            name="payerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who is paying?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PAYER_TYPES.SELF}>Self (Student)</SelectItem>
                    <SelectItem value={PAYER_TYPES.THIRD_PARTY}>Third Party</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {paymentMethod === PAYMENT_METHODS.CASH && payerType === PAYER_TYPES.THIRD_PARTY && (
          <FormField
            control={form.control}
            name="thirdPartyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Third Party Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select third party type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={THIRD_PARTY_TYPES.STUDENT}>Another Student</SelectItem>
                    <SelectItem value={THIRD_PARTY_TYPES.RELATIVE}>Relative</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                    : "Relative's Details"}
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Record Payment
          </Button>
        </div>
      </form>
    </Form>
  );
}
