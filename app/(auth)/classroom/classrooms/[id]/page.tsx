"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    DollarSign,
    Edit,
    MapPin,
    MoreHorizontal,
    Share2,
    Star,
    Users
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data based on your classroom document structure
const getMockClassroom = (id: string) => ({
    _id: id,
    title: "Advanced Physics - Mechanics & Thermodynamics",
    field: "Physics",
    level: "University",
    description: "Comprehensive physics course covering advanced mechanics, thermodynamics, and wave theory. Perfect for university students preparing for exams or seeking deeper understanding of fundamental physics concepts.",
    teacher: "Dr. Ahmed Benali",
    owner: "md78jay9wqmy2yc51a657zxhj57nhv6m",
    price: 8500,
    mode: "monthly",
    maxStudents: 25,
    currentStudents: 18,
    isArchived: false,
    isGrouped: true,
    color: "#3B82F6",
    frontPicture: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=400&fit=crop",
    backPicture: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop",
    location: {
        commune: "Alger Centre",
        wilaya: "Alger",
        fullLocation: "15 Rue Didouche Mourad, Alger Centre, Alger",
        coordinates: { lat: 36.7681618, long: 3.0404258 },
    },
    schedule: [
        {
            day: "1", // Monday
            startTime: "14:00",
            endTime: "16:00",
            isOnline: false,
            link: "",
        },
        {
            day: "3", // Wednesday
            startTime: "10:00",
            endTime: "12:00",
            isOnline: false,
            link: "",
        },
        {
            day: "5", // Friday
            startTime: "16:00",
            endTime: "18:00",
            isOnline: true,
            link: "https://meet.google.com/abc-defg-hij",
        },
    ],
    majors: ["Physics", "Engineering", "Mathematics"],
    school: null,
    perDuration: 8, // weeks
    perSemester: null,
    perSessions: 24,
    _creationTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
});

// Mock students data
const getMockStudents = () => [
    {
        id: "1",
        name: "Sarah Amrani",
        email: "sarah.amrani@email.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        joinDate: "2024-01-15",
        attendance: 92,
        lastSeen: "2024-01-20",
        status: "active",
    },
    {
        id: "2",
        name: "Youssef Benaissa",
        email: "youssef.benaissa@email.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        joinDate: "2024-01-10",
        attendance: 88,
        lastSeen: "2024-01-19",
        status: "active",
    },
    {
        id: "3",
        name: "Amina Khelifi",
        email: "amina.khelifi@email.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        joinDate: "2024-01-08",
        attendance: 95,
        lastSeen: "2024-01-20",
        status: "active",
    },
    {
        id: "4",
        name: "Omar Meziane",
        email: "omar.meziane@email.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        joinDate: "2024-01-12",
        attendance: 76,
        lastSeen: "2024-01-18",
        status: "warning",
    },
];

const DAYS = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
};

export default function ClassroomDetailPage() {
    const params = useParams();
    const router = useRouter();
    const classroomId = params.id as string;

    const [classroom, setClassroom] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setClassroom(getMockClassroom(classroomId));
            setStudents(getMockStudents());
            setLoading(false);
        }, 1000);
    }, [classroomId]);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">Classroom not found</h2>
                    <p className="text-gray-600 mt-2">The classroom you're looking for doesn't exist.</p>
                    <Button onClick={() => router.back()} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const enrollmentPercentage = (classroom.currentStudents / classroom.maxStudents) * 100;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{classroom.title}</h1>
                        <p className="text-gray-600">by {classroom.teacher}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Hero Section */}
            <Card className="overflow-hidden">
                <div
                    className="h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${classroom.frontPicture})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                        <div className="p-6 text-white">
                            <div className="flex items-center space-x-4 mb-4">
                                <Badge variant="secondary" className="bg-white/20 text-white">
                                    {classroom.field}
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white">
                                    {classroom.level}
                                </Badge>
                                {classroom.isGrouped && (
                                    <Badge variant="secondary" className="bg-green-500/80 text-white">
                                        Grouped
                                    </Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-6 text-sm">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    {classroom.currentStudents}/{classroom.maxStudents} Students
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    {classroom.price.toLocaleString()} DA/{classroom.mode}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {classroom.perDuration} weeks
                                </div>
                                <div className="flex items-center">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    {classroom.perSessions} sessions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">{classroom.description}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Field</label>
                                            <p className="text-gray-900">{classroom.field}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Level</label>
                                            <p className="text-gray-900">{classroom.level}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Duration</label>
                                            <p className="text-gray-900">{classroom.perDuration} weeks</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Sessions</label>
                                            <p className="text-gray-900">{classroom.perSessions} total</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Target Majors</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {classroom.majors.map((major: string) => (
                                                <Badge key={major} variant="outline">
                                                    {major}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enrollment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Students</span>
                                        <span className="font-medium">
                                            {classroom.currentStudents}/{classroom.maxStudents}
                                        </span>
                                    </div>
                                    <Progress value={enrollmentPercentage} className="h-2" />
                                    <p className="text-xs text-gray-500">
                                        {Math.round(enrollmentPercentage)}% capacity
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{classroom.location.commune}</p>
                                            <p className="text-xs text-gray-600">{classroom.location.wilaya}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {classroom.location.fullLocation}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {classroom.price.toLocaleString()} DA
                                        </div>
                                        <p className="text-sm text-gray-600">per {classroom.mode}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Students ({students.length})</h3>
                        <Button>
                            <Users className="w-4 h-4 mr-2" />
                            Manage Students
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {students.map((student) => (
                            <Card key={student.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h4 className="font-medium">{student.name}</h4>
                                                <p className="text-sm text-gray-600">{student.email}</p>
                                                <p className="text-xs text-gray-500">
                                                    Joined {new Date(student.joinDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <p className="text-sm font-medium">{student.attendance}%</p>
                                                    <p className="text-xs text-gray-500">Attendance</p>
                                                </div>
                                                <Badge
                                                    variant={student.status === "active" ? "default" : "destructive"}
                                                >
                                                    {student.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {classroom.schedule.map((session: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    {DAYS[session.day as keyof typeof DAYS]}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {session.startTime} - {session.endTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {session.isOnline ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    Online
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">In-Person</Badge>
                                            )}
                                            {session.isOnline && session.link && (
                                                <Button size="sm" variant="outline">
                                                    Join Meeting
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(classroom.price * classroom.currentStudents).toLocaleString()} DA
                                </div>
                                <p className="text-xs text-gray-600">This month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">87%</div>
                                <p className="text-xs text-gray-600">Last 30 days</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">94%</div>
                                <p className="text-xs text-gray-600">Course completion</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Analytics charts would go here</p>
                                    <p className="text-sm">Integration with your analytics service</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Classroom Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Archive Classroom</h4>
                                    <p className="text-sm text-gray-600">
                                        Hide this classroom from active listings
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    {classroom.isArchived ? "Unarchive" : "Archive"}
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Group Management</h4>
                                    <p className="text-sm text-gray-600">
                                        Enable or disable group features
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    {classroom.isGrouped ? "Disable Groups" : "Enable Groups"}
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-red-600">Delete Classroom</h4>
                                    <p className="text-sm text-gray-600">
                                        Permanently delete this classroom and all its data
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm">
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}