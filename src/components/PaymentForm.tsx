
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
import { PAYMENT_METHODS } from '@/lib/constants';
import { mockStudents } from '@/data/mockData';
import { generateTransactionCode, formatCurrency } from '@/lib/utils';

// Define the form schema with validation
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
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues & { transactionCode: string }) => void;
  onCancel: () => void;
}

export function PaymentForm({ onSubmit, onCancel }: PaymentFormProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Initialize form with default values
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      amount: undefined,
      paymentMethod: PAYMENT_METHODS.MOMO,
      notes: "",
    },
  });

  // Watch for student selection changes
  const studentId = form.watch('studentId');
  
  useEffect(() => {
    if (studentId) {
      const student = mockStudents.find(s => s.id === studentId);
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId]);

  // Handle form submission
  const handleSubmit = (values: PaymentFormValues) => {
    // Generate a transaction code for the payment
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
