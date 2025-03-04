import { 
  GROUPS, 
  PAYMENT_METHODS, 
  PAYMENT_PURPOSES, 
  PAYMENT_STATUS, 
  SPECIALIZATIONS,
  ROLES
} from "@/lib/constants";
import { Course, DashboardStats, Lecturer, Payment, Student, User } from "@/types";

// Function to generate a random 6-digit code
const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Add mockUsers export that is needed by Users.tsx
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@ttu.edu.gh",
    phone: "0201234567",
    role: ROLES.SUPER_ADMIN,
    createdAt: new Date("2023-01-15"),
    lastLogin: new Date("2023-10-01"),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@ttu.edu.gh",
    phone: "0557891234",
    role: ROLES.MAIN_REP,
    createdAt: new Date("2023-02-10"),
    lastLogin: new Date("2023-09-28"),
  },
  {
    id: "user-3",
    name: "Alex Johnson",
    email: "alex.j@ttu.edu.gh",
    phone: "0248765432",
    role: ROLES.ASSISTANT_REP,
    createdAt: new Date("2023-03-20"),
    lastLogin: new Date("2023-09-25"),
  },
  {
    id: "user-4",
    name: "Sarah Williams",
    email: "sarah.w@ttu.edu.gh",
    phone: "0209876543",
    role: ROLES.ASSISTANT_REP,
    createdAt: new Date("2023-04-05"),
    lastLogin: null,
  },
  {
    id: "user-5",
    name: "Michael Brown",
    email: "michael.b@ttu.edu.gh",
    phone: "0551122334",
    role: ROLES.MAIN_REP,
    createdAt: new Date("2023-05-12"),
    lastLogin: new Date("2023-09-15"),
  },
];

export const mockStudents: Student[] = [
  {
    id: "student-1",
    name: "Alice Johnson",
    indexNumber: "BC/ITS/24/001",
    email: "alice.j@example.com",
    phone: "0201234567",
    specialization: SPECIALIZATIONS.SOFTWARE,
    group: GROUPS.A,
    academicYear: "2024",
    totalAmountDue: 150,
    totalAmountPaid: 100,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-09-20"),
  },
  {
    id: "student-2",
    name: "Bob Williams",
    indexNumber: "BC/ITN/24/002",
    email: "bob.w@example.com",
    phone: "0509876543",
    specialization: SPECIALIZATIONS.NETWORKING,
    group: GROUPS.B,
    academicYear: "2024",
    totalAmountDue: 200,
    totalAmountPaid: 200,
    paymentStatus: PAYMENT_STATUS.FULL,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-09-20"),
  },
  {
    id: "student-3",
    name: "Charlie Brown",
    indexNumber: "BC/ITD/24/003",
    email: "charlie.b@example.com",
    phone: "0245678901",
    specialization: SPECIALIZATIONS.DATA_MANAGEMENT,
    group: GROUPS.C,
    academicYear: "2024",
    totalAmountDue: 180,
    totalAmountPaid: 80,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-09-20"),
  },
  {
    id: "student-4",
    name: "Diana Miller",
    indexNumber: "BC/ITS/24/004",
    email: "diana.m@example.com",
    phone: "0551234567",
    specialization: SPECIALIZATIONS.SOFTWARE,
    group: GROUPS.D,
    academicYear: "2024",
    totalAmountDue: 160,
    totalAmountPaid: 0,
    paymentStatus: PAYMENT_STATUS.OUTSTANDING,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-09-20"),
  },
  {
    id: "student-5",
    name: "Eve Taylor",
    indexNumber: "BC/ITN/24/005",
    email: "eve.t@example.com",
    phone: "0269876543",
    specialization: SPECIALIZATIONS.NETWORKING,
    group: GROUPS.E,
    academicYear: "2024",
    totalAmountDue: 190,
    totalAmountPaid: 190,
    paymentStatus: PAYMENT_STATUS.FULL,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-09-20"),
  },
];

export const mockCourses: Course[] = [
  {
    id: "course-1",
    code: "ITS201",
    name: "Software Engineering",
    creditHours: 3,
    venue: "Lab A",
    lecturerId: "lecturer-1",
  },
  {
    id: "course-2",
    code: "ITD202",
    name: "Database Management",
    creditHours: 4,
    venue: "Hall B",
    lecturerId: "lecturer-2",
  },
  {
    id: "course-3",
    code: "ITN203",
    name: "Networking Essentials",
    creditHours: 3,
    venue: "Lab C",
    lecturerId: "lecturer-3",
  },
];

export const mockLecturers: Lecturer[] = [
  {
    id: "lecturer-1",
    name: "Dr. Smith",
    email: "smith@example.com",
    phone: "0209999999",
  },
  {
    id: "lecturer-2",
    name: "Prof. Jones",
    email: "jones@example.com",
    phone: "0508888888",
  },
  {
    id: "lecturer-3",
    name: "Mr. Davis",
    email: "davis@example.com",
    phone: "0247777777",
  },
];

// Ensure all payments have 6-digit transaction codes
export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    studentId: "student-1",
    amount: 50,
    paymentMethod: PAYMENT_METHODS.MOMO,
    paymentPurpose: PAYMENT_PURPOSES.BOOK,
    itemId: "course-1",
    transactionCode: generateSixDigitCode(),
    paymentDate: new Date("2023-09-15"),
    recordedBy: "user-1",
    notes: "Full payment for Software Engineering textbook",
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2023-09-15"),
  },
  {
    id: "payment-2",
    studentId: "student-2",
    amount: 20,
    paymentMethod: PAYMENT_METHODS.CASH,
    paymentPurpose: PAYMENT_PURPOSES.HANDOUT,
    itemId: "course-2",
    transactionCode: generateSixDigitCode(),
    paymentDate: new Date("2023-09-16"),
    recordedBy: "user-2",
    payerType: "third_party",
    thirdPartyType: "relative",
    thirdPartyDetails: "Brother - James Mensah",
    notes: "Handout payment for Database Management",
    createdAt: new Date("2023-09-16"),
    updatedAt: new Date("2023-09-16"),
  },
  {
    id: "payment-3",
    studentId: "student-3",
    amount: 100,
    paymentMethod: PAYMENT_METHODS.MOMO,
    paymentPurpose: PAYMENT_PURPOSES.TRIP,
    transactionCode: generateSixDigitCode(),
    paymentDate: new Date("2023-09-17"),
    recordedBy: "user-1",
    notes: "Trip payment for tech conference",
    createdAt: new Date("2023-09-17"),
    updatedAt: new Date("2023-09-17"),
  },
  {
    id: "payment-4",
    studentId: "student-4",
    amount: 35,
    paymentMethod: PAYMENT_METHODS.CASH,
    paymentPurpose: PAYMENT_PURPOSES.BOOK,
    itemId: "course-3",
    transactionCode: generateSixDigitCode(),
    paymentDate: new Date("2023-09-18"),
    recordedBy: "user-2",
    notes: "Partial payment for Networking Essentials textbook",
    createdAt: new Date("2023-09-18"),
    updatedAt: new Date("2023-09-18"),
  },
  {
    id: "payment-5",
    studentId: "student-5",
    amount: 45,
    paymentMethod: PAYMENT_METHODS.MOMO,
    paymentPurpose: PAYMENT_PURPOSES.OTHER,
    transactionCode: generateSixDigitCode(),
    paymentDate: new Date("2023-09-19"),
    recordedBy: "user-1",
    notes: "Department dues payment",
    createdAt: new Date("2023-09-19"),
    updatedAt: new Date("2023-09-19"),
  },
];

// Update mock dashboard stats to include transaction codes in recent payments
export const mockDashboardStats: DashboardStats = {
  totalStudents: 150,
  totalPayments: 120,
  totalAmountCollected: 4350,
  fullPayments: 80,
  partialPayments: 20,
  outstandingPayments: 50,
  momoPayments: 70,
  cashPayments: 50,
  recentPayments: mockPayments.slice(0, 5),
  paymentsBySpecialization: {
    [SPECIALIZATIONS.SOFTWARE]: 60,
    [SPECIALIZATIONS.NETWORKING]: 40,
    [SPECIALIZATIONS.DATA_MANAGEMENT]: 20,
  },
  paymentsByGroup: {
    [GROUPS.A]: 30,
    [GROUPS.B]: 25,
    [GROUPS.C]: 35,
    [GROUPS.D]: 20,
    [GROUPS.E]: 10,
  },
};
