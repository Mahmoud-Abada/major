import { AuthUser } from "@/services/auth";

export const AUTH_STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  USER_ID: "userId",
  RESET_USER_ID: "resetUserId",
} as const;

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setAuthData(user: AuthUser, token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));

  // Also set in cookies for middleware access
  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
}

export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  sessionStorage.clear();

  // Clear auth cookie
  document.cookie =
    "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8;
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
