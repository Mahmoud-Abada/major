/**
 * Classroom API Hooks
 * React hooks for classroom management with loading states and error handling
 */

import { useCallback } from "react";
import { ClassroomService } from "../services/api/ClassroomService";
import { Classroom, GetClassroomsParams } from "../store/types/api";
import { useLoadingState } from "./useLoadingState";

export interface UseClassroomApiOptions {
  showToasts?: boolean;
  globalLoading?: boolean;
}

export function useClassroomApi(options: UseClassroomApiOptions = {}) {
  const { showToasts = true, globalLoading = false } = options;

  const createState = useLoadingState({ globalLoading });
  const updateState = useLoadingState({ globalLoading });
  const deleteState = useLoadingState({ globalLoading });
  const fetchState = useLoadingState({ globalLoading });
  const studentAssignState = useLoadingState({ globalLoading });

  // Create service instance with options
  const service = new ClassroomService({ showToasts });

  // Create classrooms
  const createClassrooms = useCallback(
    async (classrooms: Omit<Classroom, "id" | "createdAt" | "updatedAt">[]) => {
      return createState.execute(() => service.createClassrooms(classrooms), {
        loadingMessage: "Creating classrooms...",
        minLoadingTime: 500,
      });
    },
    [createState, service],
  );

  // Get classrooms
  const getClassrooms = useCallback(
    async (params: GetClassroomsParams) => {
      return fetchState.execute(() => service.getClassrooms(params), {
        loadingMessage: "Loading classrooms...",
        minLoadingTime: 300,
      });
    },
    [fetchState, service],
  );

  // Update classroom
  const updateClassroom = useCallback(
    async (classroomId: string, classroomData: Partial<Classroom>) => {
      return updateState.execute(
        () => service.updateClassroom(classroomId, classroomData),
        {
          loadingMessage: "Updating classroom...",
          minLoadingTime: 500,
        },
      );
    },
    [updateState, service],
  );

  // Delete classroom
  const deleteClassroom = useCallback(
    async (classroomId: string) => {
      return deleteState.execute(() => service.deleteClassroom(classroomId), {
        loadingMessage: "Deleting classroom...",
        minLoadingTime: 500,
      });
    },
    [deleteState, service],
  );

  // Archive classroom
  const archiveClassroom = useCallback(
    async (classroomId: string) => {
      return updateState.execute(() => service.archiveClassroom(classroomId), {
        loadingMessage: "Archiving classroom...",
        minLoadingTime: 500,
      });
    },
    [updateState, service],
  );

  // Restore classroom
  const restoreClassroom = useCallback(
    async (classroomId: string) => {
      return updateState.execute(() => service.restoreClassroom(classroomId), {
        loadingMessage: "Restoring classroom...",
        minLoadingTime: 500,
      });
    },
    [updateState, service],
  );

  // Add students to classroom
  const addStudentsToClassroom = useCallback(
    async (assignments: Array<{ classroom: string; student: string }>) => {
      return studentAssignState.execute(
        () => service.addStudentsToClassroom(assignments),
        {
          loadingMessage: "Adding students to classroom...",
          minLoadingTime: 500,
        },
      );
    },
    [studentAssignState, service],
  );

  // Get teacher classrooms
  const getTeacherClassrooms = useCallback(
    async (teacherId: string, status: "active" | "archived" = "active") => {
      return fetchState.execute(
        () => service.getTeacherClassrooms(teacherId, status),
        {
          loadingMessage: "Loading teacher classrooms...",
          minLoadingTime: 300,
        },
      );
    },
    [fetchState, service],
  );

  // Get school classrooms
  const getSchoolClassrooms = useCallback(
    async (schoolId: string, status: "active" | "archived" = "active") => {
      return fetchState.execute(
        () => service.getSchoolClassrooms(schoolId, status),
        {
          loadingMessage: "Loading school classrooms...",
          minLoadingTime: 300,
        },
      );
    },
    [fetchState, service],
  );

  // Reset all states
  const resetStates = useCallback(() => {
    createState.reset();
    updateState.reset();
    deleteState.reset();
    fetchState.reset();
    studentAssignState.reset();
  }, [createState, updateState, deleteState, fetchState, studentAssignState]);

  return {
    // Actions
    createClassrooms,
    getClassrooms,
    updateClassroom,
    deleteClassroom,
    archiveClassroom,
    restoreClassroom,
    addStudentsToClassroom,
    getTeacherClassrooms,
    getSchoolClassrooms,
    resetStates,

    // Loading states
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isFetching: fetchState.isLoading,
    isAssigningStudents: studentAssignState.isLoading,

    // Error states
    createError: createState.error,
    updateError: updateState.error,
    deleteError: deleteState.error,
    fetchError: fetchState.error,
    assignError: studentAssignState.error,

    // Data states
    createData: createState.data,
    updateData: updateState.data,
    deleteData: deleteState.data,
    fetchData: fetchState.data,
    assignData: studentAssignState.data,

    // Combined loading state
    isLoading:
      createState.isLoading ||
      updateState.isLoading ||
      deleteState.isLoading ||
      fetchState.isLoading ||
      studentAssignState.isLoading,

    // Combined error state
    hasError: !!(
      createState.error ||
      updateState.error ||
      deleteState.error ||
      fetchState.error ||
      studentAssignState.error
    ),
  };
}

// Hook for single classroom operations
export function useClassroom(
  classroomId?: string,
  options: UseClassroomApiOptions = {},
) {
  const api = useClassroomApi(options);

  const updateThisClassroom = useCallback(
    async (data: Partial<Classroom>) => {
      if (!classroomId) throw new Error("Classroom ID is required");
      return api.updateClassroom(classroomId, data);
    },
    [api, classroomId],
  );

  const deleteThisClassroom = useCallback(async () => {
    if (!classroomId) throw new Error("Classroom ID is required");
    return api.deleteClassroom(classroomId);
  }, [api, classroomId]);

  const archiveThisClassroom = useCallback(async () => {
    if (!classroomId) throw new Error("Classroom ID is required");
    return api.archiveClassroom(classroomId);
  }, [api, classroomId]);

  const addStudentsToThisClassroom = useCallback(
    async (studentIds: string[]) => {
      if (!classroomId) throw new Error("Classroom ID is required");
      const assignments = studentIds.map((studentId) => ({
        classroom: classroomId,
        student: studentId,
      }));
      return api.addStudentsToClassroom(assignments);
    },
    [api, classroomId],
  );

  return {
    ...api,
    updateThisClassroom,
    deleteThisClassroom,
    archiveThisClassroom,
    addStudentsToThisClassroom,
    classroomId,
  };
}
