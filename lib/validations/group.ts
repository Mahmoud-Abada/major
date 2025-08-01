/**
 * Group Validation Schemas
 * Zod schemas for group entity validation
 */
import { z } from "zod";

// Main group schema
export const GroupSchema = z
  .object({
    school: z.string().min(1, "School ID is required"),
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    frontPicture: z.string().url().optional(),
    backPicture: z.string().url().optional(),
    isArchived: z.boolean().default(false),
    description: z.string().max(1000, "Description is too long").optional(),
    field: z.string().min(1, "Field is required"),
    level: z.string().min(1, "Level is required"),
    color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"),
    isSemestral: z.boolean().default(false),
    startDate: z.number().positive().optional(),
    endDate: z.number().positive().optional(),
  })
  .refine(
    (data) => {
      // If semestral, start and end dates are required
      if (data.isSemestral && (!data.startDate || !data.endDate)) {
        return false;
      }
      // If dates are provided, end date must be after start date
      if (data.startDate && data.endDate && data.startDate >= data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Semestral groups require valid start and end dates",
      path: ["endDate"],
    },
  );

// Create group schema (without ID and timestamps)
export const CreateGroupSchema = GroupSchema;

// Update group schema
export const UpdateGroupSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  groupData: GroupSchema.partial(),
});

// Group filters schema
export const GroupFiltersSchema = z.object({
  field: z.string().optional(),
  level: z.string().optional(),
  school: z.string().optional(),
  isSemestral: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["title", "field", "level", "createdAt", "updatedAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Group student assignment schema
export const GroupStudentAssignmentSchema = z.object({
  student: z.string().min(1, "Student ID is required"),
  group: z.string().min(1, "Group ID is required"),
});

export const GroupStudentAssignmentsSchema = z.array(
  GroupStudentAssignmentSchema,
);

// Group classroom assignment schema
export const GroupClassroomAssignmentSchema = z.object({
  classroom: z.string().min(1, "Classroom ID is required"),
  group: z.string().min(1, "Group ID is required"),
});

export const GroupClassroomAssignmentsSchema = z.array(
  GroupClassroomAssignmentSchema,
);

// Type exports
export type GroupInput = z.infer<typeof GroupSchema>;
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;
export type GroupFiltersInput = z.infer<typeof GroupFiltersSchema>;
export type GroupStudentAssignmentInput = z.infer<
  typeof GroupStudentAssignmentSchema
>;
export type GroupClassroomAssignmentInput = z.infer<
  typeof GroupClassroomAssignmentSchema
>;
