"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  loading?: boolean;
  error?: Error | null;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "default" | "lg";
  animation?: "fade" | "slide" | "scale" | "none";
  rtl?: boolean;
  withErrorBoundary?: boolean;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarWidth?: "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-none",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
};

const sidebarWidthClasses = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
};

const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: {},
  },
};

function PageContainerContent({
  children,
  title,
  description,
  className,
  contentClassName,
  loading = false,
  error = null,
  maxWidth = "2xl",
  padding = "default",
  animation = "fade",
  rtl = false,
  breadcrumbs,
  actions,
  sidebar,
  sidebarPosition = "left",
  sidebarWidth = "md",
}: Omit<PageContainerProps, "withErrorBoundary">) {
  const variants = pageVariants[animation];

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg font-medium">
            Something went wrong
          </div>
          <div className="text-muted-foreground text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={variants.transition}
      className={cn("min-h-screen bg-background", rtl && "dir-rtl", className)}
    >
      <div
        className={cn(
          "mx-auto w-full",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
        )}
      >
        {/* Header Section */}
        {(title || description || breadcrumbs || actions) && (
          <div className={cn("mb-6 space-y-4", rtl && "text-right")}>
            {/* Breadcrumbs */}
            {breadcrumbs && (
              <div className="text-sm text-muted-foreground">{breadcrumbs}</div>
            )}

            {/* Title and Actions */}
            {(title || actions) && (
              <div
                className={cn(
                  "flex items-start justify-between gap-4",
                  rtl && "flex-row-reverse",
                )}
              >
                <div className="min-w-0 flex-1">
                  {title && (
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="mt-2 text-muted-foreground">{description}</p>
                  )}
                </div>

                {actions && <div className="flex-shrink-0">{actions}</div>}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div
          className={cn(
            "flex gap-6",
            rtl && "flex-row-reverse",
            sidebar && "items-start",
          )}
        >
          {/* Sidebar */}
          {sidebar && sidebarPosition === "left" && (
            <aside
              className={cn(
                "flex-shrink-0 hidden lg:block",
                sidebarWidthClasses[sidebarWidth],
              )}
            >
              <div className="sticky top-6">{sidebar}</div>
            </aside>
          )}

          {/* Content */}
          <main className={cn("flex-1 min-w-0", contentClassName)}>
            {children}
          </main>

          {/* Right Sidebar */}
          {sidebar && sidebarPosition === "right" && (
            <aside
              className={cn(
                "flex-shrink-0 hidden lg:block",
                sidebarWidthClasses[sidebarWidth],
              )}
            >
              <div className="sticky top-6">{sidebar}</div>
            </aside>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PageContainer({
  withErrorBoundary = true,
  ...props
}: PageContainerProps) {
  if (withErrorBoundary) {
    return (
      <ErrorBoundary>
        <PageContainerContent {...props} />
      </ErrorBoundary>
    );
  }

  return <PageContainerContent {...props} />;
}

// Specialized page containers for different layouts
export const PageContainers = {
  // Full-width page
  FullWidth: (props: Omit<PageContainerProps, "maxWidth">) => (
    <PageContainer maxWidth="full" {...props} />
  ),

  // Centered content page
  Centered: (props: Omit<PageContainerProps, "maxWidth" | "className">) => (
    <PageContainer
      maxWidth="lg"
      className="flex items-center justify-center min-h-screen"
      {...props}
    />
  ),

  // Dashboard layout
  Dashboard: (props: PageContainerProps) => (
    <PageContainer maxWidth="full" padding="lg" animation="slide" {...props} />
  ),

  // Form page layout
  Form: (props: Omit<PageContainerProps, "maxWidth">) => (
    <PageContainer maxWidth="md" animation="scale" {...props} />
  ),

  // Detail page with sidebar
  DetailWithSidebar: (props: PageContainerProps) => (
    <PageContainer
      maxWidth="full"
      sidebarPosition="right"
      sidebarWidth="sm"
      {...props}
    />
  ),
};

// Hook for managing page state
export function usePageContainer() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  const setPageError = React.useCallback((error: Error) => {
    setError(error);
    setLoading(false);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const withAsyncAction = React.useCallback(
    async (action: () => Promise<void>) => {
      startLoading();
      try {
        await action();
      } catch (err) {
        setPageError(
          err instanceof Error ? err : new Error("An error occurred"),
        );
      } finally {
        stopLoading();
      }
    },
    [startLoading, setPageError, stopLoading],
  );

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setPageError,
    clearError,
    withAsyncAction,
  };
}

// Context for page-level state
interface PageContextType {
  title?: string;
  setTitle: (title: string) => void;
  description?: string;
  setDescription: (description: string) => void;
  breadcrumbs?: React.ReactNode;
  setBreadcrumbs: (breadcrumbs: React.ReactNode) => void;
  actions?: React.ReactNode;
  setActions: (actions: React.ReactNode) => void;
}

const PageContext = React.createContext<PageContextType | null>(null);

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = React.useState<string>();
  const [description, setDescription] = React.useState<string>();
  const [breadcrumbs, setBreadcrumbs] = React.useState<React.ReactNode>();
  const [actions, setActions] = React.useState<React.ReactNode>();

  const value = React.useMemo(
    () => ({
      title,
      setTitle,
      description,
      setDescription,
      breadcrumbs,
      setBreadcrumbs,
      actions,
      setActions,
    }),
    [title, description, breadcrumbs, actions],
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  const context = React.useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
}

// Hook for setting page metadata
export function usePageMeta(meta: {
  title?: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const page = usePage();

  React.useEffect(() => {
    if (meta.title) page.setTitle(meta.title);
  }, [meta.title, page]);

  React.useEffect(() => {
    if (meta.description) page.setDescription(meta.description);
  }, [meta.description, page]);

  React.useEffect(() => {
    if (meta.breadcrumbs) page.setBreadcrumbs(meta.breadcrumbs);
  }, [meta.breadcrumbs, page]);

  React.useEffect(() => {
    if (meta.actions) page.setActions(meta.actions);
  }, [meta.actions, page]);
}
