"use client";

import RegisterForm from "@/components/forms/RegisterForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
