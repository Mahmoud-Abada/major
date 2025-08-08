import { z } from "zod";

// ─────────────────────────────
// Authentication Schemas
// ─────────────────────────────

// Common validation patterns
const emailSchema = z
  .string()
  .email("Invalid email address")
  .transform((val) => val.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be at most 32 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(
    /^[a-zA-Z\s-']+$/,
    "Name can only contain letters, spaces, and hyphens",
  );

const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
  .optional();

// User role enum
export const UserRoleSchema = z.enum(
  ["admin", "teacher", "student", "parent"],
  {
    errorMap: () => ({ message: "Please select a valid role" }),
  },
);

// User status enum
export const UserStatusSchema = z.enum(
  ["active", "inactive", "pending", "suspended"],
  {
    errorMap: () => ({ message: "Invalid user status" }),
  },
);

// ─────────────────────────────
// Sign In Schema
// ─────────────────────────────

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type SignInInput = z.infer<typeof signInSchema>;

// ─────────────────────────────
// Sign Up Schema
// ─────────────────────────────

const baseSignUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phoneNumber: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: UserRoleSchema,
});

export const signUpSchema = baseSignUpSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export type SignUpInput = z.infer<typeof signUpSchema>;

// ─────────────────────────────
// Password Reset Schema
// ─────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ─────────────────────────────
// OTP Verification Schema
// ─────────────────────────────

export const otpVerificationSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;

// ─────────────────────────────
// Change Password Schema
// ─────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ─────────────────────────────
// User Profile Update Schema
// ─────────────────────────────

export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneSchema,
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─────────────────────────────
// Two-Factor Authentication Schema
// ─────────────────────────────

export const twoFactorSetupSchema = z.object({
  password: z.string().min(1, "Password is required"),
  totpCode: z
    .string()
    .length(6, "TOTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "TOTP code must contain only numbers"),
});

export type TwoFactorSetupInput = z.infer<typeof twoFactorSetupSchema>;

export const twoFactorVerificationSchema = z.object({
  totpCode: z
    .string()
    .length(6, "TOTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "TOTP code must contain only numbers"),
});

export type TwoFactorVerificationInput = z.infer<
  typeof twoFactorVerificationSchema
>;

// ─────────────────────────────
// Session Schema
// ─────────────────────────────

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
  rememberMe: z.boolean(),
  createdAt: z.date(),
  lastActivity: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type SessionData = z.infer<typeof sessionSchema>;

// ─────────────────────────────
// Authentication Response Schema
// ─────────────────────────────

export const authResponseSchema = z.object({
  success: z.boolean(),
  user: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      role: UserRoleSchema,
      status: UserStatusSchema,
      avatar: z.string().optional(),
      isEmailVerified: z.boolean(),
      twoFactorEnabled: z.boolean(),
    })
    .optional(),
  token: z.string().optional(),
  message: z.string().optional(),
  requiresTwoFactor: z.boolean().optional(),
  requiresEmailVerification: z.boolean().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// ─────────────────────────────
// Error Schema
// ─────────────────────────────

export const authErrorSchema = z.object({
  code: z.enum([
    "INVALID_CREDENTIALS",
    "USER_NOT_FOUND",
    "EMAIL_ALREADY_EXISTS",
    "INVALID_TOKEN",
    "TOKEN_EXPIRED",
    "ACCOUNT_LOCKED",
    "EMAIL_NOT_VERIFIED",
    "TWO_FACTOR_REQUIRED",
    "INVALID_OTP",
    "TOO_MANY_ATTEMPTS",
    "WEAK_PASSWORD",
    "VALIDATION_ERROR",
    "NETWORK_ERROR",
    "SERVER_ERROR",
  ]),
  message: z.string(),
  field: z.string().optional(),
  details: z.any().optional(),
});

export type AuthError = z.infer<typeof authErrorSchema>;

// ─────────────────────────────
// Validation Helpers
// ─────────────────────────────

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

export const getPasswordStrength = (
  password: string,
): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("Use at least 8 characters");

  if (password.length >= 12) score += 1;
  else if (password.length >= 8)
    feedback.push("Consider using 12+ characters for better security");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add uppercase letters");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Add numbers");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Add special characters");

  if (!/(.)\1{2,}/.test(password)) score += 1;
  else feedback.push("Avoid repeating characters");

  return { score, feedback };
};

// ─────────────────────────────
// Role-specific validation
// ─────────────────────────────

export const adminSignUpSchema = baseSignUpSchema
  .extend({
    role: z.literal("admin"),
    department: z.string().min(1, "Department is required"),
    position: z.string().min(1, "Position is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const teacherSignUpSchema = baseSignUpSchema
  .extend({
    role: z.literal("teacher"),
    subjects: z.array(z.string()).min(1, "At least one subject is required"),
    qualifications: z
      .array(z.string())
      .min(1, "At least one qualification is required"),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const studentSignUpSchema = baseSignUpSchema
  .extend({
    role: z.literal("student"),
    studentId: z.string().min(1, "Student ID is required"),
    grade: z.string().min(1, "Grade is required"),
    dateOfBirth: z.date().refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 6 && age <= 25;
      },
      { message: "Student must be between 6 and 25 years old" },
    ),
    parentEmail: emailSchema.optional(),
    parentPhone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const parentSignUpSchema = baseSignUpSchema
  .extend({
    role: z.literal("parent"),
    relationship: z.enum(["father", "mother", "guardian", "other"]),
    occupation: z.string().optional(),
    children: z
      .array(z.string())
      .min(1, "At least one child must be specified"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AdminSignUpInput = z.infer<typeof adminSignUpSchema>;
export type TeacherSignUpInput = z.infer<typeof teacherSignUpSchema>;
export type StudentSignUpInput = z.infer<typeof studentSignUpSchema>;
export type ParentSignUpInput = z.infer<typeof parentSignUpSchema>;
