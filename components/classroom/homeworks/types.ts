export interface Homework {
    id: string;
    title: string;
    description: string;
    subject: string;
    classId: string;
    className: string;
    teacherId: string;
    teacherName: string;
    assignedDate: string;
    dueDate: string;
    dueTime?: string;
    type: "assignment" | "project" | "reading" | "exercise" | "research";
    priority: "low" | "medium" | "high" | "urgent";
    status: "draft" | "assigned" | "in_progress" | "completed" | "overdue";
    totalMarks?: number;
    instructions?: string;
    attachments?: string[];
    estimatedDuration?: number; // in minutes
    difficulty: "easy" | "medium" | "hard";
    tags?: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface HomeworkSubmission {
    id: string;
    homeworkId: string;
    studentId: string;
    studentName: string;
    submittedAt?: string;
    status: "not_submitted" | "submitted" | "late" | "graded" | "returned";
    content?: string;
    attachments?: string[];
    grade?: number;
    feedback?: string;
    submissionNotes?: string;
    gradedBy?: string;
    gradedAt?: string;
    isLate: boolean;
    daysLate?: number;
}

export interface HomeworkStats {
    id: string;
    homeworkId: string;
    totalStudents: number;
    submittedCount: number;
    notSubmittedCount: number;
    lateCount: number;
    gradedCount: number;
    averageGrade?: number;
    submissionRate: number;
    onTimeRate: number;
    completionRate: number;
    lastUpdated: string;
}

export interface StudentHomeworkSummary {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    className: string;
    totalHomeworks: number;
    submittedCount: number;
    lateCount: number;
    notSubmittedCount: number;
    averageGrade?: number;
    submissionRate: number;
    onTimeRate: number;
    recentSubmissions: HomeworkSubmission[];
    upcomingHomeworks: Homework[];
    overdueHomeworks: Homework[];
}

export interface ClassHomeworkOverview {
    id: string;
    classId: string;
    className: string;
    totalHomeworks: number;
    activeHomeworks: number;
    completedHomeworks: number;
    overdueHomeworks: number;
    averageSubmissionRate: number;
    averageGrade?: number;
    recentHomeworks: Homework[];
    upcomingDeadlines: Homework[];
}

export interface HomeworkAnalytics {
    totalHomeworks: number;
    activeHomeworks: number;
    completedHomeworks: number;
    overdueHomeworks: number;
    totalSubmissions: number;
    averageSubmissionRate: number;
    averageGrade?: number;
    subjectDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    priorityDistribution: Record<string, number>;
    difficultyDistribution: Record<string, number>;
    weeklyTrends: {
        week: string;
        assigned: number;
        submitted: number;
        graded: number;
    }[];
    topPerformingClasses: {
        className: string;
        submissionRate: number;
        averageGrade?: number;
    }[];
}

export interface CreateHomeworkRequest {
    title: string;
    description: string;
    subject: string;
    classId: string;
    teacherId: string;
    dueDate: string;
    dueTime?: string;
    type: "assignment" | "project" | "reading" | "exercise" | "research";
    priority: "low" | "medium" | "high" | "urgent";
    totalMarks?: number;
    instructions?: string;
    estimatedDuration?: number;
    difficulty: "easy" | "medium" | "hard";
    tags?: string[];
}

export interface UpdateHomeworkRequest extends Partial<CreateHomeworkRequest> {
    id: string;
    status?: "draft" | "assigned" | "in_progress" | "completed" | "overdue";
}

export interface SubmitHomeworkRequest {
    homeworkId: string;
    studentId: string;
    content?: string;
    attachments?: string[];
    submissionNotes?: string;
}

export interface GradeHomeworkRequest {
    submissionId: string;
    grade: number;
    feedback?: string;
    gradedBy: string;
}

export interface HomeworkFilter {
    subject?: string;
    classId?: string;
    teacherId?: string;
    status?: "draft" | "assigned" | "in_progress" | "completed" | "overdue";
    type?: "assignment" | "project" | "reading" | "exercise" | "research";
    priority?: "low" | "medium" | "high" | "urgent";
    difficulty?: "easy" | "medium" | "hard";
    dueDateFrom?: string;
    dueDateTo?: string;
    assignedDateFrom?: string;
    assignedDateTo?: string;
}