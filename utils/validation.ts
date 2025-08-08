import { z } from "zod";

// Common validation patterns
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[0-9+\-\s()]+$/;
export const usernameRegex = /^[a-zA-Z0-9_]+$/;
export const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

// Validation functions
export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8;
}

export function isValidUsername(username: string): boolean {
  return usernameRegex.test(username) && username.length >= 3;
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!passwordRegex.uppercase.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!passwordRegex.lowercase.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!passwordRegex.number.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!passwordRegex.special.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Zod schemas for forms
export const createEmailSchema = (t: (key: string) => string) =>
  z.string().min(1, t("validation.required")).email(t("validation.email"));

export const createPhoneSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(1, t("validation.required"))
    .regex(phoneRegex, t("validation.phoneFormat"));

export const createUsernameSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(3, t("validation.minLength").replace("{length}", "3"))
    .regex(usernameRegex, t("validation.usernameFormat"));

export const createPasswordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(8, t("validation.minLength").replace("{length}", "8"))
    .regex(passwordRegex.uppercase, t("validation.passwordUppercase"))
    .regex(passwordRegex.lowercase, t("validation.passwordLowercase"))
    .regex(passwordRegex.number, t("validation.passwordNumber"))
    .regex(passwordRegex.special, t("validation.passwordSpecialChar"));

export const createRequiredStringSchema = (t: (key: string) => string) =>
  z.string().min(1, t("validation.required"));

export const createOptionalUrlSchema = (t: (key: string) => string) =>
  z.string().url(t("validation.url")).optional().or(z.literal(""));

// Form validation helpers
export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    identifier: z
      .string()
      .min(1, t("validation.required"))
      .refine(
        (value) => {
          return isValidEmail(value) || isValidPhone(value);
        },
        {
          message: t("validation.emailOrPhone"),
        },
      ),
    password: z.string().min(1, t("validation.required")),
    rememberMe: z.boolean().optional().default(false),
  });
}

export function createForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    identifier: z
      .string()
      .min(1, t("validation.required"))
      .refine(
        (value) => {
          return isValidEmail(value) || isValidPhone(value);
        },
        {
          message: t("validation.emailOrPhone"),
        },
      ),
  });
}

export function createResetPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      newPassword: createPasswordSchema(t),
      confirmPassword: z.string().min(1, t("validation.required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });
}

export function createOTPSchema(t: (key: string) => string) {
  return z.object({
    otp: z
      .string()
      .length(6, t("validation.otpLength"))
      .regex(/^\d+$/, t("validation.otpDigits")),
  });
}
