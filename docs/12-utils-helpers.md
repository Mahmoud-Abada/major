# Utils & Helpers

## Overview

The application includes a comprehensive set of utility functions and helper modules that provide common functionality across the codebase, from data manipulation to error handling and validation.

## Core Utilities

### Class Name Utilities
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS merge functionality
 * Resolves conflicts between Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage examples
const buttonClasses = cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed",
  className // Additional classes from props
);

const cardClasses = cn(
  "border rounded-lg p-4",
  variant === "elevated" && "shadow-lg",
  variant === "outlined" && "border-2"
);
```

### Form Utilities
```typescript
// lib/form-utils.ts
import { z } from "zod";

/**
 * Transforms Zod validation errors into a more usable format
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      const fieldName = err.path.join('.');
      fieldErrors[fieldName] = err.message;
    }
  });
  
  return fieldErrors;
}

/**
 * Validates form data against a schema and returns formatted errors
 */
export function validateFormData<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodErrors(error) };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
}

/**
 * Sanitizes form input by trimming whitespace and removing empty strings
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      sanitized[key as keyof T] = (trimmed === '' ? undefined : trimmed) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

// Usage example
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});

export function handleFormSubmit(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const sanitizedData = sanitizeFormData(rawData);
  
  const validation = validateFormData(sanitizedData, userSchema);
  
  if (!validation.success) {
    return { errors: validation.errors };
  }
  
  // Process valid data
  return { data: validation.data };
}
```

## Authentication Utilities

### Token Management
```typescript
// utils/tokenManager.ts
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  email: string;
  userType: string;
  exp: number;
  iat: number;
}

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'user-data';
const LAST_ACTIVITY_KEY = 'last-activity';

/**
 * Securely stores authentication tokens
 */
export function setTokens(token: string, refreshToken?: string): void {
  try {
    // Store in httpOnly cookie (preferred for security)
    if (typeof document !== 'undefined') {
      document.cookie = `${TOKEN_KEY}=${token}; path=/; secure; samesite=strict; max-age=86400`;
      
      if (refreshToken) {
        document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; secure; samesite=strict; max-age=604800`;
      }
    }

    // Fallback to localStorage for development
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem(TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
}

/**
 * Retrieves authentication token from storage
 */
export function getToken(): string | null {
  try {
    // Try to get from cookie first
    if (typeof document !== 'undefined') {
      const cookieToken = getCookieValue(TOKEN_KEY);
      if (cookieToken) {
        return cookieToken;
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
}

/**
 * Gets token payload without verification
 */
export function getTokenPayload(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Failed to decode token payload:', error);
    return null;
  }
}

/**
 * Stores user data in localStorage
 */
export function setUserData(user: any): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      updateLastActivity();
    }
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
}

/**
 * Retrieves user data from localStorage
 */
export function getUserData(): any | null {
  try {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
}

/**
 * Updates last activity timestamp
 */
export function updateLastActivity(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  } catch (error) {
    console.error('Failed to update last activity:', error);
  }
}

/**
 * Clears all authentication data
 */
export function clearAuthData(): void {
  try {
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    }
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
}

/**
 * Initializes authentication state from storage
 */
export function initializeAuthFromStorage() {
  const token = getToken();
  const user = getUserData();
  const lastActivity = typeof window !== 'undefined' 
    ? localStorage.getItem(LAST_ACTIVITY_KEY) 
    : null;
  
  // Check if token is expired (24 hours)
  const isExpired = lastActivity 
    ? Date.now() - parseInt(lastActivity) > 24 * 60 * 60 * 1000
    : true;

  return {
    token,
    user,
    isExpired: isExpired || (token ? isTokenExpired(token) : true),
  };
}

/**
 * Helper function to get cookie value
 */
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}
```

## Error Handling Utilities

### Error Handler
```typescript
// utils/error-handler.ts
export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class CustomError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'CustomError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Handles and formats API errors consistently
 */
export function handleAPIError(error: unknown): APIError {
  if (error instanceof CustomError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    return {
      message: errorObj.message || 'An unknown error occurred',
      status: errorObj.status || 500,
      code: errorObj.code,
      details: errorObj.details,
    };
  }

  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('ERR_NETWORK')
    );
  }
  return false;
}

/**
 * Checks if an error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  const apiError = handleAPIError(error);
  return apiError.status === 401 || apiError.status === 403;
}

/**
 * Checks if an error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  const apiError = handleAPIError(error);
  return apiError.status === 422 || apiError.code === 'VALIDATION_ERROR';
}

/**
 * Gets user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = handleAPIError(error);

  switch (apiError.status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'You need to sign in to access this resource.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      return 'Please check your input and correct any errors.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'A server error occurred. Please try again later.';
    case 503:
      return 'Service is temporarily unavailable. Please try again later.';
    default:
      return apiError.message || 'An unexpected error occurred.';
  }
}

// Usage example
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    onError?: (error: APIError) => void;
    showToast?: boolean;
    fallbackValue?: T;
  } = {}
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    const apiError = handleAPIError(error);
    
    if (options.onError) {
      options.onError(apiError);
    }
    
    if (options.showToast) {
      toast.error(getUserFriendlyErrorMessage(error));
    }
    
    console.error('Operation failed:', apiError);
    
    return options.fallbackValue;
  }
}
```

## Data Validation Utilities

### Validation Schemas
```typescript
// lib/validationSchemas.ts
import { z } from 'zod';

// Common validation patterns
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(
  /^[\+]?[1-9][\d]{0,15}$/,
  'Invalid phone number format'
);
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Location validation
export const locationSchema = z.object({
  wilaya: z.string().min(1, 'Wilaya is required'),
  commune: z.string().min(1, 'Commune is required'),
  fullLocation: z.string().min(1, 'Full location is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

// User validation schemas
export const baseUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  location: locationSchema,
});

export const studentSchema = baseUserSchema.extend({
  userType: z.literal('student'),
  dateOfBirth: z.date().optional(),
  parentContact: phoneSchema.optional(),
});

export const teacherSchema = baseUserSchema.extend({
  userType: z.literal('teacher'),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  experience: z.number().min(0, 'Experience cannot be negative'),
});

export const schoolSchema = baseUserSchema.extend({
  userType: z.literal('school'),
  schoolType: z.enum([
    'private',
    'public',
    'language',
    'university',
    'formation',
    'support',
    'private-university',
    'preschool',
  ]),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
});

// Classroom validation
export const classroomSchema = z.object({
  name: z.string().min(2, 'Classroom name must be at least 2 characters'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  schedule: z.array(z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  })).optional(),
});

// Authentication validation
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  userData: baseUserSchema.extend({
    password: passwordSchema,
    confirmPassword: z.string(),
    userType: z.enum(['student', 'teacher', 'school']),
  }),
  schoolForm: z.object({
    representativeName: z.string().min(2, 'Representative name is required'),
    role: z.string().min(1, 'Role is required'),
    approximateTeachers: z.number().min(1, 'Number of teachers must be at least 1'),
    approximateStudents: z.number().min(1, 'Number of students must be at least 1'),
    numberOfBranches: z.number().min(1, 'Number of branches must be at least 1'),
  }).optional(),
}).refine((data) => data.userData.password === data.userData.confirmPassword, {
  message: "Passwords don't match",
  path: ["userData", "confirmPassword"],
});
```

## Date and Time Utilities

### Date Formatting
```typescript
// utils/dateUtils.ts
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';

const locales = { en: enUS, fr, ar };

/**
 * Formats a date according to the specified locale and format
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'PPP',
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locales[locale as keyof typeof locales] || enUS;
  
  return format(dateObj, formatString, { locale: localeObj });
}

/**
 * Formats a date as a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locales[locale as keyof typeof locales] || enUS;
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: localeObj 
  });
}

/**
 * Formats a date for display in the UI
 */
export function formatDisplayDate(
  date: Date | string,
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${formatDate(dateObj, 'p', locale)}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${formatDate(dateObj, 'p', locale)}`;
  }
  
  return formatDate(dateObj, 'PPP', locale);
}

/**
 * Gets the start and end of a date range
 */
export function getDateRange(period: 'today' | 'week' | 'month' | 'year'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

/**
 * Checks if a date is within business hours
 */
export function isBusinessHours(date: Date = new Date()): boolean {
  const hour = date.getHours();
  const day = date.getDay();
  
  // Monday to Friday, 9 AM to 5 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

/**
 * Calculates age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string): number {
  const birthDate = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
```

## String Utilities

### String Manipulation
```typescript
// utils/stringUtils.ts

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Generates initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Masks sensitive information (e.g., email, phone)
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  
  const visibleDigits = 2;
  const maskedPart = '*'.repeat(phone.length - visibleDigits * 2);
  
  return phone.substring(0, visibleDigits) + maskedPart + phone.substring(phone.length - visibleDigits);
}

/**
 * Extracts mentions from text (e.g., @username)
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Generates a random string of specified length
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}
```

## Number and Currency Utilities

### Number Formatting
```typescript
// utils/numberUtils.ts

/**
 * Formats a number with locale-specific formatting
 */
export function formatNumber(
  value: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a number as a percentage
 */
export function formatPercentage(
  value: number,
  locale: string = 'en-US',
  decimals: number = 1
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Rounds a number to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Generates a range of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  
  return result;
}
```

## Best Practices

### 1. Function Design
- Keep functions pure and predictable
- Use descriptive names that explain the function's purpose
- Handle edge cases and invalid inputs gracefully
- Return consistent data types

### 2. Error Handling
- Always handle potential errors in utility functions
- Provide meaningful error messages
- Use try-catch blocks for operations that might fail
- Log errors appropriately for debugging

### 3. Performance
- Memoize expensive computations when appropriate
- Avoid creating new objects unnecessarily
- Use efficient algorithms for data processing
- Consider lazy evaluation for expensive operations

### 4. Type Safety
- Use TypeScript for all utility functions
- Define clear interfaces for complex parameters
- Use generic types for reusable utilities
- Validate input types at runtime when necessary

### 5. Testing
- Write unit tests for all utility functions
- Test edge cases and error conditions
- Use property-based testing for mathematical functions
- Mock external dependencies in tests