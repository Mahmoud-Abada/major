/**
 * Error Handler Service
 * Centralized error handling for API operations
 */

import { AuthError, NetworkError, ValidationError } from '../../utils/error-handler';
import { ClassroomApiError } from '../classroom-api';

export interface AppError {
  message: string;
  code: string;
  type: 'network' | 'auth' | 'validation' | 'api' | 'unknown';
  details?: any;
  timestamp: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: unknown): AppError {
    const timestamp = Date.now();

    // Handle ClassroomApiError
    if (error instanceof ClassroomApiError) {
      return {
        message: error.message,
        code: error.code,
        type: 'api',
        details: error.details,
        timestamp
      };
    }

    // Handle AuthError
    if (error instanceof AuthError) {
      return {
        message: error.message,
        code: error.code,
        type: 'auth',
        details: error.details,
        timestamp
      };
    }

    // Handle ValidationError
    if (error instanceof ValidationError) {
      return {
        message: error.message,
        code: error.code,
        type: 'validation',
        details: { field: error.field },
        timestamp
      };
    }

    // Handle NetworkError
    if (error instanceof NetworkError) {
      return {
        message: error.message,
        code: error.status?.toString() || 'NETWORK_ERROR',
        type: 'network',
        details: { status: error.status },
        timestamp
      };
    }

    // Handle standard Error
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        type: 'unknown',
        details: { name: error.name, stack: error.stack },
        timestamp
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        message: error,
        code: 'STRING_ERROR',
        type: 'unknown',
        timestamp
      };
    }

    // Handle unknown errors
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      type: 'unknown',
      details: error,
      timestamp
    };
  }

  getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case 'network':
        if (error.code === '401') {
          return 'Authentication failed. Please log in again.';
        }
        if (error.code === '403') {
          return 'You do not have permission to perform this action.';
        }
        if (error.code === '404') {
          return 'The requested resource was not found.';
        }
        if (error.code === '429') {
          return 'Too many requests. Please try again later.';
        }
        if (error.code.startsWith('5')) {
          return 'Server error. Please try again later.';
        }
        return 'Network error. Please check your connection.';

      case 'auth':
        return 'Authentication error. Please log in again.';

      case 'validation':
        return error.message || 'Please check your input and try again.';

      case 'api':
        return error.message || 'API error occurred.';

      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  logError(error: AppError): void {
    console.error('Application Error:', {
      message: error.message,
      code: error.code,
      type: error.type,
      timestamp: new Date(error.timestamp).toISOString(),
      details: error.details
    });
  }
}