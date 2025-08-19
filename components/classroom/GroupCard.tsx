/**
 * Enhanced GroupCard Component
 * Displays group information in a card format with animations and improved UX
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
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Type based on your actual Convex document structure
interface GroupCardProps {
  group: {
    _id: string;
    title: string;
    major: string;
    level: string;
    description: string;
    owner: string;
    fee?: number;
    maxStudents: number;
    isArchived: boolean;
    isSemestral: boolean;
    color: string;
    frontPicture: string;
    backPicture: string;
    startDate: number;
    endDate: number;
    _creationTime: number;
  };
  onAddStudents?: (id: string, title: string) => void;
  showActions?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
  isFavorite?: boolean;
}

export function GroupCard({
  group,
  onAddStudents,
  showActions = true,
  className,
  viewMode = "grid",
  isFavorite = false,
}: GroupCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/classroom/groups/${group._id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleView = () => {
    router.push(`/classroom/groups/${group._id}`);
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

  // Format dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getDuration = () => {
    const start = new Date(group.startDate);
    const end = new Date(group.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    return `${diffWeeks} weeks`;
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
                  {group.frontPicture ? (
                    <motion.img
                      src={group.frontPicture}
                      alt={group.title}
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
                      {group.title}
                    </h3>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    {isFavorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {group.isArchived && (
                      <Badge variant="destructive">Archived</Badge>
                    )}
                    {group.isSemestral && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Semestral
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">{group.major}</Badge>
                      <Badge variant="outline">{group.level}</Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Max: {group.maxStudents} students</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(group.startDate)} - {formatDate(group.endDate)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getDuration()}</span>
                    </div>

                    {group.fee && (
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-4 w-4" />
                        <span>{group.fee.toLocaleString()} DA</span>
                      </div>
                    )}
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
                      {onAddStudents && (
                        <DropdownMenuItem
                          onClick={(e) => handleActionClick(e, () => onAddStudents(group._id, group.title))}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Students
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleActionClick(e, handleArchive)}>
                        <Archive className="h-4 w-4 mr-2" />
                        {group.isArchived ? "Unarchive" : "Archive"}
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
          {group.frontPicture ? (
            <motion.img
              src={group.frontPicture}
              alt={group.title}
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
            {group.isArchived && (
              <Badge variant="destructive">Archived</Badge>
            )}
            {group.isSemestral && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Semestral
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
                  {onAddStudents && (
                    <DropdownMenuItem
                      onClick={(e) => handleActionClick(e, () => onAddStudents(group._id, group.title))}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Students
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => handleActionClick(e, handleArchive)}>
                    <Archive className="h-4 w-4 mr-2" />
                    {group.isArchived ? "Unarchive" : "Archive"}
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

          {/* Fee indicator */}
          {group.fee && (
            <div className="absolute bottom-2 right-2">
              <div className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-black/20 text-white">
                {group.fee.toLocaleString()} DA
              </div>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                {group.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {formatDate(group.startDate)} - {formatDate(group.endDate)}
              </p>
            </div>
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 ml-2"
              style={{ backgroundColor: group.color }}
              title="Group color"
            />
          </div>

          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="secondary">{group.major}</Badge>
            <Badge variant="outline">{group.level}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{getDuration()}</span>
          </div>

          {/* Student Capacity */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>Max: {group.maxStudents} students</span>
          </div>

          {/* Fee */}
          {group.fee && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span>{group.fee.toLocaleString()} DA</span>
              </div>
              <span className="text-xs text-muted-foreground">Total fee</span>
            </div>
          )}

          {/* Description Preview */}
          {group.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {group.description}
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

// Skeleton loader for GroupCard
export function GroupCardSkeleton() {
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
      </CardContent>
    </Card>
  );
}