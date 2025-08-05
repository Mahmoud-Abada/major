"use client";

import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Heart, Shield } from "lucide-react";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface RoleBadgeProps {
  role: User["role"];
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

export function RoleBadge({ role, size = "default", showIcon = true }: RoleBadgeProps) {
  const getRoleConfig = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          icon: <Shield className="h-3 w-3" />,
          className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
        };
      case "teacher":
        return {
          label: "Teacher",
          icon: <BookOpen className="h-3 w-3" />,
          className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
        };
      case "student":
        return {
          label: "Student",
          icon: <GraduationCap className="h-3 w-3" />,
          className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
        };
      case "parent":
        return {
          label: "Parent",
          icon: <Heart className="h-3 w-3" />,
          className: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
        };
      default:
        return {
          label: "Unknown",
          icon: null,
          className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
        };
    }
  };

  const config = getRoleConfig(role);
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-sm px-3 py-1" : "text-xs px-2 py-1";

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${sizeClass} flex items-center gap-1 font-medium`}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}