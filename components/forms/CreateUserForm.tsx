"use client";

import LocationSelector from "@/components/LocationSelector";
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
import { LocationType } from "@/types/location";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    CheckCircle,
    GraduationCap,
    ImageIcon,
    Info,
    Upload,
    User,
    Users,
    X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as z from "zod";

// Schema based on the signup forms structure
const createUserSchema = z.object({
    userType: z.enum(["teacher", "student"]),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female"]),
    dob: z.date().optional(),
    profilePicture: z.any().optional(),
    interests: z.string().optional(),
    // Student specific fields
    educationLevel: z.string().optional(),
    educationField: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

const EDUCATION_LEVELS = ["Primary", "Middle School", "High School", "University"];
const EDUCATION_FIELDS = [
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

interface CreateUserFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    loading?: boolean;
    initialData?: Partial<CreateUserFormData>;
    isEditing?: boolean;
}

export default function CreateUserForm({
    onSubmit,
    onCancel,
    loading = false,
    initialData,
    isEditing = false,
}: CreateUserFormProps) {
    const { theme } = useTheme();
    const locale = useLocale();
    const t = useTranslations("auth");
    const [activeTab, setActiveTab] = useState("basic");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [locationData, setLocationData] = useState<LocationType | null>(null);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            userType: initialData?.userType || "student",
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            password: "",
            confirmPassword: "",
            gender: initialData?.gender || "male",
            interests: initialData?.interests || "",
            educationLevel: initialData?.educationLevel || "",
            educationField: initialData?.educationField || "",
        },
    });

    const watchedUserType = form.watch("userType");
    const watchedFirstName = form.watch("firstName");
    const watchedLastName = form.watch("lastName");
    const watchedEmail = form.watch("email");

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePictureFile(file);
            form.setValue("profilePicture", file, { shouldValidate: true });

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicturePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearProfilePicture = () => {
        setProfilePictureFile(null);
        setProfilePicturePreview("");
        form.setValue("profilePicture", undefined);
    };

    const handleSubmit = async (data: CreateUserFormData) => {
        if (!locationData) {
            if (typeof window !== "undefined") {
                const event = new CustomEvent("show-notification", {
                    detail: {
                        type: "error",
                        title: "Location Required",
                        message: "Please select a location for the user",
                    },
                });
                window.dispatchEvent(event);
            }
            return;
        }

        // Format data according to RegisterData structure from authTypes
        const registerData = {
            userData: {
                email: data.email,
                name: data.firstName,
                last: data.lastName,
                password: data.password,
                DOB: data.dob ? new Date(data.dob).getTime() : 0,
                username: data.email.split("@")[0],
                phoneNumber: data.phone,
                location: {
                    fullLocation: locationData.fullLocation || "",
                    coordinates: locationData.coordinates || { lat: 0, long: 0 },
                    wilaya: locationData.wilaya || "",
                    commune: locationData.commune || "",
                },
                profilePicture: profilePictureFile
                    ? URL.createObjectURL(profilePictureFile)
                    : "https://default-avatar.com/placeholder.png",
                isVerified: false,
                verificationType: "email",
                socialLinks: {
                    website: "",
                    youtube: "",
                },
                description: data.interests || "",
                userType: data.userType,
            },
        };

        onSubmit(registerData);
    };

    // Calculate form completion
    const getTabCompletion = (tab: string) => {
        switch (tab) {
            case "basic":
                return (
                    (((watchedFirstName ? 1 : 0) +
                        (watchedLastName ? 1 : 0) +
                        (watchedEmail ? 1 : 0) +
                        (form.watch("phone") ? 1 : 0) +
                        (form.watch("password") ? 1 : 0) +
                        (form.watch("confirmPassword") ? 1 : 0)) /
                        6) *
                    100
                );
            case "details":
                return (
                    (((form.watch("gender") ? 1 : 0) +
                        (locationData ? 1 : 0)) /
                        2) *
                    100
                );
            case "optional":
                return 100; // Optional fields are always "complete"
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
                            {isEditing ? "Edit User" : "Create New User"}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {isEditing ? "Update user information" : "Add a new teacher or student to your school"}
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
                                            value="details"
                                            className="flex items-center gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            Personal Details
                                            {getTabCompletion("details") === 100 && (
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="optional"
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Optional Info
                                            {getTabCompletion("optional") === 100 && (
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                            )}
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Basic Information Tab */}
                                    <TabsContent value="basic" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-primary" />
                                                    Basic Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {/* User Type Selection */}
                                                <FormField
                                                    control={form.control}
                                                    name="userType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>User Type *</FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11 w-full">
                                                                        <SelectValue placeholder="Select user type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full">
                                                                    <SelectItem value="teacher">
                                                                        <div className="flex items-center gap-2">
                                                                            <GraduationCap className="h-4 w-4" />
                                                                            Teacher
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="student">
                                                                        <div className="flex items-center gap-2">
                                                                            <User className="h-4 w-4" />
                                                                            Student
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Name Fields */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="firstName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>First Name *</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter first name"
                                                                        {...field}
                                                                        className="h-11"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="lastName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Last Name *</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter last name"
                                                                        {...field}
                                                                        className="h-11"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                {/* Contact Information */}
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="Enter email address"
                                                                    {...field}
                                                                    className="h-11"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="tel"
                                                                    placeholder="Enter phone number"
                                                                    {...field}
                                                                    className={`h-11 ${locale === "ar" ? "text-right" : "text-left"
                                                                        }`}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Password Fields */}
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Password *</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        type={showPassword ? "text" : "password"}
                                                                        placeholder="Enter password"
                                                                        {...field}
                                                                        className="h-11 pr-10"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className={`absolute inset-y-0 ${locale === "ar" ? "left-3" : "right-3"
                                                                            } flex items-center text-muted-foreground`}
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    >
                                                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                                                    </button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="confirmPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Confirm Password *</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        type={showConfirmPassword ? "text" : "password"}
                                                                        placeholder="Confirm password"
                                                                        {...field}
                                                                        className="h-11 pr-10"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className={`absolute inset-y-0 ${locale === "ar" ? "left-3" : "right-3"
                                                                            } flex items-center text-muted-foreground`}
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    >
                                                                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                                                    </button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Personal Details Tab */}
                                    <TabsContent value="details" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <User className="h-5 w-5 text-primary" />
                                                    Personal Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {/* Gender */}
                                                <FormField
                                                    control={form.control}
                                                    name="gender"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Gender *</FormLabel>
                                                            <FormControl>
                                                                <div className="flex space-x-6">
                                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            value="male"
                                                                            checked={field.value === "male"}
                                                                            onChange={() => field.onChange("male")}
                                                                            className="text-primary focus:ring-primary"
                                                                        />
                                                                        <span className="text-sm">Male</span>
                                                                    </label>
                                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            value="female"
                                                                            checked={field.value === "female"}
                                                                            onChange={() => field.onChange("female")}
                                                                            className="text-primary focus:ring-primary"
                                                                        />
                                                                        <span className="text-sm">Female</span>
                                                                    </label>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Date of Birth */}
                                                <FormField
                                                    control={form.control}
                                                    name="dob"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Date of Birth</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    {...field}
                                                                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                                                    className="h-11"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Location */}
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Location *
                                                    </label>
                                                    <LocationSelector
                                                        value={locationData}
                                                        onChange={setLocationData}
                                                        error={!locationData ? "Location is required" : undefined}
                                                    />
                                                </div>

                                                {/* Student-specific fields */}
                                                {watchedUserType === "student" && (
                                                    <>
                                                        <FormField
                                                            control={form.control}
                                                            name="educationLevel"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Education Level</FormLabel>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        value={field.value}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="h-11 w-full">
                                                                                <SelectValue placeholder="Select education level" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent className="w-full">
                                                                            {EDUCATION_LEVELS.map((level) => (
                                                                                <SelectItem key={level} value={level}>
                                                                                    {level}
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
                                                            name="educationField"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Field of Study</FormLabel>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        value={field.value}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="h-11 w-full">
                                                                                <SelectValue placeholder="Select field of study" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent className="w-full">
                                                                            {EDUCATION_FIELDS.map((field) => (
                                                                                <SelectItem key={field} value={field}>
                                                                                    {field}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Optional Information Tab */}
                                    <TabsContent value="optional" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Upload className="h-5 w-5 text-primary" />
                                                    Optional Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {/* Profile Picture */}
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Profile Picture
                                                    </label>
                                                    <div
                                                        className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            const file = e.dataTransfer.files[0];
                                                            if (file && file.type.startsWith("image/")) {
                                                                setProfilePictureFile(file);
                                                                form.setValue("profilePicture", file);
                                                                const reader = new FileReader();
                                                                reader.onload = (e) => {
                                                                    setProfilePicturePreview(e.target?.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        onDragOver={(e) => e.preventDefault()}
                                                    >
                                                        {profilePicturePreview ? (
                                                            <div className="relative">
                                                                <img
                                                                    src={profilePicturePreview}
                                                                    alt="Profile preview"
                                                                    className="w-32 h-32 object-cover rounded-full mx-auto"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        clearProfilePicture();
                                                                    }}
                                                                    className="absolute top-2 right-2 h-6 w-6 p-0"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
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
                                                            onChange={handleProfilePictureChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Interests/Bio */}
                                                <FormField
                                                    control={form.control}
                                                    name="interests"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {watchedUserType === "teacher" ? "Bio/Specialization" : "Interests"}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder={
                                                                        watchedUserType === "teacher"
                                                                            ? "Describe teaching experience and specializations..."
                                                                            : "Describe interests and hobbies..."
                                                                    }
                                                                    {...field}
                                                                    className="min-h-[120px] resize-none"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-4 pt-6 border-t mt-8">
                                    <Button type="button" variant="outline" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading || !locationData}
                                        title={!locationData ? "Please select a location to continue" : ""}
                                    >
                                        {loading ? "Creating..." : `Create ${watchedUserType}`}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        User Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* User Card Preview */}
                                    <div className="relative rounded-lg overflow-hidden border-2 transition-all">
                                        <div className="h-20 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            {profilePicturePreview ? (
                                                <img
                                                    src={profilePicturePreview}
                                                    alt="Profile preview"
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                                                />
                                            ) : (
                                                <User className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h3 className="font-semibold text-lg">
                                                {watchedFirstName && watchedLastName
                                                    ? `${watchedFirstName} ${watchedLastName}`
                                                    : "User Name"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                {watchedUserType === "teacher" ? (
                                                    <GraduationCap className="h-4 w-4" />
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                                <span className="capitalize">{watchedUserType}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {watchedEmail || "email@example.com"}
                                            </p>
                                            {form.watch("interests") && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {form.watch("interests")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Form Progress */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm">Form Progress</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>Basic Info</span>
                                                <span>{Math.round(getTabCompletion("basic"))}%</span>
                                            </div>
                                            <div className="w-full bg-secondary rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${getTabCompletion("basic")}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>Personal Details</span>
                                                <span>{Math.round(getTabCompletion("details"))}%</span>
                                            </div>
                                            <div className="w-full bg-secondary rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${getTabCompletion("details")}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}