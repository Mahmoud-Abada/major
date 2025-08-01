// Mock attendance data
export interface Attendance {
  id: string;
  student: string;
  studentName: string;
  classroom?: string;
  event?: string;
  date: number;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export const mockAttendance: Attendance[] = [
  {
    id: "attendance-001",
    student: "student-001",
    studentName: "Ahmed Benali",
    classroom: "classroom-001",
    date: new Date("2024-11-20").getTime(),
    status: "present",
    notes: "",
    createdAt: new Date("2024-11-20").getTime(),
    updatedAt: new Date("2024-11-20").getTime(),
  },
  {
    id: "attendance-002",
    student: "student-001",
    studentName: "Ahmed Benali",
    classroom: "classroom-001",
    date: new Date("2024-11-18").getTime(),
    status: "late",
    notes: "Arrived 15 minutes late due to transportation issues",
    createdAt: new Date("2024-11-18").getTime(),
    updatedAt: new Date("2024-11-18").getTime(),
  },
  {
    id: "attendance-003",
    student: "student-002",
    studentName: "Fatima Zohra",
    classroom: "classroom-002",
    date: new Date("2024-11-19").getTime(),
    status: "absent",
    notes: "Sick leave - medical certificate provided",
    createdAt: new Date("2024-11-19").getTime(),
    updatedAt: new Date("2024-11-19").getTime(),
  },
  {
    id: "attendance-004",
    student: "student-003",
    studentName: "Yacine Mansouri",
    classroom: "classroom-003",
    date: new Date("2024-11-21").getTime(),
    status: "present",
    notes: "",
    createdAt: new Date("2024-11-21").getTime(),
    updatedAt: new Date("2024-11-21").getTime(),
  },
  {
    id: "attendance-005",
    student: "student-004",
    studentName: "Rania Cherif",
    classroom: "classroom-004",
    date: new Date("2024-11-20").getTime(),
    status: "excused",
    notes: "Family emergency - prior notification given",
    createdAt: new Date("2024-11-20").getTime(),
    updatedAt: new Date("2024-11-20").getTime(),
  },
  {
    id: "attendance-006",
    student: "student-002",
    studentName: "Fatima Zohra",
    classroom: "classroom-002",
    date: new Date("2024-11-21").getTime(),
    status: "present",
    notes: "",
    createdAt: new Date("2024-11-21").getTime(),
    updatedAt: new Date("2024-11-21").getTime(),
  },
  {
    id: "attendance-007",
    student: "student-003",
    studentName: "Yacine Mansouri",
    classroom: "classroom-003",
    date: new Date("2024-11-19").getTime(),
    status: "late",
    notes: "Traffic delay - arrived 10 minutes late",
    createdAt: new Date("2024-11-19").getTime(),
    updatedAt: new Date("2024-11-19").getTime(),
  },
  {
    id: "attendance-008",
    student: "student-001",
    studentName: "Ahmed Benali",
    classroom: "classroom-001",
    date: new Date("2024-11-15").getTime(),
    status: "present",
    notes: "",
    createdAt: new Date("2024-11-15").getTime(),
    updatedAt: new Date("2024-11-15").getTime(),
  },
];

// Helper functions
export const getAttendanceById = (id: string): Attendance | undefined => {
  return mockAttendance.find((attendance) => attendance.id === id);
};

export const getAttendanceByStudent = (studentId: string): Attendance[] => {
  return mockAttendance.filter((attendance) => attendance.student === studentId);
};

export const getAttendanceByClassroom = (classroomId: string): Attendance[] => {
  return mockAttendance.filter((attendance) => attendance.classroom === classroomId);
};

export const getAttendanceByDate = (date: string): Attendance[] => {
  const targetDate = new Date(date).toDateString();
  return mockAttendance.filter((attendance) => 
    new Date(attendance.date).toDateString() === targetDate
  );
};

export const getAttendanceByStatus = (status: Attendance["status"]): Attendance[] => {
  return mockAttendance.filter((attendance) => attendance.status === status);
};

export const getStudentAttendanceRate = (studentId: string, classroomId?: string): number => {
  let studentAttendance = getAttendanceByStudent(studentId);
  
  if (classroomId) {
    studentAttendance = studentAttendance.filter((attendance) => attendance.classroom === classroomId);
  }
  
  if (studentAttendance.length === 0) return 0;
  
  const presentCount = studentAttendance.filter((attendance) => 
    attendance.status === "present" || attendance.status === "late"
  ).length;
  
  return (presentCount / studentAttendance.length) * 100;
};

export const getClassroomAttendanceRate = (classroomId: string, date?: string): number => {
  let classroomAttendance = getAttendanceByClassroom(classroomId);
  
  if (date) {
    const targetDate = new Date(date).toDateString();
    classroomAttendance = classroomAttendance.filter((attendance) => 
      new Date(attendance.date).toDateString() === targetDate
    );
  }
  
  if (classroomAttendance.length === 0) return 0;
  
  const presentCount = classroomAttendance.filter((attendance) => 
    attendance.status === "present" || attendance.status === "late"
  ).length;
  
  return (presentCount / classroomAttendance.length) * 100;
};