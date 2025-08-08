import * as z from "zod";

// Common validation schemas
export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits");
export const emailSchema = z.string().email("Invalid email address");
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters");
export const addressSchema = z
  .string()
  .min(5, "Address must be at least 5 characters");

// Student form schema
export const studentFormSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  status: z.enum(["Active", "Inactive", "Suspended"]),
  verified: z.boolean().default(false),
  grade: z.string().min(1, "Grade is required"),
  class: z.string().min(1, "Class is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  enrollmentDate: z.date(),
  dateOfBirth: z.date(),
  address: addressSchema,
  wilaya: z.string().min(1, "Wilaya is required"),
  commune: z.string().min(1, "Commune is required"),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    relationship: z.string().min(1, "Relationship is required"),
  }),
  gpa: z.string().optional(),
  attendance: z.string().optional(),
  parentId: z.string().optional(),
  classIds: z.array(z.string()).default([]),
  teacherIds: z.array(z.string()).default([]),
  totalFees: z.number().min(0).default(0),
  paidAmount: z.number().min(0).default(0),
  pendingAmount: z.number().min(0).default(0),
});

// Teacher form schema
export const teacherFormSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  status: z.enum(["Active", "Inactive", "On Leave"]),
  verified: z.boolean().default(false),
  specialization: z
    .array(z.string())
    .min(1, "At least one specialization is required"),
  qualifications: z
    .array(z.string())
    .min(1, "At least one qualification is required"),
  experience: z.number().min(0, "Experience cannot be negative"),
  joinDate: z.date(),
  dateOfBirth: z.date(),
  address: addressSchema,
  wilaya: z.string().min(1, "Wilaya is required"),
  commune: z.string().min(1, "Commune is required"),
  classIds: z.array(z.string()).default([]),
  subjectIds: z.array(z.string()).default([]),
  studentIds: z.array(z.string()).default([]),
  salary: z.number().min(0, "Salary cannot be negative"),
  paymentSchedule: z.enum(["Monthly", "Weekly", "Per Session"]),
});

// Parent form schema
export const parentFormSchema = z.object({
  parentId: z.string().min(1, "Parent ID is required"),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  status: z.enum(["Active", "Inactive"]),
  verified: z.boolean().default(false),
  dateOfBirth: z.date(),
  address: addressSchema,
  wilaya: z.string().min(1, "Wilaya is required"),
  commune: z.string().min(1, "Commune is required"),
  occupation: z.string().min(1, "Occupation is required"),
  studentIds: z.array(z.string()).default([]),
  relationship: z.enum(["Father", "Mother", "Guardian", "Other"]),
  totalFees: z.number().min(0).default(0),
  paidAmount: z.number().min(0).default(0),
  pendingAmount: z.number().min(0).default(0),
});

// Class form schema
export const classFormSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
  name: z.string().min(2, "Class name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Completed"]),
  grade: z.string().min(1, "Grade is required"),
  subject: z.string().min(1, "Subject is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  schedule: z
    .array(
      z.object({
        day: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .min(1, "At least one schedule is required"),
  room: z.string().min(1, "Room is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  studentIds: z.array(z.string()).default([]),
  maxStudents: z.number().min(1, "Maximum students must be at least 1"),
  currentStudents: z.number().min(0).default(0),
  fee: z.number().min(0, "Fee cannot be negative"),
  paymentMode: z.enum(["Monthly", "Sessional", "Semestrial"]),
});

// Group form schema (for study groups or other groupings)
export const groupFormSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  name: z.string().min(2, "Group name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["Study Group", "Project Group", "Activity Group", "Other"]),
  status: z.enum(["Active", "Inactive", "Completed"]),
  maxMembers: z.number().min(1, "Maximum members must be at least 1"),
  currentMembers: z.number().min(0).default(0),
  createdBy: z.string().min(1, "Creator is required"),
  memberIds: z.array(z.string()).default([]),
  classIds: z.array(z.string()).default([]),
  meetingSchedule: z
    .object({
      frequency: z.enum(["Weekly", "Bi-weekly", "Monthly", "As needed"]),
      day: z.string().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
});

// Export form data types
export type StudentFormData = z.infer<typeof studentFormSchema>;
export type TeacherFormData = z.infer<typeof teacherFormSchema>;
export type ParentFormData = z.infer<typeof parentFormSchema>;
export type ClassFormData = z.infer<typeof classFormSchema>;
export type GroupFormData = z.infer<typeof groupFormSchema>;

// Common options for dropdowns
export const algerianWilayas = [
  "الجزائر",
  "وهران",
  "قسنطينة",
  "باتنة",
  "سطيف",
  "عنابة",
  "تلمسان",
  "غرداية",
  "البليدة",
  "الشلف",
  "تيزي وزو",
  "بجاية",
  "ورقلة",
  "أدرار",
  "الأغواط",
  "بسكرة",
  "تبسة",
  "جيجل",
  "سيدي بلعباس",
  "بشار",
  "المسيلة",
  "المدية",
  "برج بوعريريج",
  "البويرة",
  "تمنراست",
  "الطارف",
  "تندوف",
  "تيسمسيلت",
  "الوادي",
  "خنشلة",
  "سوق أهراس",
  "تيبازة",
  "ميلة",
  "عين الدفلى",
  "النعامة",
  "عين تموشنت",
  "غليزان",
  "غرداية",
  "الجلفة",
  "قالمة",
  "سكيكدة",
  "أم البواقي",
  "معسكر",
  "أولاد جلال",
  "البيض",
  "إليزي",
  "برج باجي مختار",
  "تين دوف",
  "أولاد جلال",
  "المغير",
  "منيعة",
];

export const gradeOptions = [
  { value: "الأولى ابتدائي", label: "الأولى ابتدائي" },
  { value: "الثانية ابتدائي", label: "الثانية ابتدائي" },
  { value: "الثالثة ابتدائي", label: "الثالثة ابتدائي" },
  { value: "الرابعة ابتدائي", label: "الرابعة ابتدائي" },
  { value: "الخامسة ابتدائي", label: "الخامسة ابتدائي" },
  { value: "الأولى متوسط", label: "الأولى متوسط" },
  { value: "الثانية متوسط", label: "الثانية متوسط" },
  { value: "الثالثة متوسط", label: "الثالثة متوسط" },
  { value: "الرابعة متوسط", label: "الرابعة متوسط" },
  { value: "الأولى ثانوي", label: "الأولى ثانوي" },
  { value: "الثانية ثانوي", label: "الثانية ثانوي" },
  { value: "الثالثة ثانوي", label: "الثالثة ثانوي" },
  { value: "الجامعي", label: "الجامعي" },
];

export const subjectOptions = [
  { value: "الرياضيات", label: "الرياضيات" },
  { value: "الفيزياء", label: "الفيزياء" },
  { value: "الكيمياء", label: "الكيمياء" },
  { value: "العلوم الطبيعية", label: "العلوم الطبيعية" },
  { value: "اللغة العربية", label: "اللغة العربية" },
  { value: "اللغة الإنجليزية", label: "اللغة الإنجليزية" },
  { value: "اللغة الفرنسية", label: "اللغة الفرنسية" },
  { value: "التاريخ", label: "التاريخ" },
  { value: "الجغرافيا", label: "الجغرافيا" },
  { value: "التربية الإسلامية", label: "التربية الإسلامية" },
  { value: "التربية المدنية", label: "التربية المدنية" },
  { value: "الفلسفة", label: "الفلسفة" },
  { value: "الاقتصاد", label: "الاقتصاد" },
  { value: "المحاسبة", label: "المحاسبة" },
  { value: "الإعلام الآلي", label: "الإعلام الآلي" },
];

export const relationshipOptions = [
  { value: "Father", label: "الأب" },
  { value: "Mother", label: "الأم" },
  { value: "Guardian", label: "الوصي" },
  { value: "Other", label: "أخرى" },
];

export const statusOptions = [
  { value: "Active", label: "نشط" },
  { value: "Inactive", label: "غير نشط" },
  { value: "Suspended", label: "موقوف" },
];

export const paymentScheduleOptions = [
  { value: "Monthly", label: "شهري" },
  { value: "Weekly", label: "أسبوعي" },
  { value: "Per Session", label: "لكل حصة" },
];

export const paymentModeOptions = [
  { value: "Monthly", label: "شهري" },
  { value: "Sessional", label: "لكل حصة" },
  { value: "Semestrial", label: "فصلي" },
];

export const groupTypeOptions = [
  { value: "Study Group", label: "مجموعة دراسية" },
  { value: "Project Group", label: "مجموعة مشروع" },
  { value: "Activity Group", label: "مجموعة نشاط" },
  { value: "Other", label: "أخرى" },
];

export const frequencyOptions = [
  { value: "Weekly", label: "أسبوعي" },
  { value: "Bi-weekly", label: "كل أسبوعين" },
  { value: "Monthly", label: "شهري" },
  { value: "As needed", label: "حسب الحاجة" },
];

export const daysOfWeek = [
  { value: "Sunday", label: "الأحد" },
  { value: "Monday", label: "الاثنين" },
  { value: "Tuesday", label: "الثلاثاء" },
  { value: "Wednesday", label: "الأربعاء" },
  { value: "Thursday", label: "الخميس" },
  { value: "Friday", label: "الجمعة" },
  { value: "Saturday", label: "السبت" },
];
