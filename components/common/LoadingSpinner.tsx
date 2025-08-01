"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "bars" | "ring";
  color?: "primary" | "secondary" | "muted" | "white";
  className?: string;
  text?: string;
  textPosition?: "bottom" | "right";
}

const sizeClasses = {
  sm: "w-4 h-4",
  default: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colorClasses = {
  primary: "text-primary border-primary",
  secondary: "text-secondary border-secondary",
  muted: "text-muted-foreground border-muted-foreground",
  white: "text-white border-white",
};

const textSizeClasses = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

// Spinner variant
const SpinnerVariant = ({ size, color, className }: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
  className?: string;
}) => (
  <div
    className={cn(
      "animate-spin rounded-full border-2 border-transparent border-t-current",
      sizeClasses[size],
      colorClasses[color],
      className
    )}
  />
);

// Dots variant
const DotsVariant = ({ size, color, className }: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
  className?: string;
}) => {
  const dotSize = {
    sm: "w-1 h-1",
    default: "w-1.5 h-1.5",
    lg: "w-2 h-2",
    xl: "w-3 h-3",
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full bg-current",
            dotSize[size],
            colorClasses[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Pulse variant
const PulseVariant = ({ size, color, className }: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
  className?: string;
}) => (
  <motion.div
    className={cn(
      "rounded-full bg-current",
      sizeClasses[size],
      colorClasses[color],
      className
    )}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
    }}
  />
);

// Bars variant
const BarsVariant = ({ size, color, className }: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
  className?: string;
}) => {
  const barHeight = {
    sm: "h-3",
    default: "h-4",
    lg: "h-6",
    xl: "h-8",
  };

  const barWidth = {
    sm: "w-0.5",
    default: "w-1",
    lg: "w-1.5",
    xl: "w-2",
  };

  return (
    <div className={cn("flex items-end space-x-0.5", className)}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "bg-current rounded-sm",
            barWidth[size],
            barHeight[size],
            colorClasses[color]
          )}
          animate={{
            scaleY: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Ring variant
const RingVariant = ({ size, color, className }: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
  className?: string;
}) => (
  <div className={cn("relative", sizeClasses[size], className)}>
    <div
      className={cn(
        "absolute inset-0 rounded-full border-2 border-current opacity-20",
        colorClasses[color]
      )}
    />
    <motion.div
      className={cn(
        "absolute inset-0 rounded-full border-2 border-transparent border-t-current",
        colorClasses[color]
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

export function LoadingSpinner({
  size = "default",
  variant = "spinner",
  color = "primary",
  className,
  text,
  textPosition = "bottom",
}: LoadingSpinnerProps) {
  const renderSpinner = () => {
    const props = { size, color, className: undefined };

    switch (variant) {
      case "dots":
        return <DotsVariant {...props} />;
      case "pulse":
        return <PulseVariant {...props} />;
      case "bars":
        return <BarsVariant {...props} />;
      case "ring":
        return <RingVariant {...props} />;
      default:
        return <SpinnerVariant {...props} />;
    }
  };

  if (!text) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {renderSpinner()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        textPosition === "bottom" && "flex-col",
        textPosition === "right" && "flex-row",
        className
      )}
    >
      {renderSpinner()}
      <span
        className={cn(
          "text-current font-medium",
          textSizeClasses[size],
          colorClasses[color]
        )}
      >
        {text}
      </span>
    </div>
  );
}

// Skeleton loading components
export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-muted";
  
  const variantClasses = {
    text: "rounded-sm h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-md",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse", // Could be enhanced with a wave animation
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

// Loading overlay component
export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  spinner?: React.ComponentProps<typeof LoadingSpinner>;
  className?: string;
  overlayClassName?: string;
  blur?: boolean;
}

export function LoadingOverlay({
  loading,
  children,
  spinner,
  className,
  overlayClassName,
  blur = true,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-background/80 z-10",
            blur && "backdrop-blur-sm",
            overlayClassName
          )}
        >
          <LoadingSpinner {...spinner} />
        </motion.div>
      )}
    </div>
  );
}

// Loading states for different components
export const LoadingStates = {
  // Card loading skeleton
  Card: ({ className }: { className?: string }) => (
    <div className={cn("p-6 space-y-4", className)}>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="rectangular" height={100} />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  ),

  // Table loading skeleton
  Table: ({ rows = 5, columns = 4, className }: {
    rows?: number;
    columns?: number;
    className?: string;
  }) => (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              variant="text"
              width={j === 0 ? "25%" : j === columns - 1 ? "15%" : "20%"}
            />
          ))}
        </div>
      ))}
    </div>
  ),

  // List loading skeleton
  List: ({ items = 3, className }: {
    items?: number;
    className?: string;
  }) => (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  ),

  // Grid loading skeleton
  Grid: ({ items = 6, className }: {
    items?: number;
    className?: string;
  }) => (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
      ))}
    </div>
  ),
};