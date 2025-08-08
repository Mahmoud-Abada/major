/**
 * Group Service
 * Dedicated service for group management with enhanced error handling and loading states
 */

import { showErrorToast, showSuccessToast } from "../../utils/error-handler";
import { classroomApi, Group, withRetry } from "../classroom-api";

export interface GroupServiceOptions {
  showToasts?: boolean;
  retryAttempts?: number;
}

export class GroupService {
  private options: GroupServiceOptions;

  constructor(options: GroupServiceOptions = {}) {
    this.options = {
      showToasts: true,
      retryAttempts: 3,
      ...options,
    };
  }

  /**
   * Create new groups
   */
  async createGroups(
    groups: Omit<Group, "id" | "createdAt" | "updatedAt">[],
    options?: { showSuccessToast?: boolean },
  ): Promise<Group[] | null> {
    try {
      const response = await withRetry(
        () => classroomApi.createGroups(groups),
        this.options.retryAttempts,
      );

      if (this.options.showToasts && options?.showSuccessToast !== false) {
        showSuccessToast(
          `Successfully created ${groups.length} group${groups.length > 1 ? "s" : ""}`,
        );
      }

      return response.data;
    } catch (error) {
      if (this.options.showToasts) {
        showErrorToast(error, "Failed to create group");
      }
      console.error("GroupService.createGroups:", error);
      return null;
    }
  }

  /**
   * Update group
   */
  async updateGroup(
    groupId: string,
    groupData: Partial<Group>,
    options?: { showSuccessToast?: boolean },
  ): Promise<Group | null> {
    try {
      const response = await withRetry(
        () => classroomApi.updateGroup({ groupId, groupData }),
        this.options.retryAttempts,
      );

      if (this.options.showToasts && options?.showSuccessToast !== false) {
        showSuccessToast("Group updated successfully");
      }

      return response.data;
    } catch (error) {
      if (this.options.showToasts) {
        showErrorToast(error, "Failed to update group");
      }
      console.error("GroupService.updateGroup:", error);
      return null;
    }
  }

  /**
   * Delete group
   */
  async deleteGroup(
    groupId: string,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    try {
      await withRetry(
        () => classroomApi.deleteGroup(groupId),
        this.options.retryAttempts,
      );

      if (this.options.showToasts && options?.showSuccessToast !== false) {
        showSuccessToast("Group deleted successfully");
      }

      return true;
    } catch (error) {
      if (this.options.showToasts) {
        showErrorToast(error, "Failed to delete group");
      }
      console.error("GroupService.deleteGroup:", error);
      return false;
    }
  }

  /**
   * Add students to group
   */
  async addStudentsToGroup(
    assignments: Array<{ student: string; group: string }>,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    try {
      await withRetry(
        () => classroomApi.addGroupStudent(assignments),
        this.options.retryAttempts,
      );

      if (this.options.showToasts && options?.showSuccessToast !== false) {
        showSuccessToast(
          `Successfully added ${assignments.length} student${assignments.length > 1 ? "s" : ""} to group`,
        );
      }

      return true;
    } catch (error) {
      if (this.options.showToasts) {
        showErrorToast(error, "Failed to add students to group");
      }
      console.error("GroupService.addStudentsToGroup:", error);
      return false;
    }
  }

  /**
   * Link groups to classrooms
   */
  async linkGroupsToClassrooms(
    assignments: Array<{ classroom: string; group: string }>,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    try {
      await withRetry(
        () => classroomApi.addGroupClassroom(assignments),
        this.options.retryAttempts,
      );

      if (this.options.showToasts && options?.showSuccessToast !== false) {
        showSuccessToast(
          `Successfully linked ${assignments.length} group${assignments.length > 1 ? "s" : ""} to classroom${assignments.length > 1 ? "s" : ""}`,
        );
      }

      return true;
    } catch (error) {
      if (this.options.showToasts) {
        showErrorToast(error, "Failed to link groups to classrooms");
      }
      console.error("GroupService.linkGroupsToClassrooms:", error);
      return false;
    }
  }

  /**
   * Archive group (soft delete)
   */
  async archiveGroup(
    groupId: string,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    return this.updateGroup(groupId, { isArchived: true }, options).then(
      (result) => result !== null,
    );
  }

  /**
   * Restore archived group
   */
  async restoreGroup(
    groupId: string,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    return this.updateGroup(groupId, { isArchived: false }, options).then(
      (result) => result !== null,
    );
  }

  /**
   * Create a single group (convenience method)
   */
  async createGroup(
    group: Omit<Group, "id" | "createdAt" | "updatedAt">,
    options?: { showSuccessToast?: boolean },
  ): Promise<Group | null> {
    const result = await this.createGroups([group], options);
    return result ? result[0] : null;
  }

  /**
   * Add single student to group (convenience method)
   */
  async addStudentToGroup(
    studentId: string,
    groupId: string,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    return this.addStudentsToGroup(
      [{ student: studentId, group: groupId }],
      options,
    );
  }

  /**
   * Link single group to classroom (convenience method)
   */
  async linkGroupToClassroom(
    groupId: string,
    classroomId: string,
    options?: { showSuccessToast?: boolean },
  ): Promise<boolean> {
    return this.linkGroupsToClassrooms(
      [{ classroom: classroomId, group: groupId }],
      options,
    );
  }
}

// Export singleton instance
export const groupService = new GroupService();

// Export service with custom options
export const createGroupService = (options: GroupServiceOptions) =>
  new GroupService(options);
