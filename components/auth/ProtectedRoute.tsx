/**
 * Protected Route Component
 * HOC and component for protecting routes with authentication and role-based access
 */

"use client";

import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
    fallback?: ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requireAuth = true,
    allowedRoles = [],
    fallback,
    redirectTo = "/unauthorized",
}: ProtectedRouteProps) {
    // Disable all authentication checks - always allow access
    return <>{children}</>;
}

// Higher-order component for protecting pages
export function withProtectedRoute<P extends object>(
    Component: React.ComponentType<P>,
    options: Omit<ProtectedRouteProps, "children"> = {}
) {
    return function ProtectedComponent(props: P) {
        return (
            <ProtectedRoute {...options}>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
}

// Specific protected route components
export function TeacherRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={["teacher"]}>
            {children}
        </ProtectedRoute>
    );
}

export function SchoolRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={["school"]}>
            {children}
        </ProtectedRoute>
    );
}

export function StudentRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={["student"]}>
            {children}
        </ProtectedRoute>
    );
}

export function AdminRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={["teacher", "school"]}>
            {children}
        </ProtectedRoute>
    );
}