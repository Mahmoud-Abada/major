"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({
  size = "md",
  text,
  className,
  fullScreen = false,
}: LoadingProps) {
  const t = useTranslations("common");

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center p-4";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100",
            sizeClasses[size],
          )}
        />
        {text && (
          <p
            className={cn(
              "text-neutral-600 dark:text-neutral-300 font-medium",
              textSizeClasses[size],
            )}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100",
        sizeClasses[size],
        className,
      )}
    />
  );
}
