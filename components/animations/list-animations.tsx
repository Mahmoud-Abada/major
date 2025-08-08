"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Reorder, Variants } from "framer-motion";
import * as React from "react";

export interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  variant?: "fade" | "slide" | "scale" | "flip" | "bounce" | "elastic";
  staggerDelay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  appear?: boolean;
  layout?: boolean;
  reorderable?: boolean;
  onReorder?: (newOrder: any[]) => void;
  items?: any[];
  keyExtractor?: (item: any, index: number) => string;
}

// Animation variants for list items
const listItemVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
  },
  bounce: {
    initial: { opacity: 0, y: -20, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    exit: { opacity: 0, y: 20, scale: 0.8 },
  },
  elastic: {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
};

// Direction-based variants
const getDirectionalVariants = (
  direction: string,
  baseVariant: Variants,
): Variants => {
  if (baseVariant === listItemVariants.slide) {
    const directions = {
      up: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      },
      down: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      },
      left: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
      },
      right: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
      },
    };
    return directions[direction as keyof typeof directions] || baseVariant;
  }
  return baseVariant;
};

export function AnimatedList({
  children,
  className,
  itemClassName,
  variant = "slide",
  staggerDelay = 0.1,
  duration = 0.3,
  direction = "up",
  appear = true,
  layout = false,
  reorderable = false,
  onReorder,
  items,
  keyExtractor,
}: AnimatedListProps) {
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

  const baseItemVariants = listItemVariants[variant];
  const itemVariants = getDirectionalVariants(direction, baseItemVariants);

  if (!mounted) return null;

  // Reorderable list
  if (reorderable && items && onReorder) {
    return (
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={onReorder}
        className={cn("space-y-2", className)}
      >
        {items.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : index;
          return (
            <Reorder.Item
              key={key}
              value={item}
              className={cn(
                "cursor-grab active:cursor-grabbing",
                itemClassName,
              )}
              whileDrag={{ scale: 1.05, zIndex: 10 }}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
            >
              {children[index]}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    );
  }

  // Standard animated list
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            transition={{ duration }}
            layout={layout}
            className={itemClassName}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

// Grid animation component
export interface AnimatedGridProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  variant?: AnimatedListProps["variant"];
  staggerDelay?: number;
  duration?: number;
  columns?: number;
  appear?: boolean;
}

export function AnimatedGrid({
  children,
  className,
  itemClassName,
  variant = "scale",
  staggerDelay = 0.05,
  duration = 0.3,
  columns = 3,
  appear = true,
}: AnimatedGridProps) {
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

  const itemVariants = listItemVariants[variant];

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={cn(
        `grid gap-4`,
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
        className,
      )}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{ duration }}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Masonry-style animated layout
export interface AnimatedMasonryProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  variant?: AnimatedListProps["variant"];
  staggerDelay?: number;
  duration?: number;
  columns?: number;
  gap?: number;
}

export function AnimatedMasonry({
  children,
  className,
  itemClassName,
  variant = "scale",
  staggerDelay = 0.05,
  duration = 0.3,
  columns = 3,
  gap = 16,
}: AnimatedMasonryProps) {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = listItemVariants[variant];

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={cn("columns-1 sm:columns-2 lg:columns-3", className)}
      style={{ columnGap: gap }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{ duration }}
          className={cn("break-inside-avoid mb-4", itemClassName)}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Infinite scroll animated list
export interface InfiniteAnimatedListProps extends AnimatedListProps {
  hasMore: boolean;
  loadMore: () => void;
  loading?: boolean;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export function InfiniteAnimatedList({
  children,
  hasMore,
  loadMore,
  loading = false,
  loader,
  endMessage,
  ...listProps
}: InfiniteAnimatedListProps) {
  const observerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div>
      <AnimatedList {...listProps}>{children}</AnimatedList>

      <div ref={observerRef} className="py-4">
        {loading &&
          (loader || (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ))}

        {!hasMore &&
          !loading &&
          (endMessage || (
            <div className="text-center text-muted-foreground text-sm">
              No more items to load
            </div>
          ))}
      </div>
    </div>
  );
}

// Sortable animated list
export interface SortableAnimatedListProps extends AnimatedListProps {
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortableKeys?: Array<{ key: string; label: string }>;
}

export function SortableAnimatedList({
  children,
  sortKey,
  sortDirection = "asc",
  onSort,
  sortableKeys = [],
  ...listProps
}: SortableAnimatedListProps) {
  const handleSort = (key: string) => {
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort?.(key, newDirection);
  };

  return (
    <div>
      {sortableKeys.length > 0 && (
        <div className="flex gap-2 mb-4">
          {sortableKeys.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={cn(
                "px-3 py-1 text-sm rounded-md border transition-colors",
                sortKey === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              )}
            >
              {label}
              {sortKey === key && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatedList {...listProps}>{children}</AnimatedList>
    </div>
  );
}

// Preset configurations
export const listAnimationPresets = {
  subtle: {
    variant: "fade" as const,
    staggerDelay: 0.05,
    duration: 0.2,
  },
  smooth: {
    variant: "slide" as const,
    staggerDelay: 0.1,
    duration: 0.3,
    direction: "up" as const,
  },
  bouncy: {
    variant: "bounce" as const,
    staggerDelay: 0.1,
    duration: 0.4,
  },
  elastic: {
    variant: "elastic" as const,
    staggerDelay: 0.08,
    duration: 0.5,
  },
  quick: {
    variant: "scale" as const,
    staggerDelay: 0.03,
    duration: 0.15,
  },
};

// Hook for managing list animations
export function useListAnimation(
  initialVariant: AnimatedListProps["variant"] = "slide",
) {
  const [variant, setVariant] = React.useState(initialVariant);
  const [staggerDelay, setStaggerDelay] = React.useState(0.1);
  const [duration, setDuration] = React.useState(0.3);

  const applyPreset = React.useCallback(
    (presetName: keyof typeof listAnimationPresets) => {
      const preset = listAnimationPresets[presetName];
      setVariant(preset.variant);
      setStaggerDelay(preset.staggerDelay);
      setDuration(preset.duration);
    },
    [],
  );

  return {
    variant,
    setVariant,
    staggerDelay,
    setStaggerDelay,
    duration,
    setDuration,
    applyPreset,
  };
}

// Higher-order component for animated lists
export function withListAnimation<P extends { children: React.ReactNode[] }>(
  Component: React.ComponentType<P>,
  animationProps?: Partial<AnimatedListProps>,
) {
  const WrappedComponent = ({ children, ...props }: P) => (
    <AnimatedList {...animationProps}>
      {React.Children.map(children, (child, index) => (
        <Component key={index} {...(props as P)}>
          {[child]}
        </Component>
      ))}
    </AnimatedList>
  );

  WrappedComponent.displayName = `withListAnimation(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
