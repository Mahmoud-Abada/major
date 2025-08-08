"use client";

import LoginForm from "@/components/forms/LoginForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
