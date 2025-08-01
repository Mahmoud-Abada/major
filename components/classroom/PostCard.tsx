/**
 * PostCard Component
 * Displays classroom posts (announcements, homework, etc.) in a card format
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import { Post } from "@/types/classroom";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Share,
} from "lucide-react";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onView?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  className,
}: PostCardProps) {
  const handleCardClick = () => {
    if (onView) {
      onView(post.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "homework":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "quiz":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "announcement":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "poll":
        return "bg-green-100 text-green-800 border-green-200";
      case "material":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "homework":
        return "📝";
      case "quiz":
        return "❓";
      case "announcement":
        return "📢";
      case "poll":
        return "📊";
      case "material":
        return "📚";
      default:
        return "📄";
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getDueDateStatus = () => {
    if (!post.dueDate) return null;

    const now = Date.now();
    const timeUntilDue = post.dueDate - now;
    const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

    if (timeUntilDue < 0) {
      return { status: "overdue", color: "text-red-600", icon: AlertCircle };
    } else if (hoursUntilDue < 24) {
      return { status: "due-soon", color: "text-orange-600", icon: Clock };
    } else {
      return { status: "upcoming", color: "text-green-600", icon: CheckCircle };
    }
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200 group",
        onView && "cursor-pointer",
        compact && "p-3",
        className,
      )}
      onClick={onView ? handleCardClick : undefined}
    >
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className={cn("h-10 w-10", compact && "h-8 w-8")}>
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback>
                {post.authorName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={cn("font-medium truncate", compact && "text-sm")}>
                  {post.authorName || "Unknown Author"}
                </p>
                <Badge
                  className={cn("text-xs", getTypeColor(post.type))}
                  variant="outline"
                >
                  <span className="mr-1">{getTypeIcon(post.type)}</span>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
              </div>
              <p
                className={cn(
                  "text-muted-foreground",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {formatTimeAgo(post.createdAt)}
                {!post.isPublished && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Draft
                  </Badge>
                )}
              </p>
            </div>
          </div>

          {showActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
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
                        handleActionClick(e, () => onView(post.id))
                      }
                    >
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onEdit(post.id))
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onShare && (
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleActionClick(e, () => onShare(post.id))
                      }
                    >
                      Share
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) =>
                          handleActionClick(e, () => onDelete(post.id))
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
      </CardHeader>

      <CardContent className={cn("space-y-4", compact && "space-y-2")}>
        <div>
          <h3
            className={cn(
              "font-semibold mb-2",
              compact ? "text-base" : "text-lg",
            )}
          >
            {post.title}
          </h3>
          <p
            className={cn(
              "text-muted-foreground",
              compact ? "text-sm line-clamp-2" : "line-clamp-3",
            )}
          >
            {post.content}
          </p>
        </div>

        {/* Due Date */}
        {post.dueDate && dueDateStatus && (
          <div
            className={cn(
              "flex items-center gap-2 p-2 rounded",
              dueDateStatus.status === "overdue"
                ? "bg-red-50"
                : dueDateStatus.status === "due-soon"
                  ? "bg-orange-50"
                  : "bg-green-50",
            )}
          >
            <dueDateStatus.icon
              className={cn("h-4 w-4", dueDateStatus.color)}
            />
            <span className={cn("text-sm font-medium", dueDateStatus.color)}>
              {dueDateStatus.status === "overdue"
                ? "Overdue: "
                : dueDateStatus.status === "due-soon"
                  ? "Due soon: "
                  : "Due: "}
              {new Date(post.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Paperclip className="h-4 w-4" />
            <span>
              {post.attachments.length} attachment
              {post.attachments.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-2", post.isLiked && "text-red-600")}
              onClick={(e) => handleActionClick(e, () => onLike?.(post.id))}
            >
              <Heart
                className={cn("h-4 w-4 mr-1", post.isLiked && "fill-current")}
              />
              {post.likesCount || 0}
            </Button>

            {post.allowComments && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={(e) =>
                  handleActionClick(e, () => onComment?.(post.id))
                }
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.commentsCount || 0}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={(e) => handleActionClick(e, () => onShare?.(post.id))}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>

          {onView && !compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleActionClick(e, () => onView(post.id))}
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for PostCard
export function PostCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card className={cn("animate-pulse", compact && "p-3")}>
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={cn(
                "rounded-full bg-muted",
                compact ? "h-8 w-8" : "h-10 w-10",
              )}
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-5 bg-muted rounded w-16" />
              </div>
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </div>
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", compact && "space-y-2")}>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="h-8 bg-muted rounded w-12" />
            <div className="h-8 bg-muted rounded w-12" />
            <div className="h-8 bg-muted rounded w-8" />
          </div>
          {!compact && <div className="h-8 bg-muted rounded w-20" />}
        </div>
      </CardContent>
    </Card>
  );
}

// Post list component
interface PostListProps {
  posts: Post[];
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onView?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function PostList({
  posts,
  onLike,
  onComment,
  onShare,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  className,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="text-lg mb-2">No posts yet</div>
        <div className="text-sm">
          Posts will appear here when they are published
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
          compact={compact}
        />
      ))}
    </div>
  );
}
