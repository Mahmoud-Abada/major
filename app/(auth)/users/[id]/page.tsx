"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleBadge } from "@/components/users/role-badge";
import { AdminUser, mockUsers, ParentUser, StudentUser, TeacherUser } from "@/data/mock/users";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Edit, Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const user = useMemo(() => {
    return mockUsers.find((u) => u.id === params.id);
  }, [params.id]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you're looking for doesn't exist.
          </p>
          <Link href="/users">
            <Button>Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/users/${user.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Deleting user:", user.id);
        router.push("/users");
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderRoleSpecificInfo = () => {
    switch (user.role) {
      case "admin":
        const admin = user as AdminUser;
        return (
          <Card>
            <CardHeader>
              <CardTitle>Administrative Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <p className="text-sm">{admin.department || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Position</label>
                <p className="text-sm">{admin.position || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {admin.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "teacher":
        const teacher = user as TeacherUser;
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subjects</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacher.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  <p className="text-sm">{teacher.yearsOfExperience} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employment Date</label>
                  <p className="text-sm">{teacher.employmentDate.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Qualifications & Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualifications</label>
                  <div className="space-y-1 mt-1">
                    {teacher.qualifications.map((qualification, index) => (
                      <p key={index} className="text-sm">• {qualification}</p>
                    ))}
                  </div>
                </div>
                {teacher.specializations && teacher.specializations.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Specializations</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {teacher.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bio</label>
                    <p className="text-sm mt-1">{teacher.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "student":
        const student = user as StudentUser;
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                    <p className="text-sm font-mono">{student.studentId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Grade</label>
                    <p className="text-sm">{student.grade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-sm">{student.dateOfBirth.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Enrollment Date</label>
                    <p className="text-sm">{student.enrollmentDate.toLocaleDateString()}</p>
                  </div>
                </div>
                {student.nationality && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                    <p className="text-sm">{student.nationality}</p>
                  </div>
                )}
                {student.bloodGroup && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <p className="text-sm">{student.bloodGroup}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.parentName && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Parent/Guardian Name</label>
                    <p className="text-sm">{student.parentName}</p>
                  </div>
                )}
                {student.parentEmail && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Parent Email</label>
                    <p className="text-sm">{student.parentEmail}</p>
                  </div>
                )}
                {student.parentPhone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Parent Phone</label>
                    <p className="text-sm">{student.parentPhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "parent":
        const parent = user as ParentUser;
        return (
          <Card>
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                <p className="text-sm capitalize">{parent.relationship}</p>
              </div>
              {parent.occupation && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                  <p className="text-sm">{parent.occupation}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Children</label>
                <p className="text-sm">{parent.children.length} child(ren)</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </motion.div>

      {/* User Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-lg">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex gap-2">
                    <RoleBadge role={user.role} />
                    <Badge className={getStatusColor(user.status)} variant="outline">
                      {user.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {user.phoneNumber}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  {user.phoneNumber && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-sm">{user.phoneNumber}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <div className="mt-1">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(user.status)} variant="outline">
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  {(user as StudentUser).address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-sm">{(user as StudentUser).address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Role-specific Information */}
              {renderRoleSpecificInfo()}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                    <p className="text-sm">
                      {user.isEmailVerified ? (
                        <Badge className="bg-green-100 text-green-800" variant="outline">Verified</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800" variant="outline">Not Verified</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Two-Factor Auth</label>
                    <p className="text-sm">
                      {user.twoFactorEnabled ? (
                        <Badge className="bg-green-100 text-green-800" variant="outline">Enabled</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800" variant="outline">Disabled</Badge>
                      )}
                    </p>
                  </div>
                </div>
                
                {user.lastPasswordChange && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Password Change</label>
                    <p className="text-sm">{user.lastPasswordChange.toLocaleDateString()}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Failed Login Attempts</label>
                  <p className="text-sm">{user.failedLoginAttempts}</p>
                </div>
                
                {user.lockedUntil && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Locked Until</label>
                    <p className="text-sm text-red-600">{user.lockedUntil.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <p className="text-sm">
                    {user.lastLogin ? user.lastLogin.toLocaleString() : "Never"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <p className="text-sm">{user.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{user.updatedAt.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}