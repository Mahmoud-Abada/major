"use client";

import {
  authService,
  AuthUser,
  ForgetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from "@/services/auth";
import {
  AUTH_STORAGE_KEYS,
  clearAuthData,
  getStoredUser,
  setAuthData,
} from "@/utils/auth";
import { handleApiError, showErrorToast } from "@/utils/error-handler";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  sendOTP: (data: SendOTPRequest) => Promise<void>;
  verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
  forgetPassword: (data: ForgetPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const clearError = useCallback(() => setError(null), []);

  const t = useTranslations("auth");

  const handleError = useCallback((err: unknown, defaultMessage: string) => {
    const errorMessage = handleApiError(err, defaultMessage);
    setError(errorMessage);
    showErrorToast(err, defaultMessage);
    console.error(defaultMessage, err);
    throw err;
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.login(data, locale);

        if (response.success && response.user) {
          setUser(response.user);
          setAuthData(response.user, response.user.token);

          // Redirect based on user verification status
          if (!response.user.isVerified) {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.USER_ID, response.user.id);
            router.push("/otp");
          } else {
            router.push("/(auth)/classroom");
          }
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (err) {
        handleError(err, "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [locale, router, handleError],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setLoading(true);
        setError(null);

        console.log("🚀 Starting registration process...");
        console.log("📝 Registration data:", JSON.stringify(data, null, 2));
        console.log("🌐 Locale:", locale);

        const response = await authService.register(data, locale);

        console.log("📡 API Response received:", JSON.stringify(response, null, 2));

        if (response.status === "success" && response.payload?._id) {
          console.log("✅ Registration successful, creating user object...");

          // Create user object from response
          const user = {
            id: response.payload._id,
            email: data.userData.email,
            name: data.userData.name,
            username: data.userData.username || "",
            phoneNumber: data.userData.phoneNumber,
            userType: data.userData.userType,
            isVerified: false,
            token: "", // Will be set after OTP verification
          };

          console.log("👤 User object created:", user);

          setUser(user);
          sessionStorage.setItem(
            AUTH_STORAGE_KEYS.USER_ID,
            response.payload._id,
          );

          console.log("💾 User stored in session storage");

          // Show success toast
          showErrorToast(
            "Registration successful! Please check your verification method.",
            "Success",
          );

          console.log("🔄 Redirecting to OTP page...");
          // Redirect to OTP verification
          router.push("/otp");
          return;
        } else {
          console.log("❌ Registration failed - invalid response format");
          console.log("Response status:", response.status);
          console.log("Response payload:", response.payload);
          throw new Error(response.message || "Registration failed");
        }
      } catch (err) {
        console.log("🔥 Registration error caught:", err);

        // Check if this is actually a success message being treated as error
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log("📄 Error message:", errorMessage);

        if (
          errorMessage.includes("User had been created successfully") ||
          errorMessage.includes("opt for verification")
        ) {
          console.log("✅ Error message indicates success - treating as success");

          // This is actually a success case being treated as error
          setError(null);
          setLoading(false);

          // Show success toast
          showErrorToast(
            "Registration successful! Please check your verification method.",
            "Success",
          );

          console.log("🔄 Redirecting to OTP page...");
          // Still redirect to OTP page since registration was successful
          router.push("/otp");
          return;
        }

        console.log("❌ Actual registration error - calling handleError");
        // Only call handleError for actual errors
        handleError(err, "Registration failed");
      } finally {
        console.log("🏁 Registration process completed, setting loading to false");
        setLoading(false);
      }
    },
    [locale, router, handleError],
  );

  const sendOTP = useCallback(
    async (data: SendOTPRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.sendOTP(data, locale);

        if (!response.success) {
          throw new Error(response.message || "Failed to send OTP");
        }
      } catch (err) {
        handleError(err, "Failed to send OTP");
      } finally {
        setLoading(false);
      }
    },
    [locale, handleError],
  );

  const verifyOTP = useCallback(
    async (data: VerifyOTPRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.verifyOTP(data, locale);

        if (response.success && response.verified) {
          if (response.token) {
            const updatedUser = user ? { ...user, isVerified: true } : null;
            if (updatedUser) {
              setUser(updatedUser);
              setAuthData(updatedUser, response.token);
            }
          }

          sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_ID);
          sessionStorage.removeItem(AUTH_STORAGE_KEYS.RESET_USER_ID);
          router.push("/(auth)/classroom");
        } else {
          throw new Error(response.message || "OTP verification failed");
        }
      } catch (err) {
        handleError(err, "OTP verification failed");
      } finally {
        setLoading(false);
      }
    },
    [locale, user, router, handleError],
  );

  const forgetPassword = useCallback(
    async (data: ForgetPasswordRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.forgetPassword(data, locale);

        if (response.success) {
          // Store userId for password reset flow
          sessionStorage.setItem(AUTH_STORAGE_KEYS.RESET_USER_ID, data.userId);
          router.push("/otp?type=reset");
        } else {
          throw new Error(
            response.message || "Failed to initiate password reset",
          );
        }
      } catch (err) {
        handleError(err, "Failed to initiate password reset");
      } finally {
        setLoading(false);
      }
    },
    [locale, router, handleError],
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.resetPassword(data, locale);

        if (response.success) {
          sessionStorage.removeItem(AUTH_STORAGE_KEYS.RESET_USER_ID);
          router.push("/signin?message=password-reset-success");
        } else {
          throw new Error(response.message || "Password reset failed");
        }
      } catch (err) {
        handleError(err, "Password reset failed");
      } finally {
        setLoading(false);
      }
    },
    [locale, router, handleError],
  );

  const logout = useCallback(() => {
    setUser(null);
    clearAuthData();
    router.push("/signin");
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    register,
    sendOTP,
    verifyOTP,
    forgetPassword,
    resetPassword,
    logout,
    clearError,
  };
}
