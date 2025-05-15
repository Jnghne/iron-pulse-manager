
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Korean currency (₩)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

/**
 * Format a date as a human-readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDateYYYYMMDD(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
}

/**
 * Get a random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random member ID
 */
export function generateMemberId(): string {
  return `M${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`;
}

/**
 * Generate a random trainer ID
 */
export function generateTrainerId(): string {
  return `T${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`;
}

/**
 * Format a phone number as XXX-XXXX-XXXX
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as XXX-XXXX-XXXX
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if not valid
  return phoneNumber;
}

/**
 * Check if a string is a valid phone number
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  return regex.test(phoneNumber);
}

/**
 * Convert attendance rate to a status label
 */
export function getAttendanceStatus(rate: number): { label: string; color: string } {
  if (rate >= 80) {
    return { label: '우수', color: 'text-gym-success' };
  } else if (rate >= 50) {
    return { label: '보통', color: 'text-gym-warning' };
  } else {
    return { label: '저조', color: 'text-gym-danger' };
  }
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if a user has specific permission
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  if (requiredRole === 'any') return true;
  if (requiredRole === 'owner') return userRole === 'owner';
  return false;
}

/**
 * Truncate a string to a given length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
