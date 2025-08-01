// Group types and mock data
export interface Group {
  id: string;
  school: string;
  schoolName: string;
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
  members: string[];
  classrooms: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
export const mockGroups: Group[] = [
  {
    id: "group-001",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Advanced Math Study Group",
    frontPicture: "/images/groups/math-group-1.jpg",
    backPicture: "/images/groups/math-group-1-back.jpg",
    isArchived: false,
    description:
      "Study group for students excelling in mathematics, preparing for national competitions and university entrance exams.",
    field: "Mathematics",
    level: "High School",
    color: "#e74c3c",
    isSemestral: true,
    startDate: new Date("2024-09-01").getTime(),
    endDate: new Date("2025-06-30").getTime(),
    memberCount: 12,
    members: ["student-001", "student-004"],
    classrooms: ["classroom-001"],
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "group-002",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Programming Club",
    frontPicture: "/images/groups/programming-club-1.jpg",
    isArchived: false,
    description:
      "Weekly programming challenges and collaborative projects for computer science students. Focus on competitive programming and open source contributions.",
    field: "Computer Science",
    level: "University",
    color: "#1abc9c",
    isSemestral: false,
    memberCount: 28,
    members: [],
    classrooms: ["classroom-004"],
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-11-18"),
  },
  {
    id: "group-003",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Arabic Literature Circle",
    frontPicture: "/images/groups/arabic-literature-1.jpg",
    isArchived: false,
    description:
      "Literary discussion group exploring classical and modern Arabic literature, poetry analysis, and creative writing.",
    field: "Arabic Literature",
    level: "High School",
    color: "#9b59b6",
    isSemestral: true,
    startDate: new Date("2024-09-15").getTime(),
    endDate: new Date("2025-05-31").getTime(),
    memberCount: 15,
    members: ["student-003"],
    classrooms: ["classroom-003"],
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "group-004",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Science Explorers",
    frontPicture: "/images/groups/science-group-1.jpg",
    isArchived: false,
    description:
      "Hands-on science experiments and discovery activities for students interested in physics, chemistry, and biology.",
    field: "General Science",
    level: "High School",
    color: "#f39c12",
    isSemestral: true,
    startDate: new Date("2024-10-01").getTime(),
    endDate: new Date("2025-05-31").getTime(),
    memberCount: 18,
    members: ["student-002"],
    classrooms: ["classroom-002"],
    createdAt: new Date("2024-09-25"),
    updatedAt: new Date("2024-11-05"),
  },
  {
    id: "group-005",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Debate Society",
    frontPicture: "/images/groups/debate-society-1.jpg",
    isArchived: false,
    description:
      "Develop critical thinking and public speaking skills through structured debates on current affairs and philosophical topics.",
    field: "General Studies",
    level: "High School",
    color: "#34495e",
    isSemestral: false,
    memberCount: 20,
    members: ["student-001", "student-003"],
    classrooms: [],
    createdAt: new Date("2024-09-05"),
    updatedAt: new Date("2024-11-12"),
  },
  {
    id: "group-006",
    school: "school-001",
    schoolName: "MAJOR Academy Alger",
    title: "Islamic Studies Circle",
    frontPicture: "/images/groups/islamic-studies-1.jpg",
    isArchived: true,
    description:
      "Weekly discussions on Islamic history, jurisprudence, and contemporary issues.",
    field: "Islamic Studies",
    level: "High School",
    color: "#27ae60",
    isSemestral: true,
    startDate: new Date("2024-07-01").getTime(),
    endDate: new Date("2024-12-31").getTime(),
    memberCount: 0,
    members: [],
    classrooms: ["classroom-005"],
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-10-15"),
  },
];

// Helper functions
export const getGroupById = (id: string): Group | undefined => {
  return mockGroups.find((group) => group.id === id);
};

export const getGroupsBySchool = (schoolId: string): Group[] => {
  return mockGroups.filter((group) => group.school === schoolId);
};

export const getActiveGroups = (): Group[] => {
  return mockGroups.filter((group) => !group.isArchived);
};

export const getArchivedGroups = (): Group[] => {
  return mockGroups.filter((group) => group.isArchived);
};

export const getGroupsByField = (field: string): Group[] => {
  return mockGroups.filter((group) => group.field === field);
};

export const getGroupsByLevel = (level: string): Group[] => {
  return mockGroups.filter((group) => group.level === level);
};

export const getGroupsByMember = (studentId: string): Group[] => {
  return mockGroups.filter((group) => group.members.includes(studentId));
};
