// store/userRoleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoleData {
  phone: string;
  dob: Date | string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

interface UserRoleState {
  selectedRole: string | null;
  roleData: Record<string, RoleData>;
}

const initialState: UserRoleState = {
  selectedRole: "student",
  roleData: {
    student: {
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      dob: new Date("2000-01-01"),
      email: "student@major.edu",
      password: "Student@123",
    },
    teacher: {
      firstName: "Jane",
      lastName: "Smith",
      phone: "0987654321",
      dob: new Date("1980-05-10"),
      email: "teacher@major.edu",
      password: "Teacher@123",
    },
    talent: {
      firstName: "Mike",
      lastName: "Talent",
      phone: "1122334455",
      dob: new Date("1995-09-20"),
      email: "talent@major.edu",
      password: "Talent@123",
    },
    school: {
      firstName: "XYZ",
      lastName: "School",
      phone: "6677889900",
      dob: new Date("2010-12-12"),
      email: "school@major.edu",
      password: "School@123",
    },
  },
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
    },
  },
});

export const { setSelectedRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
