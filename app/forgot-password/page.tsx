"use client";

import PasswordResetForm from "@/components/auth/forgot-password";
import { useLanguage, useTheme } from "@/lib/redux/hooks";

export default function PasswordPage() {
    const { theme } = useTheme();
    const { lang } = useLanguage();
  return (
    <div
      className={`flex min-h-screen flex-col lg:flex-row items-center justify-center lg:justify-evenly ${
        theme === "dark" ? "bg-neutral-900" : "bg-neutral-100"
      } ${lang === "ar" ? "font-kufi" : ""}`}
    >
      <PasswordResetForm />
    </div>
  );
}
