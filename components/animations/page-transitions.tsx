"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import * as React from "react";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "fade"
    | "slide"
    | "scale"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "zoom"
    | "flip";
  duration?: number;
  delay?: number;
  rtl?: boolean;
}

// Animation variants for different transition types
const transitionVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  flip: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
  },
};

export function PageTransition({
  children,
  className,
  variant = "fade",
  duration = 0.3,
  delay = 0,
  rtl = false,
}: PageTransitionProps) {
  const variants = transitionVariants[variant];

  // Adjust slide directions for RTL
  const adjustedVariants = React.useMemo(() => {
    if (!rtl || !variant.includes("slide")) return variants;

    if (variant === "slideLeft") {
      return transitionVariants.slideRight;
    }
    if (variant === "slideRight") {
      return transitionVariants.slideLeft;
    }

    return variants;
  }, [variants, variant, rtl]);

  return (
    <motion.div
      variants={adjustedVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Custom easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper with AnimatePresence
export interface AnimatedPageProps extends PageTransitionProps {
  pageKey: string;
  mode?: "wait" | "sync" | "popLayout";
}

export function AnimatedPage({
  children,
  pageKey,
  mode = "wait",
  ...transitionProps
}: AnimatedPageProps) {
  return (
    <AnimatePresence mode={mode}>
      <PageTransition key={pageKey} {...transitionProps}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}

// Staggered page sections
export interface StaggeredSectionProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  variant?: PageTransitionProps["variant"];
  duration?: number;
}

export function StaggeredSections({
  children,
  className,
  staggerDelay = 0.1,
  variant = "slideUp",
  duration = 0.3,
}: StaggeredSectionProps) {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = transitionVariants[variant];

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children.map((child, index) => (
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

// Route transition wrapper
export interface RouteTransitionProps {
  children: React.ReactNode;
  pathname: string;
  variant?: PageTransitionProps["variant"];
  duration?: number;
  className?: string;
}

export function RouteTransition({
  children,
  pathname,
  variant = "slideUp",
  duration = 0.3,
  className,
}: RouteTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition
        key={pathname}
        variant={variant}
        duration={duration}
        className={className}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}

// Conditional animation wrapper
export interface ConditionalAnimationProps {
  children: React.ReactNode;
  animate: boolean;
  variant?: PageTransitionProps["variant"];
  duration?: number;
  className?: string;
}

export function ConditionalAnimation({
  children,
  animate,
  variant = "fade",
  duration = 0.3,
  className,
}: ConditionalAnimationProps) {
  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <PageTransition variant={variant} duration={duration} className={className}>
      {children}
    </PageTransition>
  );
}

// Preset transition configurations
export const transitionPresets = {
  // Quick and subtle
  subtle: {
    variant: "fade" as const,
    duration: 0.2,
  },

  // Standard page transition
  standard: {
    variant: "slideUp" as const,
    duration: 0.3,
  },

  // Smooth and elegant
  smooth: {
    variant: "scale" as const,
    duration: 0.4,
  },

  // Dynamic and energetic
  dynamic: {
    variant: "zoom" as const,
    duration: 0.25,
  },

  // Slide transitions for navigation
  slideNext: {
    variant: "slideLeft" as const,
    duration: 0.3,
  },

  slidePrev: {
    variant: "slideRight" as const,
    duration: 0.3,
  },
};

// Hook for managing page transitions
export function usePageTransition(
  initialVariant: PageTransitionProps["variant"] = "fade",
) {
  const [variant, setVariant] = React.useState(initialVariant);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const startTransition = React.useCallback(
    (newVariant?: PageTransitionProps["variant"]) => {
      if (newVariant) setVariant(newVariant);
      setIsAnimating(true);
    },
    [],
  );

  const endTransition = React.useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    variant,
    setVariant,
    isAnimating,
    startTransition,
    endTransition,
  };
}

// Context for global page transitions
interface PageTransitionContextType {
  variant: PageTransitionProps["variant"];
  setVariant: (variant: PageTransitionProps["variant"]) => void;
  duration: number;
  setDuration: (duration: number) => void;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
}

const PageTransitionContext =
  React.createContext<PageTransitionContextType | null>(null);

export function PageTransitionProvider({
  children,
  defaultVariant = "fade",
  defaultDuration = 0.3,
}: {
  children: React.ReactNode;
  defaultVariant?: PageTransitionProps["variant"];
  defaultDuration?: number;
}) {
  const [variant, setVariant] = React.useState(defaultVariant);
  const [duration, setDuration] = React.useState(defaultDuration);
  const [disabled, setDisabled] = React.useState(false);

  const value = React.useMemo(
    () => ({
      variant,
      setVariant,
      duration,
      setDuration,
      disabled,
      setDisabled,
    }),
    [variant, duration, disabled],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransitionContext() {
  const context = React.useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransitionContext must be used within a PageTransitionProvider",
    );
  }
  return context;
}

// Higher-order component for automatic page transitions
export function withPageTransition<P extends object>(
  Component: React.ComponentType<P>,
  transitionProps?: Partial<PageTransitionProps>,
) {
  const WrappedComponent = (props: P) => (
    <PageTransition {...transitionProps}>
      <Component {...props} />
    </PageTransition>
  );

  WrappedComponent.displayName = `withPageTransition(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Transition group for multiple elements
export interface TransitionGroupProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  variant?: PageTransitionProps["variant"];
  duration?: number;
  appear?: boolean;
}

export function TransitionGroup({
  children,
  className,
  staggerDelay = 0.1,
  variant = "slideUp",
  duration = 0.3,
  appear = true,
}: TransitionGroupProps) {
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

  const itemVariants = transitionVariants[variant];

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children.map((child, index) => (
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
