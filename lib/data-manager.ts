// Central data management with storage persistence
import {
  mockAttendance,
  mockClassrooms,
  mockGroups,
  mockMarks,
  mockNotifications,
  mockPosts,
  mockUsers,
  type Classroom,
  type Group,
  type User,
} from "@/data/mock";
import { storage, STORAGE_KEYS } from "./storage";

// Data synchronization manager
export class DataManager {
  private initialized = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeData();
  }

  // Initialize data from storage or use defaults
  private initializeData(): void {
    if (this.initialized) return;

    try {
      // Load persisted data or use defaults
      const persistedUsers = storage.loadData(STORAGE_KEYS.USERS, mockUsers);
      const persistedClassrooms = storage.loadData(
        STORAGE_KEYS.CLASSROOMS,
        mockClassrooms,
      );
      const persistedGroups = storage.loadData(STORAGE_KEYS.GROUPS, mockGroups);
      const persistedPosts = storage.loadData(STORAGE_KEYS.POSTS, mockPosts);
      const persistedMarks = storage.loadData(STORAGE_KEYS.MARKS, mockMarks);
      const persistedAttendance = storage.loadData(
        STORAGE_KEYS.ATTENDANCE,
        mockAttendance,
      );
      const persistedNotifications = storage.loadData(
        STORAGE_KEYS.NOTIFICATIONS,
        mockNotifications,
      );

      // Update mock data arrays with persisted data
      mockUsers.splice(0, mockUsers.length, ...persistedUsers);
      mockClassrooms.splice(0, mockClassrooms.length, ...persistedClassrooms);
      mockGroups.splice(0, mockGroups.length, ...persistedGroups);
      mockPosts.splice(0, mockPosts.length, ...persistedPosts);
      mockMarks.splice(0, mockMarks.length, ...persistedMarks);
      mockAttendance.splice(0, mockAttendance.length, ...persistedAttendance);
      mockNotifications.splice(
        0,
        mockNotifications.length,
        ...persistedNotifications,
      );

      this.initialized = true;

      // Start auto-sync
      this.startAutoSync();

      console.log("Data manager initialized with persisted data");
    } catch (error) {
      console.error("Error initializing data manager:", error);
      this.initialized = true; // Continue with default data
    }
  }

  // Persist all data to storage
  public persistData(): void {
    try {
      storage.persistData(STORAGE_KEYS.USERS, mockUsers);
      storage.persistData(STORAGE_KEYS.CLASSROOMS, mockClassrooms);
      storage.persistData(STORAGE_KEYS.GROUPS, mockGroups);
      storage.persistData(STORAGE_KEYS.POSTS, mockPosts);
      storage.persistData(STORAGE_KEYS.MARKS, mockMarks);
      storage.persistData(STORAGE_KEYS.ATTENDANCE, mockAttendance);
      storage.persistData(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);

      console.log("Data persisted to storage");
    } catch (error) {
      console.error("Error persisting data:", error);
    }
  }

  // Auto-sync data every 30 seconds
  private startAutoSync(): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.persistData();
    }, 30000); // 30 seconds
  }

  public stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Reset all data to defaults
  public resetData(): void {
    try {
      storage.clearLocal();

      // Reset to original mock data
      const originalUsers = [...mockUsers];
      const originalClassrooms = [...mockClassrooms];
      const originalGroups = [...mockGroups];
      const originalPosts = [...mockPosts];
      const originalMarks = [...mockMarks];
      const originalAttendance = [...mockAttendance];
      const originalNotifications = [...mockNotifications];

      mockUsers.splice(0, mockUsers.length, ...originalUsers);
      mockClassrooms.splice(0, mockClassrooms.length, ...originalClassrooms);
      mockGroups.splice(0, mockGroups.length, ...originalGroups);
      mockPosts.splice(0, mockPosts.length, ...originalPosts);
      mockMarks.splice(0, mockMarks.length, ...originalMarks);
      mockAttendance.splice(0, mockAttendance.length, ...originalAttendance);
      mockNotifications.splice(
        0,
        mockNotifications.length,
        ...originalNotifications,
      );

      this.persistData();

      console.log("Data reset to defaults");
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  }

  // Export all data
  public exportData(): string {
    const exportData = {
      users: mockUsers,
      classrooms: mockClassrooms,
      groups: mockGroups,
      posts: mockPosts,
      marks: mockMarks,
      attendance: mockAttendance,
      notifications: mockNotifications,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Import data from JSON
  public importData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);

      if (importedData.users) {
        mockUsers.splice(0, mockUsers.length, ...importedData.users);
      }
      if (importedData.classrooms) {
        mockClassrooms.splice(
          0,
          mockClassrooms.length,
          ...importedData.classrooms,
        );
      }
      if (importedData.groups) {
        mockGroups.splice(0, mockGroups.length, ...importedData.groups);
      }
      if (importedData.posts) {
        mockPosts.splice(0, mockPosts.length, ...importedData.posts);
      }
      if (importedData.marks) {
        mockMarks.splice(0, mockMarks.length, ...importedData.marks);
      }
      if (importedData.attendance) {
        mockAttendance.splice(
          0,
          mockAttendance.length,
          ...importedData.attendance,
        );
      }
      if (importedData.notifications) {
        mockNotifications.splice(
          0,
          mockNotifications.length,
          ...importedData.notifications,
        );
      }

      this.persistData();

      console.log("Data imported successfully");
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  // Get data statistics
  public getDataStats() {
    return {
      users: {
        total: mockUsers.length,
        admins: mockUsers.filter((u) => u.role === "admin").length,
        teachers: mockUsers.filter((u) => u.role === "teacher").length,
        students: mockUsers.filter((u) => u.role === "student").length,
        parents: mockUsers.filter((u) => u.role === "parent").length,
        active: mockUsers.filter((u) => u.status === "active").length,
      },
      classrooms: {
        total: mockClassrooms.length,
        active: mockClassrooms.filter((c) => !c.isArchived).length,
        archived: mockClassrooms.filter((c) => c.isArchived).length,
      },
      groups: {
        total: mockGroups.length,
        active: mockGroups.filter((g) => !g.isArchived).length,
        archived: mockGroups.filter((g) => g.isArchived).length,
      },
      posts: {
        total: mockPosts.length,
        published: mockPosts.filter((p) => p.isPublished).length,
        byType: {
          announcement: mockPosts.filter((p) => p.type === "announcement")
            .length,
          homework: mockPosts.filter((p) => p.type === "homework").length,
          quiz: mockPosts.filter((p) => p.type === "quiz").length,
          poll: mockPosts.filter((p) => p.type === "poll").length,
          material: mockPosts.filter((p) => p.type === "material").length,
        },
      },
      marks: {
        total: mockMarks.length,
        byType: {
          exam: mockMarks.filter((m) => m.markType === "exam").length,
          homework: mockMarks.filter((m) => m.markType === "homework").length,
          quiz: mockMarks.filter((m) => m.markType === "quiz").length,
          participation: mockMarks.filter((m) => m.markType === "participation")
            .length,
          project: mockMarks.filter((m) => m.markType === "project").length,
        },
      },
      attendance: {
        total: mockAttendance.length,
        present: mockAttendance.filter((a) => a.status === "present").length,
        absent: mockAttendance.filter((a) => a.status === "absent").length,
        late: mockAttendance.filter((a) => a.status === "late").length,
        excused: mockAttendance.filter((a) => a.status === "excused").length,
      },
      notifications: {
        total: mockNotifications.length,
        unread: mockNotifications.filter((n) => !n.isRead).length,
        byType: {
          info: mockNotifications.filter((n) => n.type === "info").length,
          success: mockNotifications.filter((n) => n.type === "success").length,
          warning: mockNotifications.filter((n) => n.type === "warning").length,
          error: mockNotifications.filter((n) => n.type === "error").length,
          announcement: mockNotifications.filter(
            (n) => n.type === "announcement",
          ).length,
        },
      },
      storage: {
        size: storage.getStorageSize("localStorage"),
        available: storage.isStorageAvailable("localStorage"),
      },
    };
  }

  // Data validation and cleanup
  public validateData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Validate users
      mockUsers.forEach((user, index) => {
        if (!user.id || !user.email || !user.firstName || !user.lastName) {
          errors.push(
            `Invalid user at index ${index}: missing required fields`,
          );
        }
        if (!["admin", "teacher", "student", "parent"].includes(user.role)) {
          errors.push(`Invalid user role at index ${index}: ${user.role}`);
        }
      });

      // Validate classrooms
      mockClassrooms.forEach((classroom, index) => {
        if (!classroom.id || !classroom.title || !classroom.teacher) {
          errors.push(
            `Invalid classroom at index ${index}: missing required fields`,
          );
        }
        if (!mockUsers.find((u) => u.id === classroom.teacher)) {
          errors.push(
            `Invalid classroom teacher reference at index ${index}: ${classroom.teacher}`,
          );
        }
      });

      // Validate groups
      mockGroups.forEach((group, index) => {
        if (!group.id || !group.title || !group.school) {
          errors.push(
            `Invalid group at index ${index}: missing required fields`,
          );
        }
      });

      // Validate posts
      mockPosts.forEach((post, index) => {
        if (!post.id || !post.title || !post.author) {
          errors.push(
            `Invalid post at index ${index}: missing required fields`,
          );
        }
        if (!mockUsers.find((u) => u.id === post.author)) {
          errors.push(
            `Invalid post author reference at index ${index}: ${post.author}`,
          );
        }
      });

      // Validate marks
      mockMarks.forEach((mark, index) => {
        if (
          !mark.id ||
          !mark.student ||
          mark.value === undefined ||
          mark.maxValue === undefined
        ) {
          errors.push(
            `Invalid mark at index ${index}: missing required fields`,
          );
        }
        if (!mockUsers.find((u) => u.id === mark.student)) {
          errors.push(
            `Invalid mark student reference at index ${index}: ${mark.student}`,
          );
        }
      });

      // Validate attendance
      mockAttendance.forEach((attendance, index) => {
        if (!attendance.id || !attendance.student || !attendance.status) {
          errors.push(
            `Invalid attendance at index ${index}: missing required fields`,
          );
        }
        if (!mockUsers.find((u) => u.id === attendance.student)) {
          errors.push(
            `Invalid attendance student reference at index ${index}: ${attendance.student}`,
          );
        }
      });

      // Validate notifications
      mockNotifications.forEach((notification, index) => {
        if (
          !notification.id ||
          !notification.recipient ||
          !notification.title
        ) {
          errors.push(
            `Invalid notification at index ${index}: missing required fields`,
          );
        }
        if (!mockUsers.find((u) => u.id === notification.recipient)) {
          errors.push(
            `Invalid notification recipient reference at index ${index}: ${notification.recipient}`,
          );
        }
      });
    } catch (error) {
      errors.push(`Validation error: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Cleanup orphaned references
  public cleanupData(): number {
    let cleanupCount = 0;

    try {
      // Get valid user IDs
      const validUserIds = new Set(mockUsers.map((u) => u.id));
      const validClassroomIds = new Set(mockClassrooms.map((c) => c.id));
      const validGroupIds = new Set(mockGroups.map((g) => g.id));

      // Clean up classroom references
      mockClassrooms.forEach((classroom) => {
        if (!validUserIds.has(classroom.teacher)) {
          classroom.teacher =
            mockUsers.find((u) => u.role === "teacher")?.id || "";
          cleanupCount++;
        }

        classroom.students = classroom.students.filter((studentId) => {
          const isValid = validUserIds.has(studentId);
          if (!isValid) cleanupCount++;
          return isValid;
        });
      });

      // Clean up group references
      mockGroups.forEach((group) => {
        group.members = group.members.filter((memberId) => {
          const isValid = validUserIds.has(memberId);
          if (!isValid) cleanupCount++;
          return isValid;
        });

        group.classrooms = group.classrooms.filter((classroomId) => {
          const isValid = validClassroomIds.has(classroomId);
          if (!isValid) cleanupCount++;
          return isValid;
        });
      });

      // Clean up post references
      const validPostIds = new Set(mockPosts.map((p) => p.id));
      mockPosts.forEach((post) => {
        if (!validUserIds.has(post.author)) {
          // Remove posts with invalid authors
          const postIndex = mockPosts.findIndex((p) => p.id === post.id);
          if (postIndex > -1) {
            mockPosts.splice(postIndex, 1);
            cleanupCount++;
          }
        }
      });

      // Clean up mark references
      mockMarks.forEach((mark, index) => {
        if (!validUserIds.has(mark.student)) {
          mockMarks.splice(index, 1);
          cleanupCount++;
        }
      });

      // Clean up attendance references
      mockAttendance.forEach((attendance, index) => {
        if (!validUserIds.has(attendance.student)) {
          mockAttendance.splice(index, 1);
          cleanupCount++;
        }
      });

      // Clean up notification references
      mockNotifications.forEach((notification, index) => {
        if (!validUserIds.has(notification.recipient)) {
          mockNotifications.splice(index, 1);
          cleanupCount++;
        }
      });

      if (cleanupCount > 0) {
        this.persistData();
        console.log(`Cleaned up ${cleanupCount} orphaned references`);
      }
    } catch (error) {
      console.error("Error during data cleanup:", error);
    }

    return cleanupCount;
  }

  // Destroy the data manager
  public destroy(): void {
    this.stopAutoSync();
    this.persistData(); // Final save
    this.initialized = false;
  }
}

// Create singleton instance
export const dataManager = new DataManager();

// Auto-cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    dataManager.destroy();
  });

  // Also cleanup on visibility change (mobile apps)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      dataManager.persistData();
    }
  });
}

// Export utility functions
export const dataUtils = {
  // Generate realistic mock data
  generateUser: (
    role: User["role"],
    overrides: Partial<User> = {},
  ): Omit<User, "id" | "createdAt" | "updatedAt"> => {
    const baseUser = {
      firstName: "Generated",
      lastName: "User",
      email: `user${Date.now()}@example.com`,
      role,
      status: "active" as const,
      ...overrides,
    };

    return baseUser;
  },

  generateClassroom: (
    teacherId: string,
    overrides: Partial<Classroom> = {},
  ): Omit<Classroom, "id" | "createdAt" | "updatedAt"> => {
    const teacher = mockUsers.find((u) => u.id === teacherId);

    return {
      teacher: teacherId,
      teacherName: teacher
        ? `${teacher.firstName} ${teacher.lastName}`
        : "Unknown Teacher",
      title: "Generated Classroom",
      location: {
        coordinates: { lat: 36.75, long: 3.06 },
        wilaya: "Alger",
        commune: "El Madania",
      },
      isArchived: false,
      field: "General",
      level: "High School",
      color: "#3498db",
      price: 3000,
      schedule: [{ day: "Monday", startTime: "14:00", endTime: "16:00" }],
      mode: "monthly" as const,
      perDuration: 30,
      students: [],
      subjects: [],
      ...overrides,
    };
  },

  // Data relationship helpers
  getUserClassrooms: (userId: string): Classroom[] => {
    return mockClassrooms.filter(
      (c) => c.teacher === userId || c.students.includes(userId),
    );
  },

  getUserGroups: (userId: string): Group[] => {
    return mockGroups.filter((g) => g.members.includes(userId));
  },

  getClassroomStudents: (classroomId: string): User[] => {
    const classroom = mockClassrooms.find((c) => c.id === classroomId);
    if (!classroom) return [];

    return mockUsers.filter((u) => classroom.students.includes(u.id));
  },

  // Search helpers
  searchUsers: (query: string, role?: User["role"]): User[] => {
    const searchTerm = query.toLowerCase();
    let users = mockUsers;

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm),
    );
  },

  searchClassrooms: (query: string): Classroom[] => {
    const searchTerm = query.toLowerCase();
    return mockClassrooms.filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm) ||
        c.field.toLowerCase().includes(searchTerm) ||
        c.teacherName.toLowerCase().includes(searchTerm),
    );
  },
};
