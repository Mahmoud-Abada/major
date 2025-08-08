/**
 * Notifications API Service
 * Handles notification management and delivery
 */

import { apiConfig, PaginatedResponse, QueryParams } from "@/lib/api";
import { apiClient } from "@/lib/api/client";
import { Notification } from "@/lib/api/types";

export class NotificationsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.endpoints.notifications;
  }

  async getNotifications(
    params?: QueryParams,
  ): Promise<PaginatedResponse<Notification>> {
    return apiClient.get(`${this.baseUrl}`, params);
  }

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${notificationId}`);
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get(`${this.baseUrl}/unread-count`, undefined, {
      cache: true,
      cacheTtl: 30000,
    });
  }
}

export const notificationsApi = new NotificationsApiService();
