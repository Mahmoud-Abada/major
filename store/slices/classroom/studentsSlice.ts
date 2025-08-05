import { Student, StudentFormData } from "@/types/classroom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Empty students array - will be populated from API
const mockStudents: any[] = [];

interface StudentsState {
    students: Student[];
    selectedStudent: Student | null;
    loading: boolean;
    error: string | null;
    filters: {
        status: string[];
        grade: string[];
        class: string[];
        search: string;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

const initialState: StudentsState = {
    students: mockStudents,
    selectedStudent: null,
    loading: false,
    error: null,
    filters: {
        status: [],
        grade: [],
        class: [],
        search: "",
    },
    pagination: {
        page: 1,
        limit: 10,
        total: mockStudents.length,
    },
};

const studentsSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
        // Loading states
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // CRUD operations
        addStudent: (state, action: PayloadAction<StudentFormData>) => {
            const newStudent: Student = {
                ...action.payload,
                id: `student-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            state.students.push(newStudent);
            state.pagination.total += 1;
        },

        updateStudent: (state, action: PayloadAction<{ id: string; data: Partial<StudentFormData> }>) => {
            const { id, data } = action.payload;
            const index = state.students.findIndex(student => student.id === id);
            if (index !== -1) {
                state.students[index] = {
                    ...state.students[index],
                    ...data,
                    updatedAt: new Date(),
                };
                if (state.selectedStudent?.id === id) {
                    state.selectedStudent = state.students[index];
                }
            }
        },

        deleteStudent: (state, action: PayloadAction<string>) => {
            state.students = state.students.filter(student => student.id !== action.payload);
            state.pagination.total -= 1;
            if (state.selectedStudent?.id === action.payload) {
                state.selectedStudent = null;
            }
        },

        deleteMultipleStudents: (state, action: PayloadAction<string[]>) => {
            state.students = state.students.filter(student => !action.payload.includes(student.id));
            state.pagination.total -= action.payload.length;
            if (state.selectedStudent && action.payload.includes(state.selectedStudent.id)) {
                state.selectedStudent = null;
            }
        },

        // Selection
        setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
            state.selectedStudent = action.payload;
        },

        // Filters
        setFilters: (state, action: PayloadAction<Partial<StudentsState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearFilters: (state) => {
            state.filters = {
                status: [],
                grade: [],
                class: [],
                search: "",
            };
        },

        // Pagination
        setPagination: (state, action: PayloadAction<Partial<StudentsState['pagination']>>) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        // Bulk operations
        updateStudentStatus: (state, action: PayloadAction<{ ids: string[]; status: Student['status'] }>) => {
            const { ids, status } = action.payload;
            state.students.forEach(student => {
                if (ids.includes(student.id)) {
                    student.status = status;
                    student.updatedAt = new Date();
                }
            });
        },

        // Payment operations
        addPaymentToStudent: (state, action: PayloadAction<{ studentId: string; payment: any }>) => {
            const { studentId, payment } = action.payload;
            const student = state.students.find(s => s.id === studentId);
            if (student) {
                student.payments.push(payment);
                student.paidAmount += payment.amount;
                student.pendingAmount -= payment.amount;
                student.updatedAt = new Date();
            }
        },
    },
});

export const {
    setLoading,
    setError,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteMultipleStudents,
    setSelectedStudent,
    setFilters,
    clearFilters,
    setPagination,
    updateStudentStatus,
    addPaymentToStudent,
} = studentsSlice.actions;

// Selectors
export const selectAllStudents = (state: RootState) => state.students.students;
export const selectSelectedStudent = (state: RootState) => state.students.selectedStudent;
export const selectStudentsLoading = (state: RootState) => state.students.loading;
export const selectStudentsError = (state: RootState) => state.students.error;
export const selectStudentsFilters = (state: RootState) => state.students.filters;
export const selectStudentsPagination = (state: RootState) => state.students.pagination;

// Filtered students selector
export const selectFilteredStudents = (state: RootState) => {
    const { students, filters } = state.students;

    return students.filter(student => {
        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(student.status)) {
            return false;
        }

        // Grade filter
        if (filters.grade.length > 0 && !filters.grade.includes(student.grade)) {
            return false;
        }

        // Class filter
        if (filters.class.length > 0 && !filters.class.includes(student.class)) {
            return false;
        }

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                student.name.toLowerCase().includes(searchLower) ||
                student.studentId.toLowerCase().includes(searchLower) ||
                student.email.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });
};

export const selectStudentById = (state: RootState, id: string) =>
    state.students.students.find(student => student.id === id);

export const selectStudentsByClass = (state: RootState, classId: string) =>
    state.students.students.filter(student => student.classIds.includes(classId));

export const selectActiveStudents = (state: RootState) =>
    state.students.students.filter(student => student.status === "Active");

export default studentsSlice.reducer;