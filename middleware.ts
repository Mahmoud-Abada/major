import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/otp",
  "/unauthorized",
  "/",
];

// Define auth routes that should redirect to dashboard if user is already authenticated
const authRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/otp",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Get the token from cookies
  const token =
    request.cookies.get("auth-token")?.value ||
    request.cookies.get("token")?.value;

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/(auth)/classroom", request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to unauthorized
  if (!token && !isPublicRoute && pathname.startsWith("/(auth)")) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
