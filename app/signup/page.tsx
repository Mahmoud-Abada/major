"use client";

import Info from "@/components/auth/Info";
import { useLanguage, useTheme } from "@/lib/redux/hooks";
import SignupForm from "../../components/auth/SignupForm";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

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
      <ToastProvider>
        <SignupForm />
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}
