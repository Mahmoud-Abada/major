import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface StatusBadgeProps {
  status: string;
  children?: ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();

    if (
      [
        "active",
        "present",
        "paid",
        "completed",
        "approved",
        "submitted",
      ].includes(statusLower)
    ) {
      return "bg-green-100 text-green-800 hover:bg-green-200";
    }

    if (["inactive", "absent", "failed", "rejected"].includes(statusLower)) {
      return "bg-red-100 text-red-800 hover:bg-red-200";
    }

    if (
      ["pending", "in progress", "scheduled", "in review"].includes(statusLower)
    ) {
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }

    if (["late", "overdue", "warning"].includes(statusLower)) {
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    }

    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} border-0 ${className}`}
    >
      {children || status}
    </Badge>
  );
}
