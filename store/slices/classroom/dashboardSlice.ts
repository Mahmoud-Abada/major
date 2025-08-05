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
    time: "14:00",
    subject: "الرياضيات - الجبر المتقدم",
    teacher: "أ. محمد بن عبد الرحمن الجزائري",
    status: "now",
  },
  {
    id: "sess-2",
    time: "16:30",
    subject: "الفيزياء - الميكانيكا",
    teacher: "د. فاطمة الزهراء بوعلام",
    status: "soon",
  },
  {
    id: "sess-3",
    time: "18:00",
    subject: "علوم الحاسوب - تطوير الويب",
    teacher: "م. ياسين بن صالح التلمساني",
    status: "upcoming",
  },
  {
    id: "sess-4",
    time: "09:00",
    subject: "العلوم الإسلامية - تفسير القرآن",
    teacher: "الشيخ أحمد بن محمد الغرداوي",
    status: "upcoming",
  },
];

const mockClasses: ClassInfo[] = [
  {
    id: "cls-1",
    subject: "الرياضيات - الجبر المتقدم والهندسة التحليلية",
    level: "الثالثة ثانوي",
    teacher: { name: "أ. محمد بن عبد الرحمن الجزائري", avatarUrl: "/avatars/teacher-01.png" },
    studentCount: 25,
    paymentMode: "Paid",
    tag: "Active",
    subjectType: "math",
  },
  {
    id: "cls-2",
    subject: "الفيزياء - الميكانيكا والديناميكا الحرارية",
    level: "الثالثة ثانوي",
    teacher: { name: "د. فاطمة الزهراء بوعلام", avatarUrl: "/avatars/teacher-02.png" },
    studentCount: 20,
    paymentMode: "Paid",
    tag: "Today",
    subjectType: "physics",
  },
  {
    id: "cls-3",
    subject: "اللغة العربية وآدابها - الشعر الجاهلي",
    level: "الثالثة ثانوي",
    teacher: { name: "أ. عبد الكريم مرزوق", avatarUrl: "/avatars/teacher-03.png" },
    studentCount: 27,
    paymentMode: "Paid",
    tag: "Active",
    subjectType: "history",
  },
  {
    id: "cls-4",
    subject: "علوم الحاسوب - تطوير تطبيقات الويب",
    level: "الجامعي",
    teacher: { name: "م. ياسين بن صالح التلمساني", avatarUrl: "/avatars/teacher-04.png" },
    studentCount: 16,
    paymentMode: "Unpaid",
    tag: "Today",
    subjectType: "physics",
  },
  {
    id: "cls-5",
    subject: "العلوم الإسلامية - تفسير القرآن وعلوم الحديث",
    level: "الثالثة ثانوي",
    teacher: { name: "الشيخ أحمد بن محمد الغرداوي", avatarUrl: "/avatars/teacher-05.png" },
    studentCount: 23,
    paymentMode: "Paid",
    tag: "Active",
    subjectType: "history",
  },
  {
    id: "cls-6",
    subject: "علوم الطبيعة والحياة - البيولوجيا الجزيئية",
    level: "الثالثة ثانوي",
    teacher: { name: "د. سعاد بن عيسى", avatarUrl: "/avatars/teacher-06.png" },
    studentCount: 22,
    paymentMode: "Paid",
    tag: "Tomorrow",
    subjectType: "chemistry",
  },
  {
    id: "cls-7",
    subject: "التاريخ والجغرافيا - تاريخ الجزائر المعاصر",
    level: "الثالثة ثانوي",
    teacher: { name: "أ. نور الدين بلعباس", avatarUrl: "/avatars/teacher-07.png" },
    studentCount: 29,
    paymentMode: "Paid",
    tag: "Active",
    subjectType: "history",
  },
  {
    id: "cls-8",
    subject: "اللغة الفرنسية - الأدب الفرنسي والتعبير",
    level: "الثالثة ثانوي",
    teacher: { name: "أ. خديجة بن عمر", avatarUrl: "/avatars/teacher-08.png" },
    studentCount: 24,
    paymentMode: "Unpaid",
    tag: "Today",
    subjectType: "history",
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
