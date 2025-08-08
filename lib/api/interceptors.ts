/**
 * API Interceptors
 * Request and response interceptors for consistent API handling
 */

import { ApiResponse } from "./index";

// Request interceptor
export const requestInterceptor = async (
  config: RequestInit,
): Promise<RequestInit> => {
  // Add common headers
  const headers = new Headers(config.headers);

  // Add request timestamp
  headers.set("X-Request-Timestamp", Date.now().toString());

  // Add request ID for tracking
  headers.set("X-Request-ID", generateRequestId());

  // Add client info
  headers.set(
    "X-Client-Version",
    process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  );
  headers.set("X-Client-Platform", "web");

  // Add locale if available
  if (typeof window !== "undefined") {
    const locale = localStorage.getItem("locale") || navigator.language;
    headers.set("Accept-Language", locale);
  }

  // Add cache control for GET requests
  if (!config.method || config.method === "GET") {
    headers.set("Cache-Control", "no-cache");
  }

  return {
    ...config,
    headers,
  };
};

// Response interceptor
export const responseInterceptor = async <T>(
  response: Response,
): Promise<T> => {
  const contentType = response.headers.get("content-type");

  // Handle different content types
  let data: any;

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else if (contentType?.includes("text/")) {
    data = await response.text();
  } else if (contentType?.includes("application/octet-stream")) {
    data = await response.blob();
  } else {
    data = await response.text();
  }

  // Handle error responses
  if (!response.ok) {
    const error = new ApiInterceptorError(
      data?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status.toString(),
      {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      },
    );

    throw error;
  }

  // Transform successful responses
  const transformedResponse: ApiResponse<T> = {
    data,
    success: true,
    message: data?.message,
    errors: data?.errors,
    meta: {
      timestamp: Date.now(),
      requestId: response.headers.get("X-Request-ID") || generateRequestId(),
      ...(data?.meta && { ...data.meta }),
    },
  };

  return transformedResponse as T;
};

// Generate unique request ID
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Custom error class for interceptors
export class ApiInterceptorError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = "ApiInterceptorError";
    this.code = code;
    this.details = details;
  }
}

// Response transformation utilities
export const transformResponse = {
  // Transform timestamps to Date objects
  timestamps: <T extends Record<string, any>>(
    data: T,
    fields: string[] = ["createdAt", "updatedAt", "date", "dueDate"],
  ): T => {
    const transformed = { ...data };

    fields.forEach((field) => {
      if (transformed[field] && typeof transformed[field] === "number") {
        transformed[field] = new Date(transformed[field]);
      }
    });

    return transformed;
  },

  // Transform nested objects
  nested: <T>(data: T, transformer: (item: any) => any): T => {
    if (Array.isArray(data)) {
      return data.map(transformer) as T;
    }

    if (typeof data === "object" && data !== null) {
      return transformer(data);
    }

    return data;
  },

  // Sanitize sensitive data
  sanitize: <T extends Record<string, any>>(
    data: T,
    sensitiveFields: string[] = ["password", "token", "secret"],
  ): T => {
    const sanitized = { ...data };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = "[REDACTED]";
      }
    });

    return sanitized;
  },
};

// Request transformation utilities
export const transformRequest = {
  // Remove undefined/null values
  clean: <T extends Record<string, any>>(data: T): T => {
    const cleaned = { ...data };

    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === undefined || cleaned[key] === null) {
        delete cleaned[key];
      }
    });

    return cleaned;
  },

  // Trim string values
  trim: <T extends Record<string, any>>(data: T): T => {
    const trimmed = { ...data };

    Object.keys(trimmed).forEach((key) => {
      if (typeof trimmed[key] === "string") {
        trimmed[key] = trimmed[key].trim();
      }
    });

    return trimmed;
  },

  // Convert Date objects to timestamps
  dates: <T extends Record<string, any>>(
    data: T,
    fields: string[] = ["createdAt", "updatedAt", "date", "dueDate"],
  ): T => {
    const transformed = { ...data };

    fields.forEach((field) => {
      if (transformed[field] instanceof Date) {
        transformed[field] = transformed[field].getTime();
      }
    });

    return transformed;
  },
};
