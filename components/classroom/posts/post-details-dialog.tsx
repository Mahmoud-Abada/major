"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  RiAttachmentLine,
  RiBarChartLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiChat3Line,
  RiDiscussLine,
  RiDownloadLine,
  RiEyeLine,
  RiFileTextLine,
  RiHeartFill,
  RiHeartLine,
  RiHomeLine,
  RiMoreLine,
  RiPushpinLine,
  RiQuestionLine,
  RiReplyLine,
  RiOpenSourceLine,
  RiSendPlaneLine,
  RiShareLine,
  RiThumbUpLine,
  RiTimeLine,
} from "@remixicon/react";
import { useState } from "react";
import { mockComments } from "./mock-data";
import type { Comment, Post } from "./types";

interface PostDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}

export function PostDetailsDialog({
  open,
  onOpenChange,
  post,
}: PostDetailsDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(
    post?.interactions.userInteraction?.liked || false,
  );
  const [isBookmarked, setIsBookmarked] = useState(
    post?.interactions.userInteraction?.bookmarked || false,
  );
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.postId === post?.id),
  );

  if (!post) return null;

  const getPostTypeIcon = (type: Post["type"]) => {
    switch (type) {
      case "announcement":
        return <RiFileTextLine className="h-4 w-4" />;
      case "homework":
        return <RiHomeLine className="h-4 w-4" />;
      case "quiz":
        return <RiQuestionLine className="h-4 w-4" />;
      case "poll":
        return <RiBarChartLine className="h-4 w-4" />;
      case "discussion":
        return <RiDiscussLine className="h-4 w-4" />;
      case "resource":
        return <RiOpenSourceLine className="h-4 w-4" />;
      default:
        return <RiFileTextLine className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: Post["type"]) => {
    switch (type) {
      case "announcement":
        return "default";
      case "homework":
        return "secondary";
      case "quiz":
        return "destructive";
      case "poll":
        return "outline";
      case "discussion":
        return "secondary";
      case "resource":
        return "default";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: Post["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "secondary";
      case "normal":
        return "outline";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "pending_approval":
        return "outline";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Il y a moins d'1h";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Update post interactions in real app
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Update post interactions in real app
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        content: newComment,
        authorId: "current-user",
        authorName: "Utilisateur Actuel",
        authorRole: "teacher",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        interactions: {
          likes: 0,
          dislikes: 0,
          userInteraction: {
            liked: false,
            disliked: false,
          },
        },
      };
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const wasLiked = comment.interactions.userInteraction?.liked || false;
          return {
            ...comment,
            interactions: {
              ...comment.interactions,
              likes: wasLiked
                ? comment.interactions.likes - 1
                : comment.interactions.likes + 1,
              userInteraction: {
                ...comment.interactions.userInteraction,
                liked: !wasLiked,
              },
            },
          };
        }
        return comment;
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                {getPostTypeIcon(post.type)}
                {post.title}
                {post.priority === "urgent" && (
                  <RiPushpinLine className="h-5 w-5 text-red-500" />
                )}
              </DialogTitle>
              <DialogDescription className="mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={getPostTypeColor(post.type)}
                    className="text-xs"
                  >
                    <div className="flex items-center gap-1">
                      {getPostTypeIcon(post.type)}
                      <span className="capitalize">{post.type}</span>
                    </div>
                  </Badge>

                  <Badge
                    variant={getStatusColor(post.status)}
                    className="text-xs capitalize"
                  >
                    {post.status.replace("_", " ")}
                  </Badge>

                  <Badge
                    variant={getPriorityColor(post.priority)}
                    className="text-xs capitalize"
                  >
                    {post.priority}
                  </Badge>

                  <span className="text-muted-foreground">•</span>
                  <span>{post.className}</span>
                  <span>•</span>
                  <span>{post.subject}</span>
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Author and Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>
                  {post.authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{post.authorName}</p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {post.authorRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RiTimeLine className="h-3 w-3" />
                  <span>Publié {formatTimeAgo(post.createdAt)}</span>
                  {post.isEdited && (
                    <>
                      <span>•</span>
                      <span>Modifié {formatTimeAgo(post.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <RiMoreLine className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Due Date */}
            {post.dueDate && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <RiTimeLine className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Échéance:{" "}
                  {new Date(post.dueDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Tags:</span>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiAttachmentLine className="h-4 w-4" />
                    Pièces jointes ({post.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {post.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded">
                          {attachment.type === "image" && (
                            <RiFileTextLine className="h-4 w-4 text-blue-500" />
                          )}
                          {attachment.type === "document" && (
                            <RiFileTextLine className="h-4 w-4 text-red-500" />
                          )}
                          {attachment.type === "video" && (
                            <RiFileTextLine className="h-4 w-4 text-purple-500" />
                          )}
                          {attachment.type === "audio" && (
                            <RiFileTextLine className="h-4 w-4 text-green-500" />
                          )}
                          {attachment.type === "link" && (
                            <RiFileTextLine className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {attachment.name}
                          </p>
                          {attachment.size && (
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.size)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <RiDownloadLine className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Interactions */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <RiEyeLine className="h-4 w-4" />
                <span>{post.interactions.views} vues</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <RiHeartLine className="h-4 w-4" />
                <span>{post.interactions.likes} j'aime</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <RiChat3Line className="h-4 w-4" />
                <span>{comments.length} commentaires</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <RiShareLine className="h-4 w-4" />
                <span>{post.interactions.shares} partages</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
              >
                {isLiked ? (
                  <RiHeartFill className="h-4 w-4 mr-1" />
                ) : (
                  <RiHeartLine className="h-4 w-4 mr-1" />
                )}
                J'aime
              </Button>

              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={handleBookmark}
              >
                {isBookmarked ? (
                  <RiBookmarkFill className="h-4 w-4 mr-1" />
                ) : (
                  <RiBookmarkLine className="h-4 w-4 mr-1" />
                )}
                Sauvegarder
              </Button>

              <Button variant="outline" size="sm">
                <RiShareLine className="h-4 w-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <RiChat3Line className="h-5 w-5" />
              Commentaires ({comments.length})
            </h3>

            {/* Add Comment */}
            {post.settings.allowComments && (
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                  >
                    <RiSendPlaneLine className="h-4 w-4 mr-2" />
                    Commenter
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.authorAvatar} />
                      <AvatarFallback className="text-xs">
                        {comment.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">
                          {comment.authorName}
                        </p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {comment.authorRole}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                          <span className="text-xs text-muted-foreground">
                            (modifié)
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className={
                            comment.interactions.userInteraction?.liked
                              ? "text-blue-600"
                              : ""
                          }
                        >
                          <RiThumbUpLine className="h-3 w-3 mr-1" />
                          {comment.interactions.likes}
                        </Button>

                        <Button variant="ghost" size="sm">
                          <RiReplyLine className="h-3 w-3 mr-1" />
                          Répondre
                        </Button>

                        <Button variant="ghost" size="sm">
                          <RiMoreLine className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Nested replies would go here */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-3">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg"
                        >
                          {/* Similar structure for replies */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <RiChat3Line className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {post.settings.allowComments
                      ? "Aucun commentaire pour le moment. Soyez le premier à commenter!"
                      : "Les commentaires sont désactivés pour cette publication."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
