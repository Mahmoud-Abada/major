/**
 * Classroom API Endpoints
 * RTK Query endpoints for classroom management
 */
import type {
  AddStudentToClassroomParams,
  ApiResponse,
  Classroom,
  CreateClassroomParams,
  GetClassroomsParams,
  PaginatedResponse,
  UpdateClassroomParams,
} from "@/store/types/api";
import { getAccessToken, isTokenExpired } from "@/utils/tokenManager";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { baseApi } from "./baseApi";

// Create separate base queries for different services
const usersBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL || "http://localhost:3000/api/users",
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

export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get classrooms with filtering and pagination
    getClassrooms: builder.query<
      PaginatedResponse<Classroom>,
      GetClassroomsParams
    >({
      queryFn: async (params, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/get-classrooms",
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
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({
              type: "Classroom" as const,
              id,
            })),
            { type: "Classroom", id: "LIST" },
          ]
          : [{ type: "Classroom", id: "LIST" }],
    }),

    // Get single classroom by ID
    getClassroom: builder.query<ApiResponse<Classroom>, string>({
      queryFn: async (classroomId, { getState }) => {
        try {
          const result = await usersBaseQuery(
            {
              url: "/classroom/get-classrooms",
              method: "POST",
              body: {
                classroomId,
                pagination: { numItems: 1 },
                fetchBy: { userType: "teacher", userId: "current" },
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
      providesTags: (result, error, classroomId) => [
        { type: "Classroom", id: classroomId },
      ],
    }),

    // Create new classrooms
    createClassrooms: builder.mutation<
      ApiResponse<Classroom[]>,
      CreateClassroomParams
    >({
      queryFn: async (params, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/create-classroom",
              method: "POST",
              body: params.classrooms,
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
      invalidatesTags: [{ type: "Classroom", id: "LIST" }],
    }),

    // Update classroom
    updateClassroom: builder.mutation<
      ApiResponse<Classroom>,
      UpdateClassroomParams
    >({
      queryFn: async (params, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/update-classroom",
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
      invalidatesTags: (result, error, { classroomId }) => [
        { type: "Classroom", id: classroomId },
        { type: "Classroom", id: "LIST" },
      ],
    }),

    // Delete classroom
    deleteClassroom: builder.mutation<ApiResponse<void>, string>({
      queryFn: async (classroomId, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/delete-classroom",
              method: "DELETE",
              body: { classroomId },
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
      invalidatesTags: (result, error, classroomId) => [
        { type: "Classroom", id: classroomId },
        { type: "Classroom", id: "LIST" },
      ],
    }),

    // Add student to classroom
    addStudentToClassroom: builder.mutation<
      ApiResponse<void>,
      AddStudentToClassroomParams[]
    >({
      queryFn: async (assignments, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/add-classroom-student",
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
        { type: "Classroom", id: "LIST" },
      ],
    }),

    // Remove student from classroom
    removeStudentFromClassroom: builder.mutation<
      ApiResponse<void>,
      { classroomId: string; studentId: string }
    >({
      queryFn: async ({ classroomId, studentId }, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/remove-classroom-student",
              method: "POST",
              body: { classroom: classroomId, student: studentId },
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
      invalidatesTags: (result, error, { classroomId }) => [
        { type: "Classroom", id: classroomId },
        { type: "Classroom", id: "LIST" },
      ],
    }),

    // Archive/Unarchive classroom
    archiveClassroom: builder.mutation<
      ApiResponse<void>,
      { classroomId: string; isArchived: boolean }
    >({
      queryFn: async ({ classroomId, isArchived }, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/update-classroom",
              method: "POST",
              body: {
                classroomId,
                classroomData: { isArchived },
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
      invalidatesTags: (result, error, { classroomId }) => [
        { type: "Classroom", id: classroomId },
        { type: "Classroom", id: "LIST" },
      ],
    }),

    // Get classroom statistics
    getClassroomStats: builder.query<
      ApiResponse<{
        totalStudents: number;
        maxStudents?: number;
        averageAttendance: number;
        averageGrade: number;
        totalSessions: number;
        completedSessions: number;
        totalPosts: number;
        totalHomeworks: number;
        totalQuizzes: number;
        totalAnnouncements: number;
      }>,
      string
    >({
      queryFn: async (classroomId, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/get-classroom-stats",
              method: "POST",
              body: { classroomId },
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
      providesTags: (result, error, classroomId) => [
        { type: "Classroom", id: `${classroomId}_STATS` },
      ],
    }),

    // Group Management Endpoints
    // Create new groups
    createGroups: builder.mutation<
      ApiResponse<any[]>,
      { groups: any[] }
    >({
      queryFn: async ({ groups }, { getState }) => {
        try {
          const result = await classroomBaseQuery(
            {
              url: "/create-group",
              method: "POST",
              body: groups,
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
    updateGroup: builder.mutation<
      ApiResponse<any>,
      { groupId: string; groupData: any }
    >({
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
      Array<{ student: string; group: string }>
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

    // Add group to classroom
    addGroupToClassroom: builder.mutation<
      ApiResponse<void>,
      Array<{ classroom: string; group: string; coefficient?: number }>
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
        ...assignments.map(({ classroom, group }) => [
          { type: "Classroom" as const, id: classroom },
          { type: "Group" as const, id: group },
        ]).flat(),
        { type: "Classroom", id: "LIST" },
        { type: "Group", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetClassroomsQuery,
  useGetClassroomQuery,
  useCreateClassroomsMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
  useAddStudentToClassroomMutation,
  useRemoveStudentFromClassroomMutation,
  useArchiveClassroomMutation,
  useGetClassroomStatsQuery,
  // Group hooks
  useCreateGroupsMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useAddStudentToGroupMutation,
  useAddGroupToClassroomMutation,
} = classroomApi;
