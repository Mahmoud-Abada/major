import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoleData {
  phone: string;
  dob: Date | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type RoleType = "student" | "teacher" | "school"; // ensures type-safe access

interface UserRoleState {
  user: any;
  selectedRole: RoleType;
  roleData: Record<RoleType, Partial<RoleData>>;
  isInitialized: boolean;
}

const initialRoleData: Partial<RoleData> = {
  phone: "",
  dob: null,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const initialState: UserRoleState = {
  selectedRole: "student",
  roleData: {
    student: { ...initialRoleData },
    teacher: { ...initialRoleData },
    school: { ...initialRoleData },
  },
  isInitialized: false,
  user: undefined,
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<RoleType>) => {
      state.selectedRole = action.payload;
      state.isInitialized = true;
    },
    initializeRole: (state, action: PayloadAction<RoleType>) => {
      if (!state.isInitialized) {
        state.selectedRole = action.payload;
        state.isInitialized = true;
      }
    },
    updateRoleData: (
      state,
      action: PayloadAction<{ role: RoleType; data: Partial<RoleData> }>,
    ) => {
      state.roleData[action.payload.role] = {
        ...state.roleData[action.payload.role],
        ...action.payload.data,
      };
    },
    resetRoleData: (state, action: PayloadAction<RoleType>) => {
      state.roleData[action.payload] = { ...initialRoleData };
    },
  },
});

export const {
  setSelectedRole,
  initializeRole,
  updateRoleData,
  resetRoleData,
} = userRoleSlice.actions;

export type { RoleType };
export default userRoleSlice.reducer;
