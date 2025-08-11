/**
 * Group API Endpoints
 * RTK Query endpoints for group management
 */
import type {
  AddGroupToClassroomParams,
  AddStudentToGroupParams,
  ApiResponse,
  CreateGroupParams,
  Group,
  UpdateGroupParams,
} from "@/store/types/api";
import { getAccessToken, isTokenExpired } from "@/utils/tokenManager";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { baseApi } from "./baseApi";

// Create base query for classroom service (groups are part of classroom service)
const classroomBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_CLASSROOM_API_URL || "http://127.0.0.1:3001/classroom",
  timeout: 30000,
  prepareHeaders: (headers, { getState }) => {
    const token = getAccessToken();
    const state = getState() as RootState;
    const stateToken = state.auth?.token;
    const finalToken = token || stateToken;

    if (finalToken && !isTokenExpired()) {
      headers.set("authorization", `Bearer ${finalToken}`);
    }

    headers.set("content-type", "application/json");
    headers.set("accept", "application/json");
    return headers;
  },
});

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all groups
    getGroups: builder.query<
      { data: Group[]; pagination?: { hasMore: boolean; cursor?: string } },
      {
        status?: "archived" | "all" | "notArchived";
        pagination?: { numItems: number; cursor: string | null };
        fetchBy?: {
          userType: "school" | "teacher" | "student";
          userId?: string;
        };
      }
    >({
      queryFn: async (params, { getState }) => {
        try {
          // Use the getClassrooms endpoint with groupPagination to get groups
          const result = await classroomBaseQuery(
            {
              url: "/get-classrooms",
              method: "POST",
              body: {
                ...params,
                groupPagination: params.pagination,
                pagination: { numItems: 0, cursor: null }, // Don't fetch classrooms, only groups
              },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          // Extract groups from the response
          const response = result.data as any;
          return {
            data: {
              data: response.groups || [],
              pagination: response.groupPagination
            }
          };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: "Group" as const, id })),
            { type: "Group", id: "LIST" },
          ]
          : [{ type: "Group", id: "LIST" }],
    }),

    // Get single group by ID
    getGroup: builder.query<ApiResponse<Group>, string>({
      queryFn: async (groupId, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/get-group",
              method: "POST",
              body: { groupId },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Create new groups
    createGroups: builder.mutation<ApiResponse<Group[]>, CreateGroupParams>({
      queryFn: async (params, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/create-group",
              method: "POST",
              body: params.groups,
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: [{ type: "Group", id: "LIST" }],
    }),

    // Update group
    updateGroup: builder.mutation<ApiResponse<Group>, UpdateGroupParams>({
      queryFn: async (params, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/update-group",
              method: "POST",
              body: params,
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Delete group
    deleteGroup: builder.mutation<ApiResponse<void>, string>({
      queryFn: async (groupId, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/delete-group",
              method: "DELETE",
              body: { groupId },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Add student to group
    addStudentToGroup: builder.mutation<
      ApiResponse<void>,
      AddStudentToGroupParams[]
    >({
      queryFn: async (assignments, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/add-group-student",
              method: "POST",
              body: assignments,
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, assignments) => [
        ...assignments.map(({ group }) => ({
          type: "Group" as const,
          id: group,
        })),
        { type: "Group", id: "LIST" },
      ],
    }),

    // Remove student from group
    removeStudentFromGroup: builder.mutation<
      ApiResponse<void>,
      { groupId: string; studentId: string }
    >({
      queryFn: async ({ groupId, studentId }, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/remove-group-student",
              method: "POST",
              body: { group: groupId, student: studentId },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Add group to classroom
    addGroupToClassroom: builder.mutation<
      ApiResponse<void>,
      AddGroupToClassroomParams[]
    >({
      queryFn: async (assignments, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/add-group-classroom",
              method: "POST",
              body: assignments,
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, assignments) => [
        ...assignments.map(({ classroom }) => ({
          type: "Classroom" as const,
          id: classroom,
        })),
        ...assignments.map(({ group }) => ({
          type: "Group" as const,
          id: group,
        })),
      ],
    }),

    // Remove group from classroom
    removeGroupFromClassroom: builder.mutation<
      ApiResponse<void>,
      { classroomId: string; groupId: string }
    >({
      queryFn: async ({ classroomId, groupId }, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/remove-group-classroom",
              method: "POST",
              body: { classroom: classroomId, group: groupId },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, { classroomId, groupId }) => [
        { type: "Classroom", id: classroomId },
        { type: "Group", id: groupId },
      ],
    }),

    // Archive/Unarchive group
    archiveGroup: builder.mutation<
      ApiResponse<void>,
      { groupId: string; isArchived: boolean }
    >({
      queryFn: async ({ groupId, isArchived }, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/update-group",
              method: "POST",
              body: {
                groupId,
                groupData: { isArchived },
              },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Get group members
    getGroupMembers: builder.query<ApiResponse<any[]>, string>({
      queryFn: async (groupId, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/get-group-members",
              method: "POST",
              body: { groupId },
            },
            { getState } as any,
            {}
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
      providesTags: (result, error, groupId) => [
        { type: "Group", id: `${groupId}_MEMBERS` },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupsMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useAddStudentToGroupMutation,
  useRemoveStudentFromGroupMutation,
  useAddGroupToClassroomMutation,
  useRemoveGroupFromClassroomMutation,
  useArchiveGroupMutation,
  useGetGroupMembersQuery,
} = groupApi;
