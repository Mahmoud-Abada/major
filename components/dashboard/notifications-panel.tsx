"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Info,
  MoreHorizontal,
  Settings,
  XCircle
} from "lucide-react";
import { useState } from "react";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

// Mock notification functions - will be replaced with API calls
const getNotificationsByRecipient = (userId: string) => [];
const getUnreadNotifications = (userId: string) => [];
const markNotificationAsRead = (notificationId: string) => true;

interface NotificationsPanelProps {
  user: User;
  className?: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success": return CheckCircle;
    case "warning": return AlertTriangle;
    case "error": return XCircle;
    case "announcement": return Bell;
    case "info":
    default: return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success": return "text-green-600 bg-green-50";
    case "warning": return "text-yellow-600 bg-yellow-50";
    case "error": return "text-red-600 bg-red-50";
    case "announcement": return "text-purple-600 bg-purple-50";
    case "info":
    default: return "text-blue-600 bg-blue-50";
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high": return { text: "High", variant: "destructive" as const };
    case "medium": return { text: "Medium", variant: "outline" as const };
    case "low": return { text: "Low", variant: "secondary" as const };
    default: return null;
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  exit: {
    opacity: 0,
    x: 20,
    height: 0,
    transition: { duration: 0.2 }
  }
};

export function NotificationsPanel({ user, className = "" }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(getNotificationsByRecipient(user.id));
  const unreadNotifications = getUnreadNotifications(user.id);
  const unreadCount = unreadNotifications.length;

  const handleMarkAsRead = (notificationId: string) => {
    const success = markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(getNotificationsByRecipient(user.id));
    }
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.id);
      }
    });
    setNotifications(getNotificationsByRecipient(user.id));
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.action?.url) {
      window.open(notification.action.url, '_self');
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-6">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {notifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                const priorityBadge = getPriorityBadge(notification.priority);

                return (
                  <motion.div
                    key={notification.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${notification.isRead
                        ? "bg-background hover:bg-muted/50 border-border"
                        : "bg-muted/30 hover:bg-muted/50 border-primary/20 shadow-sm"
                      }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-2 top-4 w-2 h-2 bg-primary rounded-full" />
                    )}

                    <div className="flex items-start space-x-3 ml-2">
                      {/* Icon */}
                      <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`text-sm font-medium ${notification.isRead ? "text-muted-foreground" : "text-foreground"
                                }`}>
                                {notification.title}
                              </h4>
                              {priorityBadge && (
                                <Badge variant={priorityBadge.variant} className="text-xs">
                                  {priorityBadge.text}
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm ${notification.isRead ? "text-muted-foreground/80" : "text-muted-foreground"
                              }`}>
                              {notification.message}
                            </p>

                            {/* Category and timestamp */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                </span>
                              </div>

                              {/* Action button */}
                              {notification.action && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (notification.action?.url) {
                                      window.open(notification.action.url, '_self');
                                    }
                                  }}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Mark as read button */}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full text-sm" asChild>
              <a href="/notifications">
                View all notifications
                <MoreHorizontal className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}