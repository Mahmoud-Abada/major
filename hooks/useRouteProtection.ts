/**
 * Route Protection Hook
 * Custom hook for protecting routes and handling authentication redirects
 */

"use client";

import { useAppSelector } from "@/store/hooks";
import { selectAuthLoading, selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface UseRouteProtectionOptions {
    redirectTo?: string;
    requireAuth?: boolean;
    allowedRoles?: string[];
}

export function useRouteProtection(options: UseRouteProtectionOptions = {}) {
    const {
        redirectTo = "/signin",
        requireAuth = true,
        allowedRoles = [],
    } = options;

    const user = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectAuthLoading);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // Check authentication requirement
        if (requireAuth && !isAuthenticated) {
            const currentPath = window.location.pathname;
            const loginUrl = new URL(redirectTo, window.location.origin);
            loginUrl.searchParams.set("callbackUrl", currentPath);
            router.push(loginUrl.toString());
            return;
        }

        // Check role-based access
        if (
            requireAuth &&
            isAuthenticated &&
            user &&
            allowedRoles.length > 0 &&
            !allowedRoles.includes(user.userType)
        ) {
            const unauthorizedUrl = new URL("/unauthorized", window.location.origin);
            unauthorizedUrl.searchParams.set("reason", "insufficient-permissions");
            router.push(unauthorizedUrl.toString());
            return;
        }

        // Handle callback URL after successful authentication
        const callbackUrl = searchParams?.get("callbackUrl");
        if (isAuthenticated && callbackUrl && callbackUrl !== window.location.pathname) {
            router.push(callbackUrl);
        }
    }, [
        isAuthenticated,
        isLoading,
        user,
        requireAuth,
        allowedRoles,
        router,
        redirectTo,
        searchParams,
    ]);

    return {
        isAuthenticated,
        isLoading,
        user,
        canAccess: requireAuth
            ? isAuthenticated &&
            (allowedRoles.length === 0 ||
                (user && allowedRoles.includes(user.userType)))
            : true,
    };
}

// Hook for teacher-only routes
export function useTeacherRoute() {
    return useRouteProtection({
        requireAuth: true,
        allowedRoles: ["teacher"],
    });
}

// Hook for school-only routes
export function useSchoolRoute() {
    return useRouteProtection({
        requireAuth: true,
        allowedRoles: ["school"],
    });
}

// Hook for student-only routes
export function useStudentRoute() {
    return useRouteProtection({
        requireAuth: true,
        allowedRoles: ["student"],
    });
}

// Hook for admin routes (teachers and schools)
export function useAdminRoute() {
    return useRouteProtection({
        requireAuth: true,
        allowedRoles: ["teacher", "school"],
    });
}