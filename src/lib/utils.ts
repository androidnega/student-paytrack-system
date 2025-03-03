
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Group, GROUPS, Specialization, SPECIALIZATIONS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random string to use as a transaction code
export function generateTransactionCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
}

// Get student group based on index number
export function getStudentGroup(indexNumber: string): Group | null {
  try {
    // Extract the numeric part (XXX) from the index number
    const match = indexNumber.match(/\/(\d{3})$/);
    if (!match) return null;
    
    const studentNumber = parseInt(match[1]);
    
    if (studentNumber >= 1 && studentNumber <= 50) {
      return GROUPS.A;
    } else if (studentNumber >= 51 && studentNumber <= 100) {
      return GROUPS.B;
    } else if (studentNumber >= 101 && studentNumber <= 150) {
      return GROUPS.C;
    } else if (studentNumber >= 151 && studentNumber <= 200) {
      return GROUPS.D;
    } else if (studentNumber >= 201 && studentNumber <= 250) {
      return GROUPS.E;
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing index number:", error);
    return null;
  }
}

// Extract specialization from index number
export function getSpecialization(indexNumber: string): Specialization | null {
  try {
    // Extract the specialization part (ITS, ITN, ITD)
    const match = indexNumber.match(/BC\/(IT[SND])\//);
    if (!match) return null;
    
    const specializationCode = match[1];
    
    if (specializationCode === "ITS") {
      return SPECIALIZATIONS.SOFTWARE;
    } else if (specializationCode === "ITN") {
      return SPECIALIZATIONS.NETWORKING;
    } else if (specializationCode === "ITD") {
      return SPECIALIZATIONS.DATA_MANAGEMENT;
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting specialization:", error);
    return null;
  }
}

// Validate Ghana phone number
export function isValidGhanaPhoneNumber(phone: string): boolean {
  // Ghana phone numbers can be 10 digits (e.g., 0241234567)
  // or with country code +233 followed by 9 digits (e.g., +233241234567)
  const ghanaPhoneRegex = /^(\+233|0)([2-3]|[5]|[7-9])[0-9]{8}$/;
  return ghanaPhoneRegex.test(phone);
}

// Validate index number format
export function isValidIndexNumber(indexNumber: string): boolean {
  const indexRegex = /^BC\/(IT[SND])\/(\d{2})\/(\d{3})$/;
  return indexRegex.test(indexNumber);
}

// Get the academic year from the index number
export function getAcademicYear(indexNumber: string): string | null {
  try {
    const match = indexNumber.match(/\/(\d{2})\//);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting academic year:", error);
    return null;
  }
}

// Format date to a readable string
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format time to a readable string
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format date and time to a readable string
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// Truncate text with ellipsis if it exceeds the given length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
