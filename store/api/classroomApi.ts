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
        url: "/get-classrooms",
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
        url: "/get-classrooms",
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
} = classroomApi;
