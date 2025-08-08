"use client";

import { ProfileContactInfo } from "@/components/profile/ProfileContactInfo";
import { StatusBadge } from "@/components/profile/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/auth";
import { motion } from "framer-motion";
import {
  Bell,
  Camera,
  Clock,
  Edit3,
  Globe,
  Key,
  Mail,
  Palette,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// User type - will be replaced with actual API types
interface UserType {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2 },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push("/signin");
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleSettings = () => {
    router.push("/profile/settings");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "teacher":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "student":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "parent":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your profile.
              </p>
              <Button onClick={() => router.push("/signin")}>Sign In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10"></div>
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-12">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="text-xl font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={handleEditProfile}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        {user.firstName} {user.lastName}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={getRoleColor(user.role)}
                          variant="outline"
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                        <StatusBadge status={user.status} />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleEditProfile}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" onClick={handleSettings}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileContactInfo
                      email={user.email}
                      phone={user.phoneNumber}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Details */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Member Since
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Last Updated
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(user.updatedAt)}
                      </span>
                    </div>
                    {user.lastLogin && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Last Login
                          </span>
                          <span className="text-sm font-medium">
                            {formatDate(user.lastLogin)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Role-specific Information */}
            {user.role === "student" && (
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Student ID
                        </span>
                        <p className="font-medium">{(user as any).studentId}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Grade
                        </span>
                        <p className="font-medium">{(user as any).grade}</p>
                      </div>
                      {(user as any).dateOfBirth && (
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Date of Birth
                          </span>
                          <p className="font-medium">
                            {formatDate(new Date((user as any).dateOfBirth))}
                          </p>
                        </div>
                      )}
                      {(user as any).nationality && (
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Nationality
                          </span>
                          <p className="font-medium">
                            {(user as any).nationality}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {user.role === "teacher" && (
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Years of Experience
                        </span>
                        <p className="font-medium">
                          {(user as any).yearsOfExperience} years
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Employment Date
                        </span>
                        <p className="font-medium">
                          {formatDate(new Date((user as any).employmentDate))}
                        </p>
                      </div>
                    </div>
                    {(user as any).subjects &&
                      (user as any).subjects.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Subjects
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(user as any).subjects.map(
                              (subject: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {subject}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {(user as any).qualifications &&
                      (user as any).qualifications.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Qualifications
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(user as any).qualifications.map(
                              (qualification: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {qualification}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Status */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Verified</span>
                      <StatusBadge
                        status={user.isEmailVerified ? "verified" : "pending"}
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <StatusBadge
                        status={user.twoFactorEnabled ? "enabled" : "disabled"}
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Failed Login Attempts</span>
                      <Badge
                        variant={
                          user.failedLoginAttempts > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {user.failedLoginAttempts}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Password Security */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Password Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.lastPasswordChange && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Last Changed
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(user.lastPasswordChange)}
                        </span>
                      </div>
                    )}
                    <Button variant="outline" className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile viewed</p>
                        <p className="text-xs text-muted-foreground">
                          Just now
                        </p>
                      </div>
                    </div>
                    {user.lastLogin && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Signed in</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(user.lastLogin)}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Account created</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage Notifications
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Display Preferences */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Display
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      Language & Region
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Palette className="h-4 w-4 mr-2" />
                      Theme Settings
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
