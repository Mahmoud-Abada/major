/**
 * Classroom Types
 * Updated to match the API structure from classroom basics.json
 */

export interface Classroom {
  id: string;
  teacher: string;
  teacherName?: string;
  school?: string;
  schoolName?: string;
  title: string;
  location: {
    fullLocation?: string;
    coordinates: { lat: number; long: number };
    wilaya: string;
    commune: string;
  };
  frontPicture?: string;
  backPicture?: string;
  isArchived: boolean;
  description?: string;
  field: string;
  level: string;
  color: string;
  maxStudents?: number;
  currentStudents?: number;
  price: number;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  mode: "monthly" | "sessional" | "semestrial";
  perDuration?: number;
  perSessions?: number;
  perSemester?: Array<{
    semester: string;
    price: number;
    startDate: number;
    endDate: number;
  }>;
  createdAt?: number;
  updatedAt?: number;
}

export interface Group {
  id: string;
  school: string;
  schoolName?: string;
  title: string;
  frontPicture?: string;
  backPicture?: string;
  isArchived?: boolean;
  description?: string;
  field: string;
  level: string;
  color: string;
  isSemestral?: boolean;
  startDate?: number;
  endDate?: number;
  memberCount?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ClassroomStudent {
  classroom: string;
  student: string;
}

export interface GroupStudent {
  student: string;
  group: string;
}

export interface GroupClassroom {
  classroom: string;
  group: string;
}

// API Request/Response types
export interface GetClassroomsParams {
  status?: "active" | "archived";
  pagination: { numItems: number; cursor?: string };
  classroomId?: string;
  fetchBy: { userType: string; userId: string };
}

export interface CreateClassroomParams {
  classrooms: Omit<Classroom, "id" | "createdAt" | "updatedAt">[];
}

export interface UpdateClassroomParams {
  classroomId: string;
  classroomData: Partial<Classroom>;
}

export interface CreateGroupParams {
  groups: Omit<Group, "id" | "createdAt" | "updatedAt">[];
}

export interface UpdateGroupParams {
  groupId: string;
  groupData: Partial<Group>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    cursor?: string;
    total?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Form types for UI components
export interface ClassroomFormData {
  title: string;
  teacher: string;
  school?: string;
  field: string;
  level: string;
  description?: string;
  color: string;
  maxStudents?: number;
  price: number;
  mode: "monthly" | "sessional" | "semestrial";
  perDuration?: number;
  perSessions?: number;
  frontPicture?: string;
  backPicture?: string;
  location: {
    fullLocation?: string;
    coordinates: { lat: number; long: number };
    wilaya: string;
    commune: string;
  };
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  perSemester?: Array<{
    semester: string;
    price: number;
    startDate: number;
    endDate: number;
  }>;
}

export interface GroupFormData {
  title: string;
  school: string;
  field: string;
  level: string;
  description?: string;
  color: string;
  isSemestral?: boolean;
  startDate?: number;
  endDate?: number;
  frontPicture?: string;
  backPicture?: string;
}

// Filter and search types
export interface ClassroomFilters {
  field?: string;
  level?: string;
  status?: "active" | "archived";
  teacher?: string;
  school?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface GroupFilters {
  field?: string;
  level?: string;
  status?: "active" | "archived";
  school?: string;
  isSemestral?: boolean;
}

// Mark types
export interface Mark {
  id: string;
  student: string;
  studentName?: string;
  classroom?: string;
  group?: string;
  subject: string;
  markType: "homework" | "quiz" | "exam" | "participation";
  value: number;
  maxValue: number;
  date: number;
  description?: string;
  isExempted?: boolean;
  createdAt?: number;
  updatedAt?: number;
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

export interface MarkFilters {
  markType?: string;
  subject?: string;
  studentId?: string;
  classroomId?: string;
  groupId?: string;
  dateRange?: {
    start: number;
    end: number;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
}

// Statistics types
export interface ClassroomStats {
  totalClassrooms: number;
  activeClassrooms: number;
  archivedClassrooms: number;
  totalStudents: number;
  averageStudentsPerClassroom: number;
  byField: Record<string, number>;
  byLevel: Record<string, number>;
  revenueThisMonth: number;
  upcomingSessions: number;
}

export interface GroupStats {
  totalGroups: number;
  activeGroups: number;
  archivedGroups: number;
  totalMembers: number;
  averageMembersPerGroup: number;
  byField: Record<string, number>;
  byLevel: Record<string, number>;
  semestralGroups: number;
  permanentGroups: number;
}

export interface MarkStats {
  totalMarks: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passingRate: number;
  byType: Record<string, { count: number; average: number }>;
  bySubject: Record<string, { count: number; average: number }>;
  recentTrend: 'up' | 'down' | 'stable';
}

// Attendance types
export interface Attendance {
  id: string;
  student: string;
  studentName?: string;
  classroom?: string;
  event?: string;
  date: number;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface AttendanceFormData {
  student: string;
  classroom?: string;
  event?: string;
  date: number;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface AttendanceFilters {
  status?: string;
  studentId?: string;
  classroomId?: string;
  eventId?: string;
  dateRange?: {
    start: number;
    end: number;
  };
}

export interface AttendanceStats {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  punctualityRate: number;
  byDate: Record<string, { present: number; absent: number; late: number; excused: number }>;
  byStudent: Record<string, { present: number; absent: number; late: number; excused: number; rate: number }>;
  recentTrend: 'improving' | 'declining' | 'stable';
}