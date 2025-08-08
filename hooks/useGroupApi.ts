/**
 * Group API Hooks
 * React hooks for group management with loading states and error handling
 */

import { useCallback } from "react";
import { ClassroomService } from "../services/api/ClassroomService";
import { Group } from "../store/types/api";
import { useLoadingState } from "./useLoadingState";

export interface UseGroupApiOptions {
  showToasts?: boolean;
  globalLoading?: boolean;
}

export function useGroupApi(options: UseGroupApiOptions = {}) {
  const { showToasts = true, globalLoading = false } = options;

  const createState = useLoadingState({ globalLoading });
  const updateState = useLoadingState({ globalLoading });
  const deleteState = useLoadingState({ globalLoading });
  const studentAssignState = useLoadingState({ globalLoading });
  const classroomAssignState = useLoadingState({ globalLoading });

  // Create service instance with options
  const service = new ClassroomService({ showToasts });

  // Create groups
  const createGroups = useCallback(
    async (groups: Omit<Group, "id" | "createdAt" | "updatedAt">[]) => {
      return createState.execute(() => service.createGroups(groups), {
        loadingMessage: "Creating groups...",
        minLoadingTime: 500,
      });
    },
    [createState, service],
  );

  // Update group
  const updateGroup = useCallback(
    async (groupId: string, groupData: Partial<Group>) => {
      return updateState.execute(
        () => service.updateGroup(groupId, groupData),
        {
          loadingMessage: "Updating group...",
          minLoadingTime: 500,
        },
      );
    },
    [updateState, service],
  );

  // Delete group
  const deleteGroup = useCallback(
    async (groupId: string) => {
      return deleteState.execute(() => service.deleteGroup(groupId), {
        loadingMessage: "Deleting group...",
        minLoadingTime: 500,
      });
    },
    [deleteState, service],
  );

  // Archive group
  const archiveGroup = useCallback(
    async (groupId: string) => {
      return updateState.execute(
        () => service.updateGroup(groupId, { isArchived: true }),
        {
          loadingMessage: "Archiving group...",
          minLoadingTime: 500,
        },
      );
    },
    [updateState, service],
  );

  // Restore group
  const restoreGroup = useCallback(
    async (groupId: string) => {
      return updateState.execute(
        () => service.updateGroup(groupId, { isArchived: false }),
        {
          loadingMessage: "Restoring group...",
          minLoadingTime: 500,
        },
      );
    },
    [updateState, service],
  );

  // Add students to group
  const addStudentsToGroup = useCallback(
    async (assignments: Array<{ student: string; group: string }>) => {
      return studentAssignState.execute(
        () => service.addStudentsToGroup(assignments),
        {
          loadingMessage: "Adding students to group...",
          minLoadingTime: 500,
        },
      );
    },
    [studentAssignState, service],
  );

  // Add groups to classroom
  const addGroupsToClassroom = useCallback(
    async (assignments: Array<{ classroom: string; group: string }>) => {
      return classroomAssignState.execute(
        () => service.addGroupsToClassroom(assignments),
        {
          loadingMessage: "Adding groups to classroom...",
          minLoadingTime: 500,
        },
      );
    },
    [classroomAssignState, service],
  );

  // Reset all states
  const resetStates = useCallback(() => {
    createState.reset();
    updateState.reset();
    deleteState.reset();
    studentAssignState.reset();
    classroomAssignState.reset();
  }, [createState, updateState, deleteState, studentAssignState, classroomAssignState]);

  return {
    // Actions
    createGroups,
    updateGroup,
    deleteGroup,
    archiveGroup,
    restoreGroup,
    addStudentsToGroup,
    addGroupsToClassroom,
    resetStates,

    // Loading states
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isAssigningStudents: studentAssignState.isLoading,
    isAssigningToClassroom: classroomAssignState.isLoading,

    // Error states
    createError: createState.error,
    updateError: updateState.error,
    deleteError: deleteState.error,
    assignStudentError: studentAssignState.error,
    assignClassroomError: classroomAssignState.error,

    // Data states
    createData: createState.data,
    updateData: updateState.data,
    deleteData: deleteState.data,
    assignStudentData: studentAssignState.data,
    assignClassroomData: classroomAssignState.data,

    // Combined loading state
    isLoading:
      createState.isLoading ||
      updateState.isLoading ||
      deleteState.isLoading ||
      studentAssignState.isLoading ||
      classroomAssignState.isLoading,

    // Combined error state
    hasError: !!(
      createState.error ||
      updateState.error ||
      deleteState.error ||
      studentAssignState.error ||
      classroomAssignState.error
    ),
  };
}

// Hook for single group operations
export function useGroup(
  groupId?: string,
  options: UseGroupApiOptions = {},
) {
  const api = useGroupApi(options);

  const updateThisGroup = useCallback(
    async (data: Partial<Group>) => {
      if (!groupId) throw new Error("Group ID is required");
      return api.updateGroup(groupId, data);
    },
    [api, groupId],
  );

  const deleteThisGroup = useCallback(async () => {
    if (!groupId) throw new Error("Group ID is required");
    return api.deleteGroup(groupId);
  }, [api, groupId]);

  const archiveThisGroup = useCallback(async () => {
    if (!groupId) throw new Error("Group ID is required");
    return api.archiveGroup(groupId);
  }, [api, groupId]);

  const addStudentsToThisGroup = useCallback(
    async (studentIds: string[]) => {
      if (!groupId) throw new Error("Group ID is required");
      const assignments = studentIds.map((studentId) => ({
        student: studentId,
        group: groupId,
      }));
      return api.addStudentsToGroup(assignments);
    },
    [api, groupId],
  );

  const addThisGroupToClassrooms = useCallback(
    async (classroomIds: string[]) => {
      if (!groupId) throw new Error("Group ID is required");
      const assignments = classroomIds.map((classroomId) => ({
        classroom: classroomId,
        group: groupId,
      }));
      return api.addGroupsToClassroom(assignments);
    },
    [api, groupId],
  );

  return {
    ...api,
    updateThisGroup,
    deleteThisGroup,
    archiveThisGroup,
    addStudentsToThisGroup,
    addThisGroupToClassrooms,
    groupId,
  };
}