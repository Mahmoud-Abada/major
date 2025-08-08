export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  markedBy: string;
  markedAt: string;
  updatedAt: string;
}

export interface AttendanceEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  subjectId?: string;
  subjectName?: string;
  teacherId: string;
  teacherName: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassroomAttendance {
  id: string;
  classId: string;
  className: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  events: AttendanceEvent[];
  records: AttendanceRecord[];
  lastUpdated: string;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
  recentRecords: AttendanceRecord[];
  monthlyStats: {
    month: string;
    totalDays: number;
    presentDays: number;
    attendanceRate: number;
  }[];
  lastAttendance?: AttendanceRecord;
}

export interface AttendanceStats {
  totalStudents: number;
  totalEvents: number;
  totalRecords: number;
  overallAttendanceRate: number;
  todayAttendanceRate: number;
  weeklyAttendanceRate: number;
  monthlyAttendanceRate: number;
  classDistribution: Record<
    string,
    {
      totalStudents: number;
      attendanceRate: number;
    }
  >;
  statusDistribution: Record<string, number>;
  trendData: {
    date: string;
    attendanceRate: number;
  }[];
}

export interface CreateAttendanceEventRequest {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId?: string;
  teacherId: string;
}

export interface UpdateAttendanceRequest {
  studentId: string;
  eventId: string;
  status: "present" | "absent" | "late" | "excused";
  timeIn?: string;
  timeOut?: string;
  notes?: string;
}

export interface BulkAttendanceUpdate {
  eventId: string;
  records: {
    studentId: string;
    status: "present" | "absent" | "late" | "excused";
    timeIn?: string;
    timeOut?: string;
    notes?: string;
  }[];
}

export interface AttendanceFilter {
  dateFrom?: string;
  dateTo?: string;
  classId?: string;
  status?: "present" | "absent" | "late" | "excused";
  studentId?: string;
  teacherId?: string;
}
