// User types and mock data
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  role: "admin" | "teacher" | "student" | "parent";
  status: "active" | "inactive" | "pending" | "suspended";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  // Authentication fields (in real app, password would be hashed)
  password: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChange?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

export interface AdminUser extends User {
  role: "admin";
  permissions: string[];
  department?: string;
  position?: string;
}

export interface TeacherUser extends User {
  role: "teacher";
  subjects: string[];
  classrooms: string[];
  qualifications: string[];
  bio?: string;
  specializations?: string[];
  employmentDate: Date;
  yearsOfExperience: number;
}

export interface StudentUser extends User {
  role: "student";
  studentId: string;
  grade: string;
  class?: string;
  enrollmentDate: Date;
  guardians: string[];
  dateOfBirth: Date;
  nationality?: string;
  bloodGroup?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export interface ParentUser extends User {
  role: "parent";
  children: string[];
  relationship: "father" | "mother" | "guardian" | "other";
  occupation?: string;
  address?: string;
}

// Mock data
export const mockAdmins: AdminUser[] = [
  {
    id: "admin-001",
    firstName: "Ahmed",
    lastName: "Benali",
    email: "ahmed.benali@majorschool.edu",
    phoneNumber: "+213-555-123-456",
    avatar: "/avatars/ahmed-benali.jpg",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-20"),
    lastLogin: new Date("2024-11-20T08:30:00"),
    password: "Admin123!",
    isEmailVerified: true,
    twoFactorEnabled: true,
    lastPasswordChange: new Date("2024-10-01"),
    failedLoginAttempts: 0,
    permissions: [
      "manage_users",
      "manage_classes",
      "manage_finances",
      "system_settings",
    ],
    department: "Administration",
    position: "Principal",
  },
  {
    id: "admin-002",
    firstName: "Fatima",
    lastName: "Zohra",
    email: "fatima.zohra@majorschool.edu",
    phoneNumber: "+213-555-987-654",
    avatar: "/avatars/fatima-zohra.jpg",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-11-19"),
    lastLogin: new Date("2024-11-19T14:20:00"),
    password: "Admin456!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-15"),
    failedLoginAttempts: 0,
    permissions: ["manage_users", "manage_classes", "view_finances"],
    department: "Academic Affairs",
    position: "Vice Principal",
  },
];

export const mockTeachers: TeacherUser[] = [
  {
    id: "teacher-001",
    firstName: "Karim",
    lastName: "Mansouri",
    email: "karim.mansouri@majorschool.edu",
    phoneNumber: "+213-555-234-567",
    avatar: "/avatars/karim-mansouri.jpg",
    role: "teacher",
    status: "active",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-11-18"),
    lastLogin: new Date("2024-11-20T09:15:00"),
    password: "Teacher123!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-08-20"),
    failedLoginAttempts: 0,
    subjects: ["Mathematics", "Physics"],
    classrooms: ["classroom-001", "classroom-002"],
    qualifications: ["M.Sc. Mathematics", "B.Sc. Physics"],
    bio: "Experienced mathematics and physics teacher with 12 years of teaching experience.",
    specializations: ["Advanced Calculus", "Quantum Physics"],
    employmentDate: new Date("2020-08-15"),
    yearsOfExperience: 12,
  },
  {
    id: "teacher-002",
    firstName: "Amina",
    lastName: "Benaissa",
    email: "amina.benaissa@majorschool.edu",
    phoneNumber: "+213-555-345-678",
    avatar: "/avatars/amina-benaissa.jpg",
    role: "teacher",
    status: "active",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-11-17"),
    lastLogin: new Date("2024-11-19T16:45:00"),
    password: "Teacher456!",
    isEmailVerified: true,
    twoFactorEnabled: true,
    lastPasswordChange: new Date("2024-07-10"),
    failedLoginAttempts: 0,
    subjects: ["Arabic Literature", "Islamic Studies"],
    classrooms: ["classroom-003", "classroom-004"],
    qualifications: ["Ph.D. Arabic Literature", "M.A. Islamic Studies"],
    bio: "Passionate about Arabic literature and Islamic culture.",
    specializations: ["Classical Arabic Poetry", "Islamic History"],
    employmentDate: new Date("2021-01-10"),
    yearsOfExperience: 8,
  },
  {
    id: "teacher-003",
    firstName: "Yacine",
    lastName: "Cherif",
    email: "yacine.cherif@majorschool.edu",
    phoneNumber: "+213-555-456-789",
    avatar: "/avatars/yacine-cherif.jpg",
    role: "teacher",
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-11-16"),
    lastLogin: new Date("2024-11-20T07:30:00"),
    password: "Teacher789!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-06-15"),
    failedLoginAttempts: 0,
    subjects: ["Computer Science", "Information Technology"],
    classrooms: ["classroom-005"],
    qualifications: ["M.Sc. Computer Science", "B.Sc. Software Engineering"],
    bio: "Technology enthusiast focused on modern programming and software development.",
    specializations: ["Web Development", "Database Design", "AI/ML"],
    employmentDate: new Date("2022-09-01"),
    yearsOfExperience: 6,
  },
];

export const mockStudents: StudentUser[] = [
  {
    id: "student-001",
    firstName: "Rania",
    lastName: "Boumediene",
    email: "rania.boumediene@student.majorschool.edu",
    phoneNumber: "+213-555-567-890",
    avatar: "/avatars/rania-boumediene.jpg",
    role: "student",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15"),
    lastLogin: new Date("2024-11-20T08:00:00"),
    password: "Student123!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 0,
    studentId: "STU2024001",
    grade: "12",
    class: "classroom-001",
    enrollmentDate: new Date("2024-09-01"),
    guardians: ["parent-001"],
    dateOfBirth: new Date("2006-03-15"),
    nationality: "Algerian",
    bloodGroup: "A+",
    address: "123 Rue des Martyrs, Alger",
    parentName: "Mohammed Boumediene",
    parentEmail: "mohammed.boumediene@email.com",
    parentPhone: "+213-555-111-222",
  },
  {
    id: "student-002",
    firstName: "Omar",
    lastName: "Khelifi",
    email: "omar.khelifi@student.majorschool.edu",
    phoneNumber: "+213-555-678-901",
    avatar: "/avatars/omar-khelifi.jpg",
    role: "student",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-14"),
    lastLogin: new Date("2024-11-19T19:30:00"),
    password: "Student456!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 0,
    studentId: "STU2024002",
    grade: "11",
    class: "classroom-002",
    enrollmentDate: new Date("2024-09-01"),
    guardians: ["parent-002"],
    dateOfBirth: new Date("2007-07-22"),
    nationality: "Algerian",
    bloodGroup: "O+",
    address: "456 Avenue de l'Indépendance, Oran",
    parentName: "Salima Khelifi",
    parentEmail: "salima.khelifi@email.com",
    parentPhone: "+213-555-333-444",
  },
  {
    id: "student-003",
    firstName: "Lina",
    lastName: "Hamidi",
    email: "lina.hamidi@student.majorschool.edu",
    phoneNumber: "+213-555-789-012",
    avatar: "/avatars/lina-hamidi.jpg",
    role: "student",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-13"),
    lastLogin: new Date("2024-11-20T07:45:00"),
    password: "Student789!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 0,
    studentId: "STU2024003",
    grade: "10",
    class: "classroom-003",
    enrollmentDate: new Date("2024-09-01"),
    guardians: ["parent-003"],
    dateOfBirth: new Date("2008-11-08"),
    nationality: "Algerian",
    bloodGroup: "B+",
    address: "789 Boulevard Mohamed V, Constantine",
    parentName: "Noureddine Hamidi",
    parentEmail: "noureddine.hamidi@email.com",
    parentPhone: "+213-555-555-666",
  },
  {
    id: "student-004",
    firstName: "Amine",
    lastName: "Bouzid",
    email: "amine.bouzid@student.majorschool.edu",
    phoneNumber: "+213-555-890-123",
    avatar: "/avatars/amine-bouzid.jpg",
    role: "student",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-12"),
    lastLogin: new Date("2024-11-19T20:15:00"),
    password: "Student012!",
    isEmailVerified: false,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 1,
    studentId: "STU2024004",
    grade: "12",
    class: "classroom-001",
    enrollmentDate: new Date("2024-09-01"),
    guardians: ["parent-004"],
    dateOfBirth: new Date("2006-05-20"),
    nationality: "Algerian",
    bloodGroup: "AB+",
    address: "321 Rue de la Liberté, Annaba",
    parentName: "Aicha Bouzid",
    parentEmail: "aicha.bouzid@email.com",
    parentPhone: "+213-555-777-888",
  },
];

export const mockParents: ParentUser[] = [
  {
    id: "parent-001",
    firstName: "Mohammed",
    lastName: "Boumediene",
    email: "mohammed.boumediene@email.com",
    phoneNumber: "+213-555-111-222",
    avatar: "/avatars/mohammed-boumediene.jpg",
    role: "parent",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15"),
    lastLogin: new Date("2024-11-19T18:00:00"),
    password: "Parent123!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 0,
    children: ["student-001"],
    relationship: "father",
    occupation: "Engineer",
    address: "123 Rue des Martyrs, Alger",
  },
  {
    id: "parent-002",
    firstName: "Salima",
    lastName: "Khelifi",
    email: "salima.khelifi@email.com",
    phoneNumber: "+213-555-333-444",
    avatar: "/avatars/salima-khelifi.jpg",
    role: "parent",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-14"),
    lastLogin: new Date("2024-11-18T16:30:00"),
    password: "Parent456!",
    isEmailVerified: true,
    twoFactorEnabled: true,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 0,
    children: ["student-002"],
    relationship: "mother",
    occupation: "Doctor",
    address: "456 Avenue de l'Indépendance, Oran",
  },
  {
    id: "parent-003",
    firstName: "Noureddine",
    lastName: "Hamidi",
    email: "noureddine.hamidi@email.com",
    phoneNumber: "+213-555-555-666",
    avatar: "/avatars/noureddine-hamidi.jpg",
    role: "parent",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-13"),
    lastLogin: new Date("2024-11-17T19:45:00"),
    password: "Parent789!",
    isEmailVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 0,
    children: ["student-003"],
    relationship: "father",
    occupation: "Business Owner",
    address: "789 Boulevard Mohamed V, Constantine",
  },
  {
    id: "parent-004",
    firstName: "Aicha",
    lastName: "Bouzid",
    email: "aicha.bouzid@email.com",
    phoneNumber: "+213-555-777-888",
    avatar: "/avatars/aicha-bouzid.jpg",
    role: "parent",
    status: "active",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-12"),
    lastLogin: new Date("2024-11-16T17:20:00"),
    password: "Parent012!",
    isEmailVerified: false,
    twoFactorEnabled: false,
    lastPasswordChange: new Date("2024-09-01"),
    failedLoginAttempts: 2,
    lockedUntil: new Date("2024-11-21T12:00:00"),
    children: ["student-004"],
    relationship: "mother",
    occupation: "Teacher",
    address: "321 Rue de la Liberté, Annaba",
  },
];

// Combined users array for easy access
export const mockUsers: User[] = [
  ...mockAdmins,
  ...mockTeachers,
  ...mockStudents,
  ...mockParents,
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

export const getUsersByRole = (role: User["role"]): User[] => {
  return mockUsers.filter((user) => user.role === role);
};

export const getUsersByStatus = (status: User["status"]): User[] => {
  return mockUsers.filter((user) => user.status === status);
};
