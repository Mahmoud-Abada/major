/**
 * Authentication Service
 * Handles authentication token management and user session
 */
export class AuthService {
  private static instance: AuthService;
  private tokenKey = "auth_token";
  private refreshTokenKey = "refresh_token";
  private userKey = "user_data";

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Token management
  public getToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem(this.tokenKey) ||
      sessionStorage.getItem(this.tokenKey)
    );
  }

  public setToken(token: string, persistent: boolean = true): void {
    if (typeof window === "undefined") return;

    if (persistent) {
      localStorage.setItem(this.tokenKey, token);
      sessionStorage.removeItem(this.tokenKey);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
      localStorage.removeItem(this.tokenKey);
    }
  }

  public removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  // Refresh token management
  public getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  public setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.refreshTokenKey, token);
  }

  public removeRefreshToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.refreshTokenKey);
  }

  // User data management
  public getUser(): any | null {
    if (typeof window === "undefined") return null;
    const userData =
      localStorage.getItem(this.userKey) ||
      sessionStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  public setUser(user: any, persistent: boolean = true): void {
    if (typeof window === "undefined") return;

    const userData = JSON.stringify(user);
    if (persistent) {
      localStorage.setItem(this.userKey, userData);
      sessionStorage.removeItem(this.userKey);
    } else {
      sessionStorage.setItem(this.userKey, userData);
      localStorage.removeItem(this.userKey);
    }
  }

  public removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
  }

  // Authentication state
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  public getUserId(): string | null {
    const user = this.getUser();
    return user?.id || null;
  }

  // Session management
  public clearSession(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  // Token validation
  public isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;

    try {
      const payload = JSON.parse(atob(tokenToCheck.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Auto-refresh token logic
  public async refreshTokenIfNeeded(): Promise<boolean> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!token || !refreshToken) {
      return false;
    }

    if (!this.isTokenExpired(token)) {
      return true; // Token is still valid
    }

    try {
      // This would typically call your auth API to refresh the token
      // For now, we'll just return false to indicate refresh failed
      // You should implement the actual refresh logic based on your auth API
      return false;
    } catch (error) {
      this.clearSession();
      return false;
    }
  }

  // Logout
  public logout(): void {
    this.clearSession();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  }
}
