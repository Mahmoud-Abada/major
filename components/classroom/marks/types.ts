export interface Mark {
    id: string;
    title: string;
    subject: string;
    class: string;
    type: "exam" | "quiz" | "assignment" | "test";
    totalMarks: number;
    date: string;
    status: "published" | "draft";
    description?: string;
    duration?: number; // in minutes
    instructions?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface StudentMark {
    id: string;
    markId: string;
    studentId: string;
    studentName: string;
    subject: string;
    obtainedMarks: number;
    totalMarks: number;
    grade: string;
    remarks?: string;
    isExempted: boolean;
    submittedAt?: string;
    gradedAt: string;
    gradedBy: string;
}

export interface GroupMark {
    id: string;
    groupName: string;
    groupId: string;
    subject: string;
    markId: string;
    totalStudents: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    passCount: number;
    failCount: number;
    exemptedCount: number;
    date: string;
}

export interface MarkEvent {
    id: string;
    markId: string;
    eventType: "created" | "updated" | "published" | "graded";
    description: string;
    performedBy: string;
    performedAt: string;
    metadata?: Record<string, any>;
}

export interface CreateMarkRequest {
    title: string;
    subject: string;
    class: string;
    type: "exam" | "quiz" | "assignment" | "test";
    totalMarks: number;
    date: string;
    description?: string;
    duration?: number;
    instructions?: string;
}

export interface UpdateMarkRequest extends Partial<CreateMarkRequest> {
    id: string;
    status?: "published" | "draft";
}

export interface StudentMarkUpdate {
    studentId: string;
    obtainedMarks: number;
    grade: string;
    remarks?: string;
    isExempted?: boolean;
}

export interface GroupMarkUpdate {
    groupId: string;
    marks: StudentMarkUpdate[];
}

export interface MarkStats {
    totalMarks: number;
    publishedMarks: number;
    draftMarks: number;
    totalStudentMarks: number;
    averagePerformance: number;
    passRate: number;
    subjectDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
}