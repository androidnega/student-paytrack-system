
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockPayments, mockStudents, mockCourses, mockLecturers } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAYMENT_PURPOSES } from '@/lib/constants';

// Validation schema for verification form
const verificationFormSchema = z.object({
  indexNumber: z.string({
    required_error: "Index number is required",
  }).refine((value) => {
    // Regex to validate index number format (e.g., BC/ITS/24/001)
    return /^[A-Z]{2}\/[A-Z]{3}\/\d{2}\/\d{3}$/.test(value);
  }, {
    message: "Invalid index number format. Should be like BC/ITS/24/001",
  }),
  transactionCode: z.string({
    required_error: "Transaction code is required",
  }),
});

type VerificationFormValues = z.infer<typeof verificationFormSchema>;

export default function PaymentVerification() {
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    payment?: any;
    student?: any;
    course?: any;
    lecturer?: any;
    outstandingAmount?: number;
  } | null>(null);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      indexNumber: "",
      transactionCode: "",
    },
  });

  const onSubmit = (values: VerificationFormValues) => {
    // Find student by index number
    const student = mockStudents.find(s => s.indexNumber === values.indexNumber);
    
    if (!student) {
      setVerificationResult({
        found: false,
      });
      return;
    }
    
    // Find payment by transaction code and student id
    const payment = mockPayments.find(
      p => p.transactionCode === values.transactionCode && p.studentId === student.id
    );
    
    if (!payment) {
      setVerificationResult({
        found: false,
        student,
        outstandingAmount: student.totalAmountDue - student.totalAmountPaid,
      });
      return;
    }

    // If payment is for a book or handout, get course details
    let course = undefined;
    let lecturer = undefined;
    
    if (
      (payment.paymentPurpose === PAYMENT_PURPOSES.BOOK || 
       payment.paymentPurpose === PAYMENT_PURPOSES.HANDOUT) && 
      payment.itemId
    ) {
      course = mockCourses.find(c => c.id === payment.itemId);
      if (course) {
        lecturer = mockLecturers.find(l => l.id === course?.lecturerId);
      }
    }
    
    // Set verification result
    setVerificationResult({
      found: true,
      payment,
      student,
      course,
      lecturer,
      outstandingAmount: student.totalAmountDue - student.totalAmountPaid,
    });
  };

  // Get payment purpose display name
  const getPaymentPurposeDisplay = (purpose: string) => {
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
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 font-semibold text-lg"
        >
          <span className="font-bold">TTU Payment System</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            About Us
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Admin Login
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="mx-auto max-w-lg w-full">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl text-center">Verify Your Payment</CardTitle>
              <CardDescription className="text-center">
                Enter your index number and transaction code to verify your payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="indexNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Index Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. BC/ITS/24/001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format examples: BC/ITS/24/001 (Software), BC/ITN/24/001 (Networking), BC/ITD/24/001 (Data)
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="transactionCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. TTU-ABC123-12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Verify Payment</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {verificationResult && (
            <Card className="mt-6 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {verificationResult.found ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Payment Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span>Payment Not Found</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationResult.student && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Student Information</h3>
                    <div className="text-sm grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">Name:</span> {verificationResult.student.name}</div>
                      <div><span className="text-muted-foreground">Index:</span> {verificationResult.student.indexNumber}</div>
                      <div><span className="text-muted-foreground">Program:</span> {verificationResult.student.specialization}</div>
                      <div><span className="text-muted-foreground">Group:</span> {verificationResult.student.group}</div>
                    </div>
                  </div>
                )}
                
                {verificationResult.found && verificationResult.payment && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Payment Details</h3>
                    <div className="text-sm grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">Amount:</span> {formatCurrency(verificationResult.payment.amount)}</div>
                      <div><span className="text-muted-foreground">Date:</span> {formatDate(new Date(verificationResult.payment.paymentDate))}</div>
                      <div><span className="text-muted-foreground">Purpose:</span> {getPaymentPurposeDisplay(verificationResult.payment.paymentPurpose)}</div>
                      <div><span className="text-muted-foreground">Method:</span> {verificationResult.payment.paymentMethod === 'momo' ? 'Mobile Money' : 'Cash'}</div>
                      <div className="col-span-2"><span className="text-muted-foreground">Transaction Code:</span> {verificationResult.payment.transactionCode}</div>
                    </div>
                  </div>
                )}
                
                {verificationResult.found && verificationResult.course && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Course Information</h3>
                    <div className="text-sm grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">Course Code:</span> {verificationResult.course.code}</div>
                      <div><span className="text-muted-foreground">Course Name:</span> {verificationResult.course.name}</div>
                      <div><span className="text-muted-foreground">Credit Hours:</span> {verificationResult.course.creditHours}</div>
                      <div><span className="text-muted-foreground">Venue:</span> {verificationResult.course.venue}</div>
                      {verificationResult.lecturer && (
                        <div className="col-span-2"><span className="text-muted-foreground">Lecturer:</span> {verificationResult.lecturer.name}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {verificationResult.outstandingAmount !== undefined && verificationResult.outstandingAmount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                    <h3 className="font-medium text-amber-800">Outstanding Balance</h3>
                    <p className="text-sm text-amber-700">
                      You have an outstanding balance of {formatCurrency(verificationResult.outstandingAmount)}. 
                      Please contact the course representative to complete your payment.
                    </p>
                  </div>
                )}
                
                {!verificationResult.found && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                    <p className="text-sm text-red-700">
                      We couldn't find a payment with the provided transaction code for this student. 
                      Please verify your information and try again, or contact your course representative for assistance.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setVerificationResult(null)}
                >
                  Check Another Payment
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <footer className="border-t py-4 px-4 lg:px-6">
        <div className="container flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Developed by Manuel with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Takoradi Technical University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
