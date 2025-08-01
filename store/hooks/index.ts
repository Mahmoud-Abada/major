/**
 * Redux Hooks
 * Typed hooks for using Redux with TypeScript
 */
export { useAppDispatch } from "./useAppDispatch";
export { useAppSelector } from "./useAppSelector";
export { useRole } from "./useRole";

// Re-export RTK Query hooks
export {
  useAddClassroomStudentMutation,
  useCreateClassroomsMutation,
  useDeleteClassroomMutation,
  useGetClassroomQuery,
  // Classroom API hooks
  useGetClassroomsQuery,
  useUpdateClassroomMutation,
} from "../api/classroomApi";

export {
  useAddGroupClassroomMutation,
  useAddGroupStudentMutation,
  // Group API hooks
  useCreateGroupsMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from "../api/groupApi";

export {
  // Mark API hooks
  useCreateMarkMutation,
  useDeleteMarkMutation,
  useGetGroupMarksQuery,
  useGetStudentMarksQuery,
  useUpdateGroupExemptionMutation,
  useUpdateGroupMarkMutation,
  useUpdateMarkMutation,
  useUpdateStudentMarkMutation,
} from "../api/markApi";

export {
  // Attendance API hooks
  useAddStudentAttendanceMutation,
  useGetClassroomAttendanceQuery,
  useGetEventAttendanceQuery,
  useGetStudentAttendanceQuery,
  useUpdateStudentAttendanceMutation,
} from "../api/attendanceApi";

export {
  // Post API hooks
  useCreatePostMutation,
  useDeletePostMutation,
  useGetGroupPostsQuery,
  useGetHomeworksAndQuizzesQuery,
  useGetPostsQuery,
  useGetStudentPostsQuery,
  useInteractWithPostMutation,
  useSubmitHomeworkMutation,
  useSubmitPollMutation,
  useSubmitQuizMutation,
  useUpdatePostMutation,
} from "../api/postApi";
