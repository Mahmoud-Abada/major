import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme-aware class utilities
export function themeClass(lightClass: string, darkClass: string): string {
  return `${lightClass} dark:${darkClass}`;
}

// RTL-aware class utilities
export function rtlClass(ltrClass: string, rtlClass: string): string {
  return `${ltrClass} rtl:${rtlClass}`;
}

// Combined theme and RTL class utilities
export function themeRtlClass(
  lightLtr: string,
  lightRtl: string,
  darkLtr: string,
  darkRtl: string,
): string {
  return `${lightLtr} rtl:${lightRtl} dark:${darkLtr} dark:rtl:${darkRtl}`;
}

// Generate responsive classes
export function responsiveClass(
  mobile: string,
  tablet?: string,
  desktop?: string,
): string {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  return classes.join(" ");
}

// Animation classes for theme transitions
export const themeTransition = "transition-colors duration-200 ease-in-out";
export const transformTransition =
  "transition-transform duration-200 ease-in-out";
export const opacityTransition = "transition-opacity duration-200 ease-in-out";

// Common theme-aware component classes
export const componentClasses = {
  card: cn(
    "bg-white dark:bg-gray-900",
    "border border-gray-200 dark:border-gray-700",
    "rounded-lg shadow-sm",
    themeTransition,
  ),

  button: {
    primary: cn(
      "bg-primary text-white",
      "hover:bg-primary/90",
      "focus:ring-2 focus:ring-primary/20",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      themeTransition,
    ),
    secondary: cn(
      "bg-gray-100 dark:bg-gray-800",
      "text-gray-900 dark:text-gray-100",
      "hover:bg-gray-200 dark:hover:bg-gray-700",
      "focus:ring-2 focus:ring-gray-500/20",
      themeTransition,
    ),
    ghost: cn(
      "text-gray-700 dark:text-gray-300",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      "focus:ring-2 focus:ring-gray-500/20",
      themeTransition,
    ),
  },

  input: cn(
    "bg-white dark:bg-gray-900",
    "border border-gray-300 dark:border-gray-600",
    "text-gray-900 dark:text-gray-100",
    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
    "focus:border-primary focus:ring-2 focus:ring-primary/20",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    themeTransition,
  ),

  text: {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-600 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-500",
  },

  background: {
    primary: "bg-white dark:bg-gray-900",
    secondary: "bg-gray-50 dark:bg-gray-800",
    muted: "bg-gray-100 dark:bg-gray-700",
  },
};

// Utility for creating theme-aware gradients
export function createGradient(
  lightFrom: string,
  lightTo: string,
  darkFrom: string,
  darkTo: string,
): string {
  return `bg-gradient-to-r from-${lightFrom} to-${lightTo} dark:from-${darkFrom} dark:to-${darkTo}`;
}

// Utility for creating theme-aware shadows
export function createShadow(lightShadow: string, darkShadow: string): string {
  return `shadow-${lightShadow} dark:shadow-${darkShadow}`;
}
