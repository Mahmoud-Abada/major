// Mock API service with CRUD operations
import {
    mockAttendance,
    mockClassrooms,
    mockGroups,
    mockMarks,
    mockNotifications,
    mockPosts,
    mockUsers,
    type Attendance,
    type Classroom,
    type Group,
    type Mark,
    type Notification,
    type Post,
    type User,
} from "@/data/mock";

// Generic CRUD interface
interface CrudOperations<T> {
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  read(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  list(filters?: any): Promise<T[]>;
}

// Utility functions
const generateId = (prefix: string = ""): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}${prefix ? "-" : ""}${timestamp}-${random}`;
};

const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const addTimestamps = <T>(
  data: T,
): T & { createdAt: Date; updatedAt: Date } => {
  const now = new Date();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

const updateTimestamp = <T>(data: T): T & { updatedAt: Date } => {
  return {
    ...data,
    updatedAt: new Date(),
  };
};

// User API
export class MockUserApi implements CrudOperations<User> {
  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    await simulateDelay();

    const newUser: User = {
      id: generateId("user"),
      ...addTimestamps(data),
    };

    mockUsers.push(newUser);
    return newUser;
  }

  async read(id: string): Promise<User | null> {
    await simulateDelay();
    return mockUsers.find((user) => user.id === id) || null;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await simulateDelay();

    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    mockUsers[userIndex] = updateTimestamp({
      ...mockUsers[userIndex],
      ...data,
    });
    return mockUsers[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    mockUsers.splice(userIndex, 1);
    return true;
  }

  async list(filters?: {
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    await simulateDelay();

    let filteredUsers = [...mockUsers];

    if (filters?.role) {
      filteredUsers = filteredUsers.filter(
        (user) => user.role === filters.role,
      );
    }

    if (filters?.status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === filters.status,
      );
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      );
    }

    // Sort by creation date (newest first)
    filteredUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    if (filters?.offset !== undefined) {
      const start = filters.offset;
      const end = filters.limit ? start + filters.limit : undefined;
      filteredUsers = filteredUsers.slice(start, end);
    }

    return filteredUsers;
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    await simulateDelay(500); // Simulate auth delay

    // Mock authentication - in real app, this would verify hashed password
    const user = mockUsers.find((u) => u.email === email);
    if (user && user.password === password) {
      // Check if account is active
      if (user.status !== "active") {
        throw new Error(`Account is ${user.status}. Please contact support.`);
      }

      // Check if account is locked
      if (user.lockedUntil && new Date() < user.lockedUntil) {
        throw new Error("Account is temporarily locked due to too many failed attempts.");
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        throw new Error("Please verify your email address before signing in.");
      }

      // Update last login and reset failed attempts
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;

      return user;
    }

    // Increment failed login attempts for existing user
    if (user) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.updatedAt = new Date();
      
      // Lock account after 5 failed attempts for 30 minutes
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
    }

    return null;
  }
}

// Classroom API
export class MockClassroomApi implements CrudOperations<Classroom> {
  async create(
    data: Omit<Classroom, "id" | "createdAt" | "updatedAt">,
  ): Promise<Classroom> {
    await simulateDelay();

    const newClassroom: Classroom = {
      id: generateId("classroom"),
      ...addTimestamps(data),
    };

    mockClassrooms.push(newClassroom);
    return newClassroom;
  }

  async read(id: string): Promise<Classroom | null> {
    await simulateDelay();
    return mockClassrooms.find((classroom) => classroom.id === id) || null;
  }

  async update(
    id: string,
    data: Partial<Classroom>,
  ): Promise<Classroom | null> {
    await simulateDelay();

    const classroomIndex = mockClassrooms.findIndex(
      (classroom) => classroom.id === id,
    );
    if (classroomIndex === -1) return null;

    mockClassrooms[classroomIndex] = updateTimestamp({
      ...mockClassrooms[classroomIndex],
      ...data,
    });
    return mockClassrooms[classroomIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const classroomIndex = mockClassrooms.findIndex(
      (classroom) => classroom.id === id,
    );
    if (classroomIndex === -1) return false;

    mockClassrooms.splice(classroomIndex, 1);
    return true;
  }

  async list(filters?: {
    teacher?: string;
    school?: string;
    field?: string;
    level?: string;
    status?: "active" | "archived";
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Classroom[]> {
    await simulateDelay();

    let filteredClassrooms = [...mockClassrooms];

    if (filters?.teacher) {
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) => classroom.teacher === filters.teacher,
      );
    }

    if (filters?.school) {
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) => classroom.school === filters.school,
      );
    }

    if (filters?.field) {
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) => classroom.field === filters.field,
      );
    }

    if (filters?.level) {
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) => classroom.level === filters.level,
      );
    }

    if (filters?.status) {
      const isArchived = filters.status === "archived";
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) => classroom.isArchived === isArchived,
      );
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) =>
          classroom.title.toLowerCase().includes(searchTerm) ||
          classroom.field.toLowerCase().includes(searchTerm) ||
          classroom.teacherName.toLowerCase().includes(searchTerm),
      );
    }

    // Sort by creation date (newest first)
    filteredClassrooms.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Apply pagination
    if (filters?.offset !== undefined) {
      const start = filters.offset;
      const end = filters.limit ? start + filters.limit : undefined;
      filteredClassrooms = filteredClassrooms.slice(start, end);
    }

    return filteredClassrooms;
  }

  async addStudent(classroomId: string, studentId: string): Promise<boolean> {
    await simulateDelay();

    const classroom = mockClassrooms.find((c) => c.id === classroomId);
    if (!classroom) return false;

    if (!classroom.students.includes(studentId)) {
      classroom.students.push(studentId);
      classroom.currentStudents = classroom.students.length;
      classroom.updatedAt = new Date();
    }

    return true;
  }

  async removeStudent(
    classroomId: string,
    studentId: string,
  ): Promise<boolean> {
    await simulateDelay();

    const classroom = mockClassrooms.find((c) => c.id === classroomId);
    if (!classroom) return false;

    const studentIndex = classroom.students.indexOf(studentId);
    if (studentIndex > -1) {
      classroom.students.splice(studentIndex, 1);
      classroom.currentStudents = classroom.students.length;
      classroom.updatedAt = new Date();
    }

    return true;
  }
}

// Similar implementations for other entities...
export class MockGroupApi implements CrudOperations<Group> {
  async create(
    data: Omit<Group, "id" | "createdAt" | "updatedAt">,
  ): Promise<Group> {
    await simulateDelay();

    const newGroup: Group = {
      id: generateId("group"),
      ...addTimestamps(data),
    };

    mockGroups.push(newGroup);
    return newGroup;
  }

  async read(id: string): Promise<Group | null> {
    await simulateDelay();
    return mockGroups.find((group) => group.id === id) || null;
  }

  async update(id: string, data: Partial<Group>): Promise<Group | null> {
    await simulateDelay();

    const groupIndex = mockGroups.findIndex((group) => group.id === id);
    if (groupIndex === -1) return null;

    mockGroups[groupIndex] = updateTimestamp({
      ...mockGroups[groupIndex],
      ...data,
    });
    return mockGroups[groupIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const groupIndex = mockGroups.findIndex((group) => group.id === id);
    if (groupIndex === -1) return false;

    mockGroups.splice(groupIndex, 1);
    return true;
  }

  async list(filters?: any): Promise<Group[]> {
    await simulateDelay();

    let filteredGroups = [...mockGroups];

    if (filters?.school) {
      filteredGroups = filteredGroups.filter(
        (group) => group.school === filters.school,
      );
    }

    if (filters?.field) {
      filteredGroups = filteredGroups.filter(
        (group) => group.field === filters.field,
      );
    }

    if (filters?.status) {
      const isArchived = filters.status === "archived";
      filteredGroups = filteredGroups.filter(
        (group) => group.isArchived === isArchived,
      );
    }

    return filteredGroups;
  }
}

// Post API
export class MockPostApi implements CrudOperations<Post> {
  async create(
    data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  ): Promise<Post> {
    await simulateDelay();

    const newPost: Post = {
      id: generateId("post"),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      ...addTimestamps(data),
    };

    mockPosts.push(newPost);
    return newPost;
  }

  async read(id: string): Promise<Post | null> {
    await simulateDelay();
    return mockPosts.find((post) => post.id === id) || null;
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    await simulateDelay();

    const postIndex = mockPosts.findIndex((post) => post.id === id);
    if (postIndex === -1) return null;

    mockPosts[postIndex] = updateTimestamp({
      ...mockPosts[postIndex],
      ...data,
    });
    return mockPosts[postIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const postIndex = mockPosts.findIndex((post) => post.id === id);
    if (postIndex === -1) return false;

    mockPosts.splice(postIndex, 1);
    return true;
  }

  async list(filters?: {
    classroom?: string;
    group?: string;
    author?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<Post[]> {
    await simulateDelay();

    let filteredPosts = [...mockPosts];

    if (filters?.classroom) {
      filteredPosts = filteredPosts.filter(
        (post) => post.classroom === filters.classroom,
      );
    }

    if (filters?.group) {
      filteredPosts = filteredPosts.filter(
        (post) => post.group === filters.group,
      );
    }

    if (filters?.author) {
      filteredPosts = filteredPosts.filter(
        (post) => post.author === filters.author,
      );
    }

    if (filters?.type) {
      filteredPosts = filteredPosts.filter(
        (post) => post.type === filters.type,
      );
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    if (filters?.offset !== undefined) {
      const start = filters.offset;
      const end = filters.limit ? start + filters.limit : undefined;
      filteredPosts = filteredPosts.slice(start, end);
    }

    return filteredPosts;
  }

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    await simulateDelay();

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) return false;

    post.isLiked = !post.isLiked;
    post.likesCount = (post.likesCount || 0) + (post.isLiked ? 1 : -1);
    post.updatedAt = new Date();

    return true;
  }
}

// Mark API
export class MockMarkApi implements CrudOperations<Mark> {
  async create(
    data: Omit<Mark, "id" | "createdAt" | "updatedAt">,
  ): Promise<Mark> {
    await simulateDelay();

    const newMark: Mark = {
      id: generateId("mark"),
      ...addTimestamps(data),
    };

    mockMarks.push(newMark);
    return newMark;
  }

  async read(id: string): Promise<Mark | null> {
    await simulateDelay();
    return mockMarks.find((mark) => mark.id === id) || null;
  }

  async update(id: string, data: Partial<Mark>): Promise<Mark | null> {
    await simulateDelay();

    const markIndex = mockMarks.findIndex((mark) => mark.id === id);
    if (markIndex === -1) return null;

    mockMarks[markIndex] = updateTimestamp({
      ...mockMarks[markIndex],
      ...data,
    });
    return mockMarks[markIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const markIndex = mockMarks.findIndex((mark) => mark.id === id);
    if (markIndex === -1) return false;

    mockMarks.splice(markIndex, 1);
    return true;
  }

  async list(filters?: {
    student?: string;
    classroom?: string;
    subject?: string;
    markType?: string;
    term?: string;
    limit?: number;
    offset?: number;
  }): Promise<Mark[]> {
    await simulateDelay();

    let filteredMarks = [...mockMarks];

    if (filters?.student) {
      filteredMarks = filteredMarks.filter(
        (mark) => mark.student === filters.student,
      );
    }

    if (filters?.classroom) {
      filteredMarks = filteredMarks.filter(
        (mark) => mark.classroom === filters.classroom,
      );
    }

    if (filters?.subject) {
      filteredMarks = filteredMarks.filter(
        (mark) => mark.subject === filters.subject,
      );
    }

    if (filters?.markType) {
      filteredMarks = filteredMarks.filter(
        (mark) => mark.markType === filters.markType,
      );
    }

    if (filters?.term) {
      filteredMarks = filteredMarks.filter(
        (mark) => mark.term === filters.term,
      );
    }

    // Sort by date (newest first)
    filteredMarks.sort((a, b) => b.date.getTime() - a.date.getTime());

    return filteredMarks;
  }
}

// Attendance API
export class MockAttendanceApi implements CrudOperations<Attendance> {
  async create(
    data: Omit<Attendance, "id" | "createdAt" | "updatedAt">,
  ): Promise<Attendance> {
    await simulateDelay();

    const newAttendance: Attendance = {
      id: generateId("attendance"),
      ...addTimestamps(data),
    };

    mockAttendance.push(newAttendance);
    return newAttendance;
  }

  async read(id: string): Promise<Attendance | null> {
    await simulateDelay();
    return mockAttendance.find((attendance) => attendance.id === id) || null;
  }

  async update(
    id: string,
    data: Partial<Attendance>,
  ): Promise<Attendance | null> {
    await simulateDelay();

    const attendanceIndex = mockAttendance.findIndex(
      (attendance) => attendance.id === id,
    );
    if (attendanceIndex === -1) return null;

    mockAttendance[attendanceIndex] = updateTimestamp({
      ...mockAttendance[attendanceIndex],
      ...data,
    });
    return mockAttendance[attendanceIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const attendanceIndex = mockAttendance.findIndex(
      (attendance) => attendance.id === id,
    );
    if (attendanceIndex === -1) return false;

    mockAttendance.splice(attendanceIndex, 1);
    return true;
  }

  async list(filters?: {
    student?: string;
    classroom?: string;
    group?: string;
    date?: Date;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Attendance[]> {
    await simulateDelay();

    let filteredAttendance = [...mockAttendance];

    if (filters?.student) {
      filteredAttendance = filteredAttendance.filter(
        (attendance) => attendance.student === filters.student,
      );
    }

    if (filters?.classroom) {
      filteredAttendance = filteredAttendance.filter(
        (attendance) => attendance.classroom === filters.classroom,
      );
    }

    if (filters?.group) {
      filteredAttendance = filteredAttendance.filter(
        (attendance) => attendance.group === filters.group,
      );
    }

    if (filters?.date) {
      const targetDate = filters.date.toDateString();
      filteredAttendance = filteredAttendance.filter(
        (attendance) => attendance.date.toDateString() === targetDate,
      );
    }

    if (filters?.status) {
      filteredAttendance = filteredAttendance.filter(
        (attendance) => attendance.status === filters.status,
      );
    }

    // Sort by date (newest first)
    filteredAttendance.sort((a, b) => b.date.getTime() - a.date.getTime());

    return filteredAttendance;
  }
}

// Notification API
export class MockNotificationApi implements CrudOperations<Notification> {
  async create(
    data: Omit<Notification, "id" | "createdAt" | "updatedAt">,
  ): Promise<Notification> {
    await simulateDelay();

    const newNotification: Notification = {
      id: generateId("notification"),
      createdAt: new Date(),
      ...data,
    };

    mockNotifications.push(newNotification);
    return newNotification;
  }

  async read(id: string): Promise<Notification | null> {
    await simulateDelay();
    return (
      mockNotifications.find((notification) => notification.id === id) || null
    );
  }

  async update(
    id: string,
    data: Partial<Notification>,
  ): Promise<Notification | null> {
    await simulateDelay();

    const notificationIndex = mockNotifications.findIndex(
      (notification) => notification.id === id,
    );
    if (notificationIndex === -1) return null;

    mockNotifications[notificationIndex] = {
      ...mockNotifications[notificationIndex],
      ...data,
    };
    return mockNotifications[notificationIndex];
  }

  async delete(id: string): Promise<boolean> {
    await simulateDelay();

    const notificationIndex = mockNotifications.findIndex(
      (notification) => notification.id === id,
    );
    if (notificationIndex === -1) return false;

    mockNotifications.splice(notificationIndex, 1);
    return true;
  }

  async list(filters?: {
    recipient?: string;
    type?: string;
    category?: string;
    isRead?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    await simulateDelay();

    let filteredNotifications = [...mockNotifications];

    if (filters?.recipient) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.recipient === filters.recipient,
      );
    }

    if (filters?.type) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.type === filters.type,
      );
    }

    if (filters?.category) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.category === filters.category,
      );
    }

    if (filters?.isRead !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.isRead === filters.isRead,
      );
    }

    // Sort by creation date (newest first)
    filteredNotifications.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Apply pagination
    if (filters?.offset !== undefined) {
      const start = filters.offset;
      const end = filters.limit ? start + filters.limit : undefined;
      filteredNotifications = filteredNotifications.slice(start, end);
    }

    return filteredNotifications;
  }

  async markAsRead(id: string): Promise<boolean> {
    await simulateDelay();

    const notification = mockNotifications.find((n) => n.id === id);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      return true;
    }

    return false;
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    await simulateDelay();

    let count = 0;
    mockNotifications.forEach((notification) => {
      if (notification.recipient === recipientId && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        count++;
      }
    });

    return count;
  }
}

// Export API instances
export const mockUserApi = new MockUserApi();
export const mockClassroomApi = new MockClassroomApi();
export const mockGroupApi = new MockGroupApi();
export const mockPostApi = new MockPostApi();
export const mockMarkApi = new MockMarkApi();
export const mockAttendanceApi = new MockAttendanceApi();
export const mockNotificationApi = new MockNotificationApi();

// Combined API object for easy access
export const mockApi = {
  users: mockUserApi,
  classrooms: mockClassroomApi,
  groups: mockGroupApi,
  posts: mockPostApi,
  marks: mockMarkApi,
  attendance: mockAttendanceApi,
  notifications: mockNotificationApi,
};
