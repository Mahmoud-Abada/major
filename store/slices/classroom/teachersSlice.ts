import { Teacher, TeacherFormData } from "@/types/classroom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Empty teachers array - will be populated from API
const mockTeachers: any[] = [];

interface TeachersState {
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
    specialization: string[];
    experience: string[];
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: TeachersState = {
  teachers: mockTeachers,
  selectedTeacher: null,
  loading: false,
  error: null,
  filters: {
    status: [],
    specialization: [],
    experience: [],
    search: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: mockTeachers.length,
  },
};

const teachersSlice = createSlice({
  name: "teachers",
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
    addTeacher: (state, action: PayloadAction<TeacherFormData>) => {
      const newTeacher: Teacher = {
        ...action.payload,
        id: `teacher-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.teachers.push(newTeacher);
      state.pagination.total += 1;
    },

    updateTeacher: (
      state,
      action: PayloadAction<{ id: string; data: Partial<TeacherFormData> }>,
    ) => {
      const { id, data } = action.payload;
      const index = state.teachers.findIndex((teacher) => teacher.id === id);
      if (index !== -1) {
        state.teachers[index] = {
          ...state.teachers[index],
          ...data,
          updatedAt: new Date(),
        };
        if (state.selectedTeacher?.id === id) {
          state.selectedTeacher = state.teachers[index];
        }
      }
    },

    deleteTeacher: (state, action: PayloadAction<string>) => {
      state.teachers = state.teachers.filter(
        (teacher) => teacher.id !== action.payload,
      );
      state.pagination.total -= 1;
      if (state.selectedTeacher?.id === action.payload) {
        state.selectedTeacher = null;
      }
    },

    deleteMultipleTeachers: (state, action: PayloadAction<string[]>) => {
      state.teachers = state.teachers.filter(
        (teacher) => !action.payload.includes(teacher.id),
      );
      state.pagination.total -= action.payload.length;
      if (
        state.selectedTeacher &&
        action.payload.includes(state.selectedTeacher.id)
      ) {
        state.selectedTeacher = null;
      }
    },

    // Selection
    setSelectedTeacher: (state, action: PayloadAction<Teacher | null>) => {
      state.selectedTeacher = action.payload;
    },

    // Filters
    setFilters: (
      state,
      action: PayloadAction<Partial<TeachersState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        status: [],
        specialization: [],
        experience: [],
        search: "",
      };
    },

    // Pagination
    setPagination: (
      state,
      action: PayloadAction<Partial<TeachersState["pagination"]>>,
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Bulk operations
    updateTeacherStatus: (
      state,
      action: PayloadAction<{ ids: string[]; status: Teacher["status"] }>,
    ) => {
      const { ids, status } = action.payload;
      state.teachers.forEach((teacher) => {
        if (ids.includes(teacher.id)) {
          teacher.status = status;
          teacher.updatedAt = new Date();
        }
      });
    },

    // Assignment operations
    assignTeacherToClass: (
      state,
      action: PayloadAction<{ teacherId: string; classId: string }>,
    ) => {
      const { teacherId, classId } = action.payload;
      const teacher = state.teachers.find((t) => t.id === teacherId);
      if (teacher && !teacher.classIds.includes(classId)) {
        teacher.classIds.push(classId);
        teacher.updatedAt = new Date();
      }
    },

    removeTeacherFromClass: (
      state,
      action: PayloadAction<{ teacherId: string; classId: string }>,
    ) => {
      const { teacherId, classId } = action.payload;
      const teacher = state.teachers.find((t) => t.id === teacherId);
      if (teacher) {
        teacher.classIds = teacher.classIds.filter((id) => id !== classId);
        teacher.updatedAt = new Date();
      }
    },

    // Payment operations
    addPaymentToTeacher: (
      state,
      action: PayloadAction<{ teacherId: string; payment: any }>,
    ) => {
      const { teacherId, payment } = action.payload;
      const teacher = state.teachers.find((t) => t.id === teacherId);
      if (teacher) {
        teacher.payments.push(payment);
        teacher.updatedAt = new Date();
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  deleteMultipleTeachers,
  setSelectedTeacher,
  setFilters,
  clearFilters,
  setPagination,
  updateTeacherStatus,
  assignTeacherToClass,
  removeTeacherFromClass,
  addPaymentToTeacher,
} = teachersSlice.actions;

// Selectors
export const selectAllTeachers = (state: RootState) => state.teachers.teachers;
export const selectSelectedTeacher = (state: RootState) =>
  state.teachers.selectedTeacher;
export const selectTeachersLoading = (state: RootState) =>
  state.teachers.loading;
export const selectTeachersError = (state: RootState) => state.teachers.error;
export const selectTeachersFilters = (state: RootState) =>
  state.teachers.filters;
export const selectTeachersPagination = (state: RootState) =>
  state.teachers.pagination;

// Filtered teachers selector
export const selectFilteredTeachers = (state: RootState) => {
  const { teachers, filters } = state.teachers;

  return teachers.filter((teacher) => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(teacher.status)) {
      return false;
    }

    // Specialization filter
    if (filters.specialization.length > 0) {
      const hasSpecialization = teacher.specialization.some((spec) =>
        filters.specialization.some((filter) => spec.includes(filter)),
      );
      if (!hasSpecialization) return false;
    }

    // Experience filter
    if (filters.experience.length > 0) {
      const experienceRange = filters.experience[0];
      if (experienceRange === "0-5" && teacher.experience > 5) return false;
      if (
        experienceRange === "6-10" &&
        (teacher.experience < 6 || teacher.experience > 10)
      )
        return false;
      if (
        experienceRange === "11-20" &&
        (teacher.experience < 11 || teacher.experience > 20)
      )
        return false;
      if (experienceRange === "20+" && teacher.experience < 20) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.teacherId.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.specialization.some((spec) =>
          spec.toLowerCase().includes(searchLower),
        )
      );
    }

    return true;
  });
};

export const selectTeacherById = (state: RootState, id: string) =>
  state.teachers.teachers.find((teacher) => teacher.id === id);

export const selectTeachersBySpecialization = (
  state: RootState,
  specialization: string,
) =>
  state.teachers.teachers.filter((teacher) =>
    teacher.specialization.some((spec) => spec.includes(specialization)),
  );

export const selectActiveTeachers = (state: RootState) =>
  state.teachers.teachers.filter((teacher) => teacher.status === "Active");

export default teachersSlice.reducer;
