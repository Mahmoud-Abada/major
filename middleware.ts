import { importSPKI, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/otp",
  "/unauthorized",
];

// Routes that require authentication (these are the actual URLs, not the folder structure)
const PROTECTED_ROUTES = [
  "/classroom",
  "/inbox",
  "/profile",
  "/users",
];

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  "/api/classroom",
  "/api/users",
  "/api/profile",
];

// Cache for the public key
let publicKeyCache: any = null;

/**
 * Get public key for JWT verification
 */
async function getPublicKey() {
  if (publicKeyCache) {
    return publicKeyCache;
  }

  try {
    // Use the public key from environment or fetch from backend
    const publicKeyPem = process.env.JWT_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtyLif7EAdt9BRZbB3ABoTU83nBQ5
6d5vohEv1c2VFtEVk+Pu59+fecIpi4ZDxa02jpj+qbU8MecSgR7WYy0NCQ==
-----END PUBLIC KEY-----`;

    publicKeyCache = await importSPKI(publicKeyPem, "ES256");
    return publicKeyCache;
  } catch (error) {
    console.error("Failed to load public key:", error);
    return null;
  }
}

/**
 * Verify JWT token
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    const publicKey = await getPublicKey();
    if (!publicKey) {
      console.error("Public key not available");
      return false;
    }

    await jwtVerify(token, publicKey, {
      algorithms: ["ES256"],
    });
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

/**
 * Extract token from request
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Try auth-token cookie
  const tokenCookie = request.cookies.get("auth-token");
  if (tokenCookie?.value && tokenCookie.value.trim() !== "") {
    return tokenCookie.value;
  }

  return null;
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });
}

/**
 * Check if route is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => {
    return pathname.startsWith(route);
  });
}

/**
 * Check if API route is protected
 */
function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_ROUTES.some(route => {
    return pathname.startsWith(route);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromRequest(request);

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${pathname} - Token: ${token ? 'Present' : 'None'}`);
  }

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    if (isProtectedApiRoute(pathname)) {
      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const isValidToken = await verifyToken(token);
      if (!isValidToken) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
    }
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute(pathname)) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && (pathname === "/signin" || pathname === "/signup" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname === "/otp")) {
      const isValidToken = await verifyToken(token);
      if (isValidToken) {
        return NextResponse.redirect(new URL("/classroom/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!token) {
      const loginUrl = new URL("/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isValidToken = await verifyToken(token);
    if (!isValidToken) {
      const loginUrl = new URL("/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "session-expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
