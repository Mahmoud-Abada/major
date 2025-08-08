export interface ScheduleEntry {
  id: string;
  title: string;
  description?: string;
  subject: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  roomId?: string;
  roomName?: string;
  date: string;
  startTime: string;
  endTime: string;
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  type: "lecture" | "lab" | "tutorial" | "exam" | "meeting" | "event";
  status: "scheduled" | "ongoing" | "completed" | "cancelled" | "postponed";
  isRecurring: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly";
  recurrenceEndDate?: string;
  color?: string;
  notes?: string;
  attendanceRequired: boolean;
  maxStudents?: number;
  currentStudents?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySchedule {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  classId?: string;
  teacherId?: string;
  entries: ScheduleEntry[];
  totalHours: number;
  totalSessions: number;
  lastUpdated: string;
}

export interface DailySchedule {
  id: string;
  date: string;
  dayOfWeek: string;
  entries: ScheduleEntry[];
  totalHours: number;
  totalSessions: number;
  conflicts: ScheduleConflict[];
}

export interface ScheduleConflict {
  id: string;
  type:
    | "time_overlap"
    | "room_conflict"
    | "teacher_conflict"
    | "class_conflict";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedEntries: string[];
  suggestedResolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ClassSchedule {
  id: string;
  classId: string;
  className: string;
  academicYear: string;
  semester: string;
  totalWeeklyHours: number;
  subjects: {
    subject: string;
    weeklyHours: number;
    teacherId: string;
    teacherName: string;
  }[];
  schedule: ScheduleEntry[];
  lastUpdated: string;
}

export interface TeacherSchedule {
  id: string;
  teacherId: string;
  teacherName: string;
  totalWeeklyHours: number;
  maxWeeklyHours: number;
  subjects: string[];
  classes: string[];
  schedule: ScheduleEntry[];
  workload: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  lastUpdated: string;
}

export interface Room {
  id: string;
  name: string;
  type:
    | "classroom"
    | "laboratory"
    | "auditorium"
    | "library"
    | "gym"
    | "office";
  capacity: number;
  equipment: string[];
  location: string;
  isAvailable: boolean;
  schedule: ScheduleEntry[];
}

export interface ScheduleStats {
  totalEntries: number;
  totalHours: number;
  totalClasses: number;
  totalTeachers: number;
  totalRooms: number;
  utilizationRate: number;
  conflictsCount: number;
  upcomingEntries: number;
  completedEntries: number;
  cancelledEntries: number;
  subjectDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  dayDistribution: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  teacherWorkload: {
    teacherId: string;
    teacherName: string;
    totalHours: number;
    utilizationRate: number;
  }[];
  roomUtilization: {
    roomId: string;
    roomName: string;
    totalHours: number;
    utilizationRate: number;
  }[];
}

export interface CreateScheduleEntryRequest {
  title: string;
  description?: string;
  subject: string;
  classId: string;
  teacherId: string;
  roomId?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "lecture" | "lab" | "tutorial" | "exam" | "meeting" | "event";
  isRecurring: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly";
  recurrenceEndDate?: string;
  color?: string;
  notes?: string;
  attendanceRequired: boolean;
  maxStudents?: number;
}

export interface UpdateScheduleEntryRequest
  extends Partial<CreateScheduleEntryRequest> {
  id: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled" | "postponed";
}

export interface BulkScheduleOperation {
  operation: "create" | "update" | "delete" | "move";
  entries: ScheduleEntry[];
  targetDate?: string;
  targetTime?: string;
}

export interface ScheduleFilter {
  classId?: string;
  teacherId?: string;
  roomId?: string;
  subject?: string;
  type?: "lecture" | "lab" | "tutorial" | "exam" | "meeting" | "event";
  status?: "scheduled" | "ongoing" | "completed" | "cancelled" | "postponed";
  dayOfWeek?:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  type: "weekly" | "semester" | "academic_year";
  entries: Omit<ScheduleEntry, "id" | "date" | "createdAt" | "updatedAt">[];
  applicableClasses: string[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}
