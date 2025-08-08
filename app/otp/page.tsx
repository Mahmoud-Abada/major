"use client";

import OTPForm from "@/components/forms/OTPForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function OtpPage() {
  return (
    <AuthLayout showInfo={false}>
      <OTPForm />
    </AuthLayout>
  );
}
