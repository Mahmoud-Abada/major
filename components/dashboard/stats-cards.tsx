"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useTranslations } from "next-intl";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

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

const getStatsForRole = (user: User, t: any, tCommon: any): StatCard[] => {
  const baseStats: StatCard[] = [];

  switch (user.role) {
    case "admin":
      return [
        {
          id: "total-users",
          title: t('stats.totalUsers'),
          value: 1247,
          change: { value: 12, type: "increase", period: t('stats.thisMonth') },
          icon: Users,
          color: "text-blue-600",
          description: t('stats.activePlatformUsers'),
          badge: { text: t('stats.active'), variant: "default" }
        },
        {
          id: "active-classrooms",
          title: t('stats.activeClassrooms'),
          value: 45,
          change: { value: 3, type: "increase", period: t('stats.thisWeek') },
          icon: BookOpen,
          color: "text-green-600",
          description: t('stats.currentlyRunningClasses')
        },
        {
          id: "total-revenue",
          title: t('stats.monthlyRevenue'),
          value: "245,000 DA",
          change: { value: 8.5, type: "increase", period: t('stats.vsLastMonth') },
          icon: TrendingUp,
          color: "text-purple-600",
          description: t('stats.totalEarningsThisMonth')
        },
        {
          id: "system-health",
          title: t('stats.systemHealth'),
          value: "99.8%",
          progress: { value: 99.8, max: 100, label: t('stats.uptime') },
          icon: Activity,
          color: "text-emerald-600",
          description: t('stats.platformAvailability'),
          badge: { text: t('stats.excellent'), variant: "default" }
        }
      ];

    case "teacher":
      return [
        {
          id: "my-classrooms",
          title: t('stats.myClassrooms'),
          value: 6,
          icon: BookOpen,
          color: "text-blue-600",
          description: t('stats.activeTeachingAssignments')
        },
        {
          id: "total-students",
          title: t('stats.totalStudents'),
          value: 142,
          change: { value: 5, type: "increase", period: t('stats.thisMonth') },
          icon: Users,
          color: "text-green-600",
          description: t('stats.studentsAcrossAllClasses')
        },
        {
          id: "avg-attendance",
          title: t('stats.avgAttendance'),
          value: "87.5%",
          progress: { value: 87.5, max: 100, label: t('stats.thisMonth') },
          icon: Calendar,
          color: "text-purple-600",
          description: t('stats.averageClassAttendance'),
          badge: { text: t('stats.good'), variant: "default" }
        },
        {
          id: "pending-grades",
          title: t('stats.pendingGrades'),
          value: 23,
          icon: GraduationCap,
          color: "text-orange-600",
          description: t('stats.assignmentsToGrade'),
          badge: { text: t('stats.actionNeeded'), variant: "destructive" }
        }
      ];

    case "student":
      return [
        {
          id: "enrolled-classes",
          title: t('stats.enrolledClasses'),
          value: 8,
          icon: BookOpen,
          color: "text-blue-600",
          description: t('stats.currentSemesterCourses')
        },
        {
          id: "overall-grade",
          title: t('stats.overallGrade'),
          value: "85.2%",
          progress: { value: 85.2, max: 100, label: t('stats.gpa') },
          change: { value: 2.3, type: "increase", period: t('stats.thisSemester') },
          icon: GraduationCap,
          color: "text-green-600",
          description: t('stats.academicPerformance'),
          badge: { text: t('stats.excellent'), variant: "default" }
        },
        {
          id: "attendance-rate",
          title: t('stats.attendanceRate'),
          value: "92.1%",
          progress: { value: 92.1, max: 100, label: t('stats.thisMonth') },
          icon: Calendar,
          color: "text-purple-600",
          description: t('stats.classAttendanceRecord'),
          badge: { text: t('stats.great'), variant: "default" }
        },
        {
          id: "pending-assignments",
          title: t('stats.pendingTasks'),
          value: 4,
          icon: Clock,
          color: "text-orange-600",
          description: t('stats.assignmentsDueSoon'),
          badge: { text: t('stats.dueSoon'), variant: "outline" }
        }
      ];

    case "parent":
      return [
        {
          id: "children-count",
          title: t('stats.myChildren'),
          value: 2,
          icon: Users,
          color: "text-blue-600",
          description: t('stats.enrolledStudents')
        },
        {
          id: "avg-performance",
          title: t('stats.avgPerformance'),
          value: "88.7%",
          progress: { value: 88.7, max: 100, label: t('stats.allChildren') },
          change: { value: 3.2, type: "increase", period: t('stats.thisMonth') },
          icon: TrendingUp,
          color: "text-green-600",
          description: t('stats.academicPerformance'),
          badge: { text: t('stats.excellent'), variant: "default" }
        },
        {
          id: "attendance-overview",
          title: t('stats.attendance'),
          value: "94.3%",
          progress: { value: 94.3, max: 100, label: t('stats.combinedRate') },
          icon: Calendar,
          color: "text-purple-600",
          description: t('stats.overallAttendanceRate'),
          badge: { text: t('stats.outstanding'), variant: "default" }
        },
        {
          id: "notifications",
          title: t('stats.newUpdates'),
          value: 7,
          icon: AlertCircle,
          color: "text-orange-600",
          description: t('stats.unreadNotifications'),
          badge: { text: t('stats.new'), variant: "destructive" }
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
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const stats = getStatsForRole(user, t, tCommon);

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
                        className={`h-full rounded-full ${stat.progress.value >= 90
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