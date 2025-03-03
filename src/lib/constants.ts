
// Role constants
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  MAIN_REP: "main_rep",
  ASSISTANT_REP: "assistant_rep",
  STUDENT: "student",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Specialization constants
export const SPECIALIZATIONS = {
  SOFTWARE: "ITS",
  NETWORKING: "ITN",
  DATA_MANAGEMENT: "ITD",
} as const;

export type Specialization = typeof SPECIALIZATIONS[keyof typeof SPECIALIZATIONS];

// Group constants
export const GROUPS = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
} as const;

export type Group = typeof GROUPS[keyof typeof GROUPS];

// Payment method constants
export const PAYMENT_METHODS = {
  MOMO: "momo",
  CASH: "cash",
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// Payment status constants
export const PAYMENT_STATUS = {
  FULL: "full",
  PARTIAL: "partial",
  OUTSTANDING: "outstanding",
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Mock data for development
export const CURRENT_ACADEMIC_YEAR = "24";

// Navigation items
export type NavItem = {
  title: string;
  href: string;
  icon: string;
  requiredRoles: Role[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    requiredRoles: [ROLES.SUPER_ADMIN, ROLES.MAIN_REP, ROLES.ASSISTANT_REP],
  },
  {
    title: "Students",
    href: "/students",
    icon: "users",
    requiredRoles: [ROLES.SUPER_ADMIN, ROLES.MAIN_REP, ROLES.ASSISTANT_REP],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: "receipt",
    requiredRoles: [ROLES.SUPER_ADMIN, ROLES.MAIN_REP, ROLES.ASSISTANT_REP],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "bar-chart",
    requiredRoles: [ROLES.SUPER_ADMIN, ROLES.MAIN_REP],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
    requiredRoles: [ROLES.SUPER_ADMIN],
  },
  {
    title: "User Management",
    href: "/users",
    icon: "user-cog",
    requiredRoles: [ROLES.SUPER_ADMIN],
  },
];
