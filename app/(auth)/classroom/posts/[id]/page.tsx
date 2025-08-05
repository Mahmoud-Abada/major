"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useComments, useInteractWithComment, useInteractWithPost, usePost } from '@/hooks/usePosts';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    BarChart3,
    BookOpen,
    Calendar,
    Clock,
    Download,
    Edit,
    Eye,
    FileText,
    Heart,
    MessageSquare,
    MoreHorizontal,
    Pin,
    Send,
    Users
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const POST_TYPE_CONFIG = {
    announcement: { icon: MessageSquare, color: 'bg-blue-100 text-blue-800' },
    homework: { icon: BookOpen, color: 'bg-orange-100 text-orange-800' },
    quiz: { icon: BarChart3, color: 'bg-red-100 text-red-800' },
    poll: { icon: Users, color: 'bg-green-100 text-green-800' },
    discussion: { icon: MessageSquare, color: 'bg-purple-100 text-purple-800' },
    material: { icon: FileText, color: 'bg-gray-100 text-gray-800' }
};

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const postId = params.id as string;

    const [newComment, setNewComment] = useState('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    const { data: post, loading: postLoading, error: postError, refetch: refetchPost } = usePost(postId);
    const { data: comments, loading: commentsLoading, refetch: refetchComments } = useComments(postId);
    const interactPostMutation = useInteractWithPost();
    const interactCommentMutation = useInteractWithComment();

    const typeConfig = post ? POST_TYPE_CONFIG[post.type] || POST_TYPE_CONFIG.announcement : POST_TYPE_CONFIG.announcement;
    const TypeIcon = typeConfig.icon;

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleLikePost = async () => {
        if (!post) return;

        try {
            await interactPostMutation.mutate({
                postId: post.id,
                userId: 'current_user', // This should come from auth context
                interaction: 'like'
            });

            setLikedPosts(prev => {
                const newSet = new Set(prev);
                if (newSet.has(post.id)) {
                    newSet.delete(post.id);
                } else {
                    newSet.add(post.id);
                }
                return newSet;
            });

            refetchPost();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to like post',
                variant: 'destructive',
            });
        }
    };

    const handleLikeComment = async (commentId: string) => {
        try {
            await interactCommentMutation.mutate({
                commentId,
                userId: 'current_user', // This should come from auth context
                interaction: 'like'
            });

            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) {
                    newSet.delete(commentId);
                } else {
                    newSet.add(commentId);
                }
                return newSet;
            });

            refetchComments();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to like comment',
                variant: 'destructive',
            });
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !post) return;

        try {
            // This would use a createComment mutation
            const commentData = {
                postId: post.id,
                content: newComment,
                author: 'current_user',
                authorName: 'Current User',
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            // await createCommentMutation.mutate(commentData);
            setNewComment('');
            refetchComments();

            toast({
                title: 'Success',
                description: 'Comment added successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add comment',
                variant: 'destructive',
            });
        }
    };

    if (postLoading) {
        return (
            <div className="container mx-auto py-6 max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded w-1/4" />
                    <Card>
                        <CardHeader>
                            <div className="h-6 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="h-4 bg-muted rounded" />
                                <div className="h-4 bg-muted rounded" />
                                <div className="h-4 bg-muted rounded w-2/3" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (postError || !post) {
        return (
            <div className="container mx-auto py-6 max-w-4xl">
                <Card className="text-center py-12">
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-2">Post not found</h3>
                        <p className="text-muted-foreground mb-4">
                            The post you're looking for doesn't exist or has been removed.
                        </p>
                        <Button onClick={() => router.push('/classroom/posts')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Posts
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Post Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="mb-6">
                    <CardHeader>
                        {/* Post Meta */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-muted">
                                <TypeIcon className="h-5 w-5" />
                            </div>
                            <Badge className={typeConfig.color}>
                                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                            </Badge>
                            {post.isPinned && (
                                <Pin className="h-4 w-4 text-yellow-600" />
                            )}
                            {!post.isPublished && (
                                <Badge variant="outline">Draft</Badge>
                            )}
                        </div>

                        {/* Title */}
                        <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>

                        {/* Author and Date */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                        {post.authorName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{post.authorName || 'Unknown Author'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            {post.dueDate && (
                                <div className="flex items-center gap-1 text-orange-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due: {formatDate(post.dueDate)}</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Content */}
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {/* Attachments */}
                        {post.attachments && post.attachments.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Attachments ({post.attachments.length})
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {post.attachments.map((attachment) => (
                                        <Card key={attachment.id} className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatFileSize(attachment.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Tags:</span>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Post Stats and Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleLikePost}
                                    className={`flex items-center gap-2 text-sm hover:text-red-600 transition-colors ${likedPosts.has(post.id) ? 'text-red-600' : 'text-muted-foreground'
                                        }`}
                                >
                                    <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                                    <span>{post.likesCount || 0} likes</span>
                                </button>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.commentsCount || 0} comments</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewsCount || 0} views</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Comments Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comments ({comments?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Comment */}
                    <div className="space-y-3">
                        <Textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim()}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Post Comment
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Comments List */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {comments?.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {comment.authorName?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">
                                                        {comment.authorName || 'Unknown User'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                </div>

                                                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => handleLikeComment(comment.id)}
                                                        className={`flex items-center gap-1 text-xs hover:text-red-600 transition-colors ${likedComments.has(comment.id) ? 'text-red-600' : 'text-muted-foreground'
                                                            }`}
                                                    >
                                                        <Heart className={`h-3 w-3 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                                                        <span>{comment.likesCount || 0}</span>
                                                    </button>

                                                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {commentsLoading && (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <Card className="p-4">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 bg-muted rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-muted rounded w-1/4" />
                                                    <div className="h-4 bg-muted rounded" />
                                                    <div className="h-4 bg-muted rounded w-3/4" />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!commentsLoading && (!comments || comments.length === 0) && (
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">No comments yet</h3>
                                <p className="text-muted-foreground">Be the first to comment on this post!</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}