// Browser storage utilities for persistence
export class StorageManager {
  private prefix: string;

  constructor(prefix: string = "major-app") {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  // Local Storage methods
  setLocal<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  getLocal<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue || null;
    }
  }

  removeLocal(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }

  clearLocal(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  // Session Storage methods
  setSession<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  }

  getSession<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
      return defaultValue || null;
    }
  }

  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error("Error removing from sessionStorage:", error);
    }
  }

  clearSession(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }

  // Utility methods
  isStorageAvailable(
    type: "localStorage" | "sessionStorage" = "localStorage",
  ): boolean {
    try {
      const storage = type === "localStorage" ? localStorage : sessionStorage;
      const testKey = "__storage_test__";
      storage.setItem(testKey, "test");
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getStorageSize(
    type: "localStorage" | "sessionStorage" = "localStorage",
  ): number {
    try {
      const storage = type === "localStorage" ? localStorage : sessionStorage;
      let total = 0;

      for (let key in storage) {
        if (storage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
          total += storage[key].length + key.length;
        }
      }

      return total;
    } catch {
      return 0;
    }
  }

  // Data persistence methods for mock data
  persistData<T>(key: string, data: T[], useSession: boolean = false): void {
    const method = useSession ? this.setSession : this.setLocal;
    method.call(this, key, data);
  }

  loadData<T>(key: string, defaultData: T[], useSession: boolean = false): T[] {
    const method = useSession ? this.getSession : this.getLocal;
    const result = method.call(this, key, defaultData);
    return Array.isArray(result) ? result : defaultData;
  }

  // Batch operations
  setBatch(items: Record<string, any>, useSession: boolean = false): void {
    Object.entries(items).forEach(([key, value]) => {
      if (useSession) {
        this.setSession(key, value);
      } else {
        this.setLocal(key, value);
      }
    });
  }

  getBatch(keys: string[], useSession: boolean = false): Record<string, any> {
    const result: Record<string, any> = {};
    keys.forEach((key) => {
      if (useSession) {
        result[key] = this.getSession(key);
      } else {
        result[key] = this.getLocal(key);
      }
    });
    return result;
  }

  // Export/Import functionality
  exportData(): string {
    try {
      const data: Record<string, any> = {};

      // Export localStorage data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.replace(`${this.prefix}:`, "");
          data[cleanKey] = JSON.parse(localStorage.getItem(key) || "null");
        }
      });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Error exporting data:", error);
      return "{}";
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      Object.entries(data).forEach(([key, value]) => {
        this.setLocal(key, value);
      });

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  // Backup and restore
  createBackup(): string {
    const timestamp = new Date().toISOString();
    const data = this.exportData();

    const backup = {
      timestamp,
      version: "1.0.0",
      data: JSON.parse(data),
    };

    return JSON.stringify(backup, null, 2);
  }

  restoreBackup(backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);

      if (!backup.data) {
        throw new Error("Invalid backup format");
      }

      // Clear existing data
      this.clearLocal();

      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        this.setLocal(key, value);
      });

      return true;
    } catch (error) {
      console.error("Error restoring backup:", error);
      return false;
    }
  }
}

// Create default storage manager instance
export const storage = new StorageManager("major-app");

// Specific storage keys used throughout the app
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: "auth_token",
  CURRENT_USER: "current_user",
  REMEMBER_ME: "remember_me",
  SESSION_DATA: "session_data",
  SESSION_EXPIRY: "session_expiry",
  LAST_ACTIVITY: "last_activity",
  FAILED_LOGIN_ATTEMPTS: "failed_login_attempts",
  ACCOUNT_LOCKED_UNTIL: "account_locked_until",
  TWO_FACTOR_ENABLED: "two_factor_enabled",
  EMAIL_VERIFIED: "email_verified",

  // Password and Security
  LAST_PASSWORD_CHANGE: "last_password_change",
  PASSWORD_RESET_TOKEN: "password_reset_token",
  OTP_DATA: "otp_data",
  SECURITY_QUESTIONS: "security_questions",

  // User preferences
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  RTL_MODE: "rtl_mode",

  // Data persistence
  USERS: "users",
  CLASSROOMS: "classrooms",
  GROUPS: "groups",
  POSTS: "posts",
  MARKS: "marks",
  ATTENDANCE: "attendance",
  NOTIFICATIONS: "notifications",

  // UI state
  LAST_VISITED_PAGE: "last_visited_page",
  SEARCH_HISTORY: "search_history",
  FILTER_PREFERENCES: "filter_preferences",
  FORM_DRAFTS: "form_drafts",

  // Settings
  NOTIFICATION_SETTINGS: "notification_settings",
  PRIVACY_SETTINGS: "privacy_settings",
  ACCESSIBILITY_SETTINGS: "accessibility_settings",
  PERFORMANCE_SETTINGS: "performance_settings",
} as const;

// Helper functions for common operations
export const authStorage = {
  // Token management
  setToken: (token: string) => storage.setLocal(STORAGE_KEYS.AUTH_TOKEN, token),
  getToken: () => storage.getLocal<string>(STORAGE_KEYS.AUTH_TOKEN),
  removeToken: () => storage.removeLocal(STORAGE_KEYS.AUTH_TOKEN),

  // User data management
  setUser: (user: any) => storage.setLocal(STORAGE_KEYS.CURRENT_USER, user),
  getUser: () => storage.getLocal<any>(STORAGE_KEYS.CURRENT_USER),
  removeUser: () => storage.removeLocal(STORAGE_KEYS.CURRENT_USER),

  // Session management
  setSessionData: (sessionData: any) => storage.setLocal(STORAGE_KEYS.SESSION_DATA, sessionData),
  getSessionData: () => storage.getLocal<any>(STORAGE_KEYS.SESSION_DATA),
  removeSessionData: () => storage.removeLocal(STORAGE_KEYS.SESSION_DATA),

  setSessionExpiry: (expiry: Date) => storage.setLocal(STORAGE_KEYS.SESSION_EXPIRY, expiry.toISOString()),
  getSessionExpiry: () => {
    const expiry = storage.getLocal<string>(STORAGE_KEYS.SESSION_EXPIRY);
    return expiry ? new Date(expiry) : null;
  },
  removeSessionExpiry: () => storage.removeLocal(STORAGE_KEYS.SESSION_EXPIRY),

  setLastActivity: (activity: Date) => storage.setLocal(STORAGE_KEYS.LAST_ACTIVITY, activity.toISOString()),
  getLastActivity: () => {
    const activity = storage.getLocal<string>(STORAGE_KEYS.LAST_ACTIVITY);
    return activity ? new Date(activity) : null;
  },
  removeLastActivity: () => storage.removeLocal(STORAGE_KEYS.LAST_ACTIVITY),

  // Remember me functionality
  setRememberMe: (remember: boolean) =>
    storage.setLocal(STORAGE_KEYS.REMEMBER_ME, remember),
  getRememberMe: () =>
    storage.getLocal<boolean>(STORAGE_KEYS.REMEMBER_ME, false),

  // Security features
  setFailedLoginAttempts: (attempts: number) =>
    storage.setLocal(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS, attempts),
  getFailedLoginAttempts: () =>
    storage.getLocal<number>(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS, 0),
  removeFailedLoginAttempts: () => storage.removeLocal(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS),

  setAccountLockedUntil: (lockedUntil: Date) =>
    storage.setLocal(STORAGE_KEYS.ACCOUNT_LOCKED_UNTIL, lockedUntil.toISOString()),
  getAccountLockedUntil: () => {
    const locked = storage.getLocal<string>(STORAGE_KEYS.ACCOUNT_LOCKED_UNTIL);
    return locked ? new Date(locked) : null;
  },
  removeAccountLockedUntil: () => storage.removeLocal(STORAGE_KEYS.ACCOUNT_LOCKED_UNTIL),

  setTwoFactorEnabled: (enabled: boolean) =>
    storage.setLocal(STORAGE_KEYS.TWO_FACTOR_ENABLED, enabled),
  getTwoFactorEnabled: () =>
    storage.getLocal<boolean>(STORAGE_KEYS.TWO_FACTOR_ENABLED, false),

  setEmailVerified: (verified: boolean) =>
    storage.setLocal(STORAGE_KEYS.EMAIL_VERIFIED, verified),
  getEmailVerified: () =>
    storage.getLocal<boolean>(STORAGE_KEYS.EMAIL_VERIFIED, false),

  // Password and security
  setLastPasswordChange: (date: Date) =>
    storage.setLocal(STORAGE_KEYS.LAST_PASSWORD_CHANGE, date.toISOString()),
  getLastPasswordChange: () => {
    const date = storage.getLocal<string>(STORAGE_KEYS.LAST_PASSWORD_CHANGE);
    return date ? new Date(date) : null;
  },

  setPasswordResetToken: (token: string) =>
    storage.setLocal(STORAGE_KEYS.PASSWORD_RESET_TOKEN, token),
  getPasswordResetToken: () =>
    storage.getLocal<string>(STORAGE_KEYS.PASSWORD_RESET_TOKEN),
  removePasswordResetToken: () => storage.removeLocal(STORAGE_KEYS.PASSWORD_RESET_TOKEN),

  setOtpData: (otpData: any) =>
    storage.setLocal(STORAGE_KEYS.OTP_DATA, otpData),
  getOtpData: () =>
    storage.getLocal<any>(STORAGE_KEYS.OTP_DATA),
  removeOtpData: () => storage.removeLocal(STORAGE_KEYS.OTP_DATA),

  // Complete auth cleanup
  clearAuth: () => {
    storage.removeLocal(STORAGE_KEYS.AUTH_TOKEN);
    storage.removeLocal(STORAGE_KEYS.CURRENT_USER);
    storage.removeLocal(STORAGE_KEYS.REMEMBER_ME);
    storage.removeLocal(STORAGE_KEYS.SESSION_DATA);
    storage.removeLocal(STORAGE_KEYS.SESSION_EXPIRY);
    storage.removeLocal(STORAGE_KEYS.LAST_ACTIVITY);
    storage.removeLocal(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS);
    storage.removeLocal(STORAGE_KEYS.ACCOUNT_LOCKED_UNTIL);
    storage.removeLocal(STORAGE_KEYS.PASSWORD_RESET_TOKEN);
    storage.removeLocal(STORAGE_KEYS.OTP_DATA);
  },

  // Session validation helpers
  isSessionValid: () => {
    const expiry = authStorage.getSessionExpiry();
    if (!expiry) return false;
    return new Date() < expiry;
  },

  isAccountLocked: () => {
    const lockedUntil = authStorage.getAccountLockedUntil();
    if (!lockedUntil) return false;
    return new Date() < lockedUntil;
  },

  // Authentication state helpers
  isAuthenticated: () => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    const sessionValid = authStorage.isSessionValid();
    return !!(token && user && sessionValid);
  },

  requiresTwoFactor: () => {
    const user = authStorage.getUser();
    return user?.twoFactorEnabled === true;
  },

  requiresEmailVerification: () => {
    const user = authStorage.getUser();
    return user?.isEmailVerified === false;
  },
};

export const themeStorage = {
  setTheme: (theme: "light" | "dark" | "system") =>
    storage.setLocal(STORAGE_KEYS.THEME, theme),
  getTheme: () =>
    storage.getLocal<"light" | "dark" | "system">(STORAGE_KEYS.THEME, "system"),

  setLanguage: (language: string) =>
    storage.setLocal(STORAGE_KEYS.LANGUAGE, language),
  getLanguage: () => storage.getLocal<string>(STORAGE_KEYS.LANGUAGE, "en"),
};

export const uiStorage = {
  setSidebarCollapsed: (collapsed: boolean) =>
    storage.setLocal(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed),
  getSidebarCollapsed: () =>
    storage.getLocal<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false),

  setLastVisitedPage: (page: string) =>
    storage.setSession(STORAGE_KEYS.LAST_VISITED_PAGE, page),
  getLastVisitedPage: () =>
    storage.getSession<string>(STORAGE_KEYS.LAST_VISITED_PAGE),

  addSearchHistory: (query: string) => {
    const history = storage.getLocal<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []) || [];
    const updatedHistory = [query, ...history.filter((h) => h !== query)].slice(
      0,
      10,
    );
    storage.setLocal(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
  },

  getSearchHistory: () =>
    storage.getLocal<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []),
  clearSearchHistory: () => storage.removeLocal(STORAGE_KEYS.SEARCH_HISTORY),
};
