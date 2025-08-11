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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import comunesData from "@/data/Comunes.json";
import { LocationType } from "@/types/location";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  GraduationCap,
  ImageIcon,
  Info,
  MapPin,
  Palette,
  Plus,
  Search,
  Settings,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the schema based on backend ClassroomType
const classroomSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  field: z.string().min(1, "Field is required"),
  level: z.string().min(1, "Level is required"),
  color: z.string().min(1, "Color is required"),
  maxStudents: z
    .number()
    .min(1, "Maximum students must be at least 1")
    .optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  mode: z.enum(["monthly", "sessional", "semestrial"]),
  perDuration: z.number().optional(),
  perSessions: z.number().optional(),
  frontPicture: z.string().optional(),
  backPicture: z.string().optional(),
  majors: z.array(z.string()).default([]),
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

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

const DAYS = [
  { value: "Sunday", label: "Sunday", index: "0" },
  { value: "Monday", label: "Monday", index: "1" },
  { value: "Tuesday", label: "Tuesday", index: "2" },
  { value: "Wednesday", label: "Wednesday", index: "3" },
  { value: "Thursday", label: "Thursday", index: "4" },
  { value: "Friday", label: "Friday", index: "5" },
  { value: "Saturday", label: "Saturday", index: "6" },
];

// Updated colors - Top 15 colors for classroom themes
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

// Mock teachers data
const MOCK_TEACHERS = [
  {
    id: "1",
    name: "Dr. Ahmed Benali",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    subjects: ["Mathematics", "Physics"],
    level: ["High School", "University"],
    rating: 4.9,
    experience: "8 years",
    location: "Algiers",
    bio: "Experienced mathematics and physics teacher with PhD in Applied Mathematics",
  },
  {
    id: "2",
    name: "Prof. Fatima Khelifi",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["French", "Literature"],
    level: ["Middle School", "High School"],
    rating: 4.8,
    experience: "12 years",
    location: "Oran",
    bio: "French literature specialist with extensive teaching experience",
  },
  {
    id: "3",
    name: "Dr. Karim Messaoudi",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    subjects: ["Chemistry", "Biology"],
    level: ["High School", "University"],
    rating: 4.7,
    experience: "10 years",
    location: "Constantine",
    bio: "Chemistry professor specializing in organic chemistry and biochemistry",
  },
  {
    id: "4",
    name: "Ms. Amina Boudjemaa",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    subjects: ["English", "Languages"],
    level: ["Primary", "Middle School", "High School"],
    rating: 4.9,
    experience: "6 years",
    location: "Annaba",
    bio: "Native English speaker with TESOL certification and multilingual expertise",
  },
  {
    id: "5",
    name: "Prof. Omar Hadj",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    subjects: ["History", "Geography"],
    level: ["Middle School", "High School"],
    rating: 4.6,
    experience: "15 years",
    location: "Tlemcen",
    bio: "History and geography teacher with expertise in North African studies",
  },
  {
    id: "6",
    name: "Dr. Leila Brahimi",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    subjects: ["Computer Science", "Mathematics"],
    level: ["High School", "University"],
    rating: 4.8,
    experience: "9 years",
    location: "Algiers",
    bio: "Computer science professor with expertise in algorithms and data structures",
  },
  {
    id: "7",
    name: "Mr. Youcef Larbi",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    subjects: ["Arabic", "Philosophy"],
    level: ["High School", "University"],
    rating: 4.7,
    experience: "11 years",
    location: "Setif",
    bio: "Arabic language and philosophy teacher with classical literature expertise",
  },
  {
    id: "8",
    name: "Ms. Nadia Zerrouki",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    subjects: ["Mathematics", "Physics"],
    level: ["Primary", "Middle School"],
    rating: 4.9,
    experience: "7 years",
    location: "Blida",
    bio: "Elementary and middle school specialist in mathematics and basic physics",
  },
];

interface ClassroomCreateFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ClassroomCreateForm({
  onSubmit,
  onCancel,
  loading = false,
}: ClassroomCreateFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [schedule, setSchedule] = useState<
    Array<{
      day: string;
      startTime: string;
      endTime: string;
      isOnline?: boolean;
      link?: string;
    }>
  >([]);

  const [location, setLocation] = useState<LocationType | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [detailedAddress, setDetailedAddress] = useState<string>("");
  const [wilayaSearch, setWilayaSearch] = useState<string>("");
  const [communeSearch, setCommuneSearch] = useState<string>("");

  const [semesters, setSemesters] = useState<
    Array<{
      semester: string;
      price: number;
      startDate: number;
      endDate: number;
    }>
  >([]);

  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string>("");
  const [backImagePreview, setBackImagePreview] = useState<string>("");

  // Teacher selection state
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [teacherSearch, setTeacherSearch] = useState<string>("");

  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      title: "",
      description: "",
      field: "",
      level: "",
      color: COLORS[0],
      mode: "monthly",
      frontPicture: "",
      backPicture: "",
      majors: [],
    },
  });

  const watchedMode = form.watch("mode");
  const watchedTitle = form.watch("title");
  const watchedField = form.watch("field");
  const watchedLevel = form.watch("level");
  const watchedColor = form.watch("color");
  const watchedDescription = form.watch("description");
  const watchedMajors = form.watch("majors");
  const watchedPrice = form.watch("price");

  // Get unique wilayas from communes data with search
  const wilayas = useMemo(() => {
    const uniqueWilayas = Array.from(
      new Set(comunesData.map((c) => c.wilaya_id)),
    )
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((id) => {
        const comune = comunesData.find((c) => c.wilaya_id === id);
        return {
          id,
          name: comune?.name.split(" ")[0] || `Wilaya ${id}`,
          ar_name: comune?.ar_name || "",
        };
      });

    if (!wilayaSearch) return uniqueWilayas;

    return uniqueWilayas.filter(
      (w) =>
        w.name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
        w.ar_name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
        w.id.includes(wilayaSearch),
    );
  }, [wilayaSearch]);

  // Get available communes with search
  const availableComunes = useMemo(() => {
    if (!selectedWilaya) return [];

    const communes = comunesData.filter((c) => c.wilaya_id === selectedWilaya);

    if (!communeSearch) return communes;

    return communes.filter(
      (c) =>
        c.name.toLowerCase().includes(communeSearch.toLowerCase()) ||
        c.ar_name.toLowerCase().includes(communeSearch.toLowerCase()) ||
        c.id.includes(communeSearch),
    );
  }, [selectedWilaya, communeSearch]);

  // Filter teachers based on search and form data
  const filteredTeachers = useMemo(() => {
    let filtered = MOCK_TEACHERS;

    // Filter by search term
    if (teacherSearch) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
          teacher.subjects.some((subject) =>
            subject.toLowerCase().includes(teacherSearch.toLowerCase()),
          ) ||
          teacher.level.some((level) =>
            level.toLowerCase().includes(teacherSearch.toLowerCase()),
          ) ||
          teacher.location
            .toLowerCase()
            .includes(teacherSearch.toLowerCase()) ||
          teacher.bio.toLowerCase().includes(teacherSearch.toLowerCase()),
      );
    }

    // Filter by selected field if available
    if (watchedField) {
      filtered = filtered.filter((teacher) =>
        teacher.subjects.includes(watchedField),
      );
    }

    // Filter by selected level if available
    if (watchedLevel) {
      filtered = filtered.filter((teacher) =>
        teacher.level.includes(watchedLevel),
      );
    }

    return filtered;
  }, [teacherSearch, watchedField, watchedLevel]);

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

  const addScheduleItem = () => {
    setSchedule([
      ...schedule,
      { day: "", startTime: "", endTime: "", isOnline: false, link: "" },
    ]);
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateScheduleItem = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const addSemester = () => {
    setSemesters([
      ...semesters,
      {
        semester: "",
        price: 0,
        startDate: Date.now(),
        endDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
      },
    ]);
  };

  const removeSemester = (index: number) => {
    setSemesters(semesters.filter((_, i) => i !== index));
  };

  const updateSemester = (index: number, field: string, value: any) => {
    const updated = [...semesters];
    updated[index] = { ...updated[index], [field]: value };
    setSemesters(updated);
  };

  const handleWilayaSelect = (wilayaId: string) => {
    setSelectedWilaya(wilayaId);
    setSelectedCommune("");
    setLocation(null);
    setWilayaSearch("");
    setCommuneSearch("");
  };

  const handleCommuneSelect = (communeId: string) => {
    const comune = availableComunes.find((c) => c.id === communeId);
    if (!comune) return;

    const wilaya = wilayas.find((w) => w.id === comune.wilaya_id);
    setSelectedCommune(communeId);
    setCommuneSearch("");

    setLocation({
      fullLocation: detailedAddress
        ? `${detailedAddress}, ${comune.name}, ${wilaya?.name || "Unknown"}`
        : `${comune.name}, ${wilaya?.name || "Unknown"}`,
      coordinates: {
        lat: parseFloat(comune.latitude),
        long: parseFloat(comune.longitude),
      },
      wilaya: `${comune.wilaya_id}-${wilaya?.name || "Unknown"}-${wilaya?.ar_name || ""}`,
      commune: `${comune.id}-${comune.name}-${comune.ar_name}`,
    });
  };

  const updateLocationWithAddress = (address: string) => {
    setDetailedAddress(address);
    if (location) {
      const comuneParts = location.commune.split("-");
      const wilayaParts = location.wilaya.split("-");
      setLocation({
        ...location,
        fullLocation: address
          ? `${address}, ${comuneParts[1]}, ${wilayaParts[1]}`
          : `${comuneParts[1]}, ${wilayaParts[1]}`,
      });
    }
  };

  const handleSubmit = async (data: ClassroomFormData) => {
    if (!location) {
      // Show error notification instead of alert
      if (typeof window !== "undefined") {
        const event = new CustomEvent("show-notification", {
          detail: {
            type: "error",
            title: "Location Required",
            message: "Please select a location for the classroom",
          },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    if (schedule.length === 0) {
      // Show error notification instead of alert
      if (typeof window !== "undefined") {
        const event = new CustomEvent("show-notification", {
          detail: {
            type: "error",
            title: "Schedule Required",
            message: "Please add at least one schedule item",
          },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    if (data.mode === "semestrial" && semesters.length === 0) {
      // Show error notification instead of alert
      if (typeof window !== "undefined") {
        const event = new CustomEvent("show-notification", {
          detail: {
            type: "error",
            title: "Semester Information Required",
            message: "Please add at least one semester for semestrial mode",
          },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    // Convert schedule days to indexes (Sunday = 0, Monday = 1, etc.)
    const scheduleWithIndexes = schedule.map(item => {
      const dayObj = DAYS.find(d => d.value === item.day);
      return {
        ...item,
        day: dayObj ? dayObj.index : item.day, // Convert day name to index string
      };
    });

    // Format data according to API structure
    const classroomData = {
      teacher: selectedTeacher || "current-user-id",
      school: null, // Will be set based on user context
      title: data.title,
      location,
      frontPicture:
        data.frontPicture || "https://mock-storage.com/default-front.jpg",
      backPicture:
        data.backPicture || "https://mock-storage.com/default-back.jpg",
      isArchived: false,
      description: data.description,
      field: data.field,
      level: data.level,
      color: data.color,
      maxStudents: data.maxStudents,
      price: data.price || 0,
      schedule: scheduleWithIndexes,
      mode: data.mode,
      ...(data.mode === "monthly" && {
        perDuration: data.perDuration || 30,
        perSessions: null,
        perSemester: null,
      }),
      ...(data.mode === "sessional" && {
        perDuration: null,
        perSessions: data.perSessions || 10,
        perSemester: null,
      }),
      ...(data.mode === "semestrial" && {
        perDuration: null,
        perSessions: null,
        perSemester: semesters,
      }),
    };

    onSubmit(classroomData);
  };

  const addMajor = (major: string) => {
    const currentMajors = form.getValues("majors");
    if (!currentMajors.includes(major)) {
      form.setValue("majors", [...currentMajors, major]);
    }
  };

  const removeMajor = (major: string) => {
    const currentMajors = form.getValues("majors");
    form.setValue(
      "majors",
      currentMajors.filter((m) => m !== major),
    );
  };

  // Calculate form completion
  const getTabCompletion = (tab: string) => {
    switch (tab) {
      case "basic":
        return (
          (((watchedTitle ? 1 : 0) +
            (watchedField ? 1 : 0) +
            (watchedLevel ? 1 : 0)) /
            3) *
          100
        );
      case "schedule":
        return (((location ? 1 : 0) + (selectedTeacher ? 1 : 0)) / 2) * 100;
      case "pricing":
        const scheduleComplete = schedule.length > 0 ? 1 : 0;
        const pricingComplete =
          watchedMode === "semestrial"
            ? semesters.length > 0
              ? 1
              : 0
            : watchedPrice
              ? 1
              : 0;
        return ((scheduleComplete + pricingComplete) / 2) * 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Header */}
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
              Create New Classroom
            </h1>
            <p className="text-muted-foreground mt-1">
              Set up your classroom with schedule and pricing details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger
                      value="basic"
                      className="flex items-center gap-2"
                    >
                      <Info className="h-4 w-4" />
                      Basic Info
                      {getTabCompletion("basic") === 100 && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="schedule"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Location & Teacher
                      {getTabCompletion("schedule") === 100 && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="pricing"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Schedule & Pricing
                      {getTabCompletion("pricing") === 100 && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-6">
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
                              <FormLabel>Classroom Title *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Advanced Mathematics - Algebra Fundamentals"
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
                              <FormLabel>Maximum Students</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    placeholder="30"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      )
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
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the classroom content, objectives, and what students will learn..."
                                  {...field}
                                  className="min-h-[120px] resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Majors Selection */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">
                            Specializations
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {MAJORS_OPTIONS.map((major) => (
                              <Button
                                key={major}
                                type="button"
                                variant={
                                  watchedMajors.includes(major)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  if (watchedMajors.includes(major)) {
                                    removeMajor(major);
                                  } else {
                                    addMajor(major);
                                  }
                                }}
                                className="h-8 text-xs"
                              >
                                {major}
                              </Button>
                            ))}
                          </div>
                          {watchedMajors.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {watchedMajors.map((major) => (
                                <Badge
                                  key={major}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {major}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeMajor(major);
                                    }}
                                  >
                                    <X className="h-3 w-3 hover:text-destructive" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Color Selection */}
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

                        {/* Images Upload */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-primary" />
                            <label className="text-sm font-medium">
                              Classroom Images
                            </label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Front Picture */}
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

                            {/* Back Picture */}
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
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* Location & Teacher Tab */}
                  <TabsContent value="schedule" className="space-y-6">
                    {/* Location */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Wilaya Selection */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Wilaya *
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search wilaya by name, Arabic name, or ID..."
                              value={wilayaSearch}
                              onChange={(e) => setWilayaSearch(e.target.value)}
                              className="h-11 pl-10"
                            />
                          </div>
                          {wilayaSearch && (
                            <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-card">
                              {wilayas.map((wilaya) => (
                                <button
                                  key={wilaya.id}
                                  type="button"
                                  onClick={() => handleWilayaSelect(wilaya.id)}
                                  className="w-full text-left px-3 py-2 hover:bg-accent border-b border-border last:border-b-0"
                                >
                                  <div className="text-sm font-medium">
                                    {wilaya.id} - {wilaya.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {wilaya.ar_name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {selectedWilaya && (
                            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                              <p className="text-sm font-medium text-primary">
                                Selected:{" "}
                                {
                                  wilayas.find((w) => w.id === selectedWilaya)
                                    ?.id
                                }{" "}
                                -{" "}
                                {
                                  wilayas.find((w) => w.id === selectedWilaya)
                                    ?.name
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Commune Selection */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Commune *
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={
                                selectedWilaya
                                  ? "Search commune by name, Arabic name, or ID..."
                                  : "Select wilaya first"
                              }
                              value={communeSearch}
                              onChange={(e) => setCommuneSearch(e.target.value)}
                              disabled={!selectedWilaya}
                              className="h-11 pl-10"
                            />
                          </div>
                          {communeSearch && selectedWilaya && (
                            <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-card">
                              {availableComunes.map((comune) => (
                                <button
                                  key={comune.id}
                                  type="button"
                                  onClick={() => handleCommuneSelect(comune.id)}
                                  className="w-full text-left px-3 py-2 hover:bg-accent border-b border-border last:border-b-0"
                                >
                                  <div className="text-sm font-medium">
                                    {comune.id} - {comune.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {comune.ar_name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {selectedCommune && (
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                Selected:{" "}
                                {
                                  availableComunes.find(
                                    (c) => c.id === selectedCommune,
                                  )?.id
                                }{" "}
                                -{" "}
                                {
                                  availableComunes.find(
                                    (c) => c.id === selectedCommune,
                                  )?.name
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Detailed Address */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Detailed Address
                          </label>
                          <Input
                            placeholder="Street, building number, additional details..."
                            value={detailedAddress}
                            onChange={(e) =>
                              updateLocationWithAddress(e.target.value)
                            }
                            disabled={!selectedCommune}
                            className="h-11"
                          />
                        </div>

                        {location && (
                          <div className="p-4 bg-muted rounded-lg border">
                            <p className="text-sm font-medium mb-1">
                              Complete Location:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {location.fullLocation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Teacher Selection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Select Teacher
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Teacher Search */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Search Teachers
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search by name, subject, level, or location..."
                              value={teacherSearch}
                              onChange={(e) => setTeacherSearch(e.target.value)}
                              className="h-11 pl-10"
                            />
                          </div>
                        </div>

                        {/* Teachers List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher) => (
                              <div
                                key={teacher.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedTeacher === teacher.id
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50"
                                  }`}
                                onClick={() => setSelectedTeacher(teacher.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={teacher.avatar}
                                    alt={teacher.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-semibold text-sm truncate">
                                        {teacher.name}
                                      </h4>
                                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                                        <span>★</span>
                                        <span>{teacher.rating}</span>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {teacher.subjects.map((subject) => (
                                        <Badge
                                          key={subject}
                                          variant="secondary"
                                          className="text-xs px-2 py-0"
                                        >
                                          {subject}
                                        </Badge>
                                      ))}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                      <div className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        <span>{teacher.level.join(", ")}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{teacher.location}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{teacher.experience}</span>
                                      </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {teacher.bio}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm font-medium mb-1">
                                No teachers found
                              </p>
                              <p className="text-xs">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          )}
                        </div>

                        {selectedTeacher && (
                          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-sm font-medium text-primary">
                              Selected:{" "}
                              {
                                filteredTeachers.find(
                                  (t) => t.id === selectedTeacher,
                                )?.name
                              }
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Schedule & Pricing Tab */}
                  <TabsContent value="pricing" className="space-y-6">
                    {/* Schedule */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Class Schedule
                          </CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addScheduleItem}
                            className="hover:bg-primary/10"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Session
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {schedule.map((item, index) => (
                          <div
                            key={index}
                            className="p-4 border border-border rounded-lg bg-muted/30"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-sm">
                                Session {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeScheduleItem(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs font-medium">
                                  Day
                                </label>
                                <Select
                                  value={item.day}
                                  onValueChange={(value) =>
                                    updateScheduleItem(index, "day", value)
                                  }
                                >
                                  <SelectTrigger className="h-10 text-sm w-full">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                  <SelectContent className="w-full">
                                    {DAYS.map((day) => (
                                      <SelectItem
                                        key={day.value}
                                        value={day.value}
                                      >
                                        {day.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-medium">
                                  Start Time
                                </label>
                                <Input
                                  type="time"
                                  value={item.startTime}
                                  onChange={(e) =>
                                    updateScheduleItem(
                                      index,
                                      "startTime",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 text-sm"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-medium">
                                  End Time
                                </label>
                                <Input
                                  type="time"
                                  value={item.endTime}
                                  onChange={(e) =>
                                    updateScheduleItem(
                                      index,
                                      "endTime",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 text-sm"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-medium">
                                  Format
                                </label>
                                <Select
                                  value={item.isOnline ? "online" : "offline"}
                                  onValueChange={(value) =>
                                    updateScheduleItem(
                                      index,
                                      "isOnline",
                                      value === "online",
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-10 text-sm w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="w-full">
                                    <SelectItem value="offline">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        In-Person
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="online">
                                      <div className="flex items-center gap-2">
                                        <Video className="h-3 w-3" />
                                        Online
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {item.isOnline && (
                              <div className="mt-3">
                                <label className="text-xs font-medium">
                                  Meeting Link
                                </label>
                                <div className="relative mt-1">
                                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="https://meet.google.com/..."
                                    value={item.link || ""}
                                    onChange={(e) =>
                                      updateScheduleItem(
                                        index,
                                        "link",
                                        e.target.value,
                                      )
                                    }
                                    className="h-10 pl-10 text-sm"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {schedule.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium mb-1">
                              No schedule added yet
                            </p>
                            <p className="text-xs">
                              Click "Add Session" to create your first class
                              session
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          Pricing & Payment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="mode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Mode</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="monthly">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      Monthly Payment
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="sessional">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      Per Session Payment
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="semestrial">
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4" />
                                      Semester Payment
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {watchedMode !== "semestrial" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (DZD)</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        type="number"
                                        placeholder="4000"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value
                                              ? parseFloat(e.target.value)
                                              : undefined,
                                          )
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
                              name={
                                watchedMode === "monthly"
                                  ? "perDuration"
                                  : "perSessions"
                              }
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {watchedMode === "monthly"
                                      ? "Duration (Days)"
                                      : "Number of Sessions"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder={
                                        watchedMode === "monthly" ? "30" : "10"
                                      }
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
                                        )
                                      }
                                      className="h-11"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {watchedMode === "semestrial" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-sm">Semesters</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addSemester}
                                className="hover:bg-green-500/10"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Semester
                              </Button>
                            </div>

                            {semesters.map((semester, index) => (
                              <div
                                key={index}
                                className="p-4 border border-border rounded-lg bg-muted/30"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="font-medium text-sm">
                                    Semester {index + 1}
                                  </h5>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSemester(index)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium">
                                      Semester Name
                                    </label>
                                    <Input
                                      placeholder="Fall 2025"
                                      value={semester.semester}
                                      onChange={(e) =>
                                        updateSemester(
                                          index,
                                          "semester",
                                          e.target.value,
                                        )
                                      }
                                      className="h-10 text-sm"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-xs font-medium">
                                      Price (DZD)
                                    </label>
                                    <Input
                                      type="number"
                                      placeholder="15000"
                                      value={semester.price || ""}
                                      onChange={(e) =>
                                        updateSemester(
                                          index,
                                          "price",
                                          parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      className="h-10 text-sm"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-xs font-medium">
                                      Duration (Days)
                                    </label>
                                    <Input
                                      type="number"
                                      placeholder="90"
                                      value={
                                        Math.round(
                                          (semester.endDate -
                                            semester.startDate) /
                                          (24 * 60 * 60 * 1000),
                                        ) || ""
                                      }
                                      onChange={(e) => {
                                        const days =
                                          parseInt(e.target.value) || 90;
                                        updateSemester(
                                          index,
                                          "endDate",
                                          semester.startDate +
                                          days * 24 * 60 * 60 * 1000,
                                        );
                                      }}
                                      className="h-10 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            {semesters.length === 0 && (
                              <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">
                                  No semesters added. Click "Add Semester" to
                                  create pricing for each semester.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </div>

          {/* Enhanced Live Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Live Preview Card */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Card */}
                  <div
                    className="relative rounded-lg overflow-hidden shadow-sm border transition-all duration-300"
                    style={{
                      backgroundColor: watchedColor
                        ? `${watchedColor}10`
                        : "transparent",
                    }}
                  >
                    {/* Front Image */}
                    <div className="h-40 bg-gradient-to-br from-muted to-muted/50 relative">
                      {frontImagePreview ? (
                        <img
                          src={frontImagePreview}
                          alt="Front"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full shadow-md transition-colors duration-300"
                        style={{ backgroundColor: watchedColor || COLORS[0] }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-base mb-2 line-clamp-2">
                        {watchedTitle || "Classroom Title"}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <BookOpen className="h-4 w-4" />
                        <span>{watchedField || "Subject"}</span>
                        {watchedLevel && (
                          <>
                            <span>•</span>
                            <span>{watchedLevel}</span>
                          </>
                        )}
                      </div>

                      {watchedDescription && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {watchedDescription}
                        </p>
                      )}

                      {watchedMajors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {watchedMajors.slice(0, 3).map((major) => (
                            <Badge
                              key={major}
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {major}
                            </Badge>
                          ))}
                          {watchedMajors.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              +{watchedMajors.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {location.fullLocation}
                          </span>
                        </div>
                      )}

                      {schedule.length > 0 && (
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {schedule.length} session
                              {schedule.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {schedule.slice(0, 2).map((session, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                {session.isOnline ? (
                                  <Video className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                <span>
                                  {session.day} {session.startTime}-
                                  {session.endTime}
                                </span>
                              </div>
                            ))}
                            {schedule.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{schedule.length - 2} more sessions
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {watchedPrice && watchedPrice > 0 && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-lg font-semibold text-green-600">
                              {watchedPrice} DZD
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground capitalize">
                            {watchedMode}
                          </span>
                        </div>
                      )}

                      {watchedMode === "semestrial" && semesters.length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="text-xs text-muted-foreground mb-1">
                            Semester Pricing:
                          </div>
                          {semesters.slice(0, 2).map((sem, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-xs"
                            >
                              <span>
                                {sem.semester || `Semester ${index + 1}`}
                              </span>
                              <span className="font-medium">
                                {sem.price} DZD
                              </span>
                            </div>
                          ))}
                          {semesters.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{semesters.length - 2} more semesters
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <div className="font-semibold text-primary text-lg">
                        {schedule.length}
                      </div>
                      <div className="text-primary/70 text-xs">Sessions</div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg text-center">
                      <div className="font-semibold text-green-600 text-lg">
                        {form.watch("maxStudents") || "∞"}
                      </div>
                      <div className="text-green-600/70 text-xs">
                        Max Students
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Form Progress</div>
                    {["basic", "schedule", "pricing"].map((tab) => {
                      const completion = getTabCompletion(tab);
                      return (
                        <div key={tab} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="capitalize">
                              {tab === "basic"
                                ? "Basic Info"
                                : tab === "schedule"
                                  ? "Schedule & Location"
                                  : "Pricing"}
                            </span>
                            <span>{Math.round(completion)}%</span>
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={form.handleSubmit(handleSubmit)}
                  className="w-full h-12 text-base"
                >
                  {loading ? "Creating..." : "Create Classroom"}
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

              {/* Validation Alerts */}
              {(!watchedTitle || !watchedField || !watchedLevel) && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Complete basic information
                    </span>
                  </div>
                </div>
              )}

              {(!location || !selectedTeacher) && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Select location and teacher
                    </span>
                  </div>
                </div>
              )}

              {(schedule.length === 0 ||
                (watchedMode === "semestrial"
                  ? semesters.length === 0
                  : !watchedPrice)) && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Add schedule and set pricing
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
