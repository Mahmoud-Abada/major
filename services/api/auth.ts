/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiConfig } from '@/lib/api';
import { apiClient } from '@/lib/api/client';
import {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    ResetPasswordRequest,
    User,
} from '@/lib/api/types';

export class AuthApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = apiConfig.endpoints.auth;
    }

    // Authentication methods
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            `${this.baseUrl}/login`,
            credentials
        );
        return response;
    }

    async register(userData: RegisterRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            `${this.baseUrl}/register`,
            userData
        );
        return response;
    }

    async logout(): Promise<void> {
        await apiClient.post(`${this.baseUrl}/logout`);
    }

    async refreshToken(refreshToken: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            `${this.baseUrl}/refresh`,
            { refreshToken }
        );
        return response;
    }

    // Password management
    async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
        await apiClient.post(`${this.baseUrl}/forgot-password`, request);
    }

    async resetPassword(request: ResetPasswordRequest): Promise<void> {
        await apiClient.post(`${this.baseUrl}/reset-password`, request);
    }

    async changePassword(request: ChangePasswordRequest): Promise<void> {
        await apiClient.post(`${this.baseUrl}/change-password`, request);
    }

    // Email verification
    async sendVerificationEmail(): Promise<void> {
        await apiClient.post(`${this.baseUrl}/send-verification`);
    }

    async verifyEmail(token: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/verify-email`, { token });
    }

    // Profile management
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>(
            `${this.baseUrl}/profile`,
            undefined,
            { cache: true, cacheTtl: 300000 }
        );
        return response;
    }

    async updateProfile(userData: Partial<User>): Promise<User> {
        const response = await apiClient.patch<User>(
            `${this.baseUrl}/profile`,
            userData
        );
        return response;
    }

    // Two-factor authentication
    async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
        const response = await apiClient.post<{ qrCode: string; secret: string }>(
            `${this.baseUrl}/2fa/enable`
        );
        return response;
    }

    async verifyTwoFactor(token: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/2fa/verify`, { token });
    }

    async disableTwoFactor(token: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/2fa/disable`, { token });
    }

    // Session management
    async getSessions(): Promise<Array<{
        id: string;
        device: string;
        location: string;
        lastActive: number;
        isCurrent: boolean;
    }>> {
        const response = await apiClient.get<Array<{
            id: string;
            device: string;
            location: string;
            lastActive: number;
            isCurrent: boolean;
        }>>(`${this.baseUrl}/sessions`);
        return response;
    }

    async revokeSession(sessionId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/sessions/${sessionId}`);
    }

    async revokeAllSessions(): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/sessions`);
    }

    // Account management
    async deleteAccount(password: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/account`, { password });
    }

    async exportData(): Promise<Blob> {
        const response = await apiClient.get<Blob>(`${this.baseUrl}/export-data`);
        return response;
    }
}

// Export singleton instance
export const authApi = new AuthApiService();