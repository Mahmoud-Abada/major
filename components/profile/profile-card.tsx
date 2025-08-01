"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User as UserType } from "@/data/mock/users";
import { motion } from "framer-motion";
import {
    Calendar,
    Edit3,
    Mail,
    MapPin,
    MessageSquare,
    MoreHorizontal,
    Phone,
    User
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ProfileCardProps {
  user: UserType;
  onEdit?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02 },
  transition: { duration: 0.2 }
};

export function ProfileCard({
  user,
  onEdit,
  onMessage,
  onViewProfile,
  showActions = true,
  compact = false,
  className = "",
}: ProfileCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "teacher":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "student":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "parent":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (compact) {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className={className}
      >
        <Card className="cursor-pointer" onClick={onViewProfile}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getRoleColor(user.role)} variant="outline" size="sm">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <StatusBadge status={user.status} size="sm" />
                </div>
              </div>

              {showActions && (
                <div className="flex items-center gap-1">
                  {onMessage && (
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation();
                      onMessage();
                    }}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    // Handle more actions
                  }}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={className}
    >
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10"></div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRoleColor(user.role)} variant="outline">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <StatusBadge status={user.status} />
                  </div>
                </div>

                {showActions && (
                  <div className="flex gap-2">
                    {onMessage && (
                      <Button variant="outline" size="sm" onClick={onMessage}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                    {onEdit && (
                      <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    {onViewProfile && (
                      <Button size="sm" onClick={onViewProfile}>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.phoneNumber}</span>
              </div>
            )}

            {(user as any).address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{(user as any).address}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Role-specific Information */}
          {user.role === "student" && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Student ID:</span>
                  <p className="font-medium">{(user as any).studentId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Grade:</span>
                  <p className="font-medium">{(user as any).grade}</p>
                </div>
              </div>
            </div>
          )}

          {user.role === "teacher" && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Experience:</span>
                  <p className="text-sm font-medium">{(user as any).yearsOfExperience} years</p>
                </div>
                {(user as any).subjects && (user as any).subjects.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(user as any).subjects.slice(0, 3).map((subject: string, index: number) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {subject}
                        </Badge>
                      ))}
                      {(user as any).subjects.length > 3 && (
                        <Badge variant="outline" size="sm">
                          +{(user as any).subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.role === "parent" && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Relationship:</span>
                  <p className="text-sm font-medium capitalize">{(user as any).relationship}</p>
                </div>
                {(user as any).occupation && (
                  <div>
                    <span className="text-sm text-muted-foreground">Occupation:</span>
                    <p className="text-sm font-medium">{(user as any).occupation}</p>
                  </div>
                )}
                {(user as any).children && (
                  <div>
                    <span className="text-sm text-muted-foreground">Children:</span>
                    <p className="text-sm font-medium">{(user as any).children.length} child(ren)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.role === "admin" && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                {(user as any).department && (
                  <div>
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <p className="text-sm font-medium">{(user as any).department}</p>
                  </div>
                )}
                {(user as any).position && (
                  <div>
                    <span className="text-sm text-muted-foreground">Position:</span>
                    <p className="text-sm font-medium">{(user as any).position}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}