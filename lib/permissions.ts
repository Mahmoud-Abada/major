// Import User types from auth service
import { AdminUser, User } from "@/lib/auth";

// ─────────────────────────────
// Permission Types and Interfaces
// ─────────────────────────────

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  level: PermissionLevel;
}

export enum PermissionCategory {
  USER_MANAGEMENT = "user_management",
  CLASSROOM_MANAGEMENT = "classroom_management",
  CONTENT_MANAGEMENT = "content_management",
  ASSESSMENT = "assessment",
  COMMUNICATION = "communication",
  REPORTING = "reporting",
  SYSTEM_ADMINISTRATION = "system_administration",
  FINANCIAL = "financial",
}

export enum PermissionLevel {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ADMIN = "admin",
}

export interface RolePermissions {
  admin: Permission[];
  teacher: Permission[];
  student: Permission[];
  parent: Permission[];
}

export interface PermissionChecker {
  hasPermission(user: User, permissionId: string): boolean;
  hasRole(user: User, role: string): boolean;
  canAccess(user: User, resource: string, action?: string): boolean;
  canAccessRoute(user: User, route: string): boolean;
  getPermissions(user: User): Permission[];
  getRolePermissions(role: string): Permission[];
}

// ─────────────────────────────
// Permission Definitions
// ─────────────────────────────

export const PERMISSIONS: Record<string, Permission> = {
  // User Management
  USER_READ: {
    id: "user_read",
    name: "View Users",
    description: "View user profiles and information",
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.READ,
  },
  USER_CREATE: {
    id: "user_create",
    name: "Create Users",
    description: "Create new user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },
  USER_UPDATE: {
    id: "user_update",
    name: "Update Users",
    description: "Edit user profiles and information",
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },
  USER_DELETE: {
    id: "user_delete",
    name: "Delete Users",
    description: "Delete user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.DELETE,
  },
  USER_MANAGE_ROLES: {
    id: "user_manage_roles",
    name: "Manage User Roles",
    description: "Assign and modify user roles",
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.ADMIN,
  },

  // Classroom Management
  CLASSROOM_READ: {
    id: "classroom_read",
    name: "View Classrooms",
    description: "View classroom information and content",
    category: PermissionCategory.CLASSROOM_MANAGEMENT,
    level: PermissionLevel.READ,
  },
  CLASSROOM_CREATE: {
    id: "classroom_create",
    name: "Create Classrooms",
    description: "Create new classrooms",
    category: PermissionCategory.CLASSROOM_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },
  CLASSROOM_UPDATE: {
    id: "classroom_update",
    name: "Update Classrooms",
    description: "Edit classroom information and settings",
    category: PermissionCategory.CLASSROOM_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },
  CLASSROOM_DELETE: {
    id: "classroom_delete",
    name: "Delete Classrooms",
    description: "Delete classrooms",
    category: PermissionCategory.CLASSROOM_MANAGEMENT,
    level: PermissionLevel.DELETE,
  },
  CLASSROOM_MANAGE_STUDENTS: {
    id: "classroom_manage_students",
    name: "Manage Classroom Students",
    description: "Add and remove students from classrooms",
    category: PermissionCategory.CLASSROOM_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },

  // Content Management
  CONTENT_READ: {
    id: "content_read",
    name: "View Content",
    description: "View posts, assignments, and materials",
    category: PermissionCategory.CONTENT_MANAGEMENT,
    level: PermissionLevel.READ,
  },
  CONTENT_CREATE: {
    id: "content_create",
    name: "Create Content",
    description: "Create posts, assignments, and materials",
    category: PermissionCategory.CONTENT_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },
  CONTENT_UPDATE: {
    id: "content_update",
    name: "Update Content",
    description: "Edit posts, assignments, and materials",
    category: PermissionCategory.CONTENT_MANAGEMENT,
    level: PermissionLevel.WRITE,
  },
  CONTENT_DELETE: {
    id: "content_delete",
    name: "Delete Content",
    description: "Delete posts, assignments, and materials",
    category: PermissionCategory.CONTENT_MANAGEMENT,
    level: PermissionLevel.DELETE,
  },

  // Assessment
  ASSESSMENT_READ: {
    id: "assessment_read",
    name: "View Assessments",
    description: "View grades, marks, and assessments",
    category: PermissionCategory.ASSESSMENT,
    level: PermissionLevel.READ,
  },
  ASSESSMENT_CREATE: {
    id: "assessment_create",
    name: "Create Assessments",
    description: "Create quizzes, exams, and assignments",
    category: PermissionCategory.ASSESSMENT,
    level: PermissionLevel.WRITE,
  },
  ASSESSMENT_GRADE: {
    id: "assessment_grade",
    name: "Grade Assessments",
    description: "Grade student submissions and assign marks",
    category: PermissionCategory.ASSESSMENT,
    level: PermissionLevel.WRITE,
  },
  ASSESSMENT_MANAGE: {
    id: "assessment_manage",
    name: "Manage Assessments",
    description: "Full control over assessment system",
    category: PermissionCategory.ASSESSMENT,
    level: PermissionLevel.ADMIN,
  },

  // Communication
  COMMUNICATION_READ: {
    id: "communication_read",
    name: "View Messages",
    description: "View messages and communications",
    category: PermissionCategory.COMMUNICATION,
    level: PermissionLevel.READ,
  },
  COMMUNICATION_SEND: {
    id: "communication_send",
    name: "Send Messages",
    description: "Send messages and communications",
    category: PermissionCategory.COMMUNICATION,
    level: PermissionLevel.WRITE,
  },
  COMMUNICATION_BROADCAST: {
    id: "communication_broadcast",
    name: "Broadcast Messages",
    description: "Send messages to multiple recipients",
    category: PermissionCategory.COMMUNICATION,
    level: PermissionLevel.WRITE,
  },
  COMMUNICATION_MODERATE: {
    id: "communication_moderate",
    name: "Moderate Communications",
    description: "Moderate and manage all communications",
    category: PermissionCategory.COMMUNICATION,
    level: PermissionLevel.ADMIN,
  },

  // Reporting
  REPORTING_READ: {
    id: "reporting_read",
    name: "View Reports",
    description: "View reports and analytics",
    category: PermissionCategory.REPORTING,
    level: PermissionLevel.READ,
  },
  REPORTING_CREATE: {
    id: "reporting_create",
    name: "Create Reports",
    description: "Generate custom reports",
    category: PermissionCategory.REPORTING,
    level: PermissionLevel.WRITE,
  },
  REPORTING_EXPORT: {
    id: "reporting_export",
    name: "Export Reports",
    description: "Export reports and data",
    category: PermissionCategory.REPORTING,
    level: PermissionLevel.WRITE,
  },

  // System Administration
  SYSTEM_SETTINGS: {
    id: "system_settings",
    name: "System Settings",
    description: "Manage system configuration and settings",
    category: PermissionCategory.SYSTEM_ADMINISTRATION,
    level: PermissionLevel.ADMIN,
  },
  SYSTEM_BACKUP: {
    id: "system_backup",
    name: "System Backup",
    description: "Manage system backups and restoration",
    category: PermissionCategory.SYSTEM_ADMINISTRATION,
    level: PermissionLevel.ADMIN,
  },
  SYSTEM_LOGS: {
    id: "system_logs",
    name: "System Logs",
    description: "View and manage system logs",
    category: PermissionCategory.SYSTEM_ADMINISTRATION,
    level: PermissionLevel.ADMIN,
  },

  // Financial
  FINANCIAL_READ: {
    id: "financial_read",
    name: "View Financial Data",
    description: "View financial information and transactions",
    category: PermissionCategory.FINANCIAL,
    level: PermissionLevel.READ,
  },
  FINANCIAL_MANAGE: {
    id: "financial_manage",
    name: "Manage Finances",
    description: "Manage financial transactions and billing",
    category: PermissionCategory.FINANCIAL,
    level: PermissionLevel.WRITE,
  },
  FINANCIAL_ADMIN: {
    id: "financial_admin",
    name: "Financial Administration",
    description: "Full control over financial system",
    category: PermissionCategory.FINANCIAL,
    level: PermissionLevel.ADMIN,
  },
};

// ─────────────────────────────
// Role-Based Permissions
// ─────────────────────────────

export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    // Full access to everything
    ...Object.values(PERMISSIONS),
  ],
  teacher: [
    // User management (limited)
    PERMISSIONS.USER_READ,

    // Classroom management
    PERMISSIONS.CLASSROOM_READ,
    PERMISSIONS.CLASSROOM_CREATE,
    PERMISSIONS.CLASSROOM_UPDATE,
    PERMISSIONS.CLASSROOM_MANAGE_STUDENTS,

    // Content management
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE,

    // Assessment
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_GRADE,

    // Communication
    PERMISSIONS.COMMUNICATION_READ,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_BROADCAST,

    // Reporting
    PERMISSIONS.REPORTING_READ,
    PERMISSIONS.REPORTING_CREATE,
    PERMISSIONS.REPORTING_EXPORT,
  ],
  student: [
    // Limited user access
    PERMISSIONS.USER_READ,

    // Classroom access
    PERMISSIONS.CLASSROOM_READ,

    // Content access
    PERMISSIONS.CONTENT_READ,

    // Assessment access
    PERMISSIONS.ASSESSMENT_READ,

    // Communication
    PERMISSIONS.COMMUNICATION_READ,
    PERMISSIONS.COMMUNICATION_SEND,

    // Limited reporting
    PERMISSIONS.REPORTING_READ,
  ],
  parent: [
    // Limited user access
    PERMISSIONS.USER_READ,

    // Classroom viewing
    PERMISSIONS.CLASSROOM_READ,

    // Content viewing
    PERMISSIONS.CONTENT_READ,

    // Assessment viewing (for their children)
    PERMISSIONS.ASSESSMENT_READ,

    // Communication
    PERMISSIONS.COMMUNICATION_READ,
    PERMISSIONS.COMMUNICATION_SEND,

    // Reporting (for their children)
    PERMISSIONS.REPORTING_READ,
  ],
};

// ─────────────────────────────
// Route-Based Access Control
// ─────────────────────────────

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Dashboard
  "/": ["user_read"],
  "/dashboard": ["user_read"],

  // User management
  "/users": ["user_read"],
  "/users/create": ["user_create"],
  "/users/[id]": ["user_read"],
  "/users/[id]/edit": ["user_update"],

  // Classroom management
  "/classroom": ["classroom_read"],
  "/classroom/classrooms": ["classroom_read"],
  "/classroom/classrooms/create": ["classroom_create"],
  "/classroom/classrooms/[id]": ["classroom_read"],
  "/classroom/classrooms/[id]/edit": ["classroom_update"],
  "/classroom/classrooms/[id]/students": ["classroom_manage_students"],

  // Groups
  "/classroom/groups": ["classroom_read"],
  "/classroom/groups/create": ["classroom_create"],
  "/classroom/groups/[id]": ["classroom_read"],

  // Posts and content
  "/classroom/posts": ["content_read"],
  "/classroom/posts/create": ["content_create"],
  "/classroom/posts/[id]": ["content_read"],
  "/classroom/posts/[id]/edit": ["content_update"],

  // Assessment
  "/classroom/marks": ["assessment_read"],
  "/classroom/marks/entry": ["assessment_grade"],
  "/classroom/attendance": ["assessment_read"],
  "/classroom/attendance/entry": ["assessment_grade"],

  // Communication
  "/messages": ["communication_read"],
  "/messages/compose": ["communication_send"],
  "/notifications": ["communication_read"],

  // Reports
  "/reports": ["reporting_read"],
  "/reports/create": ["reporting_create"],

  // Admin routes
  "/admin": ["system_settings"],
  "/admin/users": ["user_manage_roles"],
  "/admin/settings": ["system_settings"],
  "/admin/logs": ["system_logs"],

  // Financial
  "/finance": ["financial_read"],
  "/finance/manage": ["financial_manage"],
};

// ─────────────────────────────
// Permission Checker Implementation
// ─────────────────────────────

class PermissionCheckerImpl implements PermissionChecker {
  hasPermission(user: User, permissionId: string): boolean {
    if (!user || user.status !== "active") return false;

    // Get user's role permissions
    const rolePermissions = this.getRolePermissions(user.role);

    // Check if user has the specific permission
    const hasDirectPermission = rolePermissions.some(p => p.id === permissionId);

    // For admin users, check their specific permissions array
    if (user.role === "admin") {
      const adminUser = user as AdminUser;
      const hasAdminPermission = adminUser.permissions?.includes(permissionId) ||
        adminUser.permissions?.includes("*"); // Wildcard permission
      return hasDirectPermission || hasAdminPermission;
    }

    return hasDirectPermission;
  }

  hasRole(user: User, role: string): boolean {
    return user?.role === role && user.status === "active";
  }

  canAccess(user: User, resource: string, action: string = "read"): boolean {
    if (!user || user.status !== "active") return false;

    // Construct permission ID
    const permissionId = `${resource}_${action}`;
    return this.hasPermission(user, permissionId);
  }

  canAccessRoute(user: User, route: string): boolean {
    if (!user || user.status !== "active") return false;

    // Get required permissions for the route
    const requiredPermissions = ROUTE_PERMISSIONS[route];
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No specific permissions required
    }

    // Check if user has at least one of the required permissions
    return requiredPermissions.some(permission =>
      this.hasPermission(user, permission)
    );
  }

  getPermissions(user: User): Permission[] {
    if (!user || user.status !== "active") return [];
    return this.getRolePermissions(user.role);
  }

  getRolePermissions(role: string): Permission[] {
    return ROLE_PERMISSIONS[role as keyof RolePermissions] || [];
  }
}

// ─────────────────────────────
// Permission Utilities
// ─────────────────────────────

export const permissionChecker = new PermissionCheckerImpl();

// Higher-order component for route protection (to be used in .tsx files)
export const createPermissionWrapper = (
  requiredPermissions: string[],
  fallbackMessage: string = "Access Denied"
) => {
  return {
    requiredPermissions,
    fallbackMessage,
    checkAccess: (user: User | null): boolean => {
      return user ? requiredPermissions.some(permission =>
        permissionChecker.hasPermission(user, permission)
      ) : false;
    }
  };
};

// Permission hook
export const usePermissions = (user: User | null) => {
  const hasPermission = (permissionId: string): boolean => {
    return user ? permissionChecker.hasPermission(user, permissionId) : false;
  };

  const hasRole = (role: string): boolean => {
    return user ? permissionChecker.hasRole(user, role) : false;
  };

  const canAccess = (resource: string, action: string = "read"): boolean => {
    return user ? permissionChecker.canAccess(user, resource, action) : false;
  };

  const canAccessRoute = (route: string): boolean => {
    return user ? permissionChecker.canAccessRoute(user, route) : false;
  };

  const getPermissions = (): Permission[] => {
    return user ? permissionChecker.getPermissions(user) : [];
  };

  return {
    hasPermission,
    hasRole,
    canAccess,
    canAccessRoute,
    getPermissions,
    isAdmin: hasRole("admin"),
    isTeacher: hasRole("teacher"),
    isStudent: hasRole("student"),
    isParent: hasRole("parent"),
  };
};

// Permission context helpers
export const createPermissionContext = (user: User | null) => {
  return {
    user,
    permissions: user ? permissionChecker.getPermissions(user) : [],
    hasPermission: (permissionId: string) =>
      user ? permissionChecker.hasPermission(user, permissionId) : false,
    canAccessRoute: (route: string) =>
      user ? permissionChecker.canAccessRoute(user, route) : false,
  };
};

// Export permission checker instance
export default permissionChecker;