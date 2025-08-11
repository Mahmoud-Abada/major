"use client";

import { useAppDispatch } from "@/store/hooks";
import { setAuthState } from "@/store/slices/authSlice";
import { initializeAuthFromStorage } from "@/utils/tokenManager";
import { useEffect, useState } from "react";

interface AuthInitializerProps {
    children: React.ReactNode;
}

/**
 * AuthInitializer Component
 * Initializes authentication state from secure storage on app startup
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
    const dispatch = useAppDispatch();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { user, token, refreshToken, isExpired } = initializeAuthFromStorage();

                if (user && token && !isExpired) {
                    // Restore auth state from storage
                    dispatch(setAuthState({
                        user,
                        token,
                        refreshToken,
                    }));

                    console.log("✅ Auth state restored from storage");
                } else if (isExpired) {
                    console.log("⚠️ Auth token expired, clearing storage");
                    // Token expired, storage will be cleared by tokenManager
                } else {
                    console.log("ℹ️ No valid auth data found in storage");
                }
            } catch (error) {
                console.error("❌ Failed to initialize auth state:", error);
            } finally {
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [dispatch]);

    // Show loading spinner while initializing
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}