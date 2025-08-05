/**
 * Users API Service
 * Handles user management and related operations
 */

import { apiConfig, PaginatedResponse, QueryParams } from '@/lib/api';
import { apiClient } from '@/lib/api/client';
import { CreateRequest, UpdateRequest, User } from '@/lib/api/types';

export interface UserFilters {
    role?: string;
    isActive?: boolean;
    search?: string;
    dateRange?: {
        start: number;
        end: number;
    };
}

export interface UserStats {
    total: number;
    active: number;
    byRole: Record<string, number>;
    recentSignups: number;
    lastWeekGrowth: number;
}

export class UsersApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = apiConfig.endpoints.users;
    }

    // User CRUD operations
    async getUsers(
        params?: QueryParams & UserFilters
    ): Promise<PaginatedResponse<User>> {
        const response = await apiClient.get<PaginatedResponse<User>>(
            `${this.baseUrl}`,
            params,
            { cache: true, cacheTtl: 60000 }
        );
        return response;
    }

    async getUser(userId: string): Promise<User> {
        const response = await apiClient.get<User>(
            `${this.baseUrl}/${userId}`,
            undefined,
            { cache: true, cacheTtl: 300000 }
        );
        return response;
    }

    async createUser(userData: CreateRequest<User>): Promise<User> {
        const response = await apiClient.post<User>(`${this.baseUrl}`, userData);
        return response;
    }

    async updateUser(userId: string, userData: UpdateRequest<User>): Promise<User> {
        const response = await apiClient.patch<User>(
            `${this.baseUrl}/${userId}`,
            userData
        );
        return response;
    }

    async deleteUser(userId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${userId}`);
    }

    // Bulk operations
    async bulkCreateUsers(users: CreateRequest<User>[]): Promise<User[]> {
        const response = await apiClient.post<User[]>(`${this.baseUrl}/bulk`, {
            users,
        });
        return response;
    }

    async bulkUpdateUsers(
        updates: Array<{ id: string; data: UpdateRequest<User> }>
    ): Promise<User[]> {
        const response = await apiClient.patch<User[]>(`${this.baseUrl}/bulk`, {
            updates,
        });
        return response;
    }

    async bulkDeleteUsers(userIds: string[]): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/bulk`, { userIds });
    }

    // User search and filtering
    async searchUsers(query: string, filters?: UserFilters): Promise<User[]> {
        const response = await apiClient.get<User[]>(`${this.baseUrl}/search`, {
            q: query,
            ...filters,
        });
        return response;
    }

    async getUsersByRole(role: string): Promise<User[]> {
        const response = await apiClient.get<User[]>(
            `${this.baseUrl}/by-role/${role}`,
            undefined,
            { cache: true, cacheTtl: 300000 }
        );
        return response;
    }

    // User statistics
    async getUserStats(): Promise<UserStats> {
        const response = await apiClient.get<UserStats>(
            `${this.baseUrl}/stats`,
            undefined,
            { cache: true, cacheTtl: 300000 }
        );
        return response;
    }

    // User activation/deactivation
    async activateUser(userId: string): Promise<User> {
        const response = await apiClient.post<User>(
            `${this.baseUrl}/${userId}/activate`
        );
        return response;
    }

    async deactivateUser(userId: string, reason?: string): Promise<User> {
        const response = await apiClient.post<User>(
            `${this.baseUrl}/${userId}/deactivate`,
            { reason }
        );
        return response;
    }

    // User roles and permissions
    async assignRole(userId: string, role: string): Promise<User> {
        const response = await apiClient.post<User>(
            `${this.baseUrl}/${userId}/role`,
            { role }
        );
        return response;
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const response = await apiClient.get<string[]>(
            `${this.baseUrl}/${userId}/permissions`
        );
        return response;
    }

    async grantPermission(userId: string, permission: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${userId}/permissions`, {
            permission,
        });
    }

    async revokePermission(userId: string, permission: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${userId}/permissions`, {
            permission,
        });
    }

    // User preferences
    async getUserPreferences(userId: string): Promise<any> {
        const response = await apiClient.get<any>(
            `${this.baseUrl}/${userId}/preferences`,
            undefined,
            { cache: true, cacheTtl: 300000 }
        );
        return response;
    }

    async updateUserPreferences(userId: string, preferences: any): Promise<any> {
        const response = await apiClient.patch<any>(
            `${this.baseUrl}/${userId}/preferences`,
            preferences
        );
        return response;
    }

    // User activity
    async getUserActivity(
        userId: string,
        params?: {
            limit?: number;
            offset?: number;
            dateRange?: { start: number; end: number };
        }
    ): Promise<Array<{
        id: string;
        action: string;
        resource: string;
        timestamp: number;
        metadata?: any;
    }>> {
        const response = await apiClient.get<Array<{
            id: string;
            action: string;
            resource: string;
            timestamp: number;
            metadata?: any;
        }>>(`${this.baseUrl}/${userId}/activity`, params);
        return response;
    }

    // User invitations
    async inviteUser(email: string, role: string, message?: string): Promise<{
        inviteId: string;
        inviteUrl: string;
        expiresAt: number;
    }> {
        const response = await apiClient.post<{
            inviteId: string;
            inviteUrl: string;
            expiresAt: number;
        }>(`${this.baseUrl}/invite`, { email, role, message });
        return response;
    }

    async getInvitations(status?: 'pending' | 'accepted' | 'expired'): Promise<Array<{
        id: string;
        email: string;
        role: string;
        status: string;
        invitedBy: string;
        createdAt: number;
        expiresAt: number;
    }>> {
        const response = await apiClient.get<Array<{
            id: string;
            email: string;
            role: string;
            status: string;
            invitedBy: string;
            createdAt: number;
            expiresAt: number;
        }>>(`${this.baseUrl}/invitations`, { status });
        return response;
    }

    async resendInvitation(inviteId: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/invitations/${inviteId}/resend`);
    }

    async cancelInvitation(inviteId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/invitations/${inviteId}`);
    }

    // User export/import
    async exportUsers(filters?: UserFilters): Promise<Blob> {
        const response = await apiClient.get<Blob>(`${this.baseUrl}/export`, filters);
        return response;
    }

    async importUsers(file: File): Promise<{
        imported: number;
        failed: number;
        errors: Array<{ row: number; error: string }>;
    }> {
        const response = await apiClient.upload<{
            imported: number;
            failed: number;
            errors: Array<{ row: number; error: string }>;
        }>(`${this.baseUrl}/import`, file);
        return response;
    }
}

// Export singleton instance
export const usersApi = new UsersApiService();