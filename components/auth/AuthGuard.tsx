"use client";

import { getStoredToken, getStoredUser } from "@/utils/auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const PUBLIC_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/otp",
];

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/signin",
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    const isAuthenticated = !!(token && user);
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      // User needs to be authenticated but isn't
      router.push(redirectTo);
      return;
    }

    if (!requireAuth && isAuthenticated && isPublicRoute) {
      // User is authenticated but trying to access public auth pages
      router.push("/(auth)/classroom");
      return;
    }

    // Check if user needs OTP verification
    if (isAuthenticated && user && !user.isVerified && pathname !== "/otp") {
      router.push("/otp");
      return;
    }
  }, [pathname, router, requireAuth, redirectTo]);

  return <>{children}</>;
}
