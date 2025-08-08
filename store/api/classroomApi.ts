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
import { baseApi } from "./baseApi";

export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get classrooms with filtering and pagination
    getClassrooms: builder.query<
      PaginatedResponse<Classroom>,
      GetClassroomsParams
    >({
      query: (params) => ({
        url: "http://127.0.0.1:5000/classroom/get-classrooms",
        method: "POST",
        body: params,
      }),
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
      query: (classroomId) => ({
        url: "http://127.0.0.1:5000/classroom/get-classrooms",
        method: "POST",
        body: {
          classroomId,
          pagination: { numItems: 1 },
          fetchBy: { userType: "teacher", userId: "current" }, // Will be replaced with actual user context
        },
      }),
      providesTags: (result, error, classroomId) => [
        { type: "Classroom", id: classroomId },
      ],
    }),

    // Create new classrooms
    createClassrooms: builder.mutation<
      ApiResponse<Classroom[]>,
      CreateClassroomParams
    >({
      query: (params) => ({
        url: "/create-classroom",
        method: "POST",
        body: params.classrooms,
      }),
      invalidatesTags: [{ type: "Classroom", id: "LIST" }],
    }),

    // Update classroom
    updateClassroom: builder.mutation<
      ApiResponse<Classroom>,
      UpdateClassroomParams
    >({
      query: (params) => ({
        url: "/update-classroom",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { classroomId }) => [
        { type: "Classroom", id: classroomId },
        { type: "Classroom", id: "LIST" },
      ],
    }),

    // Delete classroom
    deleteClassroom: builder.mutation<ApiResponse<void>, string>({
      query: (classroomId) => ({
        url: "/delete-classroom",
        method: "DELETE",
        body: { classroomId },
      }),
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
      query: (assignments) => ({
        url: "/add-classroom-student",
        method: "POST",
        body: assignments,
      }),
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
      query: ({ classroomId, studentId }) => ({
        url: "/remove-classroom-student",
        method: "POST",
        body: { classroom: classroomId, student: studentId },
      }),
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
      query: ({ classroomId, isArchived }) => ({
        url: "/update-classroom",
        method: "POST",
        body: {
          classroomId,
          classroomData: { isArchived },
        },
      }),
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
      query: (classroomId) => ({
        url: "/get-classroom-stats",
        method: "POST",
        body: { classroomId },
      }),
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
      query: ({ groups }) => ({
        url: "/create-group",
        method: "POST",
        body: groups,
      }),
      invalidatesTags: [{ type: "Group", id: "LIST" }],
    }),

    // Update group
    updateGroup: builder.mutation<
      ApiResponse<any>,
      { groupId: string; groupData: any }
    >({
      query: (params) => ({
        url: "/update-group",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Delete group
    deleteGroup: builder.mutation<ApiResponse<void>, string>({
      query: (groupId) => ({
        url: "/delete-group",
        method: "DELETE",
        body: { groupId },
      }),
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
      query: (assignments) => ({
        url: "/add-group-student",
        method: "POST",
        body: assignments,
      }),
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
      Array<{ classroom: string; group: string }>
    >({
      query: (assignments) => ({
        url: "/add-group-classroom",
        method: "POST",
        body: assignments,
      }),
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
