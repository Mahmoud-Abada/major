import { z } from "zod";

// ─────────────────────────────
// Common reusable schemas
// ─────────────────────────────

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be at most 32 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const emailSchema = z
  .string()
  .email("Invalid email address")
  .transform((val) => val.toLowerCase());

const phoneSchema = z
  .string()
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^[0-9]+$/, "Phone number must contain only numbers");

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(/^[a-zA-Z\s-']+$/, "Name can only contain letters and hyphens");

const genderSchema = z.enum(["male", "female"], {
  errorMap: () => ({ message: "Please select a gender" }),
});

// Updated location schema to match our new implementation
const locationSchema = z.object({
  type: z.enum(["manual", "map"]),
  comune: z
    .object({
      id: z.string(),
      post_code: z.string(),
      name: z.string(),
      wilaya_id: z.string(),
      ar_name: z.string(),
      longitude: z.string(),
      latitude: z.string(),
    })
    .optional(),
  address: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  wilaya_id: z.string().optional(),
  post_code: z.string().optional(),
});

const socialLinksSchema = z
  .object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    tiktok: z.string().url().optional(),
    youtube: z.string().url().optional(),
    website: z.string().url().optional(),
  })
  .catchall(z.string().url().optional());

// Date validation for students (6+ years old)
const studentDobSchema = z.date().refine(
  (date) => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    const maxDate = new Date(
      today.getFullYear() - 6,
      today.getMonth(),
      today.getDate()
    );
    return date >= minDate && date <= maxDate;
  },
  { message: "You must be at least 6 years old" }
);

// Date validation for teachers (18+ years old)
const teacherDobSchema = z.date().refine(
  (date) => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return date >= minDate && date <= maxDate;
  },
  { message: "You must be at least 18 years old" }
);

// ─────────────────────────────
// Person (Student/Teacher) Schema
// ─────────────────────────────

const personBaseSchema = z
  .object({
    role: z.enum(["student", "teacher"]),
    firstName: nameSchema,
    lastName: nameSchema,
    gender: genderSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    dob: z.date(),
    location: locationSchema.optional(),
    profilePicture: z.instanceof(File).optional(),
    interests: z.string().optional(),
    educationLevel: z.string().optional(),
    educationField: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "student") {
        return studentDobSchema.safeParse(data.dob).success;
      } else if (data.role === "teacher") {
        return teacherDobSchema.safeParse(data.dob).success;
      }
      return true;
    },
    {
      message: "Invalid date of birth for your role",
      path: ["dob"],
    }
  );

// Add password match validation
export const personSchema = personBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

// ─────────────────────────────
// School Schema
// ─────────────────────────────


  const schoolBaseSchema = z.object({
    location: locationSchema,
    email: emailSchema,
    phone: phoneSchema,
    representativeName: nameSchema,
    representativeRole: z.string().min(1, "Representative role is required"),
    customRepresentativeRole: z.string().optional(),
    branchesCount: z.number().int().min(1).max(100).default(1),
    approxTeachers: z.number().int().min(1).max(10000),
    approxStudents: z.number().int().min(1).max(100000),
    password: passwordSchema,
    confirmPassword: z.string(),
    profilePicture: z.instanceof(File).optional(),
    socialLinks: socialLinksSchema.optional(),
    role: z.literal("school"),
    schoolName: nameSchema,
    schoolType: z.string().min(1, "School type is required"),
    customSchoolType: z.string().optional(),
  }).superRefine((data, ctx) => {
    // School type validation
    if (data.schoolType === "other" && !data.customSchoolType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify school type",
        path: ["customSchoolType"]
      });
    }
    
    // Representative role validation
    if (data.representativeRole === "other" && !data.customRepresentativeRole) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify representative role",
        path: ["customRepresentativeRole"]
      });
    }
  });

// Add password match validation
export const schoolSchema = schoolBaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.location.type === "manual") {
        return !!data.location.comune?.wilaya_id;
      }
      return true;
    },
    {
      message: "Wilaya is required when selecting from list",
      path: ["location"],
    }
  );

// ─────────────────────────────
// Main Signup Discriminated Union
// ─────────────────────────────
/*
export const signUpSchema = z.discriminatedUnion("role", [
  personBaseSchema,
  schoolBaseSchema,
]);*/

// ─────────────────────────────
// Types
// ─────────────────────────────

//export type SignUpInput = z.infer<typeof signUpSchema>;
export type PersonSignUpInput = z.infer<typeof personSchema>;
export type SchoolSignUpInput = z.infer<typeof schoolSchema>;

export const getSignupSchema = (role: string | null) => {
  switch (role) {
    case "student":
    case "teacher":
      return personSchema;
    case "school":
      return schoolSchema;
    default:
      return z.object({});
  }
};
