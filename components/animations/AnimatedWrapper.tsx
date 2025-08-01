"use client";

import { cn } from "@/lib/theme-utils";
import { ReactNode, useEffect, useState } from "react";

interface AnimatedWrapperProps {
  children: ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale";
  duration?: number;
  delay?: number;
}

export function AnimatedWrapper({
  children,
  className,
  animation = "fadeIn",
  duration = 300,
  delay = 0,
}: AnimatedWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    fadeIn: isVisible
      ? "opacity-100 transition-opacity"
      : "opacity-0 transition-opacity",
    slideUp: isVisible
      ? "translate-y-0 opacity-100 transition-all"
      : "translate-y-4 opacity-0 transition-all",
    slideDown: isVisible
      ? "translate-y-0 opacity-100 transition-all"
      : "-translate-y-4 opacity-0 transition-all",
    slideLeft: isVisible
      ? "translate-x-0 opacity-100 transition-all"
      : "translate-x-4 opacity-0 transition-all",
    slideRight: isVisible
      ? "translate-x-0 opacity-100 transition-all"
      : "-translate-x-4 opacity-0 transition-all",
    scale: isVisible
      ? "scale-100 opacity-100 transition-all"
      : "scale-95 opacity-0 transition-all",
  };

  return (
    <div
      className={cn(animationClasses[animation], className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}

// Staggered animation wrapper for lists
interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale";
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 100,
  animation = "slideUp",
}: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedWrapper
          key={index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {child}
        </AnimatedWrapper>
      ))}
    </div>
  );
}
