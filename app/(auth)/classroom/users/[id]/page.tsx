"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Mail, Phone, User, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock user data - in real app this would come from API
const mockUser = {
    id: "1",
    name: "Ahmed Ben Ali",
    email: "ahmed@example.com",
    phone: "+213 555 0123",
    userType: "teacher",
    status: "active",
    createdAt: "2024-01-15",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: {
        fullLocation: "Algiers, Algeria",
        wilaya: "Algiers",
        commune: "Bab El Oued",
    },
    specialization: "Mathematics",
    bio: "Experienced mathematics teacher with 10+ years of teaching experience.",
    subjects: ["Algebra", "Geometry", "Calculus"],
    experience: 12,
    qualifications: ["Master's in Mathematics", "Teaching Certificate"],
};

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    // In real app, fetch user data based on userId
    const user = mockUser;

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>User not found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/classroom/users">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground mt-1">
                            {user.userType === "teacher" ? "Teacher" : "Student"} Profile
                        </p>
                    </div>
                </div>
                <Link href={`/classroom/users/${userId}/edit`}>
                    <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4">
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                                        {user.userType === "teacher" ? (
                                            <Users className="h-12 w-12 text-primary" />
                                        ) : (
                                            <User className="h-12 w-12 text-primary" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription className="capitalize">
                                {user.userType}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${user.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}>
                                    {user.status}
                                </span>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Details */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            {user.userType === "teacher" && (
                                <TabsTrigger value="teaching">Teaching Info</TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                    <CardDescription>
                                        General information about {user.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user.bio && (
                                        <div>
                                            <h4 className="font-medium mb-2">Bio</h4>
                                            <p className="text-sm text-muted-foreground">{user.bio}</p>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium mb-2">Location</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {user.location.fullLocation}
                                        </p>
                                    </div>
                                    {user.userType === "teacher" && user.specialization && (
                                        <div>
                                            <h4 className="font-medium mb-2">Specialization</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {user.specialization}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="details" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Details</CardTitle>
                                    <CardDescription>
                                        Detailed information about {user.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium mb-1">Full Name</h4>
                                            <p className="text-sm text-muted-foreground">{user.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1">Email</h4>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1">Phone</h4>
                                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1">Status</h4>
                                            <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1">Wilaya</h4>
                                            <p className="text-sm text-muted-foreground">{user.location.wilaya}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1">Commune</h4>
                                            <p className="text-sm text-muted-foreground">{user.location.commune}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {user.userType === "teacher" && (
                            <TabsContent value="teaching" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Teaching Information</CardTitle>
                                        <CardDescription>
                                            Professional teaching details for {user.name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Experience</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {user.experience} years of teaching experience
                                            </p>
                                        </div>
                                        {user.subjects && user.subjects.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Subjects</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.subjects.map((subject, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                                                        >
                                                            {subject}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {user.qualifications && user.qualifications.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Qualifications</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {user.qualifications.map((qualification, index) => (
                                                        <li key={index} className="text-sm text-muted-foreground">
                                                            {qualification}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>
        </div>
    );
}