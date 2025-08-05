"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    RiBarChartLine,
    RiBookmarkLine,
    RiChat3Line,
    RiEyeLine,
    RiFileTextLine,
    RiHeartLine,
    RiRidingLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
// Empty stats object - will be populated from API
const mockPostStats = {
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    averageEngagement: 0,
    topPerformingPosts: [],
    recentActivity: []
};

export function PostsStats() {
    const stats = mockPostStats;

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    const getEngagementColor = (rate: number) => {
        if (rate >= 80) return "text-green-600";
        if (rate >= 60) return "text-blue-600";
        if (rate >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="space-y-4">
            {/* Overview Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiBarChartLine className="h-4 w-4" />
                        Vue d'Ensemble
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <RiFileTextLine className="h-4 w-4 text-blue-600" />
                                <span className="text-2xl font-bold text-blue-600">{stats.totalPosts}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Total Publications</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <RiEyeLine className="h-4 w-4 text-green-600" />
                                <span className="text-2xl font-bold text-green-600">{formatNumber(stats.totalViews)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Vues Totales</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <RiHeartLine className="h-4 w-4 text-purple-600" />
                                <span className="text-2xl font-bold text-purple-600">{formatNumber(stats.totalInteractions)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Interactions</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <RiChat3Line className="h-4 w-4 text-orange-600" />
                                <span className="text-2xl font-bold text-orange-600">{stats.totalComments}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Commentaires</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Taux d'Engagement</span>
                            <span className={`font-medium ${getEngagementColor(stats.averageEngagement)}`}>
                                {stats.averageEngagement.toFixed(1)}%
                            </span>
                        </div>
                        <Progress value={stats.averageEngagement} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Post Status Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Statut des Publications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Publiées</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats.publishedPosts}</span>
                            <Badge variant="secondary" className="text-xs">
                                {((stats.publishedPosts / stats.totalPosts) * 100).toFixed(0)}%
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Brouillons</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats.draftPosts}</span>
                            <Badge variant="outline" className="text-xs">
                                {((stats.draftPosts / stats.totalPosts) * 100).toFixed(0)}%
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">En Attente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats.pendingPosts}</span>
                            <Badge variant="outline" className="text-xs">
                                {((stats.pendingPosts / stats.totalPosts) * 100).toFixed(0)}%
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span className="text-sm">Archivées</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats.archivedPosts}</span>
                            <Badge variant="outline" className="text-xs">
                                {((stats.archivedPosts / stats.totalPosts) * 100).toFixed(0)}%
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Performing Posts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiRidingLine className="h-4 w-4" />
                        Publications Populaires
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {stats.topPerformingPosts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        #{index + 1}
                                    </Badge>
                                    <Badge
                                        variant={
                                            post.type === "announcement" ? "default" :
                                                post.type === "homework" ? "secondary" :
                                                    post.type === "quiz" ? "destructive" :
                                                        post.type === "poll" ? "outline" : "secondary"
                                        }
                                        className="text-xs capitalize"
                                    >
                                        {post.type}
                                    </Badge>
                                </div>
                                <Badge
                                    variant={
                                        post.priority === "urgent" ? "destructive" :
                                            post.priority === "high" ? "secondary" : "outline"
                                    }
                                    className="text-xs"
                                >
                                    {post.priority}
                                </Badge>
                            </div>

                            <h4 className="text-sm font-medium mb-2 line-clamp-2">
                                {post.title}
                            </h4>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <RiEyeLine className="h-3 w-3" />
                                        <span>{post.interactions.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <RiHeartLine className="h-3 w-3" />
                                        <span>{post.interactions.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <RiChat3Line className="h-3 w-3" />
                                        <span>{post.comments.length}</span>
                                    </div>
                                </div>
                                <span className="text-xs">{post.className}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        Activité Récente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {stats.recentActivity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                            <div className="flex-shrink-0 mt-1">
                                {activity.type === "post_created" && <RiFileTextLine className="h-4 w-4 text-blue-500" />}
                                {activity.type === "comment_added" && <RiChat3Line className="h-4 w-4 text-green-500" />}
                                {activity.type === "interaction" && <RiHeartLine className="h-4 w-4 text-red-500" />}
                                {activity.type === "homework_submitted" && <RiBookmarkLine className="h-4 w-4 text-purple-500" />}
                                {activity.type === "quiz_completed" && <RiBarChartLine className="h-4 w-4 text-orange-500" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{activity.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                        <RiUserLine className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{activity.userName}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                {activity.postTitle && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        "{activity.postTitle}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}