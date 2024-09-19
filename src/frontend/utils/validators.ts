import { User, Quote, QuoteItem } from '@/types';
import { PASSWORD_MIN_LENGTH, EMAIL_REGEX } from '@/config';

// Validate email address
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Validate password
export function validatePassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
}

// Validate user data
export function validateUser(user: User): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!user.name || user.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!validateEmail(user.email)) {
    errors.push('Invalid email address');
  }

  if (!['admin', 'salesperson', 'customer'].includes(user.role)) {
    errors.push('Invalid user role');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate quote data
export function validateQuote(quote: Quote): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!quote.customerId || quote.customerId.trim() === '') {
    errors.push('Customer ID is required');
  }

  if (!quote.items || quote.items.length === 0) {
    errors.push('Quote must have at least one item');
  } else {
    quote.items.forEach((item, index) => {
      const itemValidation = validateQuoteItem(item);
      if (!itemValidation.isValid) {
        errors.push(`Item ${index + 1}: ${itemValidation.errors.join(', ')}`);
      }
    });
  }

  if (!validatePositiveNumber(quote.totalAmount)) {
    errors.push('Total amount must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate a single quote item
export function validateQuoteItem(item: QuoteItem): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.productId || item.productId.trim() === '') {
    errors.push('Product ID is required');
  }

  if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
    errors.push('Quantity must be a positive integer');
  }

  if (!validatePositiveNumber(item.unitPrice)) {
    errors.push('Unit price must be a positive number');
  }

  if (item.totalPrice !== item.quantity * item.unitPrice) {
    errors.push('Total price must equal quantity * unit price');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate if a value is a positive number
export function validatePositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0;
}