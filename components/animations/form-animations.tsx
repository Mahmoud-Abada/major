"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";
import * as React from "react";

export interface AnimatedFormProps {
  children: React.ReactNode;
  className?: string;
  variant?: "slide" | "fade" | "scale" | "bounce";
  staggerDelay?: number;
  duration?: number;
  appear?: boolean;
}

export interface AnimatedFieldProps {
  children: React.ReactNode;
  className?: string;
  error?: string | boolean;
  success?: boolean;
  loading?: boolean;
  variant?: "slide" | "fade" | "scale" | "shake";
  duration?: number;
}

export interface FormStepProps {
  children: React.ReactNode;
  isActive: boolean;
  direction?: "forward" | "backward";
  className?: string;
}

// Form animation variants
const formVariants: Record<string, Variants> = {
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  bounce: {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: { opacity: 0, y: -20, scale: 0.9 },
  },
};

// Field animation variants
const fieldVariants: Record<string, Variants> = {
  slide: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    error: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
    success: { scale: [1, 1.02, 1], transition: { duration: 0.3 } },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    error: { opacity: [1, 0.7, 1], transition: { duration: 0.3 } },
    success: { opacity: [1, 0.8, 1], transition: { duration: 0.3 } },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    error: { scale: [1, 0.98, 1.02, 1], transition: { duration: 0.4 } },
    success: { scale: [1, 1.05, 1], transition: { duration: 0.3 } },
  },
  shake: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    success: {
      y: [0, -2, 0],
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  },
};

// Step transition variants
const stepVariants: Record<string, Variants> = {
  forward: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  backward: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
};

// Animated form container
export function AnimatedForm({
  children,
  className,
  variant = "slide",
  staggerDelay = 0.1,
  duration = 0.3,
  appear = true,
}: AnimatedFormProps) {
  const [mounted, setMounted] = React.useState(!appear);

  React.useEffect(() => {
    if (appear) {
      setMounted(true);
    }
  }, [appear]);

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = formVariants[variant];

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{ duration }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Animated form field with error/success states
export function AnimatedField({
  children,
  className,
  error,
  success = false,
  loading = false,
  variant = "slide",
  duration = 0.3,
}: AnimatedFieldProps) {
  const [animationKey, setAnimationKey] = React.useState(0);
  const variants = fieldVariants[variant];

  // Trigger animation when error or success state changes
  React.useEffect(() => {
    if (error || success) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [error, success]);

  const getAnimationState = () => {
    if (error) return "error";
    if (success) return "success";
    return "animate";
  };

  return (
    <motion.div
      key={animationKey}
      variants={variants}
      initial="initial"
      animate={getAnimationState()}
      transition={{ duration }}
      className={cn(
        "relative",
        error && "text-destructive",
        success && "text-green-600",
        className,
      )}
    >
      {children}

      {/* Loading indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && typeof error === "string" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-destructive mt-1"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Multi-step form with transitions
export interface MultiStepFormProps {
  children: React.ReactNode[];
  currentStep: number;
  className?: string;
  stepClassName?: string;
  direction?: "forward" | "backward";
}

export function MultiStepForm({
  children,
  currentStep,
  className,
  stepClassName,
  direction = "forward",
}: MultiStepFormProps) {
  const variants = stepVariants[direction];

  return (
    <div className={className}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={stepClassName}
        >
          {children[currentStep]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Form step indicator with animations
export interface StepIndicatorProps {
  steps: Array<{
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
  currentStep: number;
  completedSteps?: number[];
  className?: string;
  variant?: "dots" | "lines" | "numbers";
  orientation?: "horizontal" | "vertical";
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps = [],
  className,
  variant = "dots",
  orientation = "horizontal",
}: StepIndicatorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex",
        isHorizontal ? "items-center justify-between" : "flex-col space-y-4",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps.includes(index);
        const isPast = index < currentStep;

        return (
          <div
            key={index}
            className={cn(
              "flex items-center",
              !isHorizontal && "w-full",
              isHorizontal && index < steps.length - 1 && "flex-1",
            )}
          >
            {/* Step indicator */}
            <motion.div
              className={cn(
                "relative flex items-center justify-center rounded-full border-2 transition-colors",
                variant === "dots" && "w-3 h-3",
                variant === "numbers" && "w-8 h-8 text-sm font-medium",
                variant === "lines" && "w-6 h-6",
                isActive && "border-primary bg-primary text-primary-foreground",
                isCompleted && "border-green-500 bg-green-500 text-white",
                !isActive && !isCompleted && "border-muted bg-background",
              )}
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isActive
                  ? "var(--primary)"
                  : isCompleted
                    ? "var(--green-500)"
                    : "var(--background)",
              }}
              transition={{ duration: 0.2 }}
            >
              {variant === "numbers" && (
                <span>{isCompleted ? "✓" : index + 1}</span>
              )}
              {variant === "lines" && step.icon && (
                <span className="text-xs">{step.icon}</span>
              )}
            </motion.div>

            {/* Step label */}
            {(variant === "numbers" || variant === "lines") && (
              <div className={cn("ml-3 min-w-0", !isHorizontal && "flex-1")}>
                <div
                  className={cn(
                    "text-sm font-medium",
                    isActive && "text-primary",
                    isCompleted && "text-green-600",
                    !isActive && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            )}

            {/* Connector line */}
            {isHorizontal && index < steps.length - 1 && (
              <motion.div
                className="flex-1 h-0.5 mx-4 bg-muted"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: isPast ? 1 : 0,
                  backgroundColor: isPast ? "var(--primary)" : "var(--muted)",
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{ originX: 0 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Form progress bar
export interface FormProgressProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function FormProgress({
  progress,
  className,
  showPercentage = true,
  animated = true,
}: FormProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <motion.span
            key={progress}
            initial={animated ? { opacity: 0, scale: 0.8 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}

      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

// Floating label animation
export interface FloatingLabelProps {
  children: React.ReactNode;
  label: string;
  focused: boolean;
  hasValue: boolean;
  className?: string;
  labelClassName?: string;
}

export function FloatingLabel({
  children,
  label,
  focused,
  hasValue,
  className,
  labelClassName,
}: FloatingLabelProps) {
  const shouldFloat = focused || hasValue;

  return (
    <div className={cn("relative", className)}>
      {children}
      <motion.label
        className={cn(
          "absolute left-3 text-muted-foreground pointer-events-none transition-colors",
          focused && "text-primary",
          labelClassName,
        )}
        animate={{
          top: shouldFloat ? "0.5rem" : "50%",
          fontSize: shouldFloat ? "0.75rem" : "1rem",
          y: shouldFloat ? 0 : "-50%",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {label}
      </motion.label>
    </div>
  );
}

// Form validation animations
export interface ValidationMessageProps {
  message?: string;
  type?: "error" | "success" | "warning" | "info";
  className?: string;
}

export function ValidationMessage({
  message,
  type = "error",
  className,
}: ValidationMessageProps) {
  const variants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const typeStyles = {
    error: "text-destructive",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className={cn("text-sm mt-1", typeStyles[type], className)}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Preset form animation configurations
export const formAnimationPresets = {
  subtle: {
    variant: "fade" as const,
    staggerDelay: 0.05,
    duration: 0.2,
  },
  smooth: {
    variant: "slide" as const,
    staggerDelay: 0.1,
    duration: 0.3,
  },
  bouncy: {
    variant: "bounce" as const,
    staggerDelay: 0.1,
    duration: 0.4,
  },
  quick: {
    variant: "scale" as const,
    staggerDelay: 0.05,
    duration: 0.15,
  },
};

// Hook for form animations
export function useFormAnimation(
  preset: keyof typeof formAnimationPresets = "smooth",
) {
  const [config, setConfig] = React.useState(formAnimationPresets[preset]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const applyPreset = React.useCallback(
    (presetName: keyof typeof formAnimationPresets) => {
      setConfig(formAnimationPresets[presetName]);
    },
    [],
  );

  const startSubmission = React.useCallback(() => {
    setIsSubmitting(true);
  }, []);

  const endSubmission = React.useCallback(() => {
    setIsSubmitting(false);
  }, []);

  return {
    config,
    applyPreset,
    isSubmitting,
    startSubmission,
    endSubmission,
  };
}
