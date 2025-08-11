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
import { Edit, Eye, Plus, Trash2, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock data - in real app this would come from API/Redux
const mockUsers = [
    {
        id: "1",
        name: "Ahmed Ben Ali",
        email: "ahmed@example.com",
        userType: "teacher",
        status: "active",
        createdAt: "2024-01-15",
        phone: "+213 555 0123",
        specialization: "Mathematics",
    },
    {
        id: "2",
        name: "Fatima Khelifi",
        email: "fatima@example.com",
        userType: "student",
        status: "active",
        createdAt: "2024-01-20",
        phone: "+213 555 0124",
        grade: "High School",
    },
    {
        id: "3",
        name: "Omar Messaoudi",
        email: "omar@example.com",
        userType: "teacher",
        status: "active",
        createdAt: "2024-01-10",
        phone: "+213 555 0125",
        specialization: "Physics",
    },
];

export default function ClassroomUsersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");

    const handleViewUser = (id: string) => {
        router.push(`/classroom/users/${id}`);
    };

    const handleEditUser = (id: string) => {
        router.push(`/classroom/users/${id}/edit`);
    };

    const handleDeleteUser = (id: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            // Handle delete logic here
            console.log("Deleting user:", id);
        }
    };

    const getFilteredUsers = (filterType: string) => {
        switch (filterType) {
            case "teachers":
                return mockUsers.filter((user) => user.userType === "teacher");
            case "students":
                return mockUsers.filter((user) => user.userType === "student");
            case "active":
                return mockUsers.filter((user) => user.status === "active");
            case "inactive":
                return mockUsers.filter((user) => user.status === "inactive");
            default:
                return mockUsers;
        }
    };

    const UserCard = ({ user }: { user: any }) => (
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewUser(user.id)}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            {user.userType === "teacher" ? (
                                <Users className="h-6 w-6 text-primary" />
                            ) : (
                                <UserPlus className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${user.userType === "teacher"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    }`}>
                                    {user.userType}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${user.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}>
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewUser(user.id);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditUser(user.id);
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                    {user.userType === "teacher" && user.specialization && (
                        <p>Specialization: {user.specialization}</p>
                    )}
                    {user.userType === "student" && user.grade && (
                        <p>Grade: {user.grade}</p>
                    )}
                    <p>Phone: {user.phone}</p>
                    <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage teachers and students in your school
                    </p>
                </div>
                <Link href="/classroom/users/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>
                                View and manage all users in your school. Click on a user to view their profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getFilteredUsers("all").map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="teachers" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Teachers</CardTitle>
                            <CardDescription>
                                View and manage all teachers in your school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getFilteredUsers("teachers").map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Students</CardTitle>
                            <CardDescription>
                                View and manage all students in your school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getFilteredUsers("students").map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Users</CardTitle>
                            <CardDescription>
                                View and manage all active users in your school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getFilteredUsers("active").map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inactive" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inactive Users</CardTitle>
                            <CardDescription>
                                View and manage all inactive users in your school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getFilteredUsers("inactive").map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                            {getFilteredUsers("inactive").length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No inactive users found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}