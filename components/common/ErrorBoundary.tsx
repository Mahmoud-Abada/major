"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiArrowLeftLine,
  RiBugLine,
  RiErrorWarningLine,
  RiHomeLine,
  RiInformationLine,
  RiRefreshLine,
} from "@remixicon/react";
import { motion } from "framer-motion";
import * as React from "react";

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
  className?: string;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
  showDetails?: boolean;
  className?: string;
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  errorInfo,
  resetError,
  showDetails = false,
  className,
}: ErrorFallbackProps) {
  const [showFullError, setShowFullError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center justify-center min-h-[400px] p-4",
        className,
      )}
    >
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <RiErrorWarningLine className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We encountered an unexpected error. Please try refreshing the page
            or contact support if the problem persists.
          </p>

          {showDetails && (
            <Alert variant="destructive">
              <RiBugLine className="h-4 w-4" />
              <AlertDescription className="font-mono text-xs">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {showDetails && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullError(!showFullError)}
                className="w-full gap-2"
              >
                <RiInformationLine className="h-4 w-4" />
                {showFullError ? "Hide" : "Show"} Error Details
              </Button>

              {showFullError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-md bg-muted p-3 text-xs font-mono overflow-auto max-h-40"
                >
                  <div className="mb-2 font-semibold">Error:</div>
                  <div className="mb-4 text-destructive">{error.message}</div>

                  <div className="mb-2 font-semibold">Stack Trace:</div>
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {error.stack}
                  </div>

                  {errorInfo.componentStack && (
                    <>
                      <div className="mb-2 mt-4 font-semibold">
                        Component Stack:
                      </div>
                      <div className="whitespace-pre-wrap text-muted-foreground">
                        {errorInfo.componentStack}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1 gap-2">
              <RiRefreshLine className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="gap-2"
            >
              <RiHomeLine className="h-4 w-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Error boundary class component
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          showDetails={this.props.showErrorDetails}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  // Throw error to be caught by error boundary
  if (error) {
    throw error;
  }

  return { handleError, resetError };
}

// Async error boundary for handling promise rejections
export function AsyncErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      // You could also trigger the error boundary here if needed
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
}

// Specialized error fallbacks for different contexts
export const ErrorFallbacks = {
  // Minimal error fallback for small components
  Minimal: ({ error, resetError }: ErrorFallbackProps) => (
    <Alert variant="destructive" className="m-4">
      <RiErrorWarningLine className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Error: {error.message}</span>
        <Button variant="outline" size="sm" onClick={resetError}>
          <RiRefreshLine className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  ),

  // Page-level error fallback
  Page: ({ error, resetError }: ErrorFallbackProps) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <RiErrorWarningLine className="h-10 w-10 text-destructive" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Page Error</h1>
          <p className="text-muted-foreground">
            This page encountered an error and couldn't be displayed properly.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={resetError} className="gap-2">
            <RiRefreshLine className="h-4 w-4" />
            Reload Page
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <RiArrowLeftLine className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  ),

  // Inline error fallback for components within a page
  Inline: ({ error, resetError, className }: ErrorFallbackProps) => (
    <div
      className={cn(
        "rounded-lg border border-destructive/20 bg-destructive/5 p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <RiErrorWarningLine className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-destructive mb-1">Component Error</h3>
          <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="gap-2"
          >
            <RiRefreshLine className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  ),
};

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Error boundary provider for global error handling
interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
}

export function ErrorBoundaryProvider({
  children,
  onError,
  showErrorDetails = process.env.NODE_ENV === "development",
}: ErrorBoundaryProviderProps) {
  return (
    <ErrorBoundary
      onError={onError}
      showErrorDetails={showErrorDetails}
      fallback={ErrorFallbacks.Page}
    >
      {children}
    </ErrorBoundary>
  );
}
