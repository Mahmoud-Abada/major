/**
 * Enhanced ClassroomCard Component
 * Displays classroom information in a card format with animations and improved UX
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
import { Progress } from "@/components/ui/progress";
import { Classroom } from "@/types/classroom";
import { motion } from "framer-motion";
import {
  Archive,
  BookOpen,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Star,
  Trash2,
  Users,
} from "lucide-react";

interface ClassroomCardProps {
  classroom: Classroom;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onFavorite?: (id: string) => void;
  showActions?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
  isFavorite?: boolean;
}

export function ClassroomCard({
  classroom,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onFavorite,
  showActions = true,
  className,
  viewMode = "grid",
  isFavorite = false,
}: ClassroomCardProps) {
  const handleCardClick = () => {
    if (onView) {
      onView(classroom.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Calculate occupancy percentage
  const currentStudents = classroom.currentStudents || 0;
  const maxStudents = classroom.maxStudents || 0;
  const occupancyPercentage =
    maxStudents > 0 ? (currentStudents / maxStudents) * 100 : 0;

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getOccupancyBgColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-100";
    if (percentage >= 75) return "bg-yellow-100";
    return "bg-green-100";
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: {
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hover: { scale: 1.05 },
  };

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={className}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6" onClick={handleCardClick}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {classroom.frontPicture ? (
                    <motion.img
                      src={classroom.frontPicture}
                      alt={classroom.title}
                      className="w-full h-full object-cover"
                      variants={imageVariants}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {classroom.title}
                    </h3>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: classroom.color }}
                    />
                    {isFavorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {classroom.isArchived && (
                      <Badge variant="destructive">Archived</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {classroom.teacherName || "Teacher not assigned"}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">{classroom.field}</Badge>
                      <Badge variant="outline">{classroom.level}</Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">
                        {classroom.location.commune},{" "}
                        {classroom.location.wilaya}
                      </span>
                    </div>

                    {maxStudents > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span
                          className={getOccupancyColor(occupancyPercentage)}
                        >
                          {currentStudents}/{maxStudents}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{classroom.schedule.length} sessions/week</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>{classroom.price.toLocaleString()} DA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) =>
                      handleActionClick(e, () => onView?.(classroom.id))
                    }
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={(e) =>
                            handleActionClick(e, () => onEdit(classroom.id))
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onFavorite && (
                        <DropdownMenuItem
                          onClick={(e) =>
                            handleActionClick(e, () => onFavorite(classroom.id))
                          }
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {!classroom.isArchived && onArchive && (
                        <DropdownMenuItem
                          onClick={(e) =>
                            handleActionClick(e, () => onArchive(classroom.id))
                          }
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      {classroom.isArchived && onUnarchive && (
                        <DropdownMenuItem
                          onClick={(e) =>
                            handleActionClick(e, () =>
                              onUnarchive(classroom.id),
                            )
                          }
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Unarchive
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) =>
                              handleActionClick(e, () => onDelete(classroom.id))
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={className}
    >
      <Card
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="h-48 overflow-hidden relative bg-muted">
          {classroom.frontPicture ? (
            <motion.img
              src={classroom.frontPicture}
              alt={classroom.title}
              className="w-full h-full object-cover"
              variants={imageVariants}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {classroom.isArchived && (
              <Badge variant="destructive">Archived</Badge>
            )}
            {isFavorite && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </Badge>
            )}
          </div>

          {/* Actions overlay */}
          {showActions && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onView(classroom.id))
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onEdit(classroom.id))
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onFavorite && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onFavorite(classroom.id))
                      }
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {!classroom.isArchived && onArchive && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onArchive(classroom.id))
                      }
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                  {classroom.isArchived && onUnarchive && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onUnarchive(classroom.id))
                      }
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Unarchive
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) =>
                          handleActionClick(e, () => onDelete(classroom.id))
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Occupancy indicator */}
          {maxStudents > 0 && (
            <div className="absolute bottom-2 right-2">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getOccupancyBgColor(occupancyPercentage)} ${getOccupancyColor(occupancyPercentage)}`}
              >
                {occupancyPercentage.toFixed(0)}% full
              </div>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                {classroom.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {classroom.teacherName || "Teacher not assigned"}
              </p>
            </div>
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 ml-2"
              style={{ backgroundColor: classroom.color }}
              title="Classroom color"
            />
          </div>

          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="secondary">{classroom.field}</Badge>
            <Badge variant="outline">{classroom.level}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {classroom.location.commune}, {classroom.location.wilaya}
            </span>
          </div>

          {/* Student Capacity with Progress */}
          {maxStudents > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Students</span>
                </div>
                <span className={getOccupancyColor(occupancyPercentage)}>
                  {currentStudents}/{maxStudents}
                </span>
              </div>
              <Progress value={occupancyPercentage} className="h-2" />
            </div>
          )}

          {/* Schedule */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>
              {classroom.schedule.length} session
              {classroom.schedule.length !== 1 ? "s" : ""}/week
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>{classroom.price.toLocaleString()} DA</span>
            </div>
            <span className="text-xs text-muted-foreground">
              /{classroom.mode}
            </span>
          </div>

          {/* Description Preview */}
          {classroom.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {classroom.description}
            </p>
          )}

          {/* Action Buttons (Mobile) */}
          {showActions && (
            <div className="flex gap-2 pt-2 md:hidden">
              {onView && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) =>
                    handleActionClick(e, () => onView(classroom.id))
                  }
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) =>
                    handleActionClick(e, () => onEdit(classroom.id))
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton loader for ClassroomCard
export function ClassroomCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted animate-pulse" />
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
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
