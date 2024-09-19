import { format, parseISO } from 'date-fns';
import { CURRENCY_LOCALE, DATE_FORMAT } from '@/config';

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  // Create a new Intl.NumberFormat instance with the CURRENCY_LOCALE and currency options
  const formatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: currencyCode,
  });

  // Format the amount using the NumberFormat instance
  return formatter.format(amount);
}

/**
 * Formats a date string or Date object
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  // If input is a string, parse it using parseISO
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  // Format the date using the format function with DATE_FORMAT
  return format(parsedDate, DATE_FORMAT);
}

/**
 * Formats a number with thousands separators and decimal places
 * @param value - The number to format
 * @param decimalPlaces - The number of decimal places to show
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimalPlaces: number): string {
  // Create a new Intl.NumberFormat instance with the CURRENCY_LOCALE and decimal options
  const formatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Format the value using the NumberFormat instance
  return formatter.format(value);
}

/**
 * Formats a number as a percentage
 * @param value - The number to format as a percentage (e.g., 0.5 for 50%)
 * @param decimalPlaces - The number of decimal places to show
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number): string {
  // Create a new Intl.NumberFormat instance with the CURRENCY_LOCALE and percentage options
  const formatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Format the value using the NumberFormat instance
  return formatter.format(value);
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the truncated text
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  // Check if text length is greater than maxLength
  if (text.length > maxLength) {
    // If so, slice the text to maxLength and add ellipsis
    return text.slice(0, maxLength) + '...';
  }

  // Return the original text if no truncation was needed
  return text;
}