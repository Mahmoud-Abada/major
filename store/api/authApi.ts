/**
 * Authentication API Endpoints
 * RTK Query endpoints for authentication operations
 */
import type {
    ForgetPasswordRequest,
    LoginRequest,
    LoginResponse,
    OTPResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    SendOTPRequest,
    VerifyOTPRequest,
    VerifyOTPResponse,
} from "@/services/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),

        // Register endpoint
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),

        // Send OTP endpoint
        sendOTP: builder.mutation<OTPResponse, SendOTPRequest>({
            query: (data) => ({
                url: "/auth/send-otp",
                method: "POST",
                body: data,
            }),
        }),

        // Verify OTP endpoint
        verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
            query: (data) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        // Forget password endpoint
        forgetPassword: builder.mutation<OTPResponse, ForgetPasswordRequest>({
            query: (data) => ({
                url: "/auth/forget-password",
                method: "POST",
                body: data,
            }),
        }),

        // Reset password endpoint
        resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data,
            }),
        }),

        // Refresh token endpoint
        refreshToken: builder.mutation<{ token: string; expiresIn: number }, void>({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        // Logout endpoint
        logout: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        // Get current user
        getCurrentUser: builder.query<{ user: any }, void>({
            query: () => "/auth/me",
            providesTags: ["User"],
        }),

        // Validate token
        validateToken: builder.query<{ valid: boolean; user?: any }, void>({
            query: () => "/auth/validate",
            providesTags: ["User"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useValidateTokenQuery,
} = authApi;