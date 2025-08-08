"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  MessageSquare,
  Plus,
  Settings,
  Upload,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
  shortcut?: string;
  category: "primary" | "secondary";
}

interface QuickActionsProps {
  user: User;
  className?: string;
}

const getActionsForRole = (user: User, t: any): QuickAction[] => {
  switch (user.role) {
    case "admin":
      return [
        {
          id: "create-user",
          title: "Add New User",
          description: "Register teachers, students, or parents",
          icon: Users,
          href: "/users/create",
          color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
          shortcut: "Ctrl+N",
          category: "primary",
        },
        {
          id: "create-classroom",
          title: "Create Classroom",
          description: "Set up a new class or course",
          icon: BookOpen,
          href: "/classroom/classrooms/create",
          color: "text-green-600 bg-green-50 hover:bg-green-100",
          category: "primary",
        },
        {
          id: "view-reports",
          title: "View Reports",
          description: "Analytics and performance insights",
          icon: BarChart3,
          href: "/reports",
          color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
          badge: { text: "New", variant: "destructive" },
          category: "primary",
        },
        {
          id: "system-settings",
          title: "System Settings",
          description: "Configure platform settings",
          icon: Settings,
          href: "/settings",
          color: "text-gray-600 bg-gray-50 hover:bg-gray-100",
          category: "secondary",
        },
        {
          id: "bulk-import",
          title: "Bulk Import",
          description: "Import users from CSV/Excel",
          icon: Upload,
          href: "/users/import",
          color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
          category: "secondary",
        },
        {
          id: "export-data",
          title: "Export Data",
          description: "Download platform data",
          icon: Download,
          href: "/export",
          color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
          category: "secondary",
        },
      ];

    case "teacher":
      return [
        {
          id: "create-post",
          title: "Create Post",
          description: "Share announcements or assignments",
          icon: MessageSquare,
          href: "/classroom/posts/create",
          color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
          shortcut: "Ctrl+P",
          category: "primary",
        },
        {
          id: "grade-assignments",
          title: "Grade Assignments",
          description: "Review and grade student work",
          icon: GraduationCap,
          href: "/classroom/marks/entry",
          color: "text-green-600 bg-green-50 hover:bg-green-100",
          badge: { text: "23 Pending", variant: "destructive" },
          category: "primary",
        },
        {
          id: "take-attendance",
          title: "Take Attendance",
          description: "Mark student attendance",
          icon: Calendar,
          href: "/classroom/attendance/entry",
          color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
          category: "primary",
        },
        {
          id: "view-classrooms",
          title: "My Classrooms",
          description: "Manage your classes",
          icon: BookOpen,
          href: "/classroom/classrooms",
          color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
          category: "secondary",
        },
        {
          id: "messages",
          title: "Messages",
          description: "Communicate with parents and students",
          icon: MessageSquare,
          href: "/messages",
          color: "text-pink-600 bg-pink-50 hover:bg-pink-100",
          badge: { text: "5 New", variant: "outline" },
          category: "secondary",
        },
        {
          id: "class-reports",
          title: "Class Reports",
          description: "Generate performance reports",
          icon: BarChart3,
          href: "/reports/classroom",
          color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
          category: "secondary",
        },
      ];

    case "student":
      return [
        {
          id: "view-assignments",
          title: "My Assignments",
          description: "View and submit homework",
          icon: FileText,
          href: "/classroom/posts?type=homework",
          color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
          badge: { text: "4 Due", variant: "destructive" },
          category: "primary",
        },
        {
          id: "view-grades",
          title: "My Grades",
          description: "Check your academic performance",
          icon: GraduationCap,
          href: "/classroom/marks",
          color: "text-green-600 bg-green-50 hover:bg-green-100",
          category: "primary",
        },
        {
          id: "view-schedule",
          title: "Class Schedule",
          description: "View your timetable",
          icon: Calendar,
          href: "/schedule",
          color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
          category: "primary",
        },
        {
          id: "join-classroom",
          title: "Join Classroom",
          description: "Enroll in a new class",
          icon: Plus,
          href: "/classroom/join",
          color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
          category: "secondary",
        },
        {
          id: "messages",
          title: "Messages",
          description: "Chat with teachers and classmates",
          icon: MessageSquare,
          href: "/messages",
          color: "text-pink-600 bg-pink-50 hover:bg-pink-100",
          badge: { text: "2 New", variant: "outline" },
          category: "secondary",
        },
        {
          id: "study-groups",
          title: "Study Groups",
          description: "Join or create study groups",
          icon: Users,
          href: "/classroom/groups",
          color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
          category: "secondary",
        },
      ];

    case "parent":
      return [
        {
          id: "child-progress",
          title: "Child's Progress",
          description: "View academic performance",
          icon: BarChart3,
          href: "/reports/children",
          color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
          category: "primary",
        },
        {
          id: "attendance-report",
          title: "Attendance Report",
          description: "Check attendance records",
          icon: Calendar,
          href: "/reports/attendance",
          color: "text-green-600 bg-green-50 hover:bg-green-100",
          category: "primary",
        },
        {
          id: "teacher-messages",
          title: "Teacher Messages",
          description: "Communicate with teachers",
          icon: MessageSquare,
          href: "/messages",
          color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
          badge: { text: "3 New", variant: "outline" },
          category: "primary",
        },
        {
          id: "upcoming-events",
          title: "Upcoming Events",
          description: "School calendar and events",
          icon: Calendar,
          href: "/events",
          color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
          category: "secondary",
        },
        {
          id: "notifications",
          title: "Notifications",
          description: "Important updates and alerts",
          icon: Bell,
          href: "/notifications",
          color: "text-pink-600 bg-pink-50 hover:bg-pink-100",
          badge: { text: "7 New", variant: "destructive" },
          category: "secondary",
        },
        {
          id: "payment-history",
          title: "Payment History",
          description: "View fee payments and invoices",
          icon: FileText,
          href: "/payments",
          color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
          category: "secondary",
        },
      ];

    default:
      return [];
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 5,
    transition: { duration: 0.2 },
  },
};

export function QuickActions({ user, className = "" }: QuickActionsProps) {
  const t = useTranslations("dashboard");
  const actions = getActionsForRole(user, t);
  const primaryActions = actions.filter(
    (action) => action.category === "primary",
  );
  const secondaryActions = actions.filter(
    (action) => action.category === "secondary",
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            {t("quickActions")}
            <Badge variant="outline" className="ml-2 text-xs">
              {primaryActions.length} {t("available")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {primaryActions.map((action, index) => (
              <motion.div
                key={action.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <Link href={action.href}>
                  <Card className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <motion.div
                          variants={iconVariants}
                          initial="initial"
                          whileHover="hover"
                          className={`p-3 rounded-lg ${action.color} flex-shrink-0`}
                        >
                          <action.icon className="h-5 w-5" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm text-foreground">
                              {action.title}
                            </h3>
                            {action.badge && (
                              <Badge
                                variant={action.badge.variant}
                                className="text-xs"
                              >
                                {action.badge.text}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {action.description}
                          </p>
                          {action.shortcut && (
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {action.shortcut}
                              </span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              {t("moreActions")}
              <Badge variant="secondary" className="ml-2 text-xs">
                {secondaryActions.length} {t("available")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {secondaryActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  custom={index + primaryActions.length}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link href={action.href}>
                    <Button
                      variant="ghost"
                      className="h-auto p-3 flex flex-col items-center space-y-2 w-full hover:bg-muted/50 relative"
                    >
                      {action.badge && (
                        <Badge
                          variant={action.badge.variant}
                          className="absolute -top-1 -right-1 text-xs px-1 py-0 h-5"
                        >
                          {action.badge.text}
                        </Badge>
                      )}
                      <motion.div
                        variants={iconVariants}
                        initial="initial"
                        whileHover="hover"
                        className={`p-2 rounded-lg ${action.color}`}
                      >
                        <action.icon className="h-4 w-4" />
                      </motion.div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-foreground">
                          {action.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
