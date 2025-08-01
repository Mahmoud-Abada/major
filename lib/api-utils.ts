/**
 * API Utilities
 * Common utilities for API interactions and error handling
 */

import { ApiError } from "@/services/classroom-api";

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error types
export const ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// Request configuration
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Response wrapper
export interface ApiResponseWrapper<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// Error handler utility
export const createApiError = (
  message: string,
  code: string,
  status?: number,
  details?: any,
): ApiError => {
  const error = new ApiError(message, code, details);

  // Add additional properties based on status code
  if (status) {
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        error.code = ERROR_TYPES.AUTHENTICATION_ERROR;
        break;
      case HTTP_STATUS.FORBIDDEN:
        error.code = ERROR_TYPES.AUTHORIZATION_ERROR;
        break;
      case HTTP_STATUS.NOT_FOUND:
        error.code = ERROR_TYPES.NOT_FOUND_ERROR;
        break;
      case HTTP_STATUS.CONFLICT:
        error.code = ERROR_TYPES.CONFLICT_ERROR;
        break;
      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        error.code = ERROR_TYPES.VALIDATION_ERROR;
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        error.code = ERROR_TYPES.SERVER_ERROR;
        break;
      default:
        error.code = ERROR_TYPES.UNKNOWN_ERROR;
    }
  }

  return error;
};

// Enhanced fetch with timeout and retry logic
export const fetchWithConfig = async (
  url: string,
  config: RequestConfig = {},
): Promise<Response> => {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    ...fetchConfig
  } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const attemptFetch = async (attempt: number): Promise<Response> => {
    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Don't retry on abort (timeout) or authentication errors
      if (
        error instanceof Error &&
        (error.name === "AbortError" ||
          (error as any).status === HTTP_STATUS.UNAUTHORIZED)
      ) {
        throw error;
      }

      // Retry logic
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, attempt)),
        );
        return attemptFetch(attempt + 1);
      }

      throw error;
    }
  };

  return attemptFetch(0);
};

// Request interceptor
export const requestInterceptor = (config: RequestConfig): RequestConfig => {
  // Add common headers
  const headers = new Headers(config.headers);

  // Add timestamp for cache busting
  if (config.method === "GET") {
    headers.set("Cache-Control", "no-cache");
  }

  // Add request ID for tracking
  headers.set("X-Request-ID", generateRequestId());

  return {
    ...config,
    headers,
  };
};

// Response interceptor
export const responseInterceptor = async <T>(
  response: Response,
): Promise<ApiResponseWrapper<T>> => {
  const data = await response.json();

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

// Generate unique request ID
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  },

  setToken: (token: string, persistent = false): void => {
    if (typeof window === "undefined") return;

    if (persistent) {
      localStorage.setItem("auth_token", token);
      sessionStorage.removeItem("auth_token");
    } else {
      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token");
    }
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

// URL utilities
export const urlUtils = {
  buildUrl: (
    baseUrl: string,
    path: string,
    params?: Record<string, any>,
  ): string => {
    const url = new URL(path, baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  },

  parseUrl: (
    url: string,
  ): { baseUrl: string; path: string; params: Record<string, string> } => {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return {
      baseUrl: `${urlObj.protocol}//${urlObj.host}`,
      path: urlObj.pathname,
      params,
    };
  },
};

// Data transformation utilities
export const dataUtils = {
  // Convert timestamps to Date objects
  transformTimestamps: <T extends Record<string, any>>(
    data: T,
    timestampFields: string[] = ["createdAt", "updatedAt", "date", "dueDate"],
  ): T => {
    const transformed = { ...data };

    timestampFields.forEach((field) => {
      if (transformed[field] && typeof transformed[field] === "number") {
        transformed[field] = new Date(transformed[field]);
      }
    });

    return transformed;
  },

  // Convert Date objects to timestamps
  transformDates: <T extends Record<string, any>>(
    data: T,
    dateFields: string[] = ["createdAt", "updatedAt", "date", "dueDate"],
  ): T => {
    const transformed = { ...data };

    dateFields.forEach((field) => {
      if (transformed[field] instanceof Date) {
        transformed[field] = transformed[field].getTime();
      }
    });

    return transformed;
  },

  // Sanitize data for API submission
  sanitizeData: <T extends Record<string, any>>(data: T): T => {
    const sanitized = { ...data };

    // Remove undefined values
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });

    // Trim string values
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "string") {
        sanitized[key] = sanitized[key].trim();
      }
    });

    return sanitized;
  },
};

// Validation utilities
export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  isValidColorHex: (color: string): boolean => {
    const colorRegex = /^#[0-9A-F]{6}$/i;
    return colorRegex.test(color);
  },

  isValidTime: (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },
};

// Cache utilities
export const cacheUtils = {
  set: (key: string, data: any, ttl: number = 300000): void => {
    if (typeof window === "undefined") return;

    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  },

  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl;

      if (isExpired) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn("Failed to retrieve cached data:", error);
      return null;
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`cache_${key}`);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("cache_"),
    );
    keys.forEach((key) => localStorage.removeItem(key));
  },
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Format utilities
export const formatUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  },

  formatPercentage: (value: number, total: number): string => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  },
};

// Export all utilities
export {
  cacheUtils,
  createApiError,
  dataUtils,
  debounce,
  fetchWithConfig as fetch,
  formatUtils,
  requestInterceptor,
  responseInterceptor,
  throttle,
  tokenManager,
  urlUtils,
  validationUtils,
};
