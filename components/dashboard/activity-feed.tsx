"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/data/mock/users";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
    Bell,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    GraduationCap,
    MessageSquare,
    MoreHorizontal,
    Settings,
    UserPlus
} from "lucide-react";

interface Activity {
  id: string;
  type: "classroom" | "grade" | "message" | "attendance" | "assignment" | "user" | "system" | "notification";
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  metadata?: {
    classroom?: string;
    grade?: number;
    status?: "success" | "warning" | "error" | "info";
    priority?: "low" | "medium" | "high";
  };
  actionUrl?: string;
}

interface ActivityFeedProps {
  user: User;
  className?: string;
}

const getActivitiesForRole = (user: User): Activity[] => {
  const now = new Date();
  
  switch (user.role) {
    case "admin":
      return [
        {
          id: "activity-1",
          type: "user",
          title: "New Teacher Registration",
          description: "Yacine Cherif has registered as a Computer Science teacher",
          timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
          user: {
            name: "Yacine Cherif",
            avatar: "/avatars/yacine-cherif.jpg",
            role: "teacher"
          },
          metadata: { status: "info", priority: "medium" },
          actionUrl: "/users/teacher-003"
        },
        {
          id: "activity-2",
          type: "classroom",
          title: "New Classroom Created",
          description: "Web Development course has been added to the platform",
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          user: {
            name: "Karim Mansouri",
            avatar: "/avatars/karim-mansouri.jpg",
            role: "teacher"
          },
          metadata: { status: "success", classroom: "Web Development", priority: "low" },
          actionUrl: "/classroom/classrooms/classroom-004"
        },
        {
          id: "activity-3",
          type: "system",
          title: "System Maintenance Completed",
          description: "Scheduled maintenance completed successfully. All services operational",
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
          metadata: { status: "success", priority: "high" }
        },
        {
          id: "activity-4",
          type: "grade",
          title: "Grade Reports Generated",
          description: "Monthly grade reports have been generated for all active classrooms",
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
          metadata: { status: "info", priority: "medium" },
          actionUrl: "/reports/grades"
        },
        {
          id: "activity-5",
          type: "user",
          title: "Account Verification",
          description: "15 new student accounts have been verified and activated",
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
          metadata: { status: "success", priority: "low" }
        }
      ];

    case "teacher":
      return [
        {
          id: "activity-1",
          type: "assignment",
          title: "Assignment Submitted",
          description: "Rania Boumediene submitted Advanced Algebra homework",
          timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          user: {
            name: "Rania Boumediene",
            avatar: "/avatars/rania-boumediene.jpg",
            role: "student"
          },
          metadata: { status: "info", classroom: "Advanced Algebra", priority: "medium" },
          actionUrl: "/classroom/posts/post-001"
        },
        {
          id: "activity-2",
          type: "message",
          title: "New Message",
          description: "Mohammed Boumediene sent you a message about his daughter's progress",
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
          user: {
            name: "Mohammed Boumediene",
            avatar: "/avatars/mohammed-boumediene.jpg",
            role: "parent"
          },
          metadata: { status: "info", priority: "high" },
          actionUrl: "/messages"
        },
        {
          id: "activity-3",
          type: "attendance",
          title: "Attendance Recorded",
          description: "Attendance has been marked for Physics lab session",
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
          metadata: { status: "success", classroom: "Physics Lab", priority: "low" },
          actionUrl: "/classroom/attendance"
        },
        {
          id: "activity-4",
          type: "grade",
          title: "Grades Updated",
          description: "Midterm exam grades have been published for Advanced Algebra",
          timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
          metadata: { status: "success", classroom: "Advanced Algebra", priority: "medium" },
          actionUrl: "/classroom/marks"
        },
        {
          id: "activity-5",
          type: "classroom",
          title: "Class Schedule Updated",
          description: "Physics lab session moved to Thursday 2:00 PM",
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
          metadata: { status: "warning", classroom: "Physics Lab", priority: "high" },
          actionUrl: "/classroom/classrooms/classroom-002"
        }
      ];

    case "student":
      return [
        {
          id: "activity-1",
          type: "grade",
          title: "New Grade Posted",
          description: "Your Advanced Algebra midterm exam has been graded: 17/20",
          timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
          user: {
            name: "Karim Mansouri",
            avatar: "/avatars/karim-mansouri.jpg",
            role: "teacher"
          },
          metadata: { status: "success", grade: 17, classroom: "Advanced Algebra", priority: "high" },
          actionUrl: "/classroom/marks"
        },
        {
          id: "activity-2",
          type: "assignment",
          title: "New Assignment",
          description: "Polynomial Functions homework has been posted",
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          user: {
            name: "Karim Mansouri",
            avatar: "/avatars/karim-mansouri.jpg",
            role: "teacher"
          },
          metadata: { status: "info", classroom: "Advanced Algebra", priority: "high" },
          actionUrl: "/classroom/posts/post-001"
        },
        {
          id: "activity-3",
          type: "message",
          title: "Message from Teacher",
          description: "Karim Mansouri sent feedback on your recent performance",
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
          user: {
            name: "Karim Mansouri",
            avatar: "/avatars/karim-mansouri.jpg",
            role: "teacher"
          },
          metadata: { status: "info", priority: "medium" },
          actionUrl: "/messages"
        },
        {
          id: "activity-4",
          type: "attendance",
          title: "Attendance Marked",
          description: "Your attendance has been recorded for today's Physics class",
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
          metadata: { status: "success", classroom: "Physics", priority: "low" }
        },
        {
          id: "activity-5",
          type: "notification",
          title: "Class Rescheduled",
          description: "Arabic Literature class moved to Sunday 9:00 AM",
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
          metadata: { status: "warning", classroom: "Arabic Literature", priority: "high" },
          actionUrl: "/classroom/classrooms/classroom-003"
        }
      ];

    case "parent":
      return [
        {
          id: "activity-1",
          type: "grade",
          title: "Excellent Performance",
          description: "Rania scored 17/20 on her mathematics midterm exam",
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
          user: {
            name: "Rania Boumediene",
            avatar: "/avatars/rania-boumediene.jpg",
            role: "student"
          },
          metadata: { status: "success", grade: 17, classroom: "Advanced Algebra", priority: "medium" },
          actionUrl: "/reports/student/student-001"
        },
        {
          id: "activity-2",
          type: "attendance",
          title: "Perfect Attendance",
          description: "Rania attended all classes this week",
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
          user: {
            name: "Rania Boumediene",
            avatar: "/avatars/rania-boumediene.jpg",
            role: "student"
          },
          metadata: { status: "success", priority: "low" }
        },
        {
          id: "activity-3",
          type: "message",
          title: "Teacher Message",
          description: "Karim Mansouri sent an update about upcoming parent-teacher conference",
          timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
          user: {
            name: "Karim Mansouri",
            avatar: "/avatars/karim-mansouri.jpg",
            role: "teacher"
          },
          metadata: { status: "info", priority: "high" },
          actionUrl: "/messages"
        },
        {
          id: "activity-4",
          type: "assignment",
          title: "Assignment Due Soon",
          description: "Rania has a polynomial functions assignment due tomorrow",
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
          metadata: { status: "warning", classroom: "Advanced Algebra", priority: "high" },
          actionUrl: "/classroom/posts/post-001"
        },
        {
          id: "activity-5",
          type: "notification",
          title: "School Announcement",
          description: "Winter break schedule has been published",
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
          metadata: { status: "info", priority: "medium" },
          actionUrl: "/notifications"
        }
      ];

    default:
      return [];
  }
};

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "classroom": return BookOpen;
    case "grade": return GraduationCap;
    case "message": return MessageSquare;
    case "attendance": return Calendar;
    case "assignment": return FileText;
    case "user": return UserPlus;
    case "system": return Settings;
    case "notification": return Bell;
    default: return Clock;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "success": return "text-green-600 bg-green-50";
    case "warning": return "text-yellow-600 bg-yellow-50";
    case "error": return "text-red-600 bg-red-50";
    case "info": return "text-blue-600 bg-blue-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

const getPriorityBadge = (priority?: string) => {
  switch (priority) {
    case "high": return { text: "High", variant: "destructive" as const };
    case "medium": return { text: "Medium", variant: "outline" as const };
    case "low": return { text: "Low", variant: "secondary" as const };
    default: return null;
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  hover: {
    x: 5,
    transition: { duration: 0.2 }
  }
};

export function ActivityFeed({ user, className = "" }: ActivityFeedProps) {
  const activities = getActivitiesForRole(user);

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 pb-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const statusColor = getStatusColor(activity.metadata?.status);
              const priorityBadge = getPriorityBadge(activity.metadata?.priority);

              return (
                <motion.div
                  key={activity.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => activity.actionUrl && window.open(activity.actionUrl, '_self')}
                >
                  {/* Icon */}
                  <div className={`p-2 rounded-full ${statusColor} flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {activity.title}
                          </p>
                          {priorityBadge && (
                            <Badge variant={priorityBadge.variant} className="text-xs">
                              {priorityBadge.text}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        
                        {/* User info */}
                        {activity.user && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                              <AvatarFallback className="text-xs">
                                {activity.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {activity.user.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {activity.user.role}
                            </Badge>
                          </div>
                        )}

                        {/* Metadata */}
                        {activity.metadata?.classroom && (
                          <div className="flex items-center space-x-1 mt-1">
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {activity.metadata.classroom}
                            </span>
                          </div>
                        )}

                        {activity.metadata?.grade && (
                          <div className="flex items-center space-x-1 mt-1">
                            <GraduationCap className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Grade: {activity.metadata.grade}/20
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </span>
                        {activity.actionUrl && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}