/**
 * Loading Overlay Component
 * Full-screen loading overlay with spinner and optional message
 */
"use client";

import LoadingSpinner from "./LoadingSpinner";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  backdrop?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function LoadingOverlay({
  isVisible,
  message,
  backdrop = true,
  size = "lg",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {backdrop && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      )}

      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size={size} color="primary" />

          {message && (
            <div className="text-center">
              <p className="text-gray-700 font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
