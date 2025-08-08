"use client";

import { ReactNode } from "react";

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
  // Disable all authentication checks - allow access to all routes
  return <>{children}</>;
}
