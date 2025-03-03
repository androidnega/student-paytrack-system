
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
