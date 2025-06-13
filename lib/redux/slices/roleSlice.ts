import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoleData {
  phone: string;
  dob: Date | null;  // Changed from Date | string to Date | null
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserRoleState {
  selectedRole: string;
  roleData: Record<string, Partial<RoleData>>; // Changed to Partial<RoleData>
  isInitialized: boolean;
}

const initialState: UserRoleState = {
  selectedRole: "student",
  roleData: {
    student: {
      phone: '',
      dob: null,
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    teacher: {
      phone: '',
      dob: null,
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  },
  isInitialized: false,
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
      state.isInitialized = true;
    },
    initializeRole: (state, action: PayloadAction<string>) => {
      if (!state.isInitialized) {
        state.selectedRole = action.payload;
        state.isInitialized = true;
      }
    },
    updateRoleData: (
      state,
      action: PayloadAction<{ role: string; data: Partial<RoleData> }>
    ) => {
      const { role, data } = action.payload;
      state.roleData[role] = { 
        ...state.roleData[role], 
        ...data 
      };
    },
    resetRoleData: (state, action: PayloadAction<string>) => {
      const role = action.payload;
      state.roleData[role] = {
        phone: '',
        dob: null,
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      };
    }
  },
});

export const { 
  setSelectedRole, 
  initializeRole, 
  updateRoleData,
  resetRoleData  // New action exported
} = userRoleSlice.actions;

export default userRoleSlice.reducer;