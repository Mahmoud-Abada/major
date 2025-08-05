"use client";

// Import User types from auth service
import { AdminUser, ParentUser, StudentUser, TeacherUser, User } from "@/lib/auth";

// Empty mock users array - will be replaced with API calls
const mockUsers: User[] = [];

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Storage keys
const STORAGE_KEYS = {
  USERS: 'major_users',
  LAST_ID: 'major_last_user_id'
};

// Get users from localStorage or use mock data
const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return mockUsers;

  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        lastPasswordChange: user.lastPasswordChange ? new Date(user.lastPasswordChange) : undefined,
        lockedUntil: user.lockedUntil ? new Date(user.lockedUntil) : undefined,
        ...(user.role === 'student' && {
          dateOfBirth: new Date(user.dateOfBirth),
          enrollmentDate: new Date(user.enrollmentDate),
        }),
        ...(user.role === 'teacher' && {
          employmentDate: new Date(user.employmentDate),
        }),
      }));
    } catch (error) {
      console.error('Error parsing stored users:', error);
      return mockUsers;
    }
  }
  return mockUsers;
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Generate new user ID
const generateUserId = (role: string): string => {
  if (typeof window === 'undefined') return `${role}-${Date.now()}`;

  const lastId = localStorage.getItem(STORAGE_KEYS.LAST_ID);
  const nextId = lastId ? parseInt(lastId) + 1 : 1000;
  localStorage.setItem(STORAGE_KEYS.LAST_ID, nextId.toString());

  return `${role}-${nextId.toString().padStart(3, '0')}`;
};

// Mock User API Service
export class MockUserApiService {
  // Get all users with optional filtering
  static async getUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
    department?: string;
    subject?: string;
    grade?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    await delay(300); // Simulate API delay

    let users = getStoredUsers();

    // Apply filters
    if (filters) {
      if (filters.role && filters.role !== 'all') {
        users = users.filter(user => user.role === filters.role);
      }

      if (filters.status && filters.status !== 'all') {
        users = users.filter(user => user.status === filters.status);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        users = users.filter(user =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.role === 'student' && (user as StudentUser).studentId?.toLowerCase().includes(searchLower)) ||
          (user.role === 'admin' && (user as AdminUser).department?.toLowerCase().includes(searchLower)) ||
          (user.role === 'teacher' && (user as TeacherUser).subjects?.some(s => s.toLowerCase().includes(searchLower)))
        );
      }

      if (filters.department && filters.department !== 'all') {
        users = users.filter(user =>
          user.role === 'admin' && (user as AdminUser).department === filters.department
        );
      }

      if (filters.subject && filters.subject !== 'all') {
        users = users.filter(user =>
          user.role === 'teacher' && (user as TeacherUser).subjects?.includes(filters.subject)
        );
      }

      if (filters.grade && filters.grade !== 'all') {
        users = users.filter(user =>
          user.role === 'student' && (user as StudentUser).grade === filters.grade
        );
      }
    }

    const total = users.length;

    // Apply pagination
    if (filters?.limit) {
      const offset = filters.offset || 0;
      users = users.slice(offset, offset + filters.limit);
    }

    return {
      users,
      total,
      hasMore: filters?.limit ? (filters.offset || 0) + users.length < total : false,
    };
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    await delay(200);

    const users = getStoredUsers();
    return users.find(user => user.id === id) || null;
  }

  // Create new user
  static async createUser(userData: Partial<User>): Promise<User> {
    await delay(500);

    if (!userData.role) {
      throw new Error('User role is required');
    }

    const users = getStoredUsers();

    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    // Generate student ID for students
    let studentId: string | undefined;
    if (userData.role === 'student') {
      const year = new Date().getFullYear();
      const studentCount = users.filter(u => u.role === 'student').length + 1;
      studentId = `STU${year}${studentCount.toString().padStart(3, '0')}`;
    }

    const newUser: User = {
      id: generateUserId(userData.role),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber,
      avatar: userData.avatar,
      role: userData.role,
      status: userData.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: userData.password || 'defaultPassword123!',
      isEmailVerified: false,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,

      // Role-specific fields
      ...(userData.role === 'admin' && {
        permissions: (userData as AdminUser).permissions || [],
        department: (userData as AdminUser).department,
        position: (userData as AdminUser).position,
      }),

      ...(userData.role === 'teacher' && {
        subjects: (userData as TeacherUser).subjects || [],
        classrooms: (userData as TeacherUser).classrooms || [],
        qualifications: (userData as TeacherUser).qualifications || [],
        bio: (userData as TeacherUser).bio,
        specializations: (userData as TeacherUser).specializations || [],
        employmentDate: new Date(),
        yearsOfExperience: (userData as TeacherUser).yearsOfExperience || 0,
      }),

      ...(userData.role === 'student' && {
        studentId: studentId!,
        grade: (userData as StudentUser).grade || '',
        enrollmentDate: new Date(),
        guardians: (userData as StudentUser).guardians || [],
        dateOfBirth: (userData as StudentUser).dateOfBirth ? new Date(userData.dateOfBirth) : new Date(),
        nationality: (userData as StudentUser).nationality,
        bloodGroup: (userData as StudentUser).bloodGroup,
        address: (userData as StudentUser).address,
        parentName: (userData as StudentUser).parentName,
        parentEmail: (userData as StudentUser).parentEmail,
        parentPhone: (userData as StudentUser).parentPhone,
      }),

      ...(userData.role === 'parent' && {
        children: (userData as ParentUser).children || [],
        relationship: (userData as ParentUser).relationship || 'father',
        occupation: (userData as ParentUser).occupation,
        address: (userData as ParentUser).address,
      }),
    } as User;

    users.push(newUser);
    saveUsers(users);

    return newUser;
  }

  // Update user
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await delay(400);

    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check if email already exists (excluding current user)
    if (userData.email && users.some(user => user.email === userData.email && user.id !== id)) {
      throw new Error('Email already exists');
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date(),
      // Preserve certain fields that shouldn't be updated directly
      id: users[userIndex].id,
      createdAt: users[userIndex].createdAt,
    } as User;

    users[userIndex] = updatedUser;
    saveUsers(users);

    return updatedUser;
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    await delay(300);

    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users.splice(userIndex, 1);
    saveUsers(users);

    return true;
  }

  // Bulk operations
  static async bulkUpdateUsers(ids: string[], updates: Partial<User>): Promise<User[]> {
    await delay(600);

    const users = getStoredUsers();
    const updatedUsers: User[] = [];

    for (const id of ids) {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...updates,
          updatedAt: new Date(),
        } as User;
        updatedUsers.push(users[userIndex]);
      }
    }

    saveUsers(users);
    return updatedUsers;
  }

  static async bulkDeleteUsers(ids: string[]): Promise<boolean> {
    await delay(500);

    const users = getStoredUsers();
    const filteredUsers = users.filter(user => !ids.includes(user.id));

    saveUsers(filteredUsers);
    return true;
  }

  // Statistics
  static async getUserStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    recentlyCreated: number;
    activeToday: number;
  }> {
    await delay(200);

    const users = getStoredUsers();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentlyCreated = users.filter(user => user.createdAt >= weekAgo).length;
    const activeToday = users.filter(user =>
      user.lastLogin && user.lastLogin >= today
    ).length;

    return {
      total: users.length,
      byRole,
      byStatus,
      recentlyCreated,
      activeToday,
    };
  }

  // Export users data
  static async exportUsers(format: 'json' | 'csv' = 'json'): Promise<string> {
    await delay(800);

    const users = getStoredUsers();

    if (format === 'csv') {
      const headers = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status',
        'Created At', 'Last Login'
      ];

      const csvData = users.map(user => [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber || '',
        user.role,
        user.status,
        user.createdAt.toISOString(),
        user.lastLogin?.toISOString() || '',
      ]);

      return [headers, ...csvData].map(row => row.join(',')).join('\n');
    }

    return JSON.stringify(users, null, 2);
  }

  // Import users data
  static async importUsers(data: User[]): Promise<{ success: number; errors: string[] }> {
    await delay(1000);

    const users = getStoredUsers();
    const errors: string[] = [];
    let success = 0;

    for (const userData of data) {
      try {
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.role) {
          errors.push(`Invalid user data: ${userData.email || 'Unknown'}`);
          continue;
        }

        // Check for duplicate email
        if (users.some(user => user.email === userData.email)) {
          errors.push(`Email already exists: ${userData.email}`);
          continue;
        }

        // Add user
        const newUser = {
          ...userData,
          id: userData.id || generateUserId(userData.role),
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          updatedAt: new Date(),
        } as User;

        users.push(newUser);
        success++;
      } catch (error) {
        errors.push(`Error importing user ${userData.email}: ${error}`);
      }
    }

    saveUsers(users);

    return { success, errors };
  }

  // Reset to default data
  static async resetToDefaults(): Promise<boolean> {
    await delay(300);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.LAST_ID);
    }

    return true;
  }
}

// Export individual role services for convenience
export const AdminApiService = {
  getAdmins: () => MockUserApiService.getUsers({ role: 'admin' }),
  createAdmin: (data: Partial<AdminUser>) => MockUserApiService.createUser({ ...data, role: 'admin' }),
  updateAdmin: (id: string, data: Partial<AdminUser>) => MockUserApiService.updateUser(id, data),
  deleteAdmin: (id: string) => MockUserApiService.deleteUser(id),
};

export const TeacherApiService = {
  getTeachers: () => MockUserApiService.getUsers({ role: 'teacher' }),
  createTeacher: (data: Partial<TeacherUser>) => MockUserApiService.createUser({ ...data, role: 'teacher' }),
  updateTeacher: (id: string, data: Partial<TeacherUser>) => MockUserApiService.updateUser(id, data),
  deleteTeacher: (id: string) => MockUserApiService.deleteUser(id),
};

export const StudentApiService = {
  getStudents: () => MockUserApiService.getUsers({ role: 'student' }),
  createStudent: (data: Partial<StudentUser>) => MockUserApiService.createUser({ ...data, role: 'student' }),
  updateStudent: (id: string, data: Partial<StudentUser>) => MockUserApiService.updateUser(id, data),
  deleteStudent: (id: string) => MockUserApiService.deleteUser(id),
};

export const ParentApiService = {
  getParents: () => MockUserApiService.getUsers({ role: 'parent' }),
  createParent: (data: Partial<ParentUser>) => MockUserApiService.createUser({ ...data, role: 'parent' }),
  updateParent: (id: string, data: Partial<ParentUser>) => MockUserApiService.updateUser(id, data),
  deleteParent: (id: string) => MockUserApiService.deleteUser(id),
};