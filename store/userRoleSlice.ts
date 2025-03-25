// store/userRoleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserRoleState {
  selectedRole: string | null;
  roleData: Record<string, { firstName?: string; lastName?: string; email: string; password: string }>;
}

const initialState: UserRoleState = {
  selectedRole: "student",
  roleData: {
    student: { firstName: "John", lastName: "Doe", email: "student@major.edu", password: "Student@123" },
    teacher: { firstName: "Jane", lastName: "Smith", email: "teacher@major.edu", password: "Teacher@123" },
    talent: { firstName: "Mike", lastName: "Talent", email: "talent@major.edu", password: "Talent@123" },
    school: { firstName: "XYZ", lastName: "School", email: "school@major.edu", password: "School@123" }
  }
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
    }
  }
});

export const { setSelectedRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
