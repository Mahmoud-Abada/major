/**
 * Mark API Endpoints
 * RTK Query endpoints for marks management
 */
import type {
  ApiResponse,
  CreateMarkParams,
  GetGroupMarksParams,
  GetStudentMarksParams,
  Mark,
  UpdateMarkParams,
} from "@/store/types/api";
import { baseApi } from "./baseApi";

export const markApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create mark
    createMark: builder.mutation<ApiResponse<Mark>, CreateMarkParams>({
      query: (params) => ({
        url: "/mark/create-mark",
        method: "POST",
        body: params.mark,
      }),
      invalidatesTags: (result, error, { mark }) => [
        { type: "Mark", id: "LIST" },
        { type: "Student", id: mark.student },
        ...(mark.classroom
          ? [{ type: "Classroom" as const, id: mark.classroom }]
          : []),
        ...(mark.group ? [{ type: "Group" as const, id: mark.group }] : []),
      ],
    }),

    // Update mark
    updateMark: builder.mutation<ApiResponse<Mark>, UpdateMarkParams>({
      query: (params) => ({
        url: "/mark/update-mark",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { markId }) => [
        { type: "Mark", id: markId },
        { type: "Mark", id: "LIST" },
      ],
    }),

    // Delete mark
    deleteMark: builder.mutation<ApiResponse<void>, string>({
      query: (markId) => ({
        url: "/mark/delete-mark",
        method: "DELETE",
        body: { markId },
      }),
      invalidatesTags: (result, error, markId) => [
        { type: "Mark", id: markId },
        { type: "Mark", id: "LIST" },
      ],
    }),

    // Get student marks
    getStudentMarks: builder.query<ApiResponse<Mark[]>, GetStudentMarksParams>({
      query: (params) => ({
        url: "/mark/get-student-marks",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { studentId }) => [
        { type: "Mark", id: `STUDENT_${studentId}` },
        { type: "Student", id: studentId },
      ],
    }),

    // Get group marks
    getGroupMarks: builder.query<ApiResponse<Mark[]>, GetGroupMarksParams>({
      query: (params) => ({
        url: "/mark/get-group-marks",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { groupId }) => [
        { type: "Mark", id: `GROUP_${groupId}` },
        { type: "Group", id: groupId },
      ],
    }),

    // Get all marks (with optional filtering)
    getMarks: builder.query<
      ApiResponse<Mark[]>,
      {
        classroomId?: string;
        groupId?: string;
        subject?: string;
        markType?: string;
        dateRange?: { start: number; end: number };
      }
    >({
      query: (params) => ({
        url: "/mark/get-marks",
        method: "POST",
        body: params,
      }),
      providesTags: [{ type: "Mark", id: "LIST" }],
    }),

    // Get single mark
    getMark: builder.query<ApiResponse<Mark>, string>({
      query: (markId) => ({
        url: "/mark/get-mark",
        method: "POST",
        body: { markId },
      }),
      providesTags: (result, error, markId) => [{ type: "Mark", id: markId }],
    }),

    // Update student mark (bulk operation)
    updateStudentMark: builder.mutation<
      ApiResponse<void>,
      {
        studentId: string;
        markId: string;
        markData: Partial<Mark>;
      }
    >({
      query: (params) => ({
        url: "/mark/update-student-mark",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { studentId, markId }) => [
        { type: "Mark", id: markId },
        { type: "Student", id: studentId },
        { type: "Mark", id: "LIST" },
      ],
    }),

    // Update group mark (bulk operation)
    updateGroupMark: builder.mutation<
      ApiResponse<void>,
      {
        groupId: string;
        markId: string;
        markData: Partial<Mark>;
      }
    >({
      query: (params) => ({
        url: "/mark/update-group-mark",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { groupId, markId }) => [
        { type: "Mark", id: markId },
        { type: "Group", id: groupId },
        { type: "Mark", id: "LIST" },
      ],
    }),

    // Update group exemption
    updateGroupExemption: builder.mutation<
      ApiResponse<void>,
      {
        groupId: string;
        studentId: string;
        isExempted: boolean;
      }
    >({
      query: (params) => ({
        url: "/mark/update-group-exemption",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { groupId, studentId }) => [
        { type: "Group", id: groupId },
        { type: "Student", id: studentId },
        { type: "Mark", id: "LIST" },
      ],
    }),

    // Delete group mark
    deleteGroupMark: builder.mutation<
      ApiResponse<void>,
      { groupId: string; markId: string }
    >({
      query: (params) => ({
        url: "/mark/delete-group-mark",
        method: "DELETE",
        body: params,
      }),
      invalidatesTags: (result, error, { groupId, markId }) => [
        { type: "Mark", id: markId },
        { type: "Group", id: groupId },
        { type: "Mark", id: "LIST" },
      ],
    }),

    // Update mark event (for bulk operations)
    updateMarkEvent: builder.mutation<
      ApiResponse<void>,
      {
        eventId: string;
        markData: Partial<Mark>;
      }
    >({
      query: (params) => ({
        url: "/mark/update-mark-event",
        method: "POST",
        body: params,
      }),
      invalidatesTags: [{ type: "Mark", id: "LIST" }],
    }),

    // Get marks statistics
    getMarksStatistics: builder.query<
      ApiResponse<{
        totalMarks: number;
        averageScore: number;
        highestScore: number;
        lowestScore: number;
        gradeDistribution: Record<string, number>;
        typeDistribution: Record<string, number>;
      }>,
      { classroomId?: string; groupId?: string; studentId?: string }
    >({
      query: (params) => ({
        url: "/mark/get-marks-statistics",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, params) => [
        { type: "Mark", id: "STATISTICS" },
        ...(params.classroomId
          ? [{ type: "Classroom" as const, id: params.classroomId }]
          : []),
        ...(params.groupId
          ? [{ type: "Group" as const, id: params.groupId }]
          : []),
        ...(params.studentId
          ? [{ type: "Student" as const, id: params.studentId }]
          : []),
      ],
    }),
  }),
});

// Export hooks
export const {
  useCreateMarkMutation,
  useUpdateMarkMutation,
  useDeleteMarkMutation,
  useGetStudentMarksQuery,
  useGetGroupMarksQuery,
  useGetMarksQuery,
  useGetMarkQuery,
  useUpdateStudentMarkMutation,
  useUpdateGroupMarkMutation,
  useUpdateGroupExemptionMutation,
  useDeleteGroupMarkMutation,
  useUpdateMarkEventMutation,
  useGetMarksStatisticsQuery,
} = markApi;
