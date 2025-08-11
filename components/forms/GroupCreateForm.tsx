"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  GraduationCap,
  ImageIcon,
  Palette,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the schema based on Group API interface
const groupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  field: z.string().min(1, "Field is required"),
  level: z.string().min(1, "Level is required"),
  color: z.string().min(1, "Color is required"),
  frontPicture: z.string().optional(),
  backPicture: z.string().optional(),
  maxStudents: z.number().min(1, "Max students must be at least 1"),
  major: z.string().min(1, "Major is required"),
  isSemestral: z.boolean().optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

const FIELDS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "French",
  "Arabic",
  "English",
  "History",
  "Geography",
  "Philosophy",
  "Computer Science",
  "Languages",
  "Literature",
];

const LEVELS = ["Primary", "Middle School", "High School", "University"];

const MAJORS_OPTIONS = [
  "Science",
  "Literature",
  "Mathematics",
  "Languages",
  "Arts",
  "Technology",
  "Medicine",
  "Engineering",
  "Business",
  "Law",
];

// Updated colors - Top 15 colors for group themes (exact same as classroom)
const COLORS = [
  "hsl(var(--primary))", // Purple (primary)
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F43F5E", // Rose
  "#A855F7", // Purple variant
  "#22C55E", // Green
];

interface GroupCreateFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function GroupCreateForm({
  onSubmit,
  onCancel,
  loading = false,
}: GroupCreateFormProps) {
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string>("");
  const [backImagePreview, setBackImagePreview] = useState<string>("");

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      title: "",
      description: "",
      field: "",
      level: "",
      color: COLORS[0],
      frontPicture: "",
      backPicture: "",
      maxStudents: undefined,
      major: "",
      isSemestral: false,
    },
  });

  const watchedTitle = form.watch("title");
  const watchedField = form.watch("field");
  const watchedLevel = form.watch("level");
  const watchedColor = form.watch("color");
  const watchedDescription = form.watch("description");
  const watchedMajor = form.watch("major");
  const watchedMaxStudents = form.watch("maxStudents");
  const watchedIsSemestral = form.watch("isSemestral");

  // Exact same image upload handler as classroom
  const handleImageUpload = (file: File, type: "front" | "back") => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === "front") {
          setFrontImageFile(file);
          setFrontImagePreview(result);
          form.setValue(
            "frontPicture",
            `https://mock-storage.com/images/${file.name}`,
          );
        } else {
          setBackImageFile(file);
          setBackImagePreview(result);
          form.setValue(
            "backPicture",
            `https://mock-storage.com/images/${file.name}`,
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (type: "front" | "back") => {
    if (type === "front") {
      setFrontImageFile(null);
      setFrontImagePreview("");
      form.setValue("frontPicture", "");
    } else {
      setBackImageFile(null);
      setBackImagePreview("");
      form.setValue("backPicture", "");
    }
  };

  // No need for add/remove functions since we're using a single major selection

  const handleSubmit = async (data: GroupFormData) => {
    // Validate semestral dates if enabled
    if (data.isSemestral && (!data.startDate || !data.endDate)) {
      if (typeof window !== "undefined") {
        const event = new CustomEvent("show-notification", {
          detail: {
            type: "error",
            title: "Dates Required",
            message: "Please provide start and end dates for semestral groups",
          },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    // Format data according to exact API structure
    const groupData = {
      title: data.title,
      frontPicture: data.frontPicture || "https://example.com/group-front.jpg",
      backPicture: data.backPicture || "https://example.com/group-back.jpg",
      isArchived: false,
      description: data.description || "Group for advanced students.",
      level: data.level,
      major: data.major, // Use the selected major directly
      color: data.color,
      maxStudents: data.maxStudents,
      isSemestral: data.isSemestral || false,
      startDate: data.startDate || Date.now(),
      endDate: data.endDate || Date.now() + (6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
    };

    onSubmit(groupData);
  };

  // Calculate completion for steps
  const getStepCompletion = (step: string) => {
    switch (step) {
      case "basic":
        return (
          (((watchedTitle ? 1 : 0) +
            (watchedField ? 1 : 0) +
            (watchedLevel ? 1 : 0) +
            (watchedMaxStudents ? 1 : 0) +
            (watchedMajor ? 1 : 0)) /
            5) *
          100
        );
      case "details":
        return (
          (((watchedDescription ? 1 : 0) + (watchedColor ? 1 : 0)) / 2) * 100
        );
      case "images":
        return (
          (((frontImagePreview ? 1 : 0) + (backImagePreview ? 1 : 0)) / 2) * 100
        );
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Header - Exact same as classroom */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Group
            </h1>
            <p className="text-muted-foreground mt-1">
              Set up your group with basic information and settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Advanced Mathematics Study Group"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="field"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Field *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full">
                                {FIELDS.map((fieldOption) => (
                                  <SelectItem
                                    key={fieldOption}
                                    value={fieldOption}
                                  >
                                    {fieldOption}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education Level *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full">
                                {LEVELS.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4" />
                                      {level}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="maxStudents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Students *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 42"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Major Selection */}
                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Select specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              {MAJORS_OPTIONS.map((major) => (
                                <SelectItem key={major} value={major}>
                                  {major}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your group's purpose, goals, and what members can expect..."
                              {...field}
                              className="min-h-[120px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Color Selection - Exact same as classroom */}
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Theme Color
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-3 flex-wrap">
                              {COLORS.map((color, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${field.value === color
                                    ? "border-foreground shadow-lg scale-105"
                                    : "border-border"
                                    }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => field.onChange(color)}
                                />
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Semestral Toggle */}
                    <FormField
                      control={form.control}
                      name="isSemestral"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Semestral Group
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Enable if this group follows a semester schedule
                            </div>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Semester Dates - Only show if semestral */}
                    {watchedIsSemestral && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="date"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? new Date(e.target.value).getTime()
                                          : undefined,
                                      )
                                    }
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                        : ""
                                    }
                                    className="h-11 pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="date"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? new Date(e.target.value).getTime()
                                          : undefined,
                                      )
                                    }
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                        : ""
                                    }
                                    className="h-11 pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Images Upload - Exact same as classroom */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-primary" />
                      Group Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Front Picture - Exact same as classroom */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Front Picture
                        </label>
                        <div
                          className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                              handleImageUpload(file, "front");
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          {frontImagePreview ? (
                            <div className="relative">
                              <img
                                src={frontImagePreview}
                                alt="Front preview"
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearImage("front");
                                }}
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Drop image here or click to upload
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "front");
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Back Picture - Exact same as classroom */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Back Picture
                        </label>
                        <div
                          className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                              handleImageUpload(file, "back");
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          {backImagePreview ? (
                            <div className="relative">
                              <img
                                src={backImagePreview}
                                alt="Back preview"
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearImage("back");
                                }}
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Drop image here or click to upload
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "back");
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Preview Section - Exact same layout as classroom */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Group Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Group Card Preview */}
                  <div
                    className="relative rounded-lg overflow-hidden border-2 transition-all"
                    style={{ borderColor: watchedColor }}
                  >
                    <div
                      className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                      style={{ backgroundColor: `${watchedColor}20` }}
                    >
                      {frontImagePreview ? (
                        <img
                          src={frontImagePreview}
                          alt="Front preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg">
                        {watchedTitle || "Group Title"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{watchedLevel || "Level"}</span>
                        <span>•</span>
                        <span>{watchedField || "Subject"}</span>
                      </div>
                      {watchedDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {watchedDescription}
                        </p>
                      )}

                      {/* Major Display */}
                      {watchedMajor && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0"
                          >
                            {watchedMajor}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${watchedColor}20`,
                            color: watchedColor,
                          }}
                        >
                          {watchedIsSemestral ? "Semestral" : "Regular"}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {watchedMaxStudents || 0} max
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <div className="font-semibold text-primary text-lg">
                        0
                      </div>
                      <div className="text-primary/70 text-xs">Members</div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg text-center">
                      <div className="font-semibold text-green-600 text-lg">
                        {watchedIsSemestral ? "Semester" : "Regular"}
                      </div>
                      <div className="text-green-600/70 text-xs">Type</div>
                    </div>
                  </div>

                  {/* Steps Progress */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Creation Steps</div>
                    {[
                      {
                        key: "basic",
                        label: "Basic Information",
                        desc: "Title, subject, level, max students, majors",
                      },
                      {
                        key: "details",
                        label: "Details & Style",
                        desc: "Description, color theme",
                      },
                      {
                        key: "images",
                        label: "Group Images",
                        desc: "Front and back pictures",
                      },
                    ].map((step) => {
                      const completion = getStepCompletion(step.key);
                      return (
                        <div key={step.key} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <div className="font-medium">{step.label}</div>
                              <div className="text-muted-foreground">
                                {step.desc}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {completion === 100 && (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              )}
                              <span>{Math.round(completion)}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons - Same as classroom */}
              <div className="space-y-3 mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={form.handleSubmit(handleSubmit)}
                  className="w-full h-12 text-base"
                >
                  {loading ? "Creating..." : "Create Group"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="w-full h-12 text-base"
                >
                  Cancel
                </Button>
              </div>

              {/* Validation Alerts - Same style as classroom */}
              {(!watchedTitle || !watchedField || !watchedLevel || !watchedMaxStudents || !watchedMajor) && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-3">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Complete required fields: {[
                        !watchedTitle && "title",
                        !watchedField && "field",
                        !watchedLevel && "level",
                        !watchedMaxStudents && "max students",
                        !watchedMajor && "major"
                      ].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {!watchedDescription && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-3">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Add group description
                    </span>
                  </div>
                </div>
              )}

              {(!frontImagePreview || !backImagePreview) && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mt-3">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Upload group images
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
