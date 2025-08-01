// Notification types and mock data
export interface Notification {
  id: string;
  recipient: string;
  recipientName: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "announcement";
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  relatedEntity?: {
    type: "classroom" | "group" | "post" | "mark" | "attendance" | "user";
    id: string;
  };
  action?: {
    label: string;
    url: string;
  };
  priority: "low" | "medium" | "high";
  category: "academic" | "administrative" | "social" | "system";
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  type: "maintenance" | "feature" | "policy" | "event";
  targetRoles: string[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  priority: "low" | "medium" | "high";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
export const mockNotifications: Notification[] = [
  {
    id: "notification-001",
    recipient: "student-001",
    recipientName: "Rania Boumediene",
    title: "New Assignment Posted",
    message:
      "A new mathematics assignment has been posted in Advanced Algebra class. Due date: November 25, 2024.",
    type: "info",
    isRead: false,
    createdAt: new Date("2024-11-18T10:30:00"),
    relatedEntity: {
      type: "post",
      id: "post-001",
    },
    action: {
      label: "View Assignment",
      url: "/classroom/posts/post-001",
    },
    priority: "high",
    category: "academic",
  },
  {
    id: "notification-002",
    recipient: "student-001",
    recipientName: "Rania Boumediene",
    title: "Grade Updated",
    message:
      "Your grade for the midterm exam in Advanced Algebra has been updated. Score: 17/20",
    type: "success",
    isRead: true,
    createdAt: new Date("2024-11-15T14:20:00"),
    readAt: new Date("2024-11-15T16:45:00"),
    relatedEntity: {
      type: "mark",
      id: "mark-001",
    },
    action: {
      label: "View Grades",
      url: "/classroom/marks",
    },
    priority: "medium",
    category: "academic",
  },
  {
    id: "notification-003",
    recipient: "student-002",
    recipientName: "Omar Khelifi",
    title: "Class Rescheduled",
    message:
      "Physics lab session has been moved from Tuesday to Thursday at the same time (2:00 PM - 5:00 PM).",
    type: "warning",
    isRead: false,
    createdAt: new Date("2024-11-17T09:15:00"),
    relatedEntity: {
      type: "classroom",
      id: "classroom-002",
    },
    action: {
      label: "View Schedule",
      url: "/classroom/classrooms/classroom-002",
    },
    priority: "high",
    category: "administrative",
  },
  {
    id: "notification-004",
    recipient: "student-003",
    recipientName: "Lina Hamidi",
    title: "Poetry Recitation Event",
    message:
      "Arabic Literature Circle will be hosting a poetry recitation event next month. Sign up now!",
    type: "announcement",
    isRead: false,
    createdAt: new Date("2024-11-14T11:00:00"),
    relatedEntity: {
      type: "group",
      id: "group-003",
    },
    action: {
      label: "Learn More",
      url: "/classroom/groups/group-003",
    },
    priority: "medium",
    category: "social",
  },
  {
    id: "notification-005",
    recipient: "teacher-001",
    recipientName: "Karim Mansouri",
    title: "Grade Submission Reminder",
    message:
      "Please submit grades for your Advanced Algebra class by the end of this week.",
    type: "warning",
    isRead: true,
    createdAt: new Date("2024-11-16T08:00:00"),
    readAt: new Date("2024-11-16T08:30:00"),
    relatedEntity: {
      type: "classroom",
      id: "classroom-001",
    },
    action: {
      label: "Submit Grades",
      url: "/classroom/marks/entry",
    },
    priority: "high",
    category: "administrative",
  },
  {
    id: "notification-006",
    recipient: "teacher-001",
    recipientName: "Karim Mansouri",
    title: "Student Absence Alert",
    message:
      "Omar Khelifi was absent from today's physics class. Medical certificate provided.",
    type: "info",
    isRead: false,
    createdAt: new Date("2024-11-19T14:30:00"),
    relatedEntity: {
      type: "attendance",
      id: "attendance-005",
    },
    action: {
      label: "View Attendance",
      url: "/classroom/attendance",
    },
    priority: "medium",
    category: "administrative",
  },
  {
    id: "notification-007",
    recipient: "parent-001",
    recipientName: "Mohammed Boumediene",
    title: "Excellent Performance",
    message:
      "Your daughter Rania scored 17/20 on her mathematics midterm exam. Great job!",
    type: "success",
    isRead: false,
    createdAt: new Date("2024-11-15T15:00:00"),
    relatedEntity: {
      type: "mark",
      id: "mark-001",
    },
    action: {
      label: "View Report",
      url: "/reports/student/student-001",
    },
    priority: "medium",
    category: "academic",
  },
  {
    id: "notification-008",
    recipient: "parent-002",
    recipientName: "Salima Khelifi",
    title: "Attendance Alert",
    message:
      "Your son Omar was absent from physics class today. Please ensure he catches up on missed material.",
    type: "warning",
    isRead: true,
    createdAt: new Date("2024-11-19T15:00:00"),
    readAt: new Date("2024-11-19T18:20:00"),
    relatedEntity: {
      type: "attendance",
      id: "attendance-005",
    },
    action: {
      label: "Contact Teacher",
      url: "/messages/compose?to=teacher-001",
    },
    priority: "high",
    category: "administrative",
  },
  {
    id: "notification-009",
    recipient: "admin-001",
    recipientName: "Ahmed Benali",
    title: "System Maintenance Complete",
    message:
      "The scheduled system maintenance has been completed successfully. All services are now operational.",
    type: "success",
    isRead: true,
    createdAt: new Date("2024-11-20T06:00:00"),
    readAt: new Date("2024-11-20T07:15:00"),
    priority: "low",
    category: "system",
  },
  {
    id: "notification-010",
    recipient: "student-004",
    recipientName: "Amine Bouzid",
    title: "Assignment Overdue",
    message:
      "Your polynomial functions assignment is now overdue. Please submit as soon as possible.",
    type: "error",
    isRead: false,
    createdAt: new Date("2024-11-26T09:00:00"),
    relatedEntity: {
      type: "post",
      id: "post-001",
    },
    action: {
      label: "Submit Now",
      url: "/classroom/posts/post-001",
    },
    priority: "high",
    category: "academic",
  },
];

export const mockSystemAnnouncements: SystemAnnouncement[] = [
  {
    id: "announcement-001",
    title: "New Mobile App Available",
    content:
      "We're excited to announce that the MAJOR Academy mobile app is now available for download on both iOS and Android. Access your classes, grades, and messages on the go!",
    type: "feature",
    targetRoles: ["student", "teacher", "parent"],
    isActive: true,
    startDate: new Date("2024-11-15"),
    endDate: new Date("2024-12-15"),
    priority: "medium",
    createdBy: "admin-001",
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "announcement-002",
    title: "Scheduled Maintenance",
    content:
      "The system will undergo scheduled maintenance on Sunday, November 24th from 2:00 AM to 6:00 AM. During this time, the platform may be temporarily unavailable.",
    type: "maintenance",
    targetRoles: ["admin", "teacher", "student", "parent"],
    isActive: true,
    startDate: new Date("2024-11-20"),
    endDate: new Date("2024-11-24"),
    priority: "high",
    createdBy: "admin-001",
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "announcement-003",
    title: "Winter Break Schedule",
    content:
      "Classes will be suspended from December 21st to January 7th for winter break. Regular classes will resume on January 8th, 2025.",
    type: "event",
    targetRoles: ["teacher", "student", "parent"],
    isActive: true,
    startDate: new Date("2024-11-10"),
    endDate: new Date("2024-12-20"),
    priority: "medium",
    createdBy: "admin-002",
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "announcement-004",
    title: "Updated Privacy Policy",
    content:
      "We have updated our privacy policy to better protect your data and comply with new regulations. Please review the changes in your account settings.",
    type: "policy",
    targetRoles: ["admin", "teacher", "student", "parent"],
    isActive: true,
    startDate: new Date("2024-11-01"),
    priority: "low",
    createdBy: "admin-001",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-01"),
  },
];

// Helper functions
export const getNotificationById = (id: string): Notification | undefined => {
  return mockNotifications.find((notification) => notification.id === id);
};

export const getNotificationsByRecipient = (
  recipientId: string,
): Notification[] => {
  return mockNotifications.filter(
    (notification) => notification.recipient === recipientId,
  );
};

export const getUnreadNotifications = (recipientId: string): Notification[] => {
  return mockNotifications.filter(
    (notification) =>
      notification.recipient === recipientId && !notification.isRead,
  );
};

export const getNotificationsByType = (
  type: Notification["type"],
): Notification[] => {
  return mockNotifications.filter((notification) => notification.type === type);
};

export const getNotificationsByCategory = (
  category: Notification["category"],
): Notification[] => {
  return mockNotifications.filter(
    (notification) => notification.category === category,
  );
};

export const getNotificationsByPriority = (
  priority: Notification["priority"],
): Notification[] => {
  return mockNotifications.filter(
    (notification) => notification.priority === priority,
  );
};

export const getRecentNotifications = (
  recipientId: string,
  limit: number = 10,
): Notification[] => {
  return mockNotifications
    .filter((notification) => notification.recipient === recipientId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const getSystemAnnouncementById = (
  id: string,
): SystemAnnouncement | undefined => {
  return mockSystemAnnouncements.find((announcement) => announcement.id === id);
};

export const getActiveSystemAnnouncements = (
  userRole?: string,
): SystemAnnouncement[] => {
  const now = new Date();
  return mockSystemAnnouncements.filter((announcement) => {
    const isActive = announcement.isActive;
    const isInDateRange =
      announcement.startDate <= now &&
      (!announcement.endDate || announcement.endDate >= now);
    const isTargetRole =
      !userRole || announcement.targetRoles.includes(userRole);

    return isActive && isInDateRange && isTargetRole;
  });
};

export const markNotificationAsRead = (notificationId: string): boolean => {
  const notification = mockNotifications.find((n) => n.id === notificationId);
  if (notification && !notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    return true;
  }
  return false;
};

export const markAllNotificationsAsRead = (recipientId: string): number => {
  let count = 0;
  mockNotifications.forEach((notification) => {
    if (notification.recipient === recipientId && !notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      count++;
    }
  });
  return count;
};

export const getNotificationStats = (recipientId: string) => {
  const userNotifications = getNotificationsByRecipient(recipientId);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;
  const totalCount = userNotifications.length;

  const byType = {
    info: userNotifications.filter((n) => n.type === "info").length,
    success: userNotifications.filter((n) => n.type === "success").length,
    warning: userNotifications.filter((n) => n.type === "warning").length,
    error: userNotifications.filter((n) => n.type === "error").length,
    announcement: userNotifications.filter((n) => n.type === "announcement")
      .length,
  };

  const byCategory = {
    academic: userNotifications.filter((n) => n.category === "academic").length,
    administrative: userNotifications.filter(
      (n) => n.category === "administrative",
    ).length,
    social: userNotifications.filter((n) => n.category === "social").length,
    system: userNotifications.filter((n) => n.category === "system").length,
  };

  return {
    total: totalCount,
    unread: unreadCount,
    read: totalCount - unreadCount,
    byType,
    byCategory,
  };
};
