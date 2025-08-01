// School types and mock data
export interface School {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactEmail: string;
  contactPhone: string;
  website?: string;
  logo?: string;
  establishedYear?: number;
  administrators: string[];
  teachers: string[];
  students: string[];
  classrooms: string[];
  departments: string[];
  currentAcademicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  teachers: string[];
  subjects: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  terms: Term[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Term {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
export const mockSchools: School[] = [
  {
    id: "school-001",
    name: "MAJOR Academy Alger",
    address: {
      street: "123 Avenue de l'Indépendance",
      city: "Alger",
      state: "Alger",
      postalCode: "16000",
      country: "Algeria",
    },
    contactEmail: "info@majoracademy-alger.edu.dz",
    contactPhone: "+213-21-123-456",
    website: "https://www.majoracademy-alger.edu.dz",
    logo: "/images/schools/major-academy-alger-logo.png",
    establishedYear: 1995,
    administrators: ["admin-001", "admin-002"],
    teachers: ["teacher-001", "teacher-002", "teacher-003"],
    students: ["student-001", "student-002", "student-003", "student-004"],
    classrooms: ["classroom-001", "classroom-002", "classroom-003"],
    departments: ["dept-001", "dept-002", "dept-003"],
    currentAcademicYear: "academic-2024-2025",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "school-002",
    name: "MAJOR Academy Oran",
    address: {
      street: "456 Boulevard de la République",
      city: "Oran",
      state: "Oran",
      postalCode: "31000",
      country: "Algeria",
    },
    contactEmail: "info@majoracademy-oran.edu.dz",
    contactPhone: "+213-41-789-012",
    website: "https://www.majoracademy-oran.edu.dz",
    logo: "/images/schools/major-academy-oran-logo.png",
    establishedYear: 2001,
    administrators: ["admin-003"],
    teachers: ["teacher-004", "teacher-005"],
    students: ["student-005", "student-006"],
    classrooms: ["classroom-004", "classroom-005"],
    departments: ["dept-004", "dept-005"],
    currentAcademicYear: "academic-2024-2025",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-11-19"),
  },
];

export const mockDepartments: Department[] = [
  {
    id: "dept-001",
    name: "Mathematics & Sciences",
    head: "teacher-001",
    teachers: ["teacher-001", "teacher-003"],
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
    description: "Department focused on STEM education and research",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "dept-002",
    name: "Languages & Literature",
    head: "teacher-002",
    teachers: ["teacher-002"],
    subjects: ["Arabic Literature", "French", "English", "Islamic Studies"],
    description:
      "Department dedicated to language learning and cultural studies",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-08"),
  },
  {
    id: "dept-003",
    name: "Social Sciences",
    head: "teacher-004",
    teachers: ["teacher-004"],
    subjects: ["History", "Geography", "Philosophy", "Economics"],
    description: "Department covering humanities and social sciences",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-05"),
  },
];

export const mockAcademicYears: AcademicYear[] = [
  {
    id: "academic-2024-2025",
    name: "2024-2025",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-06-30"),
    terms: [
      {
        id: "term-001",
        name: "First Term",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-12-20"),
        academicYear: "academic-2024-2025",
        createdAt: new Date("2024-08-01"),
        updatedAt: new Date("2024-08-01"),
      },
      {
        id: "term-002",
        name: "Second Term",
        startDate: new Date("2025-01-08"),
        endDate: new Date("2025-03-28"),
        academicYear: "academic-2024-2025",
        createdAt: new Date("2024-08-01"),
        updatedAt: new Date("2024-08-01"),
      },
      {
        id: "term-003",
        name: "Third Term",
        startDate: new Date("2025-04-07"),
        endDate: new Date("2025-06-30"),
        academicYear: "academic-2024-2025",
        createdAt: new Date("2024-08-01"),
        updatedAt: new Date("2024-08-01"),
      },
    ],
    isActive: true,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "academic-2023-2024",
    name: "2023-2024",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-06-30"),
    terms: [
      {
        id: "term-004",
        name: "First Term",
        startDate: new Date("2023-09-01"),
        endDate: new Date("2023-12-20"),
        academicYear: "academic-2023-2024",
        createdAt: new Date("2023-08-01"),
        updatedAt: new Date("2023-08-01"),
      },
      {
        id: "term-005",
        name: "Second Term",
        startDate: new Date("2024-01-08"),
        endDate: new Date("2024-03-28"),
        academicYear: "academic-2023-2024",
        createdAt: new Date("2023-08-01"),
        updatedAt: new Date("2023-08-01"),
      },
      {
        id: "term-006",
        name: "Third Term",
        startDate: new Date("2024-04-07"),
        endDate: new Date("2024-06-30"),
        academicYear: "academic-2023-2024",
        createdAt: new Date("2023-08-01"),
        updatedAt: new Date("2023-08-01"),
      },
    ],
    isActive: false,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2024-07-01"),
  },
];

// Helper functions
export const getSchoolById = (id: string): School | undefined => {
  return mockSchools.find((school) => school.id === id);
};

export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find((dept) => dept.id === id);
};

export const getAcademicYearById = (id: string): AcademicYear | undefined => {
  return mockAcademicYears.find((year) => year.id === id);
};

export const getCurrentAcademicYear = (): AcademicYear | undefined => {
  return mockAcademicYears.find((year) => year.isActive);
};
