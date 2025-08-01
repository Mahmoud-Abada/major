/**
 * Classroom Types
 * TypeScript interfaces for classroom-related data structures
 */

// Re-export API types for convenience
export type {
  Attendance,
  Classroom,
  Group,
  Mark,
  Post,
  ScheduleItem,
  SemesterPricing,
} from "@/store/types/api";

// Additional UI-specific types
export interface ClassroomCardProps {
  classroom: Classroom;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
}

export interface GroupCardProps {
  group: Group;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
}

export interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onView?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

// Filter and search types
export interface ClassroomFilters {
  status?: "active" | "archived" | "all";
  field?: string;
  level?: string;
  teacher?: string;
  school?: string;
  search?: string;
}

export interface GroupFilters {
  status?: "active" | "archived" | "all";
  field?: string;
  level?: string;
  school?: string;
  search?: string;
}

export interface PostFilters {
  type?: "announcement" | "homework" | "quiz" | "poll" | "material" | "all";
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface MarkFilters {
  type?: "homework" | "quiz" | "exam" | "participation" | "all";
  subject?: string;
  student?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface AttendanceFilters {
  status?: "present" | "absent" | "late" | "excused" | "all";
  student?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// Statistics types
export interface ClassroomStats {
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
}

export interface StudentStats {
  totalMarks: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  attendanceRate: number;
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  lateSessions: number;
}

// Form types
export interface ClassroomFormData {
  teacher: string;
  school?: string;
  title: string;
  location: {
    fullLocation?: string;
    coordinates: { lat: number; long: number };
    wilaya: string;
    commune: string;
  };
  frontPicture?: string;
  backPicture?: string;
  description?: string;
  field: string;
  level: string;
  color: string;
  maxStudents?: number;
  price: number;
  schedule: ScheduleItem[];
  mode: "monthly" | "sessional" | "semestrial";
  perDuration?: number;
  perSessions?: number;
  perSemester?: SemesterPricing[];
}

export interface GroupFormData {
  school: string;
  title: string;
  frontPicture?: string;
  backPicture?: string;
  description?: string;
  field: string;
  level: string;
  color: string;
  isSemestral?: boolean;
  startDate?: number;
  endDate?: number;
}

export interface PostFormData {
  author: string;
  classroom?: string;
  group?: string;
  type: "announcement" | "homework" | "quiz" | "poll" | "material";
  title: string;
  content: string;
  attachments?: string[];
  dueDate?: number;
  isPublished: boolean;
  allowComments: boolean;
}

export interface MarkFormData {
  student: string;
  classroom?: string;
  group?: string;
  subject: string;
  markType: "homework" | "quiz" | "exam" | "participation";
  value: number;
  maxValue: number;
  date: number;
  description?: string;
  isExempted?: boolean;
}

export interface AttendanceFormData {
  student: string;
  classroom?: string;
  event?: string;
  date: number;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

// Bulk operation types
export interface BulkMarkEntry {
  studentId: string;
  studentName: string;
  value?: number;
  isExempted?: boolean;
  notes?: string;
}

export interface BulkAttendanceEntry {
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

// Export/Import types
export interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  includeStatistics: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: any;
}

// Notification types
export interface ClassroomNotification {
  id: string;
  type:
    | "assignment_due"
    | "grade_posted"
    | "attendance_marked"
    | "announcement";
  title: string;
  message: string;
  classroomId?: string;
  groupId?: string;
  postId?: string;
  isRead: boolean;
  createdAt: number;
}
