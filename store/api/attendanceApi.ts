/**
 * Attendance API Endpoints
 * RTK Query endpoints for attendance management
 */
import type {
  ApiResponse,
  Attendance,
  CreateAttendanceParams,
  GetClassroomAttendanceParams,
  GetEventAttendanceParams,
  GetStudentAttendanceParams,
  UpdateAttendanceParams,
} from "@/store/types/api";
import { baseApi } from "./baseApi";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add student attendance
    addStudentAttendance: builder.mutation<
      ApiResponse<Attendance>,
      CreateAttendanceParams
    >({
      query: (params) => ({
        url: "/attendance/add-student-attendance",
        method: "POST",
        body: params.attendance,
      }),
      invalidatesTags: (result, error, { attendance }) => [
        { type: "Attendance", id: "LIST" },
        { type: "Student", id: attendance.student },
        ...(attendance.classroom
          ? [{ type: "Classroom" as const, id: attendance.classroom }]
          : []),
      ],
    }),

    // Update student attendance
    updateStudentAttendance: builder.mutation<
      ApiResponse<Attendance>,
      UpdateAttendanceParams
    >({
      query: (params) => ({
        url: "/attendance/update-student-attendance",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { attendanceId }) => [
        { type: "Attendance", id: attendanceId },
        { type: "Attendance", id: "LIST" },
      ],
    }),

    // Get student attendance
    getStudentAttendance: builder.query<
      ApiResponse<Attendance[]>,
      GetStudentAttendanceParams
    >({
      query: (params) => ({
        url: "/attendance/get-attendance-student",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { studentId }) => [
        { type: "Attendance", id: `STUDENT_${studentId}` },
        { type: "Student", id: studentId },
      ],
    }),

    // Get classroom attendance
    getClassroomAttendance: builder.query<
      ApiResponse<Attendance[]>,
      GetClassroomAttendanceParams
    >({
      query: (params) => ({
        url: "/attendance/get-attendance-classroom",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { classroomId }) => [
        { type: "Attendance", id: `CLASSROOM_${classroomId}` },
        { type: "Classroom", id: classroomId },
      ],
    }),

    // Get event attendance
    getEventAttendance: builder.query<
      ApiResponse<Attendance[]>,
      GetEventAttendanceParams
    >({
      query: (params) => ({
        url: "/attendance/get-attendance-event",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { eventId }) => [
        { type: "Attendance", id: `EVENT_${eventId}` },
      ],
    }),

    // Get all attendance records (with filtering)
    getAttendance: builder.query<
      ApiResponse<Attendance[]>,
      {
        classroomId?: string;
        studentId?: string;
        dateRange?: { start: number; end: number };
        status?: "present" | "absent" | "late" | "excused";
      }
    >({
      query: (params) => ({
        url: "/attendance/get-attendance",
        method: "POST",
        body: params,
      }),
      providesTags: [{ type: "Attendance", id: "LIST" }],
    }),

    // Delete attendance record
    deleteAttendance: builder.mutation<ApiResponse<void>, string>({
      query: (attendanceId) => ({
        url: "/attendance/delete-attendance",
        method: "DELETE",
        body: { attendanceId },
      }),
      invalidatesTags: (result, error, attendanceId) => [
        { type: "Attendance", id: attendanceId },
        { type: "Attendance", id: "LIST" },
      ],
    }),

    // Bulk add attendance for multiple students
    bulkAddAttendance: builder.mutation<
      ApiResponse<Attendance[]>,
      {
        classroomId: string;
        date: number;
        attendanceRecords: Array<{
          studentId: string;
          status: "present" | "absent" | "late" | "excused";
          notes?: string;
        }>;
      }
    >({
      query: (params) => ({
        url: "/attendance/bulk-add-attendance",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { classroomId }) => [
        { type: "Attendance", id: "LIST" },
        { type: "Classroom", id: classroomId },
      ],
    }),

    // Bulk update attendance
    bulkUpdateAttendance: builder.mutation<
      ApiResponse<void>,
      {
        updates: Array<{
          attendanceId: string;
          status: "present" | "absent" | "late" | "excused";
          notes?: string;
        }>;
      }
    >({
      query: (params) => ({
        url: "/attendance/bulk-update-attendance",
        method: "POST",
        body: params,
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }],
    }),

    // Get attendance statistics
    getAttendanceStatistics: builder.query<
      ApiResponse<{
        totalSessions: number;
        presentCount: number;
        absentCount: number;
        lateCount: number;
        excusedCount: number;
        attendanceRate: number;
        weeklyPattern: Record<string, { total: number; present: number }>;
        monthlyTrend: Array<{ month: string; rate: number }>;
      }>,
      {
        studentId?: string;
        classroomId?: string;
        dateRange?: { start: number; end: number };
      }
    >({
      query: (params) => ({
        url: "/attendance/get-attendance-statistics",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, params) => [
        { type: "Attendance", id: "STATISTICS" },
        ...(params.studentId
          ? [{ type: "Student" as const, id: params.studentId }]
          : []),
        ...(params.classroomId
          ? [{ type: "Classroom" as const, id: params.classroomId }]
          : []),
      ],
    }),

    // Get attendance summary for a specific date
    getAttendanceSummary: builder.query<
      ApiResponse<{
        date: number;
        totalStudents: number;
        presentCount: number;
        absentCount: number;
        lateCount: number;
        excusedCount: number;
        attendanceRate: number;
        records: Attendance[];
      }>,
      { classroomId: string; date: number }
    >({
      query: (params) => ({
        url: "/attendance/get-attendance-summary",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { classroomId, date }) => [
        { type: "Attendance", id: `SUMMARY_${classroomId}_${date}` },
        { type: "Classroom", id: classroomId },
      ],
    }),

    // Generate attendance report
    generateAttendanceReport: builder.mutation<
      ApiResponse<{
        reportUrl: string;
        reportId: string;
      }>,
      {
        classroomId?: string;
        studentId?: string;
        dateRange: { start: number; end: number };
        format: "pdf" | "excel" | "csv";
        includeStatistics: boolean;
      }
    >({
      query: (params) => ({
        url: "/attendance/generate-report",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

// Export hooks
export const {
  useAddStudentAttendanceMutation,
  useUpdateStudentAttendanceMutation,
  useGetStudentAttendanceQuery,
  useGetClassroomAttendanceQuery,
  useGetEventAttendanceQuery,
  useGetAttendanceQuery,
  useDeleteAttendanceMutation,
  useBulkAddAttendanceMutation,
  useBulkUpdateAttendanceMutation,
  useGetAttendanceStatisticsQuery,
  useGetAttendanceSummaryQuery,
  useGenerateAttendanceReportMutation,
} = attendanceApi;
