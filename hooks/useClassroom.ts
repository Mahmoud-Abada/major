/**
 * Classroom API Hooks
 * React hooks for classroom API operations with loading states and error handling
 */

import {
  Classroom,
  classroomApi,
  CreateClassroomParams,
  GetClassroomsParams,
  Group,
  UpdateClassroomParams,
} from "@/services/classroom-api";
import { useCallback, useEffect, useState } from "react";
import { useApi, useMutation } from "./useApi";

// Classroom hooks
export function useClassrooms(params: GetClassroomsParams, immediate = true) {
  return useApi(() => classroomApi.getClassrooms(params), { immediate });
}

export function useCreateClassrooms() {
  return useMutation((params: CreateClassroomParams) =>
    classroomApi.createClassrooms(params),
  );
}

export function useUpdateClassroom() {
  return useMutation((params: UpdateClassroomParams) =>
    classroomApi.updateClassroom(params),
  );
}

export function useDeleteClassroom() {
  return useMutation((classroomId: string) =>
    classroomApi.deleteClassroom(classroomId),
  );
}

export function useAddClassroomStudent() {
  return useMutation(
    (assignments: Array<{ classroom: string; student: string }>) =>
      classroomApi.addClassroomStudent(assignments),
  );
}

// Group hooks
export function useCreateGroups() {
  return useMutation(
    (groups: Omit<Group, "id" | "createdAt" | "updatedAt">[]) =>
      classroomApi.createGroups(groups),
  );
}

export function useUpdateGroup() {
  return useMutation((params: { groupId: string; groupData: Partial<Group> }) =>
    classroomApi.updateGroup(params),
  );
}

export function useDeleteGroup() {
  return useMutation((groupId: string) => classroomApi.deleteGroup(groupId));
}

export function useAddGroupStudent() {
  return useMutation((assignments: Array<{ student: string; group: string }>) =>
    classroomApi.addGroupStudent(assignments),
  );
}

export function useAddGroupClassroom() {
  return useMutation(
    (assignments: Array<{ classroom: string; group: string }>) =>
      classroomApi.addGroupClassroom(assignments),
  );
}

// Custom hook for classroom management with pagination
export function useClassroomManager(
  initialParams: Partial<GetClassroomsParams> = {},
) {
  const [params, setParams] = useState<GetClassroomsParams>({
    status: "active",
    pagination: { numItems: 10, cursor: undefined },
    fetchBy: { userType: "teacher", userId: "current_user" },
    ...initialParams,
  });

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await classroomApi.getClassrooms(params);

        if (reset) {
          setClassrooms(response.data);
        } else {
          setClassrooms((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.pagination.hasMore);

        // Update cursor for next page
        if (response.pagination.cursor) {
          setParams((prev) => ({
            ...prev,
            pagination: {
              ...prev.pagination,
              cursor: response.pagination.cursor,
            },
          }));
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch classrooms");
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchClassrooms(false);
    }
  }, [fetchClassrooms, loading, hasMore]);

  const refresh = useCallback(() => {
    setParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, cursor: undefined },
    }));
    fetchClassrooms(true);
  }, [fetchClassrooms]);

  const updateParams = useCallback(
    (newParams: Partial<GetClassroomsParams>) => {
      setParams((prev) => ({
        ...prev,
        ...newParams,
        pagination: { ...prev.pagination, cursor: undefined },
      }));
    },
    [],
  );

  useEffect(() => {
    fetchClassrooms(true);
  }, [params.status, params.fetchBy]);

  return {
    classrooms,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    updateParams,
    params,
  };
}

// Custom hook for classroom CRUD operations
export function useClassroomOperations() {
  const createMutation = useCreateClassrooms();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();

  const createClassroom = useCallback(
    async (
      classroomData: Omit<Classroom, "id" | "createdAt" | "updatedAt">,
    ) => {
      return createMutation.mutate({ classrooms: [classroomData] });
    },
    [createMutation],
  );

  const updateClassroom = useCallback(
    async (classroomId: string, classroomData: Partial<Classroom>) => {
      return updateMutation.mutate({ classroomId, classroomData });
    },
    [updateMutation],
  );

  const deleteClassroom = useCallback(
    async (classroomId: string) => {
      return deleteMutation.mutate(classroomId);
    },
    [deleteMutation],
  );

  const archiveClassroom = useCallback(
    async (classroomId: string) => {
      return updateMutation.mutate({
        classroomId,
        classroomData: { isArchived: true },
      });
    },
    [updateMutation],
  );

  const unarchiveClassroom = useCallback(
    async (classroomId: string) => {
      return updateMutation.mutate({
        classroomId,
        classroomData: { isArchived: false },
      });
    },
    [updateMutation],
  );

  return {
    createClassroom,
    updateClassroom,
    deleteClassroom,
    archiveClassroom,
    unarchiveClassroom,
    loading:
      createMutation.loading ||
      updateMutation.loading ||
      deleteMutation.loading,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
}

// Custom hook for group operations
export function useGroupOperations() {
  const createMutation = useCreateGroups();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();

  const createGroup = useCallback(
    async (groupData: Omit<Group, "id" | "createdAt" | "updatedAt">) => {
      return createMutation.mutate([groupData]);
    },
    [createMutation],
  );

  const updateGroup = useCallback(
    async (groupId: string, groupData: Partial<Group>) => {
      return updateMutation.mutate({ groupId, groupData });
    },
    [updateMutation],
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      return deleteMutation.mutate(groupId);
    },
    [deleteMutation],
  );

  const archiveGroup = useCallback(
    async (groupId: string) => {
      return updateMutation.mutate({
        groupId,
        groupData: { isArchived: true },
      });
    },
    [updateMutation],
  );

  const unarchiveGroup = useCallback(
    async (groupId: string) => {
      return updateMutation.mutate({
        groupId,
        groupData: { isArchived: false },
      });
    },
    [updateMutation],
  );

  return {
    createGroup,
    updateGroup,
    deleteGroup,
    archiveGroup,
    unarchiveGroup,
    loading:
      createMutation.loading ||
      updateMutation.loading ||
      deleteMutation.loading,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
}
