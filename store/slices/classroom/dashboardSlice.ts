import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface Session {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  status: "now" | "upcoming" | "soon";
}

export interface ClassInfo {
  id: string;
  subject: string;
  level: string;
  teacher: {
    name: string;
    avatarUrl: string;
  };
  studentCount: number;
  paymentMode: "Paid" | "Unpaid";
  tag: "Today" | "Active" | "Tomorrow";
  subjectType: "math" | "physics" | "chemistry" | "history";
}

interface DashboardState {
  sessions: Session[];
  classes: ClassInfo[];
  groups: ClassInfo[];
  events: ClassInfo[];
  loading: boolean;
  error: string | null;
}

const mockSessions: Session[] = [
  {
    id: "sess-1",
    time: "10:00 AM",
    subject: "Quantum Physics",
    teacher: "Dr. Evelyn Reed",
    status: "now",
  },
  {
    id: "sess-2",
    time: "11:30 AM",
    subject: "Organic Chemistry",
    teacher: "Mr. Alan Grant",
    status: "soon",
  },
  {
    id: "sess-3",
    time: "02:00 PM",
    subject: "World History",
    teacher: "Ms. Sarah Connor",
    status: "upcoming",
  },
];

const mockClasses: ClassInfo[] = [
  {
    id: "cls-1",
    subject: "Advanced Calculus",
    level: "Grade 12",
    teacher: { name: "Maria Hill", avatarUrl: "/avatars/01.png" },
    studentCount: 25,
    paymentMode: "Paid",
    tag: "Active",
    subjectType: "math",
  },
  {
    id: "cls-2",
    subject: "Classical Mechanics",
    level: "University Prep",
    teacher: { name: "John Doe", avatarUrl: "/avatars/02.png" },
    studentCount: 18,
    paymentMode: "Unpaid",
    tag: "Today",
    subjectType: "physics",
  },
  {
    id: "cls-3",
    subject: "Chemical Reactions",
    level: "Grade 11",
    teacher: { name: "Jane Smith", avatarUrl: "/avatars/03.png" },
    studentCount: 32,
    paymentMode: "Paid",
    tag: "Active",
    subjectType: "chemistry",
  },
];

const initialState: DashboardState = {
  sessions: mockSessions,
  classes: mockClasses,
  groups: mockClasses
    .slice(0, 2)
    .map((c) => ({ ...c, id: c.id.replace("cls", "grp") })),
  events: mockClasses
    .slice(1, 2)
    .map((c) => ({ ...c, id: c.id.replace("cls", "evt") })),
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = dashboardSlice.actions;

export const selectUpcomingSessions = (state: RootState) =>
  state.dashboard.sessions;
export const selectClasses = (state: RootState) => state.dashboard.classes;
export const selectGroups = (state: RootState) => state.dashboard.groups;
export const selectEvents = (state: RootState) => state.dashboard.events;
export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.loading;

export default dashboardSlice.reducer;
