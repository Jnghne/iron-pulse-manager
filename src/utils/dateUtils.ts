// /Users/jonghne/personal/iron-pulse-manager/src/utils/dateUtils.ts

/**
 * Formats a Date object or a date string into 'YYYY-MM-DD' string format.
 * Suitable for HTML date input fields.
 * Returns an empty string if the input date is invalid, null, or undefined.
 * @param date - The date to format (Date object, date string, null, or undefined).
 * @returns The formatted date string ('YYYY-MM-DD') or an empty string.
 */
export const formatDateToInput = (date: Date | string | null | undefined): string => {
  if (!date) {
    return '';
  }

  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return ''; // Invalid date
  }

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
  const day = dateObj.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Parses a date string (primarily 'YYYY-MM-DD') into a Date object.
 * Returns null if the input string is invalid, null, undefined, or not in the expected format.
 * The resulting Date object represents midnight in the local timezone.
 * @param dateString - The date string to parse (e.g., '2023-10-26').
 * @returns A Date object or null.
 */
export const parseDateString = (dateString: string | null | undefined): Date | null => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  
  if (!match) {
    // If not strictly YYYY-MM-DD, return null.
    // For more lenient parsing, this part could be expanded, or a library like date-fns used.
    return null; 
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
  const day = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return date;
  }

  return null; // Invalid date components (e.g., 2023-02-30)
};
