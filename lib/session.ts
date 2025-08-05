import { authStorage } from "@/lib/storage";
import { SessionData } from "@/lib/validations/auth";

// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
}

// ─────────────────────────────
// Session Management Types
// ─────────────────────────────

export interface SessionManager {
  createSession(user: User, rememberMe: boolean): SessionData;
  getSession(): SessionData | null;
  updateSession(updates: Partial<SessionData>): void;
  clearSession(): void;
  isSessionValid(session: SessionData): boolean;
  refreshSession(): Promise<SessionData | null>;
  extendSession(additionalTime?: number): void;
  getSessionInfo(): SessionInfo | null;
}

export interface SessionInfo {
  userId: string;
  email: string;
  role: string;
  issuedAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  rememberMe: boolean;
  timeRemaining: number; // in milliseconds
}

// ─────────────────────────────
// Session Storage Keys
// ─────────────────────────────

const SESSION_KEYS = {
  SESSION_DATA: "session_data",
  SESSION_EXPIRY: "session_expiry",
  LAST_ACTIVITY: "last_activity",
  SESSION_ID: "session_id",
} as const;

// ─────────────────────────────
// Session Configuration
// ─────────────────────────────

const SESSION_CONFIG = {
  DEFAULT_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  ACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
  REFRESH_THRESHOLD: 60 * 60 * 1000, // Refresh if less than 1 hour remaining
  CLEANUP_INTERVAL: 60 * 1000, // Clean up expired sessions every minute
} as const;

// ─────────────────────────────
// Utility Functions
// ─────────────────────────────

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
};

const isExpired = (expiresAt: Date): boolean => {
  return new Date() >= expiresAt;
};

const shouldRefresh = (expiresAt: Date): boolean => {
  const timeRemaining = expiresAt.getTime() - Date.now();
  return timeRemaining < SESSION_CONFIG.REFRESH_THRESHOLD;
};

const isInactive = (lastActivity: Date): boolean => {
  const timeSinceActivity = Date.now() - lastActivity.getTime();
  return timeSinceActivity > SESSION_CONFIG.ACTIVITY_TIMEOUT;
};

// ─────────────────────────────
// Session Manager Implementation
// ─────────────────────────────

class SessionManagerImpl implements SessionManager {
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
    this.setupActivityTracking();
  }

  createSession(user: User, rememberMe: boolean = false): SessionData {
    const now = new Date();
    const duration = rememberMe
      ? SESSION_CONFIG.REMEMBER_ME_DURATION
      : SESSION_CONFIG.DEFAULT_DURATION;

    const session: SessionData = {
      id: generateSessionId(),
      userId: user.id,
      token: authStorage.getToken() || this.generateToken(),
      expiresAt: new Date(now.getTime() + duration),
      rememberMe,
      createdAt: now,
      lastActivity: now,
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
    };

    this.storeSession(session);
    return session;
  }

  getSession(): SessionData | null {
    try {
      const sessionData = authStorage.getSessionData();
      if (!sessionData) return null;

      // Reconstruct dates from stored data
      const session: SessionData = {
        ...sessionData,
        expiresAt: new Date(sessionData.expiresAt),
        createdAt: new Date(sessionData.createdAt),
        lastActivity: new Date(sessionData.lastActivity),
      };

      // Check if session is valid
      if (!this.isSessionValid(session)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error("Error getting session:", error);
      this.clearSession();
      return null;
    }
  }

  updateSession(updates: Partial<SessionData>): void {
    const currentSession = this.getSession();
    if (!currentSession) return;

    const updatedSession: SessionData = {
      ...currentSession,
      ...updates,
      lastActivity: new Date(), // Always update last activity
    };

    this.storeSession(updatedSession);
  }

  clearSession(): void {
    try {
      authStorage.removeSessionData();
      authStorage.removeSessionExpiry();
      authStorage.removeLastActivity();
      authStorage.clearAuth();
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  }

  isSessionValid(session: SessionData): boolean {
    if (!session) return false;

    // Check if session is expired
    if (isExpired(session.expiresAt)) {
      return false;
    }

    // Check for inactivity (only for non-remember-me sessions)
    if (!session.rememberMe && isInactive(session.lastActivity)) {
      return false;
    }

    return true;
  }

  async refreshSession(): Promise<SessionData | null> {
    const currentSession = this.getSession();
    if (!currentSession) return null;

    try {
      // Extend session expiry
      const newExpiryTime = currentSession.rememberMe
        ? SESSION_CONFIG.REMEMBER_ME_DURATION
        : SESSION_CONFIG.DEFAULT_DURATION;

      const refreshedSession: SessionData = {
        ...currentSession,
        expiresAt: new Date(Date.now() + newExpiryTime),
        lastActivity: new Date(),
      };

      this.storeSession(refreshedSession);
      return refreshedSession;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return null;
    }
  }

  extendSession(additionalTime?: number): void {
    const currentSession = this.getSession();
    if (!currentSession) return;

    const extensionTime = additionalTime || SESSION_CONFIG.DEFAULT_DURATION;
    const newExpiryTime = new Date(currentSession.expiresAt.getTime() + extensionTime);

    this.updateSession({
      expiresAt: newExpiryTime,
    });
  }

  getSessionInfo(): SessionInfo | null {
    const session = this.getSession();
    if (!session) return null;

    const user = authStorage.getUser();
    if (!user) return null;

    const timeRemaining = session.expiresAt.getTime() - Date.now();

    return {
      userId: session.userId,
      email: user.email,
      role: user.role,
      issuedAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: session.lastActivity,
      rememberMe: session.rememberMe,
      timeRemaining: Math.max(0, timeRemaining),
    };
  }

  // ─────────────────────────────
  // Private Methods
  // ─────────────────────────────

  private storeSession(session: SessionData): void {
    try {
      authStorage.setSessionData(session);
      authStorage.setSessionExpiry(session.expiresAt);
      authStorage.setLastActivity(session.lastActivity);
    } catch (error) {
      console.error("Error storing session:", error);
    }
  }

  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private getClientIP(): string {
    // Mock IP address - in real app, this would be obtained from request headers
    return "127.0.0.1";
  }

  private getUserAgent(): string {
    if (typeof window !== "undefined") {
      return window.navigator.userAgent;
    }
    return "Unknown";
  }

  private startCleanupInterval(): void {
    if (typeof window === "undefined") return;

    this.cleanupInterval = setInterval(() => {
      const session = this.getSession();
      if (session && !this.isSessionValid(session)) {
        this.clearSession();
      }
    }, SESSION_CONFIG.CLEANUP_INTERVAL);
  }

  private setupActivityTracking(): void {
    if (typeof window === "undefined") return;

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const updateActivity = () => {
      const session = this.getSession();
      if (session) {
        this.updateSession({ lastActivity: new Date() });
      }
    };

    // Throttle activity updates to avoid excessive storage writes
    let lastUpdate = 0;
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate > 60000) { // Update at most once per minute
        lastUpdate = now;
        updateActivity();
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, throttledUpdate, { passive: true });
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateActivity();
      }
    });

    // Handle beforeunload to update last activity
    window.addEventListener('beforeunload', updateActivity);
  }

  // Cleanup on destruction
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// ─────────────────────────────
// Session Hooks and Utilities
// ─────────────────────────────

export const sessionManager = new SessionManagerImpl();

// Session validation hook
export const useSessionValidation = () => {
  const validateSession = (): boolean => {
    const session = sessionManager.getSession();
    return session ? sessionManager.isSessionValid(session) : false;
  };

  const getTimeRemaining = (): number => {
    const sessionInfo = sessionManager.getSessionInfo();
    return sessionInfo ? sessionInfo.timeRemaining : 0;
  };

  const shouldShowWarning = (): boolean => {
    const timeRemaining = getTimeRemaining();
    return timeRemaining > 0 && timeRemaining < 5 * 60 * 1000; // Less than 5 minutes
  };

  return {
    validateSession,
    getTimeRemaining,
    shouldShowWarning,
  };
};

// Session auto-refresh utility
export const setupSessionAutoRefresh = () => {
  if (typeof window === "undefined") return;

  const checkAndRefresh = async () => {
    const session = sessionManager.getSession();
    if (session && shouldRefresh(session.expiresAt)) {
      await sessionManager.refreshSession();
    }
  };

  // Check every 5 minutes
  const interval = setInterval(checkAndRefresh, 5 * 60 * 1000);

  // Initial check
  checkAndRefresh();

  return () => clearInterval(interval);
};

// Session warning notification
export const createSessionWarning = (onExtend: () => void, onLogout: () => void) => {
  const { shouldShowWarning, getTimeRemaining } = useSessionValidation();

  if (!shouldShowWarning()) return null;

  const minutes = Math.ceil(getTimeRemaining() / (60 * 1000));

  return {
    show: true,
    message: `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Would you like to extend it?`,
    onExtend,
    onLogout,
  };
};

// Export session manager instance
export default sessionManager;