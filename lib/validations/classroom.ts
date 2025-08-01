/**
 * Classroom Validation Schemas
 * Zod schemas for classroom entity validation
 */
import { z } from "zod";

// Location schema
const LocationSchema = z.object({
  fullLocation: z.string().optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    long: z.number().min(-180).max(180),
  }),
  wilaya: z.string().min(1, "Wilaya is required"),
  commune: z.string().min(1, "Commune is required"),
});

// Schedule item schema
const ScheduleItemSchema = z
  .object({
    day: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  })
  .refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);
      return start < end;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

// Semester pricing schema
const SemesterPricingSchema = z
  .object({
    semester: z.string().min(1, "Semester name is required"),
    price: z.number().positive("Price must be positive"),
    startDate: z.number().positive("Start date is required"),
    endDate: z.number().positive("End date is required"),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Main classroom schema
export const ClassroomSchema = z
  .object({
    teacher: z.string().min(1, "Teacher ID is required"),
    school: z.string().optional(),
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    location: LocationSchema,
    frontPicture: z.string().url().optional(),
    backPicture: z.string().url().optional(),
    isArchived: z.boolean().default(false),
    description: z.string().max(1000, "Description is too long").optional(),
    field: z.string().min(1, "Field is required"),
    level: z.string().min(1, "Level is required"),
    color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"),
    maxStudents: z.number().positive().optional(),
    price: z.number().positive("Price must be positive"),
    schedule: z
      .array(ScheduleItemSchema)
      .min(1, "At least one schedule item is required"),
    mode: z.enum(["monthly", "sessional", "semestrial"]),
    perDuration: z.number().positive().optional(),
    perSessions: z.number().positive().optional(),
    perSemester: z.array(SemesterPricingSchema).optional(),
  })
  .refine(
    (data) => {
      // Validate mode-specific fields
      if (data.mode === "monthly" && !data.perDuration) {
        return false;
      }
      if (data.mode === "sessional" && !data.perSessions) {
        return false;
      }
      if (
        data.mode === "semestrial" &&
        (!data.perSemester || data.perSemester.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Mode-specific fields are required",
      path: ["mode"],
    },
  );

// Create classroom schema (without ID and timestamps)
export const CreateClassroomSchema = ClassroomSchema;

// Update classroom schema (all fields optional except ID)
export const UpdateClassroomSchema = z.object({
  classroomId: z.string().min(1, "Classroom ID is required"),
  classroomData: ClassroomSchema.partial(),
});

// Classroom filters schema
export const ClassroomFiltersSchema = z.object({
  status: z.enum(["active", "archived"]).optional(),
  field: z.string().optional(),
  level: z.string().optional(),
  teacher: z.string().optional(),
  school: z.string().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["title", "field", "level", "createdAt", "updatedAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  pagination: z.object({
    numItems: z.number().positive().max(100),
    cursor: z.string().optional(),
  }),
  fetchBy: z.object({
    userType: z.string(),
    userId: z.string(),
  }),
});

// Classroom assignment schema
export const ClassroomAssignmentSchema = z.object({
  classroom: z.string().min(1, "Classroom ID is required"),
  student: z.string().min(1, "Student ID is required"),
});

export const ClassroomAssignmentsSchema = z.array(ClassroomAssignmentSchema);

// Type exports
export type ClassroomInput = z.infer<typeof ClassroomSchema>;
export type CreateClassroomInput = z.infer<typeof CreateClassroomSchema>;
export type UpdateClassroomInput = z.infer<typeof UpdateClassroomSchema>;
export type ClassroomFiltersInput = z.infer<typeof ClassroomFiltersSchema>;
export type ClassroomAssignmentInput = z.infer<
  typeof ClassroomAssignmentSchema
>;
