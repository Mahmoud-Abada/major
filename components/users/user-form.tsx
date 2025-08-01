"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AdminUser, ParentUser, StudentUser, TeacherUser, User } from "@/data/mock/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schemas
const baseUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  role: z.enum(["admin", "teacher", "student", "parent"]),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

const adminSchema = baseUserSchema.extend({
  role: z.literal("admin"),
  department: z.string().optional(),
  position: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

const teacherSchema = baseUserSchema.extend({
  role: z.literal("teacher"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  qualifications: z.array(z.string()).default([]),
  bio: z.string().optional(),
  specializations: z.array(z.string()).default([]),
  yearsOfExperience: z.number().min(0).default(0),
});

const studentSchema = baseUserSchema.extend({
  role: z.literal("student"),
  studentId: z.string().min(1, "Student ID is required"),
  grade: z.string().min(1, "Grade is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal("")),
  parentPhone: z.string().optional(),
});

const parentSchema = baseUserSchema.extend({
  role: z.literal("parent"),
  relationship: z.enum(["father", "mother", "guardian", "other"]),
  occupation: z.string().optional(),
  address: z.string().optional(),
});

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEditing?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save User",
  isEditing = false,
}: UserFormProps) {
  const [selectedRole, setSelectedRole] = useState<string>(initialData?.role || "student");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string>(initialData?.avatar || "");
  const [subjects, setSubjects] = useState<string[]>(
    (initialData as TeacherUser)?.subjects || []
  );
  const [qualifications, setQualifications] = useState<string[]>(
    (initialData as TeacherUser)?.qualifications || []
  );
  const [specializations, setSpecializations] = useState<string[]>(
    (initialData as TeacherUser)?.specializations || []
  );
  const [permissions, setPermissions] = useState<string[]>(
    (initialData as AdminUser)?.permissions || []
  );

  // Get the appropriate schema based on role
  const getSchema = (role: string) => {
    switch (role) {
      case "admin":
        return adminSchema;
      case "teacher":
        return teacherSchema;
      case "student":
        return studentSchema;
      case "parent":
        return parentSchema;
      default:
        return baseUserSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema(selectedRole)),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      role: selectedRole,
      status: initialData?.status || "active",
      password: "",
      // Role-specific defaults
      ...(selectedRole === "admin" && {
        department: (initialData as AdminUser)?.department || "",
        position: (initialData as AdminUser)?.position || "",
        permissions: permissions,
      }),
      ...(selectedRole === "teacher" && {
        subjects: subjects,
        qualifications: qualifications,
        bio: (initialData as TeacherUser)?.bio || "",
        specializations: specializations,
        yearsOfExperience: (initialData as TeacherUser)?.yearsOfExperience || 0,
      }),
      ...(selectedRole === "student" && {
        studentId: (initialData as StudentUser)?.studentId || "",
        grade: (initialData as StudentUser)?.grade || "",
        dateOfBirth: (initialData as StudentUser)?.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
        nationality: (initialData as StudentUser)?.nationality || "",
        bloodGroup: (initialData as StudentUser)?.bloodGroup || "",
        address: (initialData as StudentUser)?.address || "",
        parentName: (initialData as StudentUser)?.parentName || "",
        parentEmail: (initialData as StudentUser)?.parentEmail || "",
        parentPhone: (initialData as StudentUser)?.parentPhone || "",
      }),
      ...(selectedRole === "parent" && {
        relationship: (initialData as ParentUser)?.relationship || "father",
        occupation: (initialData as ParentUser)?.occupation || "",
        address: (initialData as ParentUser)?.address || "",
      }),
    },
  });

  // Update form schema when role changes
  useEffect(() => {
    const newSchema = getSchema(selectedRole);
    form.clearErrors();
    // Reset form with new schema defaults
  }, [selectedRole, form]);

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      avatar,
      ...(selectedRole === "teacher" && {
        subjects,
        qualifications,
        specializations,
      }),
      ...(selectedRole === "admin" && {
        permissions,
      }),
    };

    onSubmit(formData);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (items: string[], setItems: (items: string[]) => void, newItem: string) => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
    }
  };

  const removeItem = (items: string[], setItems: (items: string[]) => void, index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const availablePermissions = [
    "manage_users",
    "manage_classes",
    "manage_finances",
    "system_settings",
    "view_reports",
    "manage_content",
  ];

  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Arabic",
    "French",
    "History",
    "Geography",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
  ];

  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="role">Role Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} alt="User avatar" />
              <AvatarFallback>
                {form.watch("firstName")?.charAt(0) || "U"}
                {form.watch("lastName")?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Avatar
                  </span>
                </Button>
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF (max 2MB)
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder="Enter first name"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder="Enter last name"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="Enter email address"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...form.register("phoneNumber")}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  form.setValue("role", value as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="role" className="space-y-6">
          {/* Role-specific fields */}
          {selectedRole === "admin" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    {...form.register("department")}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    {...form.register("position")}
                    placeholder="Enter position"
                  />
                </div>
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPermissions([...permissions, permission]);
                          } else {
                            setPermissions(permissions.filter((p) => p !== permission));
                          }
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedRole === "teacher" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    {...form.register("yearsOfExperience", { valueAsNumber: true })}
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>

              <div>
                <Label>Subjects *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeItem(subjects, setSubjects, index)}
                    >
                      {subject} ×
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={(value) => addItem(subjects, setSubjects, value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Add subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects
                      .filter((subject) => !subjects.includes(subject))
                      .map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder="Enter bio"
                  rows={3}
                />
              </div>
            </div>
          )}

          {selectedRole === "student" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    {...form.register("studentId")}
                    placeholder="Enter student ID"
                  />
                  {form.formState.errors.studentId && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.studentId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="grade">Grade *</Label>
                  <Select
                    value={form.watch("grade")}
                    onValueChange={(value) => form.setValue("grade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("dateOfBirth")}
                  />
                </div>

                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    {...form.register("nationality")}
                    placeholder="Enter nationality"
                  />
                </div>

                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={form.watch("bloodGroup")}
                    onValueChange={(value) => form.setValue("bloodGroup", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter address"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Parent/Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="parentName">Parent Name</Label>
                    <Input
                      id="parentName"
                      {...form.register("parentName")}
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentEmail">Parent Email</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      {...form.register("parentEmail")}
                      placeholder="Enter parent email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentPhone">Parent Phone</Label>
                    <Input
                      id="parentPhone"
                      {...form.register("parentPhone")}
                      placeholder="Enter parent phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedRole === "parent" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select
                    value={form.watch("relationship")}
                    onValueChange={(value) => form.setValue("relationship", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    {...form.register("occupation")}
                    placeholder="Enter occupation"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter address"
                  rows={2}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">
                {isEditing ? "New Password (leave blank to keep current)" : "Password *"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder={isEditing ? "Enter new password" : "Enter password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="emailVerified" defaultChecked={initialData?.isEmailVerified} />
                <Label htmlFor="emailVerified">Email Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="twoFactor" defaultChecked={initialData?.twoFactorEnabled} />
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}