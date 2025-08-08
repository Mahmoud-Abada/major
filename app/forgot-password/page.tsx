"use client";

import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout showInfo={false}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
