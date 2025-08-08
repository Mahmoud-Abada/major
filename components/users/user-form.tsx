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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Save, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
// User types - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AdminUser extends User {
  role: "admin";
}

interface TeacherUser extends User {
  role: "teacher";
}

interface StudentUser extends User {
  role: "student";
}

interface ParentUser extends User {
  role: "parent";
}

// Form validation schemas - comprehensive schema that includes all possible fields
const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  role: z.enum(["admin", "teacher", "student", "parent"]),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  // Admin fields
  department: z.string().optional(),
  position: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  // Teacher fields
  subjects: z.array(z.string()).optional(),
  qualifications: z.array(z.string()).optional(),
  bio: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  yearsOfExperience: z.number().min(0).optional(),
  // Student fields
  studentId: z.string().optional(),
  grade: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal("")),
  parentPhone: z.string().optional(),
  // Parent fields
  relationship: z.enum(["father", "mother", "guardian", "other"]).optional(),
  occupation: z.string().optional(),
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
  submitLabel,
  isEditing = false,
}: UserFormProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const [selectedRole, setSelectedRole] = useState<string>(
    initialData?.role || "student",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string>(initialData?.avatar || "");
  const [subjects, setSubjects] = useState<string[]>(
    (initialData as TeacherUser)?.subjects || [],
  );
  const [qualifications, setQualifications] = useState<string[]>(
    (initialData as TeacherUser)?.qualifications || [],
  );
  const [specializations, setSpecializations] = useState<string[]>(
    (initialData as TeacherUser)?.specializations || [],
  );
  const [permissions, setPermissions] = useState<string[]>(
    (initialData as AdminUser)?.permissions || [],
  );

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      role: selectedRole as "admin" | "teacher" | "student" | "parent",
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
          ? new Date((initialData as StudentUser).dateOfBirth)
              .toISOString()
              .split("T")[0]
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

  // Update form when role changes
  useEffect(() => {
    form.clearErrors();
    // Reset form with new role defaults
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

  const addItem = (
    items: string[],
    setItems: (items: string[]) => void,
    newItem: string,
  ) => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
    }
  };

  const removeItem = (
    items: string[],
    setItems: (items: string[]) => void,
    index: number,
  ) => {
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

  const grades = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
          <TabsTrigger value="role">{t("roleDetails")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
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
                    {t("uploadAvatar")}
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
                {t("avatarDescription")}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t("firstName")} *</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder={`${tCommon("enter")} ${t("firstName").toLowerCase()}`}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">{t("lastName")} *</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder={`${tCommon("enter")} ${t("lastName").toLowerCase()}`}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">{t("email")} *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder={`${tCommon("enter")} ${t("email").toLowerCase()}`}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">{t("phone")}</Label>
              <Input
                id="phoneNumber"
                {...form.register("phoneNumber")}
                placeholder={`${tCommon("enter")} ${t("phone").toLowerCase()}`}
              />
            </div>

            <div>
              <Label htmlFor="role">{t("role")} *</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  form.setValue("role", value as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${tCommon("select")} ${t("role").toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                  <SelectItem value="teacher">{t("roles.teacher")}</SelectItem>
                  <SelectItem value="student">{t("roles.student")}</SelectItem>
                  <SelectItem value="parent">{t("roles.parent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">{tCommon("status")} *</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${tCommon("select")} ${tCommon("status").toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="inactive">
                    {tCommon("inactive")}
                  </SelectItem>
                  <SelectItem value="pending">{tCommon("pending")}</SelectItem>
                  <SelectItem value="suspended">
                    {tCommon("suspended")}
                  </SelectItem>
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
                  <Label htmlFor="department">{t("department")}</Label>
                  <Input
                    id="department"
                    {...form.register("department")}
                    placeholder={`${tCommon("enter")} ${t("department").toLowerCase()}`}
                  />
                </div>
                <div>
                  <Label htmlFor="position">{t("position")}</Label>
                  <Input
                    id="position"
                    {...form.register("position")}
                    placeholder={`${tCommon("enter")} ${t("position").toLowerCase()}`}
                  />
                </div>
              </div>

              <div>
                <Label>{t("permissions")}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission}
                        checked={permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPermissions([...permissions, permission]);
                          } else {
                            setPermissions(
                              permissions.filter((p) => p !== permission),
                            );
                          }
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                  <Label htmlFor="yearsOfExperience">
                    {t("yearsOfExperience")}
                  </Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    {...form.register("yearsOfExperience", {
                      valueAsNumber: true,
                    })}
                    placeholder={`${tCommon("enter")} ${t("yearsOfExperience").toLowerCase()}`}
                  />
                </div>
              </div>

              <div>
                <Label>{t("subjects")} *</Label>
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
                <Select
                  onValueChange={(value) =>
                    addItem(subjects, setSubjects, value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t("addSubject")} />
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
                <Label htmlFor="bio">{t("bio")}</Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder={`${tCommon("enter")} ${t("bio").toLowerCase()}`}
                  rows={3}
                />
              </div>
            </div>
          )}

          {selectedRole === "student" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId">{t("studentId")} *</Label>
                  <Input
                    id="studentId"
                    {...form.register("studentId")}
                    placeholder={`${tCommon("enter")} ${t("studentId").toLowerCase()}`}
                  />
                  {form.formState.errors.studentId && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.studentId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="grade">{t("grade")} *</Label>
                  <Select
                    value={form.watch("grade")}
                    onValueChange={(value) => form.setValue("grade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectGrade")} />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {t("grade")} {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">{t("dateOfBirth")} *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("dateOfBirth")}
                  />
                </div>

                <div>
                  <Label htmlFor="nationality">{t("nationality")}</Label>
                  <Input
                    id="nationality"
                    {...form.register("nationality")}
                    placeholder={`${tCommon("enter")} ${t("nationality").toLowerCase()}`}
                  />
                </div>

                <div>
                  <Label htmlFor="bloodGroup">{t("bloodGroup")}</Label>
                  <Select
                    value={form.watch("bloodGroup")}
                    onValueChange={(value) =>
                      form.setValue("bloodGroup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBloodGroup")} />
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
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder={`${tCommon("enter")} ${t("address").toLowerCase()}`}
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">{t("parentGuardianInfo")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="parentName">{t("parentName")}</Label>
                    <Input
                      id="parentName"
                      {...form.register("parentName")}
                      placeholder={`${tCommon("enter")} ${t("parentName").toLowerCase()}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentEmail">{t("parentEmail")}</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      {...form.register("parentEmail")}
                      placeholder={`${tCommon("enter")} ${t("parentEmail").toLowerCase()}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentPhone">{t("parentPhone")}</Label>
                    <Input
                      id="parentPhone"
                      {...form.register("parentPhone")}
                      placeholder={`${tCommon("enter")} ${t("parentPhone").toLowerCase()}`}
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
                  <Label htmlFor="relationship">{t("relationship")} *</Label>
                  <Select
                    value={form.watch("relationship")}
                    onValueChange={(value) =>
                      form.setValue("relationship", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectRelationship")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">{t("father")}</SelectItem>
                      <SelectItem value="mother">{t("mother")}</SelectItem>
                      <SelectItem value="guardian">{t("guardian")}</SelectItem>
                      <SelectItem value="other">{tCommon("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="occupation">{t("occupation")}</Label>
                  <Input
                    id="occupation"
                    {...form.register("occupation")}
                    placeholder={`${tCommon("enter")} ${t("occupation").toLowerCase()}`}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder={`${tCommon("enter")} ${t("address").toLowerCase()}`}
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
                {isEditing ? t("newPassword") : `${t("password")} *`}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder={
                    isEditing ? t("enterNewPassword") : t("enterPassword")
                  }
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
                <Checkbox
                  id="emailVerified"
                  defaultChecked={initialData?.isEmailVerified}
                />
                <Label htmlFor="emailVerified">{t("emailVerified")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="twoFactor"
                  defaultChecked={initialData?.twoFactorEnabled}
                />
                <Label htmlFor="twoFactor">{t("twoFactorAuth")}</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? t("saving") : submitLabel || t("saveUser")}
        </Button>
      </div>
    </form>
  );
}
