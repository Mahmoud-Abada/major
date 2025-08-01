// Mock marks data
export interface Mark {
  id: string;
  student: string;
  studentName: string;
  classroom?: string;
  group?: string;
  subject: string;
  markType: "homework" | "quiz" | "exam" | "participation" | "project";
  value: number;
  maxValue: number;
  date: number;
  description?: string;
  isExempted?: boolean;
  weight?: number;
  createdAt: number;
  updatedAt: number;
}

export const mockMarks: Mark[] = [
  {
    id: "mark-001",
    student: "student-001",
    studentName: "Ahmed Benali",
    classroom: "classroom-001",
    subject: "Advanced Algebra",
    markType: "exam",
    value: 17,
    maxValue: 20,
    date: new Date("2024-11-15").getTime(),
    description: "Midterm examination on quadratic equations and functions",
    isExempted: false,
    weight: 2,
    createdAt: new Date("2024-11-15").getTime(),
    updatedAt: new Date("2024-11-15").getTime(),
  },
  {
    id: "mark-002",
    student: "student-001",
    studentName: "Ahmed Benali",
    classroom: "classroom-001",
    subject: "Advanced Algebra",
    markType: "homework",
    value: 18,
    maxValue: 20,
    date: new Date("2024-11-10").getTime(),
    description: "Problem set on polynomial functions",
    isExempted: false,
    weight: 1,
    createdAt: new Date("2024-11-10").getTime(),
    updatedAt: new Date("2024-11-10").getTime(),
  },
  {
    id: "mark-003",
    student: "student-002",
    studentName: "Fatima Zohra",
    classroom: "classroom-002",
    subject: "Physics",
    markType: "quiz",
    value: 15,
    maxValue: 20,
    date: new Date("2024-11-12").getTime(),
    description: "Quiz on Newton's laws of motion",
    isExempted: false,
    weight: 1,
    createdAt: new Date("2024-11-12").getTime(),
    updatedAt: new Date("2024-11-12").getTime(),
  },
  {
    id: "mark-004",
    student: "student-003",
    studentName: "Yacine Mansouri",
    classroom: "classroom-003",
    subject: "Arabic Literature",
    markType: "participation",
    value: 19,
    maxValue: 20,
    date: new Date("2024-11-18").getTime(),
    description: "Active participation in poetry analysis discussion",
    isExempted: false,
    weight: 0.5,
    createdAt: new Date("2024-11-18").getTime(),
    updatedAt: new Date("2024-11-18").getTime(),
  },
  {
    id: "mark-005",
    student: "student-004",
    studentName: "Rania Cherif",
    classroom: "classroom-004",
    subject: "Web Development",
    markType: "project",
    value: 16,
    maxValue: 20,
    date: new Date("2024-11-20").getTime(),
    description: "React component library project",
    isExempted: false,
    weight: 3,
    createdAt: new Date("2024-11-20").getTime(),
    updatedAt: new Date("2024-11-20").getTime(),
  },
  {
    id: "mark-006",
    student: "student-002",
    studentName: "Fatima Zohra",
    classroom: "classroom-002",
    subject: "Physics",
    markType: "exam",
    value: 0,
    maxValue: 20,
    date: new Date("2024-11-14").getTime(),
    description: "Thermodynamics exam",
    isExempted: true,
    weight: 2,
    createdAt: new Date("2024-11-14").getTime(),
    updatedAt: new Date("2024-11-14").getTime(),
  },
];

// Helper functions
export const getMarkById = (id: string): Mark | undefined => {
  return mockMarks.find((mark) => mark.id === id);
};

export const getMarksByStudent = (studentId: string): Mark[] => {
  return mockMarks.filter((mark) => mark.student === studentId);
};

export const getMarksByClassroom = (classroomId: string): Mark[] => {
  return mockMarks.filter((mark) => mark.classroom === classroomId);
};

export const getMarksBySubject = (subject: string): Mark[] => {
  return mockMarks.filter((mark) => mark.subject === subject);
};

export const getMarksByType = (markType: Mark["markType"]): Mark[] => {
  return mockMarks.filter((mark) => mark.markType === markType);
};

export const getStudentAverage = (studentId: string, classroomId?: string): number => {
  let studentMarks = getMarksByStudent(studentId);
  
  if (classroomId) {
    studentMarks = studentMarks.filter((mark) => mark.classroom === classroomId);
  }
  
  const validMarks = studentMarks.filter((mark) => !mark.isExempted);
  
  if (validMarks.length === 0) return 0;
  
  const totalWeightedScore = validMarks.reduce((sum, mark) => {
    const percentage = (mark.value / mark.maxValue) * 100;
    const weight = mark.weight || 1;
    return sum + (percentage * weight);
  }, 0);
  
  const totalWeight = validMarks.reduce((sum, mark) => sum + (mark.weight || 1), 0);
  
  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
};