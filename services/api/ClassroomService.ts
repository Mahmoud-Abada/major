/**
 * Classroom Service
 * Comprehensive service for classroom and group management with proper error handling and notifications
 */

import {
  ApiResponse,
  Classroom,
  GetClassroomsParams,
  Group,
  PaginatedResponse
} from "@/store/types/api";
import { getUserFriendlyMessage } from "@/utils/errorHandling";

interface ServiceOptions {
  showToasts?: boolean;
}

export class ClassroomService {
  private classroomBaseUrl: string;
  private usersBaseUrl: string;
  private options: ServiceOptions;

  constructor(options: ServiceOptions = {}) {
    this.classroomBaseUrl = process.env.NEXT_PUBLIC_CLASSROOM_API_URL || "http://127.0.0.1:3001/classroom";
    this.usersBaseUrl = process.env.NEXT_PUBLIC_USERS_API_URL || "http://127.0.0.1:5000";
    this.options = { showToasts: true, ...options };
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      // Try new token storage format first, then fallback to legacy
      const accessToken = sessionStorage.getItem("access_token");
      const authTokenLocal = localStorage.getItem("auth_token");
      const authTokenSession = sessionStorage.getItem("auth_token");

      console.log("Token check:", {
        accessToken: accessToken ? "found" : "not found",
        authTokenLocal: authTokenLocal ? "found" : "not found",
        authTokenSession: authTokenSession ? "found" : "not found"
      });

      const token = accessToken || authTokenLocal || authTokenSession;
      console.log("Using token:", token ? "token found" : "no token");

      return token;
    }
    return null;
  }

  private showNotification(type: "success" | "error" | "warning" | "info", title: string, message?: string) {
    if (this.options.showToasts && typeof window !== "undefined") {
      const event = new CustomEvent("show-notification", {
        detail: { type, title, message },
      });
      window.dispatchEvent(event);
    }
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = {
          status: response.status,
          data: {
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            code: errorData.code || response.status.toString(),
            details: errorData,
          },
        };

        if (this.options.showToasts) {
          this.showNotification("error", "Request Failed", getUserFriendlyMessage(error));
        }

        throw error;
      }

      return await response.json();
    } catch (error: any) {
      if (error.status) {
        throw error; // Already handled above
      }

      // Network or other errors
      const networkError = {
        status: "NETWORK_ERROR",
        data: {
          message: error.message || "Network error occurred",
          code: "NETWORK_ERROR",
          details: error,
        },
      };

      if (this.options.showToasts) {
        this.showNotification("error", "Network Error", getUserFriendlyMessage(networkError));
      }

      throw networkError;
    }
  }

  // Classroom Management Methods
  async getClassrooms(params: GetClassroomsParams): Promise<PaginatedResponse<Classroom>> {
    // Use users service for get-classrooms as per API documentation
    const url = `${this.usersBaseUrl}/classroom/get-classrooms`;
    return this.request<PaginatedResponse<Classroom>>(url, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async createClassrooms(classrooms: Omit<Classroom, "id" | "createdAt" | "updatedAt">[]): Promise<ApiResponse<Classroom[]>> {
    const url = `${this.classroomBaseUrl}/create-classroom`;

    console.log("Sending request to:", url);
    console.log("Request payload:", JSON.stringify({ classroomsData: classrooms }, null, 2));

    const result = await this.request<any[]>(url, {
      method: "POST",
      body: JSON.stringify({ classroomsData: classrooms }),
    });

    console.log("Backend response:", result);

    // Transform backend response to match expected ApiResponse format
    const successfulClassrooms = result
      .filter(r => r.status === "success")
      .map(r => r.payload);

    console.log("Successful classrooms:", successfulClassrooms);

    // Check for any errors in the response
    const errors = result.filter(r => r.status !== "success");
    if (errors.length > 0) {
      console.error("Backend errors:", errors);
    }

    // Return in expected ApiResponse format with backend messages
    const response = {
      data: successfulClassrooms,
      success: successfulClassrooms.length > 0,
      message: successfulClassrooms.length > 0
        ? result.find(r => r.status === "success")?.message || "Classrooms created successfully"
        : errors[0]?.message || "Failed to create classrooms",
      errors: errors.map(e => e.message)
    };

    return response;
  }

  async updateClassroom(classroomId: string, classroomData: Partial<Classroom>): Promise<ApiResponse<Classroom>> {
    const url = `${this.classroomBaseUrl}/update-classroom`;
    const result = await this.request<ApiResponse<Classroom>>(url, {
      method: "POST",
      body: JSON.stringify({ classroomId, classroomData }),
    });

    this.showNotification(
      "success",
      "Classroom Updated",
      "Classroom information has been successfully updated"
    );

    return result;
  }

  async deleteClassroom(classroomId: string): Promise<ApiResponse<void>> {
    const url = `${this.classroomBaseUrl}/delete-classroom`;
    const result = await this.request<ApiResponse<void>>(url, {
      method: "DELETE",
      body: JSON.stringify({ classroomId }),
    });

    this.showNotification(
      "success",
      "Classroom Deleted",
      "Classroom has been successfully deleted"
    );

    return result;
  }

  async archiveClassroom(classroomId: string): Promise<ApiResponse<Classroom>> {
    return this.updateClassroom(classroomId, { isArchived: true });
  }

  async restoreClassroom(classroomId: string): Promise<ApiResponse<Classroom>> {
    const result = await this.updateClassroom(classroomId, { isArchived: false });

    this.showNotification(
      "success",
      "Classroom Restored",
      "Classroom has been successfully restored"
    );

    return result;
  }

  async addStudentsToClassroom(assignments: Array<{ classroom: string; student: string }>): Promise<ApiResponse<void>> {
    const url = `${this.classroomBaseUrl}/add-classroom-student`;
    const result = await this.request<ApiResponse<void>>(url, {
      method: "POST",
      body: JSON.stringify(assignments),
    });

    this.showNotification(
      "success",
      "Students Added",
      `Successfully added ${assignments.length} student${assignments.length > 1 ? 's' : ''} to classroom`
    );

    return result;
  }

  // Convenience methods for specific user types
  async getTeacherClassrooms(teacherId: string, status: "active" | "archived" = "active"): Promise<PaginatedResponse<Classroom>> {
    return this.getClassrooms({
      status,
      pagination: { numItems: 50 },
      fetchBy: { userType: "teacher", userId: teacherId },
    });
  }

  async getSchoolClassrooms(schoolId: string, status: "active" | "archived" = "active"): Promise<PaginatedResponse<Classroom>> {
    return this.getClassrooms({
      status,
      pagination: { numItems: 50 },
      fetchBy: { userType: "school", userId: schoolId },
    });
  }

  // Group Management Methods
  async createGroups(groups: Omit<Group, "id" | "createdAt" | "updatedAt">[]): Promise<ApiResponse<Group[]>> {
    const url = `${this.classroomBaseUrl}/create-group`;

    console.log("Sending group request to:", url);
    console.log("Request payload:", JSON.stringify({ groupsData: groups }, null, 2));

    const result = await this.request<any[]>(url, {
      method: "POST",
      body: JSON.stringify({ groupsData: groups }),
    });

    console.log("Backend response:", result);

    // Transform backend response to match expected ApiResponse format
    const successfulGroups = result
      .filter(r => r.status === "success")
      .map(r => r.payload);

    const errors = result.filter(r => r.status !== "success");

    console.log("Successful groups:", successfulGroups);
    console.log("Errors:", errors);

    // Show success notification
    if (successfulGroups.length > 0) {
      this.showNotification(
        "success",
        "Groups Created",
        `Successfully created ${successfulGroups.length} group${successfulGroups.length > 1 ? 's' : ''}`
      );
    }

    // Return in expected ApiResponse format with backend messages
    const response = {
      data: successfulGroups,
      success: successfulGroups.length > 0,
      message: successfulGroups.length > 0
        ? result.find(r => r.status === "success")?.message || "Groups created successfully"
        : errors[0]?.message || "Failed to create groups",
      errors: errors.map(e => e.message)
    };

    return response;
  }

  async updateGroup(groupId: string, groupData: Partial<Group>): Promise<ApiResponse<Group>> {
    const url = `${this.classroomBaseUrl}/update-group`;
    const result = await this.request<ApiResponse<Group>>(url, {
      method: "POST",
      body: JSON.stringify({ groupId, groupData }),
    });

    this.showNotification(
      "success",
      "Group Updated",
      "Group information has been successfully updated"
    );

    return result;
  }

  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    const url = `${this.classroomBaseUrl}/delete-group`;
    const result = await this.request<ApiResponse<void>>(url, {
      method: "DELETE",
      body: JSON.stringify({ groupId }),
    });

    this.showNotification(
      "success",
      "Group Deleted",
      "Group has been successfully deleted"
    );

    return result;
  }

  async addStudentsToGroup(assignments: Array<{ student: string; group: string }>): Promise<ApiResponse<void>> {
    const url = `${this.classroomBaseUrl}/add-group-student`;
    const result = await this.request<ApiResponse<void>>(url, {
      method: "POST",
      body: JSON.stringify(assignments),
    });

    this.showNotification(
      "success",
      "Students Added to Group",
      `Successfully added ${assignments.length} student${assignments.length > 1 ? 's' : ''} to group`
    );

    return result;
  }

  async addGroupsToClassroom(assignments: Array<{ classroom: string; group: string }>): Promise<ApiResponse<void>> {
    const url = `${this.classroomBaseUrl}/add-group-classroom`;
    const result = await this.request<ApiResponse<void>>(url, {
      method: "POST",
      body: JSON.stringify(assignments),
    });

    this.showNotification(
      "success",
      "Groups Added to Classroom",
      `Successfully linked ${assignments.length} group${assignments.length > 1 ? 's' : ''} to classroom`
    );

    return result;
  }
}

// Export singleton instance
export const classroomService = new ClassroomService();