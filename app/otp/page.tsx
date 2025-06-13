"use client";

import OTPVerificationForm from "../../components/auth/otp";
import { useTheme, useLanguage } from "@/lib/redux/hooks";

export default function OtpPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  return (
    <div
      className={`flex min-h-screen flex-col lg:flex-row items-center justify-center lg:justify-evenly 
        ${theme === "dark" ? "bg-neutral-900" : "bg-neutral-50"}  ${lang === "ar" ? "font-kufi" : ""}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <OTPVerificationForm />
    </div>
  );
}
