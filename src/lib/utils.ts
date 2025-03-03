
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function generateTransactionCode(): string {
  const prefix = 'TTU';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const datePart = new Date().getTime().toString().substring(5, 13);
  return `${prefix}-${randomPart}-${datePart}`;
}
