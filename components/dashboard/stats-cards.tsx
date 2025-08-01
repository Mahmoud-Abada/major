"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/data/mock/users";
import { motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    BookOpen,
    Calendar,
    Clock,
    GraduationCap,
    TrendingDown,
    TrendingUp,
    Users
} from "lucide-react";

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

interface StatsCardsProps {
  user: User;
  className?: string;
}

const getStatsForRole = (user: User): StatCard[] => {
  const baseStats: StatCard[] = [];

  switch (user.role) {
    case "admin":
      return [
        {
          id: "total-users",
          title: "Total Users",
          value: 1247,
          change: { value: 12, type: "increase", period: "this month" },
          icon: Users,
          color: "text-blue-600",
          description: "Active platform users",
          badge: { text: "Active", variant: "default" }
        },
        {
          id: "active-classrooms",
          title: "Active Classrooms",
          value: 45,
          change: { value: 3, type: "increase", period: "this week" },
          icon: BookOpen,
          color: "text-green-600",
          description: "Currently running classes"
        },
        {
          id: "total-revenue",
          title: "Monthly Revenue",
          value: "245,000 DA",
          change: { value: 8.5, type: "increase", period: "vs last month" },
          icon: TrendingUp,
          color: "text-purple-600",
          description: "Total earnings this month"
        },
        {
          id: "system-health",
          title: "System Health",
          value: "99.8%",
          progress: { value: 99.8, max: 100, label: "Uptime" },
          icon: Activity,
          color: "text-emerald-600",
          description: "Platform availability",
          badge: { text: "Excellent", variant: "default" }
        }
      ];

    case "teacher":
      return [
        {
          id: "my-classrooms",
          title: "My Classrooms",
          value: 6,
          icon: BookOpen,
          color: "text-blue-600",
          description: "Active teaching assignments"
        },
        {
          id: "total-students",
          title: "Total Students",
          value: 142,
          change: { value: 5, type: "increase", period: "this month" },
          icon: Users,
          color: "text-green-600",
          description: "Students across all classes"
        },
        {
          id: "avg-attendance",
          title: "Avg. Attendance",
          value: "87.5%",
          progress: { value: 87.5, max: 100, label: "This month" },
          icon: Calendar,
          color: "text-purple-600",
          description: "Average class attendance",
          badge: { text: "Good", variant: "default" }
        },
        {
          id: "pending-grades",
          title: "Pending Grades",
          value: 23,
          icon: GraduationCap,
          color: "text-orange-600",
          description: "Assignments to grade",
          badge: { text: "Action Needed", variant: "destructive" }
        }
      ];

    case "student":
      return [
        {
          id: "enrolled-classes",
          title: "Enrolled Classes",
          value: 8,
          icon: BookOpen,
          color: "text-blue-600",
          description: "Current semester courses"
        },
        {
          id: "overall-grade",
          title: "Overall Grade",
          value: "85.2%",
          progress: { value: 85.2, max: 100, label: "GPA: 3.4/4.0" },
          change: { value: 2.3, type: "increase", period: "this semester" },
          icon: GraduationCap,
          color: "text-green-600",
          description: "Academic performance",
          badge: { text: "Excellent", variant: "default" }
        },
        {
          id: "attendance-rate",
          title: "Attendance Rate",
          value: "92.1%",
          progress: { value: 92.1, max: 100, label: "This month" },
          icon: Calendar,
          color: "text-purple-600",
          description: "Class attendance record",
          badge: { text: "Great", variant: "default" }
        },
        {
          id: "pending-assignments",
          title: "Pending Tasks",
          value: 4,
          icon: Clock,
          color: "text-orange-600",
          description: "Assignments due soon",
          badge: { text: "Due Soon", variant: "outline" }
        }
      ];

    case "parent":
      return [
        {
          id: "children-count",
          title: "My Children",
          value: 2,
          icon: Users,
          color: "text-blue-600",
          description: "Enrolled students"
        },
        {
          id: "avg-performance",
          title: "Avg. Performance",
          value: "88.7%",
          progress: { value: 88.7, max: 100, label: "All children" },
          change: { value: 3.2, type: "increase", period: "this month" },
          icon: TrendingUp,
          color: "text-green-600",
          description: "Academic performance",
          badge: { text: "Excellent", variant: "default" }
        },
        {
          id: "attendance-overview",
          title: "Attendance",
          value: "94.3%",
          progress: { value: 94.3, max: 100, label: "Combined rate" },
          icon: Calendar,
          color: "text-purple-600",
          description: "Overall attendance rate",
          badge: { text: "Outstanding", variant: "default" }
        },
        {
          id: "notifications",
          title: "New Updates",
          value: 7,
          icon: AlertCircle,
          color: "text-orange-600",
          description: "Unread notifications",
          badge: { text: "New", variant: "destructive" }
        }
      ];

    default:
      return [];
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.2 }
  }
};

const progressVariants = {
  initial: { width: 0 },
  animate: (value: number) => ({
    width: `${value}%`,
    transition: {
      duration: 1.5,
      delay: 0.5,
      ease: "easeOut"
    }
  })
};

export function StatsCards({ user, className = "" }: StatsCardsProps) {
  const stats = getStatsForRole(user);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="h-full"
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <motion.div
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}
              >
                <stat.icon className="h-4 w-4" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Main Value */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>
                  {stat.badge && (
                    <Badge variant={stat.badge.variant} className="text-xs">
                      {stat.badge.text}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {stat.description && (
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                )}

                {/* Progress Bar */}
                {stat.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {stat.progress.label || "Progress"}
                      </span>
                      <span className="font-medium">
                        {stat.progress.value}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          stat.progress.value >= 90 
                            ? "bg-green-500" 
                            : stat.progress.value >= 70 
                            ? "bg-blue-500" 
                            : stat.progress.value >= 50 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                        }`}
                        variants={progressVariants}
                        initial="initial"
                        animate="animate"
                        custom={stat.progress.value}
                      />
                    </div>
                  </div>
                )}

                {/* Change Indicator */}
                {stat.change && (
                  <div className="flex items-center space-x-2 text-xs">
                    {stat.change.type === "increase" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={
                      stat.change.type === "increase" 
                        ? "text-green-600" 
                        : "text-red-600"
                    }>
                      {stat.change.type === "increase" ? "+" : "-"}
                      {stat.change.value}%
                    </span>
                    <span className="text-muted-foreground">
                      {stat.change.period}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}