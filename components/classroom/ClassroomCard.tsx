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
import { motion } from "framer-motion";
import {
  Archive,
  BookOpen,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Link,
  MapPin,
  MoreHorizontal,
  Star,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Type based on your actual Convex document structure
interface ClassroomCardProps {
  classroom: {
    _id: string;
    title: string;
    field: string;
    level: string;
    description?: string;
    teacher?: string | {
      name?: string;
      username?: string;
      profilePicture?: string;
      last?: string;
    };
    owner: string;
    price: number;
    mode: string;
    maxStudents: number;
    isArchived: boolean;
    isGrouped: boolean;
    color: string;
    frontPicture: string;
    backPicture: string;
    location?: {
      commune: string;
      wilaya: string;
      fullLocation: string;
      coordinates: { lat: number; long: number };
    };
    schedule?: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isOnline: boolean;
      link: string;
    }>;
    majors: string[];
    school?: string | null;
    perDuration?: number;
    perSemester?: number | null;
    perSessions?: number | null;
    _creationTime: number;
  };
  onLinkToGroups?: (id: string) => void;
  onAddStudents?: (id: string, title: string) => void;
  showActions?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
  isFavorite?: boolean;
}

export function ClassroomCard({
  classroom,
  onLinkToGroups,
  onAddStudents,
  showActions = true,
  className,
  viewMode = "grid",
  isFavorite = false,
}: ClassroomCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/classroom/classrooms/${classroom._id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleView = () => {
    router.push(`/classroom/classrooms/${classroom._id}`);
  };

  const handleEdit = () => {
    toast.info("Edit functionality not implemented yet");
  };

  const handleDelete = () => {
    toast.info("Delete functionality not implemented yet");
  };

  const handleArchive = () => {
    toast.info("Archive functionality not implemented yet");
  };

  const handleFavorite = () => {
    toast.info("Favorite functionality not implemented yet");
  };

  // Helper function to get teacher display name
  const getTeacherName = () => {
    if (!classroom.teacher) return "Teacher not assigned";

    if (typeof classroom.teacher === "string") {
      return classroom.teacher;
    }

    // Handle teacher object
    if (typeof classroom.teacher === "object") {
      return classroom.teacher.name || classroom.teacher.username || "Teacher not assigned";
    }

    return "Teacher not assigned";
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
                    {classroom.isGrouped && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Grouped
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {getTeacherName()}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">{classroom.field}</Badge>
                      <Badge variant="outline">{classroom.level}</Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">
                        {classroom.location?.commune || "Location not set"}
                      </span>
                    </div>

                    {classroom.maxStudents > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Max: {classroom.maxStudents} students</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{classroom.schedule?.length || 0} sessions/week</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>{classroom.price?.toLocaleString() || 0} DA</span>
                      <span className="text-xs">/{classroom.mode}</span>
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
                    onClick={(e) => handleActionClick(e, handleView)}
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
                      <DropdownMenuItem onClick={(e) => handleActionClick(e, handleEdit)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleActionClick(e, handleFavorite)}>
                        <Star className="h-4 w-4 mr-2" />
                        {isFavorite ? "Remove from favorites" : "Add to favorites"}
                      </DropdownMenuItem>
                      {onLinkToGroups && (
                        <DropdownMenuItem
                          onClick={(e) => handleActionClick(e, () => onLinkToGroups(classroom._id))}
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Link to Groups
                        </DropdownMenuItem>
                      )}
                      {onAddStudents && (
                        <DropdownMenuItem
                          onClick={(e) => handleActionClick(e, () => onAddStudents(classroom._id, classroom.title))}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Students
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleActionClick(e, handleArchive)}>
                        <Archive className="h-4 w-4 mr-2" />
                        {classroom.isArchived ? "Unarchive" : "Archive"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => handleActionClick(e, handleDelete)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
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
            {classroom.isGrouped && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Grouped
              </Badge>
            )}
            {isFavorite && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
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
                  <DropdownMenuItem onClick={(e) => handleActionClick(e, handleView)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleActionClick(e, handleEdit)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleActionClick(e, handleFavorite)}>
                    <Star className="h-4 w-4 mr-2" />
                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  {onLinkToGroups && (
                    <DropdownMenuItem
                      onClick={(e) => handleActionClick(e, () => onLinkToGroups(classroom._id))}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Link to Groups
                    </DropdownMenuItem>
                  )}
                  {onAddStudents && (
                    <DropdownMenuItem
                      onClick={(e) => handleActionClick(e, () => onAddStudents(classroom._id, classroom.title))}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Students
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => handleActionClick(e, handleArchive)}>
                    <Archive className="h-4 w-4 mr-2" />
                    {classroom.isArchived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => handleActionClick(e, handleDelete)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Price indicator */}
          <div className="absolute bottom-2 right-2">
            <div className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-black/20 text-white">
              {classroom.price?.toLocaleString() || 0} DA
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                {classroom.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {getTeacherName()}
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
              {classroom.location?.commune || "Location not set"}
            </span>
          </div>

          {/* Student Capacity */}
          {classroom.maxStudents > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>Max: {classroom.maxStudents} students</span>
            </div>
          )}

          {/* Schedule */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>
              {classroom.schedule?.length || 0} session
              {(classroom.schedule?.length || 0) !== 1 ? "s" : ""}/week
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>{classroom.price?.toLocaleString() || 0} DA</span>
            </div>
            <span className="text-xs text-muted-foreground">
              /{classroom.mode || "monthly"}
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
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => handleActionClick(e, handleView)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleActionClick(e, handleEdit)}
              >
                <Edit className="h-4 w-4" />
              </Button>
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