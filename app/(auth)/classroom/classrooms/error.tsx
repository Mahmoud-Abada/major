/**
 * Classrooms Error Page
 * Error boundary for the classrooms section
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClassroomsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Classrooms page error:", error);
  }, [error]);

  const getErrorMessage = (error: Error) => {
    if (error.message.includes("fetch")) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    if (
      error.message.includes("401") ||
      error.message.includes("unauthorized")
    ) {
      return "You are not authorized to view this page. Please sign in again.";
    }
    if (error.message.includes("403") || error.message.includes("forbidden")) {
      return "You do not have permission to access classrooms.";
    }
    if (error.message.includes("404")) {
      return "The classrooms page could not be found.";
    }
    if (error.message.includes("500")) {
      return "Server error occurred. Please try again later.";
    }
    return "An unexpected error occurred while loading classrooms.";
  };

  const getErrorTitle = (error: Error) => {
    if (
      error.message.includes("401") ||
      error.message.includes("unauthorized")
    ) {
      return "Authentication Required";
    }
    if (error.message.includes("403") || error.message.includes("forbidden")) {
      return "Access Denied";
    }
    if (error.message.includes("404")) {
      return "Page Not Found";
    }
    if (error.message.includes("500")) {
      return "Server Error";
    }
    return "Something went wrong";
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">{getErrorTitle(error)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {getErrorMessage(error)}
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-xs font-mono break-all">{error.message}</p>
                {error.digest && (
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={reset} className="flex-1" variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = "/classroom")}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please{" "}
              <a
                href="mailto:support@major.edu"
                className="text-primary hover:underline"
              >
                contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
