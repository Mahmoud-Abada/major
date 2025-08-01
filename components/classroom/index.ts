/**
 * Classroom Components Barrel Export
 * Centralized exports for all classroom-related components
 */

// Card Components
export { ClassroomCard, ClassroomCardSkeleton } from "./ClassroomCard";
export { GroupCard, GroupCardSkeleton } from "./GroupCard";
export { PostCard, PostCardSkeleton, PostList } from "./PostCard";

// Display Components
export {
  ScheduleDisplay,
  ScheduleSummary,
  WeeklyScheduleView,
} from "./ScheduleDisplay";

// Table Components
export { AttendanceSummary, AttendanceTable } from "./AttendanceTable";
export { MarksSummary, MarksTable } from "./MarksTable";

// Statistics Components
export {
  ClassroomStats,
  ExtendedClassroomStats,
  StatsComparison,
} from "./ClassroomStats";

// Re-export types for convenience
export type {
  Attendance,
  Classroom,
  ClassroomStats as ClassroomStatsType,
  Group,
  Mark,
  Post,
} from "@/types/classroom";
