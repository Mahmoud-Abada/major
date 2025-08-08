"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  GraduationCap,
  Heart,
  Mail,
  Phone,
  Shield,
  Trash2,
} from "lucide-react";
import { RoleBadge } from "./role-badge";
// User types - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AdminUser extends User {
  role: "admin";
}

interface TeacherUser extends User {
  role: "teacher";
}

interface StudentUser extends User {
  role: "student";
}

interface ParentUser extends User {
  role: "parent";
}

interface UserCardProps {
  user: User;
  isSelected?: boolean;
  onSelect?: () => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showStudentInfo?: boolean;
  showTeacherInfo?: boolean;
  showParentInfo?: boolean;
  showAdminInfo?: boolean;
}

export function UserCard({
  user,
  isSelected = false,
  onSelect,
  onView,
  onEdit,
  onDelete,
  showStudentInfo = false,
  showTeacherInfo = false,
  showParentInfo = false,
  showAdminInfo = false,
}: UserCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "teacher":
        return <BookOpen className="h-4 w-4" />;
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      case "parent":
        return <Heart className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderRoleSpecificInfo = () => {
    if (showStudentInfo && user.role === "student") {
      const student = user as StudentUser;
      return (
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Student ID:</span>
            <span className="font-mono text-xs">{student.studentId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Grade:</span>
            <Badge variant="outline" className="text-xs">
              Grade {student.grade}
            </Badge>
          </div>
          {student.parentName && (
            <div className="flex items-center justify-between">
              <span>Parent:</span>
              <span className="text-xs truncate">{student.parentName}</span>
            </div>
          )}
        </div>
      );
    }

    if (showTeacherInfo && user.role === "teacher") {
      const teacher = user as TeacherUser;
      return (
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Experience:</span>
            <span className="text-xs">{teacher.yearsOfExperience} years</span>
          </div>
          <div>
            <span className="text-xs">Subjects:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.subjects.slice(0, 2).map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
              {teacher.subjects.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{teacher.subjects.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (showParentInfo && user.role === "parent") {
      const parent = user as ParentUser;
      return (
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Relationship:</span>
            <Badge variant="outline" className="text-xs capitalize">
              {parent.relationship}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Children:</span>
            <span className="text-xs">{parent.children.length}</span>
          </div>
          {parent.occupation && (
            <div className="flex items-center justify-between">
              <span>Occupation:</span>
              <span className="text-xs truncate">{parent.occupation}</span>
            </div>
          )}
        </div>
      );
    }

    if (showAdminInfo && user.role === "admin") {
      const admin = user as AdminUser;
      return (
        <div className="space-y-2 text-sm text-muted-foreground">
          {admin.position && (
            <div className="flex items-center justify-between">
              <span>Position:</span>
              <span className="text-xs truncate">{admin.position}</span>
            </div>
          )}
          {admin.department && (
            <div className="flex items-center justify-between">
              <span>Department:</span>
              <span className="text-xs truncate">{admin.department}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Permissions:</span>
            <span className="text-xs">{admin.permissions.length}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4">
          {/* Selection Checkbox */}
          {onSelect && (
            <div className="absolute top-3 right-3 z-10">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="bg-background border-2"
              />
            </div>
          )}

          {/* User Avatar and Basic Info */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} size="sm" />
                <Badge
                  className={`${getStatusColor(user.status)} text-xs`}
                  variant="outline"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{user.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Joined {user.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Role-specific Information */}
          {renderRoleSpecificInfo()}

          {/* Last Login */}
          {user.lastLogin && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                Last login: {user.lastLogin.toLocaleDateString()}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-3 border-t">
            {onView && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onView(user.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 text-xs"
                onClick={() => onEdit(user.id)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive text-xs"
                onClick={() => onDelete(user.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
