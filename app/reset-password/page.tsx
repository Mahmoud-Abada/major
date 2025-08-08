"use client";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Reset Link
          </h1>
          <p className="mt-2 text-gray-600">
            The password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout showInfo={false}>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
