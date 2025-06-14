"use client";

import { useLanguage, useTheme } from "@/lib/redux/hooks";
import Info from "@/components/auth/Info";
import SigninForm from "../../components/auth/SigninForm";

export default function SignUpPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  return (
    <div
      className={`flex min-h-screen flex-col lg:flex-row items-center justify-center lg:justify-evenly ${
        theme === "dark" ? "bg-neutral-900" : "bg-neutral-100"
      } ${lang === "ar" ? "font-kufi" : ""}`}
    >
      <Info />
      <SigninForm />
    </div>
  );
}
