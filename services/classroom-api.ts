/**
 * Classroom API Service
 * Handles all API interactions with the classroom service
 */

// Base classroom entity interfaces
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

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    cursor?: string;
    total?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Request parameter types
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

// Classroom API Service Class
class ClassroomApiService {
  private baseUrl: string;
  private getAuthToken: () => string | null;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_CLASSROOM_API_URL ||
      "http://127.0.0.1:3001/classroom";
    this.getAuthToken = () => {
      if (typeof window !== "undefined") {
        return (
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token")
        );
      }
      return null;
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getAuthToken();
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ClassroomApiError(
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
          response.status.toString(),
          errorData,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ClassroomApiError) {
        throw error;
      }

      // Network or other errors
      throw new ClassroomApiError(
        error instanceof Error ? error.message : "Network error occurred",
        "NETWORK_ERROR",
        error,
      );
    }
  }

  // Classroom Management Methods
  async createClassrooms(
    params: CreateClassroomParams,
  ): Promise<ApiResponse<Classroom[]>> {
    return this.request("/create-classroom", {
      method: "POST",
      body: JSON.stringify(params.classrooms),
    });
  }

  async updateClassroom(
    params: UpdateClassroomParams,
  ): Promise<ApiResponse<Classroom>> {
    return this.request("/update-classroom", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async deleteClassroom(classroomId: string): Promise<ApiResponse<void>> {
    return this.request("/delete-classroom", {
      method: "DELETE",
      body: JSON.stringify({ classroomId }),
    });
  }

  async getClassrooms(
    params: GetClassroomsParams,
  ): Promise<PaginatedResponse<Classroom>> {
    return this.request("/get-classrooms", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async addClassroomStudent(
    assignments: Array<{ classroom: string; student: string }>,
  ): Promise<ApiResponse<void>> {
    return this.request("/add-classroom-student", {
      method: "POST",
      body: JSON.stringify(assignments),
    });
  }

  // Group Management Methods
  async createGroups(
    groups: Omit<Group, "id" | "createdAt" | "updatedAt">[],
  ): Promise<ApiResponse<Group[]>> {
    return this.request("/create-group", {
      method: "POST",
      body: JSON.stringify(groups),
    });
  }

  async updateGroup(params: {
    groupId: string;
    groupData: Partial<Group>;
  }): Promise<ApiResponse<Group>> {
    return this.request("/update-group", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    return this.request("/delete-group", {
      method: "DELETE",
      body: JSON.stringify({ groupId }),
    });
  }

  async addGroupStudent(
    assignments: Array<{ student: string; group: string }>,
  ): Promise<ApiResponse<void>> {
    return this.request("/add-group-student", {
      method: "POST",
      body: JSON.stringify(assignments),
    });
  }

  async addGroupClassroom(
    assignments: Array<{ classroom: string; group: string }>,
  ): Promise<ApiResponse<void>> {
    return this.request("/add-group-classroom", {
      method: "POST",
      body: JSON.stringify(assignments),
    });
  }

  // Marks Management Methods
  async createMark(
    mark: Omit<Mark, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Mark>> {
    return this.request("/mark/create-mark", {
      method: "POST",
      body: JSON.stringify(mark),
    });
  }

  async updateMark(params: {
    markId: string;
    markData: Partial<Mark>;
  }): Promise<ApiResponse<Mark>> {
    return this.request("/mark/update-mark", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async deleteMark(markId: string): Promise<ApiResponse<void>> {
    return this.request("/mark/delete-mark", {
      method: "DELETE",
      body: JSON.stringify({ markId }),
    });
  }

  async getStudentMarks(params: {
    studentId: string;
    classroomId?: string;
    groupId?: string;
  }): Promise<ApiResponse<Mark[]>> {
    return this.request("/mark/get-student-marks", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getGroupMarks(groupId: string): Promise<ApiResponse<Mark[]>> {
    return this.request("/mark/get-group-marks", {
      method: "POST",
      body: JSON.stringify({ groupId }),
    });
  }

  async updateStudentMark(params: {
    studentId: string;
    markId: string;
    markData: Partial<Mark>;
  }): Promise<ApiResponse<Mark>> {
    return this.request("/mark/update-student-mark", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async updateGroupMark(params: {
    groupId: string;
    markId: string;
    markData: Partial<Mark>;
  }): Promise<ApiResponse<Mark>> {
    return this.request("/mark/update-group-mark", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async updateGroupExemption(params: {
    groupId: string;
    studentId: string;
    isExempted: boolean;
  }): Promise<ApiResponse<void>> {
    return this.request("/mark/update-group-exemption", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Attendance Management Methods
  async addStudentAttendance(
    attendance: Omit<Attendance, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Attendance>> {
    return this.request("/attendance/add-student-attendance", {
      method: "POST",
      body: JSON.stringify(attendance),
    });
  }

  async updateStudentAttendance(params: {
    attendanceId: string;
    attendanceData: Partial<Attendance>;
  }): Promise<ApiResponse<Attendance>> {
    return this.request("/attendance/update-student-attendance", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getStudentAttendance(params: {
    studentId: string;
    dateRange?: { start: number; end: number };
  }): Promise<ApiResponse<Attendance[]>> {
    return this.request("/attendance/get-attendance-student", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getEventAttendance(
    eventId: string,
  ): Promise<ApiResponse<Attendance[]>> {
    return this.request("/attendance/get-attendance-event", {
      method: "POST",
      body: JSON.stringify({ eventId }),
    });
  }

  async getClassroomAttendance(params: {
    classroomId: string;
    date?: number;
  }): Promise<ApiResponse<Attendance[]>> {
    return this.request("/attendance/get-attendance-classroom", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Posts Management Methods
  async createPost(
    post: Omit<Post, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Post>> {
    return this.request("/post/create-post", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  async updatePost(params: {
    postId: string;
    postData: Partial<Post>;
  }): Promise<ApiResponse<Post>> {
    return this.request("/post/update-post", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return this.request("/post/delete-post", {
      method: "DELETE",
      body: JSON.stringify({ postId }),
    });
  }

  async getPosts(params: {
    classroomId?: string;
    groupId?: string;
    type?: string;
  }): Promise<ApiResponse<Post[]>> {
    return this.request("/post/get-posts", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getStudentPosts(studentId: string): Promise<ApiResponse<Post[]>> {
    return this.request("/post/get-posts-student", {
      method: "POST",
      body: JSON.stringify({ studentId }),
    });
  }

  async getGroupPosts(groupId: string): Promise<ApiResponse<Post[]>> {
    return this.request("/post/get-group-posts", {
      method: "POST",
      body: JSON.stringify({ groupId }),
    });
  }

  async submitHomework(params: {
    postId: string;
    studentId: string;
    submission: any;
  }): Promise<ApiResponse<void>> {
    return this.request("/post/submit-homework", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async submitQuiz(params: {
    postId: string;
    studentId: string;
    answers: any[];
  }): Promise<ApiResponse<void>> {
    return this.request("/post/submit-quiz", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async submitPoll(params: {
    postId: string;
    studentId: string;
    choice: string;
  }): Promise<ApiResponse<void>> {
    return this.request("/post/submit-poll", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async interactWithPost(params: {
    postId: string;
    userId: string;
    interaction: "like" | "dislike";
  }): Promise<ApiResponse<void>> {
    return this.request("/post/interact-post", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getHomeworksAndQuizzes(params: {
    classroomId?: string;
    groupId?: string;
    studentId?: string;
  }): Promise<ApiResponse<Post[]>> {
    return this.request("/post/get-homeworks-quizs", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}

// Custom error class
export class ClassroomApiError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = "ClassroomApiError";
    this.code = code;
    this.details = details;
  }
}

// Export singleton instance
export const classroomApi = new ClassroomApiService();

// Export error handling utility
export const handleApiError = (error: any): ApiError => {
  if (error instanceof ClassroomApiError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error?.response) {
    return {
      message: error.response.data?.message || "API request failed",
      code: error.response.status?.toString() || "UNKNOWN",
      details: error.response.data,
    };
  }

  return {
    message: error?.message || "Network error occurred",
    code: "NETWORK_ERROR",
    details: error,
  };
};

// Retry utility for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on authentication errors
      if (error instanceof ClassroomApiError && error.code === "401") {
        throw error;
      }

      if (i < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i)),
        );
      }
    }
  }

  throw lastError!;
};
