/**
 * Protected Route Component
 * HOC and component for protecting routes with authentication and role-based access
 */

"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

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
    const { user, isAuthenticated, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (requireAuth && !isAuthenticated) {
            const currentPath = window.location.pathname;
            const unauthorizedUrl = new URL("/unauthorized", window.location.origin);
            unauthorizedUrl.searchParams.set("callbackUrl", currentPath);
            router.push(unauthorizedUrl.toString());
            return;
        }

        if (
            requireAuth &&
            isAuthenticated &&
            user &&
            allowedRoles.length > 0 &&
            !allowedRoles.includes(user.userType)
        ) {
            router.push(redirectTo);
            return;
        }
    }, [
        isAuthenticated,
        isLoading,
        user,
        requireAuth,
        allowedRoles,
        router,
        redirectTo,
    ]);

    // Show loading state
    if (isLoading) {
        return (
            fallback || (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading...</span>
                    </div>
                </div>
            )
        );
    }

    // Check authentication
    if (requireAuth && !isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    // Check role-based access
    if (
        requireAuth &&
        isAuthenticated &&
        user &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.userType)
    ) {
        return null; // Will redirect via useEffect
    }

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