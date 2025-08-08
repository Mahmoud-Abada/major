import { toast } from "@/hooks/use-toast";

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

export class AuthError extends Error {
  code: string;
  field?: string;
  details?: any;

  constructor(
    message: string,
    code: string = "AUTH_ERROR",
    field?: string,
    details?: any,
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.field = field;
    this.details = details;
  }
}

export class ValidationError extends Error {
  field: string;
  code: string;

  constructor(
    message: string,
    field: string,
    code: string = "VALIDATION_ERROR",
  ) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.code = code;
  }
}

export class NetworkError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "NetworkError";
    this.status = status;
  }
}

export function handleApiError(
  error: unknown,
  defaultMessage: string = "An error occurred",
): string {
  console.error("API Error:", error);

  if (error instanceof AuthError) {
    return error.message;
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    if (error.status === 401) {
      return "Authentication failed. Please check your credentials.";
    }
    if (error.status === 403) {
      return "Access denied. You do not have permission to perform this action.";
    }
    if (error.status === 404) {
      return "The requested resource was not found.";
    }
    if (error.status === 429) {
      return "Too many requests. Please try again later.";
    }
    if (error.status && error.status >= 500) {
      return "Server error. Please try again later.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
}

export function showErrorToast(
  error: unknown,
  defaultMessage: string = "An error occurred",
) {
  const message = handleApiError(error, defaultMessage);
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}

export function showSuccessToast(message: string, title: string = "Success") {
  toast({
    title,
    description: message,
    variant: "default",
  });
}

export function showInfoToast(message: string, title: string = "Info") {
  toast({
    title,
    description: message,
    variant: "default",
  });
}

export function showWarningToast(message: string, title: string = "Warning") {
  toast({
    title,
    description: message,
    variant: "destructive",
  });
}
