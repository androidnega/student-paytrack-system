import { Group, GROUPS, PAYMENT_METHODS, PAYMENT_PURPOSES, PAYMENT_STATUS, ROLES, SPECIALIZATIONS } from "@/lib/constants";
import { generateTransactionCode } from "@/lib/utils";
import { Course, DashboardStats, Lecturer, Payment, Student, User } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@ttu.edu.gh",
    phone: "+233201234567",
    role: ROLES.SUPER_ADMIN,
    createdAt: new Date("2023-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Main Rep",
    email: "rep@ttu.edu.gh",
    phone: "+233201234568",
    role: ROLES.MAIN_REP,
    createdAt: new Date("2023-01-02"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    name: "Assistant Rep",
    email: "assistant@ttu.edu.gh",
    phone: "+233201234569",
    role: ROLES.ASSISTANT_REP,
    createdAt: new Date("2023-01-03"),
    lastLogin: new Date(),
  },
];

// Mock Lecturers
export const mockLecturers: Lecturer[] = [
  {
    id: "lecturer-1",
    name: "Dr. Kwame Asante",
    email: "kasante@ttu.edu.gh",
    phone: "+233201234570",
  },
  {
    id: "lecturer-2",
    name: "Prof. Abena Mensah",
    email: "amensah@ttu.edu.gh",
    phone: "+233201234571",
  },
  {
    id: "lecturer-3",
    name: "Dr. Kofi Owusu",
    email: "kowusu@ttu.edu.gh",
    phone: "+233201234572",
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: "course-1",
    code: "ITC123",
    name: "Introduction to Programming",
    creditHours: 3,
    venue: "Room A1",
    lecturerId: "lecturer-1",
  },
  {
    id: "course-2",
    code: "ITC234",
    name: "Database Management Systems",
    creditHours: 3,
    venue: "Room B2",
    lecturerId: "lecturer-2",
  },
  {
    id: "course-3",
    code: "ITC345",
    name: "Web Development",
    creditHours: 4,
    venue: "Computer Lab 1",
    lecturerId: "lecturer-3",
  },
  {
    id: "course-4",
    code: "ITC456",
    name: "Networking Fundamentals",
    creditHours: 3,
    venue: "Room C3",
    lecturerId: "lecturer-1",
  },
  {
    id: "course-5",
    code: "ITC567",
    name: "System Analysis and Design",
    creditHours: 3,
    venue: "Room D4",
    lecturerId: "lecturer-2",
  },
];

// Generate mock student data
export function generateMockStudents(count: number = 50): Student[] {
  const students: Student[] = [];
  const specializations = [SPECIALIZATIONS.SOFTWARE, SPECIALIZATIONS.NETWORKING, SPECIALIZATIONS.DATA_MANAGEMENT];
  const academicYear = "24";
  const names = [
    "Kwame Mensah", "Ama Owusu", "Kofi Adu", "Akosua Boateng", "Yaw Darko",
    "Abena Osei", "Kwesi Appiah", "Efua Mensah", "Kojo Asante", "Adwoa Nkrumah",
    "Kwabena Sarfo", "Akua Sarpong", "Yaw Boakye", "Aba Ansah", "Kwasi Frimpong",
    "Afua Amponsah", "Kofi Owusu", "Akosua Addo", "Yaw Opoku", "Abena Asare"
  ];
  
  // Generate more unique names if needed
  while (names.length < count) {
    names.push(`Student ${names.length + 1}`);
  }
  
  for (let i = 0; i < count; i++) {
    const specialization = specializations[i % specializations.length];
    const studentNumber = (i + 1).toString().padStart(3, '0');
    const indexNumber = `BC/${specialization}/${academicYear}/${studentNumber}`;
    
    let group: Group;
    if (parseInt(studentNumber) <= 50) {
      group = GROUPS.A;
    } else if (parseInt(studentNumber) <= 100) {
      group = GROUPS.B;
    } else if (parseInt(studentNumber) <= 150) {
      group = GROUPS.C;
    } else if (parseInt(studentNumber) <= 200) {
      group = GROUPS.D;
    } else {
      group = GROUPS.E;
    }
    
    const totalAmountDue = 2000; // Example amount
    const totalAmountPaid = Math.random() > 0.3 ? 
      (Math.random() > 0.5 ? totalAmountDue : Math.floor(Math.random() * totalAmountDue)) : 0;
    
    let paymentStatus;
    if (totalAmountPaid === 0) {
      paymentStatus = PAYMENT_STATUS.OUTSTANDING;
    } else if (totalAmountPaid < totalAmountDue) {
      paymentStatus = PAYMENT_STATUS.PARTIAL;
    } else {
      paymentStatus = PAYMENT_STATUS.FULL;
    }
    
    students.push({
      id: `student-${i + 1}`,
      name: names[i],
      indexNumber,
      email: `${names[i].toLowerCase().replace(/\s+/g, '.')}@students.ttu.edu.gh`,
      phone: `+2332${Math.floor(10000000 + Math.random() * 90000000)}`,
      specialization,
      group,
      academicYear,
      totalAmountDue,
      totalAmountPaid,
      paymentStatus,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return students;
}

// Generate mock payment data with payment purpose
export function generateMockPayments(students: Student[]): Payment[] {
  const payments: Payment[] = [];
  const recordedByUsers = mockUsers.map(user => user.id);
  const purposes = Object.values(PAYMENT_PURPOSES);
  
  students.forEach(student => {
    if (student.totalAmountPaid > 0) {
      // Determine how many payment installments
      const numPayments = student.paymentStatus === PAYMENT_STATUS.PARTIAL ? 
        Math.floor(Math.random() * 3) + 1 : 1;
      
      let remainingAmount = student.totalAmountPaid;
      
      for (let i = 0; i < numPayments; i++) {
        let amount;
        if (i === numPayments - 1) {
          // Last payment
          amount = remainingAmount;
        } else {
          // Random partial amount
          amount = Math.floor(remainingAmount * (0.3 + Math.random() * 0.4));
          remainingAmount -= amount;
        }
        
        const daysAgo = Math.floor(Math.random() * 60);
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() - daysAgo);
        
        // Random payment purpose
        const purpose = purposes[Math.floor(Math.random() * purposes.length)];
        
        // If book or handout, assign a course
        let itemId = undefined;
        if (purpose === PAYMENT_PURPOSES.BOOK || purpose === PAYMENT_PURPOSES.HANDOUT) {
          itemId = mockCourses[Math.floor(Math.random() * mockCourses.length)].id;
        }
        
        payments.push({
          id: `payment-${payments.length + 1}`,
          studentId: student.id,
          amount,
          paymentMethod: Math.random() > 0.5 ? PAYMENT_METHODS.MOMO : PAYMENT_METHODS.CASH,
          paymentPurpose: purpose,
          itemId,
          transactionCode: generateTransactionCode(),
          paymentDate,
          recordedBy: recordedByUsers[Math.floor(Math.random() * recordedByUsers.length)],
          notes: Math.random() > 0.7 ? "Payment received on time" : undefined,
          createdAt: paymentDate,
          updatedAt: paymentDate
        });
      }
    }
  });
  
  return payments;
}

// Mock dashboard statistics
export function generateMockDashboardStats(students: Student[], payments: Payment[]): DashboardStats {
  const totalStudents = students.length;
  const totalPayments = payments.length;
  const totalAmountCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const fullPayments = students.filter(s => s.paymentStatus === PAYMENT_STATUS.FULL).length;
  const partialPayments = students.filter(s => s.paymentStatus === PAYMENT_STATUS.PARTIAL).length;
  const outstandingPayments = students.filter(s => s.paymentStatus === PAYMENT_STATUS.OUTSTANDING).length;
  
  const momoPayments = payments.filter(p => p.paymentMethod === PAYMENT_METHODS.MOMO).length;
  const cashPayments = payments.filter(p => p.paymentMethod === PAYMENT_METHODS.CASH).length;
  
  // Sort payments by date (recent first) and take the first 5
  const recentPayments = [...payments]
    .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
    .slice(0, 5);
  
  // Count payments by specialization
  const paymentsBySpecialization = {
    [SPECIALIZATIONS.SOFTWARE]: 0,
    [SPECIALIZATIONS.NETWORKING]: 0,
    [SPECIALIZATIONS.DATA_MANAGEMENT]: 0,
  };
  
  // Count payments by group
  const paymentsByGroup = {
    [GROUPS.A]: 0,
    [GROUPS.B]: 0,
    [GROUPS.C]: 0,
    [GROUPS.D]: 0,
    [GROUPS.E]: 0,
  };
  
  // Calculate payments by specialization and group
  students.forEach(student => {
    if (student.paymentStatus !== PAYMENT_STATUS.OUTSTANDING) {
      paymentsBySpecialization[student.specialization]++;
      paymentsByGroup[student.group]++;
    }
  });
  
  return {
    totalStudents,
    totalPayments,
    totalAmountCollected,
    fullPayments,
    partialPayments,
    outstandingPayments,
    momoPayments,
    cashPayments,
    recentPayments,
    paymentsBySpecialization,
    paymentsByGroup,
  };
}

// Generate initial mock data
export const mockStudents = generateMockStudents(100);
export const mockPayments = generateMockPayments(mockStudents);
export const mockDashboardStats = generateMockDashboardStats(mockStudents, mockPayments);
