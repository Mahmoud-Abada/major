/**
 * PostStats Component
 * Analytics and statistics for posts
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PostStats as PostStatsType } from '@/types/classroom';
import {
    MessageSquare,
    Heart,
    Eye,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PostStatsProps {
    stats: PostStatsType;
    className?: string;
}

export function PostStats({ stats, className = '' }: PostStatsProps) {
    const engagementTrend = stats.engagementRate > 50 ? 'up' : 'down';
    const TrendIcon = engagementTrend === 'up' ? TrendingUp : TrendingDown;

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const getTopPostTypes = () => {
        return Object.entries(stats.byType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    };

    const getTopAuthors = () => {
        return Object.entries(stats.byAuthor)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                                    <p className="text-2xl font-bold">{formatNumber(stats.totalPosts)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                            {stats.publishedPosts} published
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {stats.draftPosts} drafts
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50">
                                    <MessageSquare className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Engagement</p>
                                    <p className="text-2xl font-bold">{formatNumber(stats.totalLikes + stats.totalComments)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Heart className="h-3 w-3" />
                                            {formatNumber(stats.totalLikes)}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MessageSquare className="h-3 w-3" />
                                            {formatNumber(stats.totalComments)}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-full bg-red-50">
                                    <Heart className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                    <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`flex items-center gap-1 text-xs ${engagementTrend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            <TrendIcon className="h-3 w-3" />
                                            {stats.engagementRate.toFixed(1)}% engagement
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-full bg-purple-50">
                                    <Eye className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                                    <p className="text-2xl font-bold">{formatTime(stats.averageResponseTime)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Activity className="h-3 w-3" />
                                            {stats.recentActivity} recent
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-full bg-green-50">
                                    <Clock className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Post Types Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Posts by Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getTopPostTypes().map(([type, count], index) => {
                                const percentage = (count / stats.totalPosts) * 100;
                                return (
                                    <div key={type} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">{type}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">{count}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {percentage.toFixed(1)}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Top Authors */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Top Authors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getTopAuthors().map(([author, count], index) => {
                                const percentage = (count / stats.totalPosts) * 100;
                                return (
                                    <div key={author} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium">{author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">{count} posts</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {percentage.toFixed(1)}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Engagement Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Engagement Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{stats.engagementRate.toFixed(1)}%</div>
                                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    (Likes + Comments) / Views
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {(stats.totalViews / stats.totalPosts).toFixed(1)}
                                </div>
                                <p className="text-sm text-muted-foreground">Avg Views per Post</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total views divided by posts
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {((stats.totalLikes + stats.totalComments) / stats.totalPosts).toFixed(1)}
                                </div>
                                <p className="text-sm text-muted-foreground">Avg Engagement per Post</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Likes and comments per post
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

// Skeleton loader for PostStats
export function PostStatsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Overview Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                                    <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                                    <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                                </div>
                                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                                        <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                                    </div>
                                    <div className="h-2 bg-muted rounded animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Engagement Overview Skeleton */}
            <Card>
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-40 animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className="h-8 bg-muted rounded w-16 mx-auto animate-pulse" />
                                <div className="h-4 bg-muted rounded w-24 mx-auto animate-pulse" />
                                <div className="h-3 bg-muted rounded w-32 mx-auto animate-pulse" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} "