
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

// Clear student records
export const mockStudents: Student[] = [];

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

// Clear payment records
export const mockPayments: Payment[] = [];

// Update dashboard stats to reflect empty records
export const mockDashboardStats: DashboardStats = {
  totalStudents: 0,
  totalPayments: 0,
  totalAmountCollected: 0,
  fullPayments: 0,
  partialPayments: 0,
  outstandingPayments: 0,
  momoPayments: 0,
  cashPayments: 0,
  recentPayments: [],
  paymentsBySpecialization: {
    [SPECIALIZATIONS.SOFTWARE]: 0,
    [SPECIALIZATIONS.NETWORKING]: 0,
    [SPECIALIZATIONS.DATA_MANAGEMENT]: 0,
  },
  paymentsByGroup: {
    [GROUPS.A]: 0,
    [GROUPS.B]: 0,
    [GROUPS.C]: 0,
    [GROUPS.D]: 0,
    [GROUPS.E]: 0,
  },
};
