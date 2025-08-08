import { Class } from "@/types/classroom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClassesState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
      state.loading = false;
      state.error = null;
    },
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.push(action.payload);
    },
    updateClass: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Class> }>,
    ) => {
      const index = state.classes.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = {
          ...state.classes[index],
          ...action.payload.data,
          updatedAt: new Date(),
        };
      }
    },
    removeClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter((c) => c.id !== action.payload);
    },
    addStudentToClass: (
      state,
      action: PayloadAction<{ classId: string; studentId: string }>,
    ) => {
      const classIndex = state.classes.findIndex(
        (c) => c.id === action.payload.classId,
      );
      if (classIndex !== -1) {
        const currentClass = state.classes[classIndex];
        if (!currentClass.studentIds.includes(action.payload.studentId)) {
          currentClass.studentIds.push(action.payload.studentId);
          currentClass.currentStudents = currentClass.studentIds.length;
          currentClass.updatedAt = new Date();
        }
      }
    },
    removeStudentFromClass: (
      state,
      action: PayloadAction<{ classId: string; studentId: string }>,
    ) => {
      const classIndex = state.classes.findIndex(
        (c) => c.id === action.payload.classId,
      );
      if (classIndex !== -1) {
        const currentClass = state.classes[classIndex];
        currentClass.studentIds = currentClass.studentIds.filter(
          (id) => id !== action.payload.studentId,
        );
        currentClass.currentStudents = currentClass.studentIds.length;
        currentClass.updatedAt = new Date();
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setClasses,
  addClass,
  updateClass,
  removeClass,
  addStudentToClass,
  removeStudentFromClass,
} = classesSlice.actions;

// Selectors
export const selectAllClasses = (state: { classes: ClassesState }) =>
  state.classes.classes;
export const selectClassById = (state: { classes: ClassesState }, id: string) =>
  state.classes.classes.find((c) => c.id === id);
export const selectClassesByTeacher = (
  state: { classes: ClassesState },
  teacherId: string,
) => state.classes.classes.filter((c) => c.teacherId === teacherId);
export const selectClassesByGrade = (
  state: { classes: ClassesState },
  grade: string,
) => state.classes.classes.filter((c) => c.grade === grade);
export const selectActiveClasses = (state: { classes: ClassesState }) =>
  state.classes.classes.filter((c) => c.status === "Active");
export const selectClassesLoading = (state: { classes: ClassesState }) =>
  state.classes.loading;
export const selectClassesError = (state: { classes: ClassesState }) =>
  state.classes.error;

export default classesSlice.reducer;
