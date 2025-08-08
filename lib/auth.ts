// User types - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  status: string;
}

interface AdminUser extends User {
  role: "admin";
}

interface TeacherUser extends User {
  role: "teacher";
}

interface StudentUser extends User {
  role: "student";
}

interface ParentUser extends User {
  role: "parent";
}

// Mock users array - will be replaced with API calls
const mockUsers: User[] = [];
import { authStorage } from "@/lib/storage";
import {
  AuthError,
  AuthResponse,
  ChangePasswordInput,
  changePasswordSchema,
  ForgotPasswordInput,
  forgotPasswordSchema,
  OtpVerificationInput,
  otpVerificationSchema,
  ResetPasswordInput,
  resetPasswordSchema,
  SessionData,
  SignInInput,
  signInSchema,
  SignUpInput,
  signUpSchema,
  UpdateProfileInput,
  updateProfileSchema,
} from "@/lib/validations/auth";

// ─────────────────────────────
// Types and Interfaces
// ─────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthService {
  signIn(credentials: SignInInput): Promise<AuthResponse>;
  signUp(userData: SignUpInput): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  refreshSession(): Promise<AuthResponse>;
  forgotPassword(
    data: ForgotPasswordInput,
  ): Promise<{ success: boolean; message: string }>;
  resetPassword(data: ResetPasswordInput): Promise<AuthResponse>;
  verifyOTP(data: OtpVerificationInput): Promise<AuthResponse>;
  changePassword(
    data: ChangePasswordInput,
  ): Promise<{ success: boolean; message: string }>;
  updateProfile(data: UpdateProfileInput): Promise<User>;
  deleteAccount(): Promise<{ success: boolean; message: string }>;
  enableTwoFactor(): Promise<{ secret: string; qrCode: string }>;
  disableTwoFactor(
    password: string,
  ): Promise<{ success: boolean; message: string }>;
  verifyTwoFactor(code: string): Promise<AuthResponse>;
}

// ─────────────────────────────
// Mock Data Storage
// ─────────────────────────────

// In-memory storage for mock data (in real app, this would be a database)
let users: User[] = [...mockUsers];
let sessions: SessionData[] = [];
const otpCodes: Map<
  string,
  { code: string; expiresAt: Date; attempts: number }
> = new Map();
const resetTokens: Map<
  string,
  { token: string; expiresAt: Date; userId: string }
> = new Map();

// ─────────────────────────────
// Utility Functions
// ─────────────────────────────

const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateResetToken = (): string => {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
};

const isAccountLocked = (user: User): boolean => {
  return user.lockedUntil ? new Date() < user.lockedUntil : false;
};

const incrementFailedAttempts = (userId: string): void => {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].failedLoginAttempts += 1;
    users[userIndex].updatedAt = new Date();

    // Lock account after 5 failed attempts for 30 minutes
    if (users[userIndex].failedLoginAttempts >= 5) {
      users[userIndex].lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
  }
};

const resetFailedAttempts = (userId: string): void => {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].failedLoginAttempts = 0;
    users[userIndex].lockedUntil = undefined;
    users[userIndex].lastLogin = new Date();
    users[userIndex].updatedAt = new Date();
  }
};

const createSession = (
  user: User,
  rememberMe: boolean = false,
): SessionData => {
  const session: SessionData = {
    id: generateToken(),
    userId: user.id,
    token: generateToken(),
    expiresAt: new Date(
      Date.now() +
        (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
    ), // 30 days or 1 day
    rememberMe,
    createdAt: new Date(),
    lastActivity: new Date(),
    ipAddress: "127.0.0.1", // Mock IP
    userAgent: "Mock User Agent",
  };

  sessions.push(session);
  return session;
};

const findSessionByToken = (token: string): SessionData | null => {
  return (
    sessions.find((s) => s.token === token && s.expiresAt > new Date()) || null
  );
};

const removeSession = (token: string): void => {
  sessions = sessions.filter((s) => s.token !== token);
};

const sanitizeUser = (user: User): Omit<User, "password"> => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// ─────────────────────────────
// Authentication Service Implementation
// ─────────────────────────────

export const authService: AuthService = {
  async signIn(credentials: SignInInput): Promise<AuthResponse> {
    await simulateDelay();

    try {
      // Validate input
      const validatedData = signInSchema.parse(credentials);

      // Find user by email
      const user = users.find((u) => u.email === validatedData.email);

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check if account is locked
      if (isAccountLocked(user)) {
        return {
          success: false,
          message:
            "Account is temporarily locked due to too many failed attempts. Please try again later.",
        };
      }

      // Check if account is active
      if (user.status !== "active") {
        return {
          success: false,
          message: `Account is ${user.status}. Please contact support.`,
        };
      }

      // Verify password (in real app, this would use bcrypt)
      if (user.password !== validatedData.password) {
        incrementFailedAttempts(user.id);
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return {
          success: false,
          message: "Please verify your email address before signing in.",
          requiresEmailVerification: true,
        };
      }

      // Check if two-factor authentication is required
      if (user.twoFactorEnabled) {
        // Generate and store OTP
        const otp = generateOTP();
        otpCodes.set(user.email, {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          attempts: 0,
        });

        console.log(`Mock OTP for ${user.email}: ${otp}`); // In real app, this would be sent via SMS/email

        return {
          success: false,
          message:
            "Two-factor authentication required. Please enter the OTP sent to your device.",
          requiresTwoFactor: true,
        };
      }

      // Reset failed attempts on successful login
      resetFailedAttempts(user.id);

      // Create session
      const session = createSession(user, validatedData.rememberMe);

      // Store session in browser storage
      authStorage.setToken(session.token);
      authStorage.setUser(sanitizeUser(user));
      authStorage.setRememberMe(validatedData.rememberMe);

      return {
        success: true,
        user: sanitizeUser(user),
        token: session.token,
        message: "Sign in successful",
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        message: "An error occurred during sign in. Please try again.",
      };
    }
  },

  async signUp(userData: SignUpInput): Promise<AuthResponse> {
    await simulateDelay();

    try {
      // Validate input
      const validatedData = signUpSchema.parse(userData);

      // Check if email already exists
      const existingUser = users.find((u) => u.email === validatedData.email);
      if (existingUser) {
        return {
          success: false,
          message: "An account with this email already exists",
        };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        role: validatedData.role,
        status: "pending", // Require email verification
        password: validatedData.password, // In real app, this would be hashed
        isEmailVerified: false,
        twoFactorEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add role-specific fields based on role
      switch (validatedData.role) {
        case "admin":
          (newUser as AdminUser).permissions = ["basic_access"];
          (newUser as AdminUser).department = "General";
          (newUser as AdminUser).position = "Administrator";
          break;
        case "teacher":
          (newUser as TeacherUser).subjects = [];
          (newUser as TeacherUser).classrooms = [];
          (newUser as TeacherUser).qualifications = [];
          (newUser as TeacherUser).yearsOfExperience = 0;
          (newUser as TeacherUser).employmentDate = new Date();
          break;
        case "student":
          (newUser as StudentUser).studentId = `STU${Date.now()}`;
          (newUser as StudentUser).grade = "1";
          (newUser as StudentUser).guardians = [];
          (newUser as StudentUser).enrollmentDate = new Date();
          (newUser as StudentUser).dateOfBirth = new Date();
          break;
        case "parent":
          (newUser as ParentUser).children = [];
          (newUser as ParentUser).relationship = "guardian";
          break;
      }

      // Add user to mock database
      users.push(newUser);

      // Generate email verification OTP
      const otp = generateOTP();
      otpCodes.set(newUser.email, {
        code: otp,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        attempts: 0,
      });

      console.log(`Mock verification OTP for ${newUser.email}: ${otp}`); // In real app, this would be sent via email

      return {
        success: true,
        message:
          "Account created successfully. Please check your email for verification instructions.",
        requiresEmailVerification: true,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        message: "An error occurred during sign up. Please try again.",
      };
    }
  },

  async signOut(): Promise<void> {
    await simulateDelay(200);

    try {
      const token = authStorage.getToken();
      if (token) {
        removeSession(token);
      }

      authStorage.clearAuth();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  getCurrentUser(): User | null {
    try {
      const token = authStorage.getToken();
      if (!token) return null;

      const session = findSessionByToken(token);
      if (!session) {
        authStorage.clearAuth();
        return null;
      }

      const user = users.find((u) => u.id === session.userId);
      return user ? (sanitizeUser(user) as User) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  async refreshSession(): Promise<AuthResponse> {
    await simulateDelay(200);

    try {
      const token = authStorage.getToken();
      if (!token) {
        return {
          success: false,
          message: "No active session found",
        };
      }

      const session = findSessionByToken(token);
      if (!session) {
        authStorage.clearAuth();
        return {
          success: false,
          message: "Session expired",
        };
      }

      const user = users.find((u) => u.id === session.userId);
      if (!user || user.status !== "active") {
        authStorage.clearAuth();
        return {
          success: false,
          message: "User account is no longer active",
        };
      }

      // Update session activity
      session.lastActivity = new Date();

      return {
        success: true,
        user: sanitizeUser(user),
        token: session.token,
      };
    } catch (error) {
      console.error("Refresh session error:", error);
      return {
        success: false,
        message: "An error occurred while refreshing session",
      };
    }
  },

  async forgotPassword(
    data: ForgotPasswordInput,
  ): Promise<{ success: boolean; message: string }> {
    await simulateDelay();

    try {
      const validatedData = forgotPasswordSchema.parse(data);

      const user = users.find((u) => u.email === validatedData.email);
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message:
            "If an account with this email exists, you will receive password reset instructions.",
        };
      }

      // Generate reset token
      const resetToken = generateResetToken();
      resetTokens.set(resetToken, {
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        userId: user.id,
      });

      console.log(`Mock reset token for ${user.email}: ${resetToken}`); // In real app, this would be sent via email

      return {
        success: true,
        message:
          "If an account with this email exists, you will receive password reset instructions.",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  },

  async resetPassword(data: ResetPasswordInput): Promise<AuthResponse> {
    await simulateDelay();

    try {
      const validatedData = resetPasswordSchema.parse(data);

      const resetData = resetTokens.get(validatedData.token);
      if (!resetData || resetData.expiresAt < new Date()) {
        return {
          success: false,
          message: "Invalid or expired reset token",
        };
      }

      const userIndex = users.findIndex((u) => u.id === resetData.userId);
      if (userIndex === -1) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Update password
      users[userIndex].password = validatedData.password; // In real app, this would be hashed
      users[userIndex].lastPasswordChange = new Date();
      users[userIndex].updatedAt = new Date();
      users[userIndex].failedLoginAttempts = 0;
      users[userIndex].lockedUntil = undefined;

      // Remove reset token
      resetTokens.delete(validatedData.token);

      return {
        success: true,
        message:
          "Password reset successfully. You can now sign in with your new password.",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message:
          "An error occurred while resetting password. Please try again.",
      };
    }
  },

  async verifyOTP(data: OtpVerificationInput): Promise<AuthResponse> {
    await simulateDelay();

    try {
      const validatedData = otpVerificationSchema.parse(data);

      const otpData = otpCodes.get(validatedData.email);
      if (!otpData) {
        return {
          success: false,
          message: "No OTP found for this email. Please request a new one.",
        };
      }

      if (otpData.expiresAt < new Date()) {
        otpCodes.delete(validatedData.email);
        return {
          success: false,
          message: "OTP has expired. Please request a new one.",
        };
      }

      if (otpData.attempts >= 3) {
        otpCodes.delete(validatedData.email);
        return {
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        };
      }

      if (otpData.code !== validatedData.otp) {
        otpData.attempts += 1;
        return {
          success: false,
          message: "Invalid OTP. Please try again.",
        };
      }

      // Find and update user
      const userIndex = users.findIndex((u) => u.email === validatedData.email);
      if (userIndex === -1) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const user = users[userIndex];

      // If this is email verification
      if (!user.isEmailVerified) {
        users[userIndex].isEmailVerified = true;
        users[userIndex].status = "active";
        users[userIndex].updatedAt = new Date();
      }

      // Remove OTP
      otpCodes.delete(validatedData.email);

      // Create session for successful verification
      const session = createSession(user);
      authStorage.setToken(session.token);
      authStorage.setUser(sanitizeUser(user));

      return {
        success: true,
        user: sanitizeUser(user),
        token: session.token,
        message: "Verification successful",
      };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return {
        success: false,
        message: "An error occurred during verification. Please try again.",
      };
    }
  },

  async changePassword(
    data: ChangePasswordInput,
  ): Promise<{ success: boolean; message: string }> {
    await simulateDelay();

    try {
      const validatedData = changePasswordSchema.parse(data);
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: "You must be signed in to change your password",
        };
      }

      const user = users.find((u) => u.id === currentUser.id);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Verify current password
      if (user.password !== validatedData.currentPassword) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      // Update password
      const userIndex = users.findIndex((u) => u.id === user.id);
      users[userIndex].password = validatedData.newPassword; // In real app, this would be hashed
      users[userIndex].lastPasswordChange = new Date();
      users[userIndex].updatedAt = new Date();

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: "An error occurred while changing password. Please try again.",
      };
    }
  },

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    await simulateDelay();

    try {
      const validatedData = updateProfileSchema.parse(data);
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        throw new Error("You must be signed in to update your profile");
      }

      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        avatar: validatedData.avatar,
        updatedAt: new Date(),
      };

      const updatedUser = sanitizeUser(users[userIndex]);
      authStorage.setUser(updatedUser);

      return updatedUser as User;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    await simulateDelay();

    try {
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: "You must be signed in to delete your account",
        };
      }

      // Remove user from mock database
      users = users.filter((u) => u.id !== currentUser.id);

      // Remove all sessions for this user
      sessions = sessions.filter((s) => s.userId !== currentUser.id);

      // Clear auth storage
      authStorage.clearAuth();

      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (error) {
      console.error("Delete account error:", error);
      return {
        success: false,
        message: "An error occurred while deleting account. Please try again.",
      };
    }
  },

  async enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
    await simulateDelay();

    // Mock implementation - in real app, this would generate actual TOTP secret
    const secret = Math.random().toString(36).substring(2, 15);
    const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;

    return { secret, qrCode };
  },

  async disableTwoFactor(
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    await simulateDelay();

    try {
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: "You must be signed in to disable two-factor authentication",
        };
      }

      const user = users.find((u) => u.id === currentUser.id);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Verify password
      if (user.password !== password) {
        return {
          success: false,
          message: "Incorrect password",
        };
      }

      // Disable two-factor authentication
      const userIndex = users.findIndex((u) => u.id === user.id);
      users[userIndex].twoFactorEnabled = false;
      users[userIndex].updatedAt = new Date();

      return {
        success: true,
        message: "Two-factor authentication disabled successfully",
      };
    } catch (error) {
      console.error("Disable two-factor error:", error);
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  },

  async verifyTwoFactor(code: string): Promise<AuthResponse> {
    await simulateDelay();

    // Mock implementation - in real app, this would verify TOTP code
    if (code === "123456") {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const userIndex = users.findIndex((u) => u.id === currentUser.id);
        users[userIndex].twoFactorEnabled = true;
        users[userIndex].updatedAt = new Date();

        return {
          success: true,
          message: "Two-factor authentication enabled successfully",
        };
      }
    }

    return {
      success: false,
      message: "Invalid verification code",
    };
  },
};

// ─────────────────────────────
// Export utilities
// ─────────────────────────────

export { generateOTP, generateToken, sanitizeUser };
export type { AdminUser, ParentUser, StudentUser, TeacherUser, User };
