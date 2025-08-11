"use client";
import {
  AuthUser,
  ForgetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from "@/services/auth";
import {
  useForgetPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthState,
  clearError,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  setAuthState,
  setOTPState,
  setPasswordResetState,
} from "@/store/slices/authSlice";
import { showErrorToast, showSuccessToast } from "@/utils/error-handler";
import {
  clearAuthData,
  setTokens,
  setUserData,
} from "@/utils/tokenManager";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  sendOTP: (data: SendOTPRequest) => Promise<void>;
  verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
  forgetPassword: (data: ForgetPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  // RTK Query mutations
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();
  const [sendOTPMutation, { isLoading: sendOTPLoading }] = useSendOTPMutation();
  const [verifyOTPMutation, { isLoading: verifyOTPLoading }] = useVerifyOTPMutation();
  const [forgetPasswordMutation, { isLoading: forgetPasswordLoading }] = useForgetPasswordMutation();
  const [resetPasswordMutation, { isLoading: resetPasswordLoading }] = useResetPasswordMutation();
  const [logoutMutation] = useLogoutMutation();

  const isLoading = loading || loginLoading || registerLoading || sendOTPLoading ||
    verifyOTPLoading || forgetPasswordLoading || resetPasswordLoading;

  const handleError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Auth error:", err);

    // Extract the actual error message from RTK Query error
    let errorMessage = defaultMessage;

    if (err && typeof err === 'object') {
      // RTK Query error structure
      if ('data' in err && err.data && typeof err.data === 'object') {
        if ('message' in err.data && typeof err.data.message === 'string') {
          errorMessage = err.data.message;
        }
      }
      // Direct error with message
      else if ('message' in err && typeof err.message === 'string') {
        errorMessage = err.message;
      }
    }

    showErrorToast(errorMessage, "Error");
    throw new Error(errorMessage);
  }, []);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        const response = await loginMutation(data).unwrap();

        // Handle both old and new response structures
        const isSuccess = response.success || response.status === "success";
        const userData = response.user || response.payload;

        if (isSuccess && userData) {
          // Store tokens securely with a default expiry (7 days)
          const defaultExpiryInSeconds = 7 * 24 * 60 * 60;
          setTokens(userData.token, undefined, defaultExpiryInSeconds);
          setUserData(userData);

          // Update Redux state
          dispatch(setAuthState({
            user: userData,
            token: userData.token,
            expiresIn: 7 * 24 * 60 * 60
          }));

          // Show success toast
          showSuccessToast("Login successful! Redirecting...", "Welcome back!");

          // Redirect based on user verification status
          if (!userData.isVerified) {
            sessionStorage.setItem("userId", userData.id || userData._id);
            setTimeout(() => router.push("/otp"), 1000);
          } else {
            setTimeout(() => router.push("/classroom/dashboard"), 1000);
          }
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (err) {
        handleError(err, "Login failed");
      }
    },
    [loginMutation, dispatch, router, handleError],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        console.log("🚀 Starting registration process...");

        const response = await registerMutation(data).unwrap();

        console.log("📡 API Response received:", response);

        if (response.status === "success" && response.payload?._id) {
          console.log("✅ Registration successful");

          // Store user ID for OTP verification
          dispatch(setOTPState({
            sent: true,
            verified: false,
            userId: response.payload._id
          }));

          sessionStorage.setItem("userId", response.payload._id);

          // Show success toast
          showSuccessToast(
            "Registration successful! Please check your verification method.",
            "Success",
          );

          console.log("🔄 Redirecting to OTP page...");
          router.push("/otp");
        } else {
          throw new Error(response.message || "Registration failed");
        }
      } catch (err) {
        console.log("🔥 Registration error caught:", err);

        // Check if this is actually a success message being treated as error
        const errorMessage = err instanceof Error ? err.message : String(err);

        if (
          errorMessage.includes("User had been created successfully") ||
          errorMessage.includes("opt for verification")
        ) {
          console.log("✅ Error message indicates success - treating as success");

          // Show success toast
          showSuccessToast(
            "Registration successful! Please check your verification method.",
            "Success",
          );

          router.push("/otp");
          return;
        }

        handleError(err, "Registration failed");
      }
    },
    [registerMutation, dispatch, router, handleError],
  );

  const sendOTP = useCallback(
    async (data: SendOTPRequest) => {
      try {
        const response = await sendOTPMutation(data).unwrap();

        if (response.success) {
          dispatch(setOTPState({ sent: true, verified: false, userId: data.userId }));
          showSuccessToast("OTP sent successfully!", "Success");
        } else {
          throw new Error(response.message || "Failed to send OTP");
        }
      } catch (err) {
        handleError(err, "Failed to send OTP");
      }
    },
    [sendOTPMutation, dispatch, handleError],
  );

  const verifyOTP = useCallback(
    async (data: VerifyOTPRequest) => {
      try {
        const response = await verifyOTPMutation(data).unwrap();

        if (response.success && response.verified) {
          dispatch(setOTPState({ sent: true, verified: true }));

          if (response.token) {
            // Store tokens securely
            setTokens(response.token);

            // Update user as verified
            const updatedUser = user ? { ...user, isVerified: true, token: response.token } : null;
            if (updatedUser) {
              setUserData(updatedUser);
              dispatch(setAuthState({
                user: updatedUser,
                token: response.token
              }));
            }
          }

          sessionStorage.removeItem("userId");
          sessionStorage.removeItem("resetUserId");

          showSuccessToast("Verification successful!", "Welcome!");
          router.push("/classroom/dashboard");
        } else {
          throw new Error(response.message || "OTP verification failed");
        }
      } catch (err) {
        handleError(err, "OTP verification failed");
      }
    },
    [verifyOTPMutation, dispatch, user, router, handleError],
  );

  const forgetPassword = useCallback(
    async (data: ForgetPasswordRequest) => {
      try {
        const response = await forgetPasswordMutation(data).unwrap();

        if (response.success) {
          dispatch(setPasswordResetState({
            requested: true,
            completed: false,
            userId: data.userId
          }));

          sessionStorage.setItem("resetUserId", data.userId);
          showSuccessToast("Password reset code sent!", "Success");
          router.push("/otp?type=reset");
        } else {
          throw new Error(response.message || "Failed to initiate password reset");
        }
      } catch (err) {
        handleError(err, "Failed to initiate password reset");
      }
    },
    [forgetPasswordMutation, dispatch, router, handleError],
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      try {
        const response = await resetPasswordMutation(data).unwrap();

        if (response.success) {
          dispatch(setPasswordResetState({
            requested: true,
            completed: true
          }));

          sessionStorage.removeItem("resetUserId");
          showSuccessToast("Password reset successful!", "Success");
          router.push("/signin?message=password-reset-success");
        } else {
          throw new Error(response.message || "Password reset failed");
        }
      } catch (err) {
        handleError(err, "Password reset failed");
      }
    },
    [resetPasswordMutation, dispatch, router, handleError],
  );

  const logout = useCallback(async () => {
    try {
      // Call logout API
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout API failed:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear all auth data
      clearAuthData();
      dispatch(clearAuthState());

      showSuccessToast("Logged out successfully", "Goodbye!");
      router.push("/signin");
    }
  }, [logoutMutation, dispatch, router]);

  return {
    user,
    loading: isLoading,
    error,
    isAuthenticated,
    login,
    register,
    sendOTP,
    verifyOTP,
    forgetPassword,
    resetPassword,
    logout,
    clearError: clearAuthError,
  };
}
