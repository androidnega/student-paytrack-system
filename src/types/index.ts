
import { Group, PaymentMethod, PaymentPurpose, PaymentStatus, Role, Specialization, PayerType, ThirdPartyType } from "@/lib/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Student {
  id: string;
  name: string;
  indexNumber: string;
  email: string;
  phone: string;
  specialization: Specialization;
  group: Group;
  academicYear: string;
  totalAmountDue: number;
  totalAmountPaid: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  venue: string;
  lecturerId: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  price: number;
  courseId?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPurpose: PaymentPurpose;
  payerType?: PayerType;
  thirdPartyType?: ThirdPartyType;
  thirdPartyDetails?: string;
  itemId?: string; // Can be courseId or other item id based on purpose
  transactionCode: string;
  paymentDate: Date;
  recordedBy: string; // User ID of the staff who recorded the payment
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentWithPayments extends Student {
  payments: Payment[];
}

export interface DashboardStats {
  totalStudents: number;
  totalPayments: number;
  totalAmountCollected: number;
  fullPayments: number;
  partialPayments: number;
  outstandingPayments: number;
  momoPayments: number;
  cashPayments: number;
  recentPayments: Payment[];
  paymentsBySpecialization: {
    [key in Specialization]: number;
  };
  paymentsByGroup: {
    [key in Group]: number;
  };
}

export interface SystemSettings {
  academicYear: string;
  defaultPaymentAmount: string;
  allowPartialPayments: boolean;
  systemName: string;
  smtpServer: string;
  smtpPort: string;
  emailSender: string;
  department: string;
  faculty: string;
  institution: string;
  currency: string;
  paymentDeadline: string;
  academicTerm: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  // SMS Integration Settings
  smsEnabled: boolean;
  smsProvider: string;
  smsApiKey: string;
  smsApiUrl: string;
  smsSenderName: string;
  smsTemplates: {
    fullPayment: string;
    partialPayment: string;
    paymentReminder: string;
  };
}

export interface SmsMessage {
  to: string;
  message: string;
  sender?: string;
}

