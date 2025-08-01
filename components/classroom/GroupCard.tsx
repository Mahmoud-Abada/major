/**
 * GroupCard Component
 * Displays group information in a card format for lists and grids
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Group } from "@/types/classroom";
import { BookOpen, Calendar, MoreHorizontal, Users } from "lucide-react";

interface GroupCardProps {
  group: Group;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  showActions?: boolean;
  className?: string;
}

export function GroupCard({
  group,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  showActions = true,
  className,
}: GroupCardProps) {
  const handleCardClick = () => {
    if (onView) {
      onView(group.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString();
  };

  const isActive = () => {
    if (!group.isSemestral || !group.startDate || !group.endDate) {
      return !group.isArchived;
    }

    const now = Date.now();
    return now >= group.startDate && now <= group.endDate && !group.isArchived;
  };

  const getStatusBadge = () => {
    if (group.isArchived) {
      return <Badge variant="destructive">Archived</Badge>;
    }

    if (group.isSemestral && group.startDate && group.endDate) {
      const now = Date.now();
      if (now < group.startDate) {
        return <Badge variant="secondary">Upcoming</Badge>;
      } else if (now > group.endDate) {
        return <Badge variant="outline">Ended</Badge>;
      } else {
        return <Badge variant="default">Active</Badge>;
      }
    }

    return <Badge variant="default">Active</Badge>;
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      {group.frontPicture && (
        <div className="h-32 overflow-hidden relative">
          <img
            src={group.frontPicture}
            alt={group.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 left-2">{getStatusBadge()}</div>
          {showActions && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onView(group.id))
                      }
                    >
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onEdit(group.id))
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {!group.isArchived && onArchive && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onArchive(group.id))
                      }
                    >
                      Archive
                    </DropdownMenuItem>
                  )}
                  {group.isArchived && onUnarchive && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onUnarchive(group.id))
                      }
                    >
                      Unarchive
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) =>
                          handleActionClick(e, () => onDelete(group.id))
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
              {group.title}
            </h3>
            {group.schoolName && (
              <p className="text-sm text-muted-foreground truncate">
                {group.schoolName}
              </p>
            )}
          </div>
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 ml-2"
            style={{ backgroundColor: group.color }}
            title="Group color"
          />
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          <Badge variant="secondary">{group.field}</Badge>
          <Badge variant="outline">{group.level}</Badge>
          {group.isSemestral && <Badge variant="default">Semestral</Badge>}
          {!group.frontPicture && getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Member Count */}
        {group.memberCount !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Duration for Semestral Groups */}
        {group.isSemestral && group.startDate && group.endDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {formatDate(group.startDate)} - {formatDate(group.endDate)}
            </span>
          </div>
        )}

        {/* Field and Level Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {group.field} • {group.level}
          </span>
        </div>

        {/* Description Preview */}
        {group.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {group.description}
          </p>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive() ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isActive() ? "Active" : "Inactive"}
            </span>
          </div>

          {group.createdAt && (
            <span className="text-xs text-muted-foreground">
              Created {formatDate(group.createdAt)}
            </span>
          )}
        </div>

        {/* Action Buttons (Mobile) */}
        {showActions && (
          <div className="flex gap-2 pt-2 md:hidden">
            {onView && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => handleActionClick(e, () => onView(group.id))}
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleActionClick(e, () => onEdit(group.id))}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton loader for GroupCard
export function GroupCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-muted animate-pulse" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
          <div className="w-4 h-4 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="flex gap-2 mt-2">
          <div className="h-6 bg-muted rounded w-16 animate-pulse" />
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />
          <div className="h-6 bg-muted rounded w-18 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
        </div>
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-muted rounded-full animate-pulse" />
            <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          </div>
          <div className="h-3 bg-muted rounded w-16 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
