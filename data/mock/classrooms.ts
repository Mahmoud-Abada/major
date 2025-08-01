// Classroom types and mock data
export interface Classroom {
  id: string;
  teacher: string;
  teacherName: string;
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
  students: string[];
  subjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  grade: string;
  teachers: string[];
  syllabus?: string;
  resources: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
export const mockClassrooms: Classroom[] = [
  {
    id: "classroom-001",
    teacher: "teacher-001",
    teacherName: "Karim Mansouri",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Mathematics - Advanced Algebra",
    location: {
      fullLocation: "123 Avenue de l'Indépendance, Alger",
      coordinates: { lat: 36.75, long: 3.06 },
      wilaya: "Alger",
      commune: "El Madania",
    },
    frontPicture: "/images/classrooms/math-classroom-1.jpg",
    backPicture: "/images/classrooms/math-classroom-1-back.jpg",
    isArchived: false,
    description:
      "Advanced algebra course for high school students preparing for university entrance exams. Focus on quadratic equations, polynomial functions, and complex numbers.",
    field: "Mathematics",
    level: "High School",
    color: "#3498db",
    maxStudents: 30,
    currentStudents: 24,
    price: 4000,
    schedule: [
      { day: "Monday", startTime: "14:00", endTime: "16:00" },
      { day: "Wednesday", startTime: "10:00", endTime: "12:00" },
      { day: "Friday", startTime: "14:00", endTime: "16:00" },
    ],
    mode: "monthly",
    perDuration: 30,
    students: ["student-001", "student-004"],
    subjects: ["subject-001", "subject-002"],
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "classroom-002",
    teacher: "teacher-001",
    teacherName: "Karim Mansouri",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Physics - Mechanics and Thermodynamics",
    location: {
      fullLocation: "123 Avenue de l'Indépendance, Alger",
      coordinates: { lat: 36.75, long: 3.06 },
      wilaya: "Alger",
      commune: "El Madania",
    },
    frontPicture: "/images/classrooms/physics-lab-1.jpg",
    backPicture: "/images/classrooms/physics-lab-1-back.jpg",
    isArchived: false,
    description:
      "Comprehensive physics course covering mechanics and thermodynamics with practical experiments and real-world applications.",
    field: "Physics",
    level: "High School",
    color: "#2ecc71",
    maxStudents: 20,
    currentStudents: 18,
    price: 5000,
    schedule: [
      { day: "Saturday", startTime: "08:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "14:00", endTime: "17:00" },
    ],
    mode: "sessional",
    perSessions: 15,
    students: ["student-002"],
    subjects: ["subject-003"],
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "classroom-003",
    teacher: "teacher-002",
    teacherName: "Amina Benaissa",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Arabic Literature - Classical Poetry",
    location: {
      fullLocation: "123 Avenue de l'Indépendance, Alger",
      coordinates: { lat: 36.75, long: 3.06 },
      wilaya: "Alger",
      commune: "El Madania",
    },
    frontPicture: "/images/classrooms/arabic-classroom-1.jpg",
    isArchived: false,
    description:
      "Deep dive into classical Arabic poetry, exploring the works of great poets like Al-Mutanabbi and Abu Nuwas.",
    field: "Arabic Literature",
    level: "High School",
    color: "#8e44ad",
    maxStudents: 25,
    currentStudents: 22,
    price: 3500,
    schedule: [
      { day: "Sunday", startTime: "09:00", endTime: "11:00" },
      { day: "Thursday", startTime: "15:00", endTime: "17:00" },
    ],
    mode: "semestrial",
    perSemester: [
      {
        semester: "Fall 2024",
        price: 1750,
        startDate: new Date("2024-09-15").getTime(),
        endDate: new Date("2025-01-15").getTime(),
      },
      {
        semester: "Spring 2025",
        price: 1750,
        startDate: new Date("2025-02-01").getTime(),
        endDate: new Date("2025-06-01").getTime(),
      },
    ],
    students: ["student-003"],
    subjects: ["subject-004"],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "classroom-004",
    teacher: "teacher-003",
    teacherName: "Yacine Cherif",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Computer Science - Web Development",
    location: {
      fullLocation: "123 Avenue de l'Indépendance, Alger",
      coordinates: { lat: 36.75, long: 3.06 },
      wilaya: "Alger",
      commune: "El Madania",
    },
    frontPicture: "/images/classrooms/cs-lab-1.jpg",
    isArchived: false,
    description:
      "Modern web development course covering HTML, CSS, JavaScript, React, and backend technologies.",
    field: "Computer Science",
    level: "University",
    color: "#e74c3c",
    maxStudents: 15,
    currentStudents: 12,
    price: 6000,
    schedule: [
      { day: "Tuesday", startTime: "18:00", endTime: "21:00" },
      { day: "Thursday", startTime: "18:00", endTime: "21:00" },
    ],
    mode: "monthly",
    perDuration: 30,
    students: [],
    subjects: ["subject-005"],
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-11-18"),
  },
  {
    id: "classroom-005",
    teacher: "teacher-002",
    teacherName: "Amina Benaissa",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Islamic Studies - Quran and Hadith",
    location: {
      fullLocation: "123 Avenue de l'Indépendance, Alger",
      coordinates: { lat: 36.75, long: 3.06 },
      wilaya: "Alger",
      commune: "El Madania",
    },
    frontPicture: "/images/classrooms/islamic-studies-1.jpg",
    isArchived: true,
    description:
      "Comprehensive study of Quranic interpretation and Hadith sciences.",
    field: "Islamic Studies",
    level: "High School",
    color: "#f39c12",
    maxStudents: 20,
    currentStudents: 0,
    price: 3000,
    schedule: [{ day: "Friday", startTime: "09:00", endTime: "11:00" }],
    mode: "monthly",
    perDuration: 30,
    students: [],
    subjects: ["subject-006"],
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-10-15"),
  },
];

export const mockSubjects: Subject[] = [
  {
    id: "subject-001",
    name: "Advanced Algebra",
    code: "MATH301",
    description:
      "Advanced algebraic concepts including quadratic equations, polynomial functions, and complex numbers.",
    grade: "12",
    teachers: ["teacher-001"],
    syllabus: "/files/advanced-algebra-syllabus.pdf",
    resources: ["resource-001", "resource-002"],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "subject-002",
    name: "Calculus I",
    code: "MATH302",
    description: "Introduction to differential and integral calculus.",
    grade: "12",
    teachers: ["teacher-001"],
    syllabus: "/files/calculus-1-syllabus.pdf",
    resources: ["resource-003", "resource-004"],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "subject-003",
    name: "Mechanics and Thermodynamics",
    code: "PHYS201",
    description: "Classical mechanics and basic thermodynamics principles.",
    grade: "11",
    teachers: ["teacher-001"],
    syllabus: "/files/mechanics-thermodynamics-syllabus.pdf",
    resources: ["resource-005", "resource-006"],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "subject-004",
    name: "Classical Arabic Poetry",
    code: "ARAB301",
    description:
      "Study of classical Arabic poetry from the pre-Islamic era to the Abbasid period.",
    grade: "12",
    teachers: ["teacher-002"],
    syllabus: "/files/classical-poetry-syllabus.pdf",
    resources: ["resource-007", "resource-008"],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "subject-005",
    name: "Web Development",
    code: "CS401",
    description: "Full-stack web development using modern technologies.",
    grade: "University",
    teachers: ["teacher-003"],
    syllabus: "/files/web-development-syllabus.pdf",
    resources: ["resource-009", "resource-010"],
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "subject-006",
    name: "Quran and Hadith",
    code: "ISLAM201",
    description: "Quranic interpretation and Hadith sciences.",
    grade: "11",
    teachers: ["teacher-002"],
    syllabus: "/files/quran-hadith-syllabus.pdf",
    resources: ["resource-011"],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-11-01"),
  },
];

// Helper functions
export const getClassroomById = (id: string): Classroom | undefined => {
  return mockClassrooms.find((classroom) => classroom.id === id);
};

export const getClassroomsByTeacher = (teacherId: string): Classroom[] => {
  return mockClassrooms.filter((classroom) => classroom.teacher === teacherId);
};

export const getClassroomsBySchool = (schoolId: string): Classroom[] => {
  return mockClassrooms.filter((classroom) => classroom.school === schoolId);
};

export const getActiveClassrooms = (): Classroom[] => {
  return mockClassrooms.filter((classroom) => !classroom.isArchived);
};

export const getArchivedClassrooms = (): Classroom[] => {
  return mockClassrooms.filter((classroom) => classroom.isArchived);
};

export const getSubjectById = (id: string): Subject | undefined => {
  return mockSubjects.find((subject) => subject.id === id);
};

export const getSubjectsByTeacher = (teacherId: string): Subject[] => {
  return mockSubjects.filter((subject) => subject.teachers.includes(teacherId));
};
