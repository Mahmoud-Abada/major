"use client";

import PasswordResetForm from "@/components/auth/forgot-password";

export default function PasswordPage() {
  return (
    <div className="flex min-h-screen flex-row items-center justify-center lg:justify-evenly">
      <PasswordResetForm />
    </div>
  );
}
