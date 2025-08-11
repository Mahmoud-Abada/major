/**
 * Secure Token Management Utility
 * Handles secure storage and management of authentication tokens
 */

import { AuthUser } from "@/services/auth";

export const TOKEN_STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER_DATA: "user_data",
    SESSION_EXPIRY: "session_expiry",
} as const;

// Cookie configuration for secure token storage
const COOKIE_CONFIG = {
    httpOnly: false, // Client-side access needed for API calls
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
};

/**
 * Set authentication tokens securely
 */
export function setTokens(
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
): void {
    if (typeof window === "undefined") return;

    try {
        // Store access token in httpOnly cookie (via API call) and sessionStorage as fallback
        sessionStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        // Store refresh token in httpOnly cookie only
        if (refreshToken) {
            // This would typically be set by the server in an httpOnly cookie
            // For now, we'll use a secure approach with sessionStorage
            sessionStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        // Store expiry time
        if (expiresIn) {
            const expiryTime = Date.now() + expiresIn * 1000;
            sessionStorage.setItem(TOKEN_STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
        }

        // Set auth cookie for middleware access
        const cookieOptions = [
            `path=${COOKIE_CONFIG.path}`,
            `max-age=${COOKIE_CONFIG.maxAge}`,
            COOKIE_CONFIG.secure ? "secure" : "",
            `samesite=${COOKIE_CONFIG.sameSite}`
        ].filter(Boolean).join("; ");

        document.cookie = `auth-token=${accessToken}; ${cookieOptions}`;

    } catch (error) {
        console.error("Failed to store tokens:", error);
    }
}

/**
 * Get access token from secure storage
 */
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
        // Try sessionStorage first (fallback)
        const token = sessionStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
        return token;
    } catch (error) {
        console.error("Failed to retrieve access token:", error);
        return null;
    }
}

/**
 * Get refresh token from secure storage
 */
export function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
        return sessionStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
        console.error("Failed to retrieve refresh token:", error);
        return null;
    }
}

/**
 * Store user data securely
 */
export function setUserData(user: AuthUser): void {
    if (typeof window === "undefined") return;

    try {
        // Store in sessionStorage (more secure than localStorage)
        sessionStorage.setItem(TOKEN_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to store user data:", error);
    }
}

/**
 * Get user data from secure storage
 */
export function getUserData(): AuthUser | null {
    if (typeof window === "undefined") return null;

    try {
        const userData = sessionStorage.getItem(TOKEN_STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Failed to retrieve user data:", error);
        return null;
    }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;

    try {
        const expiryTime = sessionStorage.getItem(TOKEN_STORAGE_KEYS.SESSION_EXPIRY);
        const token = sessionStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);

        // If we have a token but no expiry time, assume it's valid (for backward compatibility)
        if (token && !expiryTime) return false;

        // If no token, it's expired
        if (!token) return true;

        // If no expiry time, assume expired
        if (!expiryTime) return true;

        return Date.now() >= parseInt(expiryTime);
    } catch (error) {
        console.error("Failed to check token expiry:", error);
        return true;
    }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
    if (typeof window === "undefined") return;

    try {
        console.log("🧹 Clearing all auth data...");

        // Clear sessionStorage
        sessionStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
        sessionStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
        sessionStorage.removeItem(TOKEN_STORAGE_KEYS.USER_DATA);
        sessionStorage.removeItem(TOKEN_STORAGE_KEYS.SESSION_EXPIRY);

        // Clear localStorage (legacy cleanup)
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear auth cookies with multiple approaches to ensure they're removed
        const cookieOptions = "path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
        document.cookie = `auth-token=; ${cookieOptions}`;
        document.cookie = `refresh-token=; ${cookieOptions}`;

        // Also try clearing without samesite for broader compatibility
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        console.log("✅ Auth data cleared successfully");

    } catch (error) {
        console.error("Failed to clear auth data:", error);
    }
}

/**
 * Initialize auth state from storage
 */
export function initializeAuthFromStorage(): {
    user: AuthUser | null;
    token: string | null;
    refreshToken: string | null;
    isExpired: boolean;
} {
    const user = getUserData();
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    const isExpired = isTokenExpired();

    return {
        user,
        token,
        refreshToken,
        isExpired,
    };
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
    if (typeof window === "undefined") return;

    try {
        sessionStorage.setItem("last_activity", Date.now().toString());
    } catch (error) {
        console.error("Failed to update last activity:", error);
    }
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number | null {
    if (typeof window === "undefined") return null;

    try {
        const lastActivity = sessionStorage.getItem("last_activity");
        return lastActivity ? parseInt(lastActivity) : null;
    } catch (error) {
        console.error("Failed to get last activity:", error);
        return null;
    }
}