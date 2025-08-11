/**
 * API Types
 * TypeScript interfaces for API requests and responses
 */

// Base API response structure
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Pagination interfaces
export interface PaginationParams {
  numItems: number;
  cursor?: string;
}

export interface PaginationResponse {
  hasMore: boolean;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

// Classroom interfaces
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
  schedule: ScheduleItem[];
  mode: "monthly" | "sessional" | "semestrial";
  perDuration?: number;
  perSessions?: number;
  perSemester?: SemesterPricing[];
  createdAt: number;
  updatedAt: number;
}

export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

export interface SemesterPricing {
  semester: string;
  price: number;
  startDate: number;
  endDate: number;
}

export interface GetClassroomsParams {
  status?: "archived" | "all" | "notArchived";
  pagination?: { numItems: number; cursor: string | null };
  groupPagination?: { numItems: number; cursor: string | null };
  classroomId?: string;
  fetchBy?: {
    userType: "school" | "teacher" | "student";
    userId?: string;
  };
}

export interface CreateClassroomParams {
  classrooms: Omit<Classroom, "id" | "createdAt" | "updatedAt">[];
}

export interface UpdateClassroomParams {
  classroomId: string;
  classroomData: Partial<Omit<Classroom, "id" | "createdAt" | "updatedAt">>;
}

// Group interfaces
export interface Group {
  id: string;
  school?: string;
  schoolName?: string;
  title: string;
  frontPicture?: string;
  backPicture?: string;
  isArchived?: boolean;
  description?: string;
  field?: string; // Keep for backward compatibility
  major: string; // API uses 'major' instead of 'field'
  level: string;
  color: string;
  maxStudents: number;
  majors: string[]; // Array of specializations
  isSemestral?: boolean;
  startDate?: number;
  endDate?: number;
  memberCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateGroupParams {
  groups: Omit<Group, "id" | "createdAt" | "updatedAt">[];
}

export interface UpdateGroupParams {
  groupId: string;
  groupData: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>;
}

// Mark interfaces
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
  createdAt: number;
  updatedAt: number;
}

export interface CreateMarkParams {
  mark: Omit<Mark, "id" | "createdAt" | "updatedAt">;
}

export interface UpdateMarkParams {
  markId: string;
  markData: Partial<Omit<Mark, "id" | "createdAt" | "updatedAt">>;
}

export interface GetStudentMarksParams {
  studentId: string;
  classroomId?: string;
  groupId?: string;
}

export interface GetGroupMarksParams {
  groupId: string;
}

// Attendance interfaces
export interface Attendance {
  id: string;
  student: string;
  studentName?: string;
  classroom?: string;
  event?: string;
  date: number;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateAttendanceParams {
  attendance: Omit<Attendance, "id" | "createdAt" | "updatedAt">;
}

export interface UpdateAttendanceParams {
  attendanceId: string;
  attendanceData: Partial<Omit<Attendance, "id" | "createdAt" | "updatedAt">>;
}

export interface GetStudentAttendanceParams {
  studentId: string;
  dateRange?: {
    start: number;
    end: number;
  };
}

export interface GetClassroomAttendanceParams {
  classroomId: string;
  date?: number;
}

export interface GetEventAttendanceParams {
  eventId: string;
}

// Post interfaces
export interface Post {
  id: string;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  classroom?: string;
  group?: string;
  type: "announcement" | "homework" | "quiz" | "poll" | "material";
  title: string;
  content: string;
  attachments?: string[];
  dueDate?: number;
  isPublished: boolean;
  allowComments: boolean;
  createdAt: number;
  updatedAt: number;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export interface CreatePostParams {
  post: Omit<
    Post,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "likesCount"
    | "commentsCount"
    | "isLiked"
  >;
}

export interface UpdatePostParams {
  postId: string;
  postData: Partial<
    Omit<
      Post,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "likesCount"
      | "commentsCount"
      | "isLiked"
    >
  >;
}

export interface GetPostsParams {
  classroomId?: string;
  groupId?: string;
  type?: string;
}

export interface GetStudentPostsParams {
  studentId: string;
}

export interface GetGroupPostsParams {
  groupId: string;
}

export interface SubmitHomeworkParams {
  postId: string;
  studentId: string;
  submission: any;
}

export interface SubmitQuizParams {
  postId: string;
  studentId: string;
  answers: any[];
}

export interface SubmitPollParams {
  postId: string;
  studentId: string;
  choice: string;
}

export interface InteractWithPostParams {
  postId: string;
  userId: string;
  interaction: "like" | "dislike";
}

// Student assignment interfaces
export interface AddStudentToClassroomParams {
  classroom: string;
  student: string;
}

export interface AddStudentToGroupParams {
  student: string;
  group: string;
}

export interface AddGroupToClassroomParams {
  classroom: string;
  group: string;
}

// Group-Classroom relationship interface
export interface GroupClassroom {
  _id?: string;
  classroom: string;
  group: string;
  coefficient?: number;
}

export interface AddGroupClassroomParams {
  groupClassrooms: Omit<GroupClassroom, "_id"> | Array<Omit<GroupClassroom, "_id">>;
}
