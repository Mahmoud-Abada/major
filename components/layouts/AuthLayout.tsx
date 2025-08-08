"use client";

import Info from "@/components/auth/Info";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  showInfo?: boolean;
}

export default function AuthLayout({
  children,
  showInfo = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header with language and theme switchers */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="flex min-h-screen flex-col lg:flex-row items-center justify-center lg:justify-evenly px-4 py-8">
        {showInfo && <Info />}

        {/* Mobile Info - Show condensed version on mobile */}
        {showInfo && (
          <div className="w-full max-w-md mb-6 lg:hidden">
            <div className="text-center">
              <Image
                src="/major-logo.svg"
                alt="major app"
                width={80}
                height={76}
                className="mx-auto mb-4"
              />
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50 mb-2">
                MAJOR Academy
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Educational B2B SaaS Platform
              </p>
            </div>
          </div>
        )}

        <div className="flex w-full max-w-md lg:max-w-2xl items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
