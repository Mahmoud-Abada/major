/**
 * Mark Validation Schemas
 * Zod schemas for mark entity validation
 */
import { z } from "zod";

// Main mark schema
export const MarkSchema = z
  .object({
    student: z.string().min(1, "Student ID is required"),
    classroom: z.string().optional(),
    group: z.string().optional(),
    subject: z.string().min(1, "Subject is required"),
    markType: z.enum(["homework", "quiz", "exam", "participation"], {
      errorMap: () => ({
        message: "Mark type must be homework, quiz, exam, or participation",
      }),
    }),
    value: z.number().min(0, "Mark value cannot be negative"),
    maxValue: z.number().positive("Maximum value must be positive"),
    date: z.number().positive("Date is required"),
    description: z.string().max(500, "Description is too long").optional(),
    isExempted: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Value cannot exceed maxValue unless exempted
      if (!data.isExempted && data.value > data.maxValue) {
        return false;
      }
      // Must have either classroom or group
      if (!data.classroom && !data.group) {
        return false;
      }
      return true;
    },
    {
      message:
        "Mark value cannot exceed maximum value, and either classroom or group must be specified",
      path: ["value"],
    },
  );

// Create mark schema (without ID and timestamps)
export const CreateMarkSchema = MarkSchema;

// Update mark schema
export const UpdateMarkSchema = z.object({
  markId: z.string().min(1, "Mark ID is required"),
  markData: MarkSchema.partial(),
});

// Student mark update schema
export const UpdateStudentMarkSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  markId: z.string().min(1, "Mark ID is required"),
  markData: MarkSchema.partial(),
});

// Group mark update schema
export const UpdateGroupMarkSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  markId: z.string().min(1, "Mark ID is required"),
  markData: MarkSchema.partial(),
});

// Group exemption schema
export const GroupExemptionSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  isExempted: z.boolean(),
});

// Mark filters schema
export const MarkFiltersSchema = z.object({
  student: z.string().optional(),
  classroom: z.string().optional(),
  group: z.string().optional(),
  subject: z.string().optional(),
  markType: z.enum(["homework", "quiz", "exam", "participation"]).optional(),
  dateRange: z
    .object({
      start: z.number().positive(),
      end: z.number().positive(),
    })
    .refine((data) => data.start < data.end, {
      message: "End date must be after start date",
      path: ["end"],
    })
    .optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["date", "value", "subject", "markType", "createdAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Get student marks schema
export const GetStudentMarksSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  classroomId: z.string().optional(),
  groupId: z.string().optional(),
});

// Bulk mark entry schema
export const BulkMarkEntrySchema = z
  .object({
    marks: z.array(CreateMarkSchema).min(1, "At least one mark is required"),
    classroom: z.string().optional(),
    group: z.string().optional(),
  })
  .refine(
    (data) => {
      // Must have either classroom or group
      if (!data.classroom && !data.group) {
        return false;
      }
      return true;
    },
    {
      message: "Either classroom or group must be specified",
      path: ["classroom"],
    },
  );

// Type exports
export type MarkInput = z.infer<typeof MarkSchema>;
export type CreateMarkInput = z.infer<typeof CreateMarkSchema>;
export type UpdateMarkInput = z.infer<typeof UpdateMarkSchema>;
export type UpdateStudentMarkInput = z.infer<typeof UpdateStudentMarkSchema>;
export type UpdateGroupMarkInput = z.infer<typeof UpdateGroupMarkSchema>;
export type GroupExemptionInput = z.infer<typeof GroupExemptionSchema>;
export type MarkFiltersInput = z.infer<typeof MarkFiltersSchema>;
export type GetStudentMarksInput = z.infer<typeof GetStudentMarksSchema>;
export type BulkMarkEntryInput = z.infer<typeof BulkMarkEntrySchema>;
