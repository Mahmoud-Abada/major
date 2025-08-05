"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    RiBarChartLine,
    RiChat3Line,
    RiDiscussLine,
    RiEyeLine,
    RiFileTextLine,
    RiHeartLine,
    RiHomeLine,
    RiQuestionLine,
    RiRidingLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
// Empty data arrays - will be populated from API
const mockPosts: any[] = [];
const mockPostStats = {
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    averageEngagement: 0,
    topPerformingPosts: [],
    recentActivity: []
};

export function AnalyticsView() {
    const stats = mockPostStats;

    // Calculate additional analytics
    const postsByType = mockPosts.reduce((acc, post) => {
        acc[post.type] = (acc[post.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const postsByPriority = mockPosts.reduce((acc, post) => {
        acc[post.priority] = (acc[post.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const postsByStatus = mockPosts.reduce((acc, post) => {
        acc[post.status] = (acc[post.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const averageInteractionsPerPost = stats.totalInteractions / stats.totalPosts;
    const averageCommentsPerPost = stats.totalComments / stats.totalPosts;
    const averageViewsPerPost = stats.totalViews / stats.totalPosts;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "announcement": return <RiFileTextLine className="h-4 w-4" />;
            case "homework": return <RiHomeLine className="h-4 w-4" />;
            case "quiz": return <RiQuestionLine className="h-4 w-4" />;
            case "poll": return <RiBarChartLine className="h-4 w-4" />;
            case "discussion": return <RiDiscussLine className="h-4 w-4" />;
            case "resource": return <RiFileTextLine className="h-4 w-4" />;
            default: return <RiFileTextLine className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "announcement": return "bg-blue-50 text-blue-600";
            case "homework": return "bg-orange-50 text-orange-600";
            case "quiz": return "bg-red-50 text-red-600";
            case "poll": return "bg-purple-50 text-purple-600";
            case "discussion": return "bg-green-50 text-green-600";
            case "resource": return "bg-gray-50 text-gray-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return Math.round(num).toString();
    };

    return (
        <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Publications</p>
                                <p className="text-2xl font-bold">{stats.totalPosts}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <RiFileTextLine className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <RiRidingLine className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+12%</span>
                            <span className="text-muted-foreground ml-1">ce mois</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Vues Totales</p>
                                <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <RiEyeLine className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <RiRidingLine className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+8%</span>
                            <span className="text-muted-foreground ml-1">cette semaine</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Interactions</p>
                                <p className="text-2xl font-bold">{formatNumber(stats.totalInteractions)}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <RiHeartLine className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <RiRidingLine className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+15%</span>
                            <span className="text-muted-foreground ml-1">ce mois</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                                <p className="text-2xl font-bold">{stats.averageEngagement.toFixed(1)}%</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <RiBarChartLine className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <RiRidingLine className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">+5%</span>
                            <span className="text-muted-foreground ml-1">ce mois</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <RiBarChartLine className="h-5 w-5" />
                            Distribution par Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(postsByType).map(([type, count]) => {
                            const percentage = (count / stats.totalPosts) * 100;
                            return (
                                <div key={type} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                                                {getTypeIcon(type)}
                                            </div>
                                            <span className="text-sm font-medium capitalize">
                                                {type === "announcement" ? "Annonces" :
                                                    type === "homework" ? "Devoirs" :
                                                        type === "quiz" ? "Quiz" :
                                                            type === "poll" ? "Sondages" :
                                                                type === "discussion" ? "Discussions" :
                                                                    type === "resource" ? "Ressources" : type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{count}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {percentage.toFixed(0)}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <RiTimeLine className="h-5 w-5" />
                            Statut des Publications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(postsByStatus).map(([status, count]) => {
                            const percentage = (count / stats.totalPosts) * 100;
                            const statusColors = {
                                published: "bg-green-50 text-green-600",
                                draft: "bg-yellow-50 text-yellow-600",
                                pending_approval: "bg-blue-50 text-blue-600",
                                archived: "bg-gray-50 text-gray-600"
                            };
                            const statusLabels = {
                                published: "Publiées",
                                draft: "Brouillons",
                                pending_approval: "En Attente",
                                archived: "Archivées"
                            };

                            return (
                                <div key={status} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]?.replace('text-', 'bg-').replace('-600', '-500')}`}></div>
                                            <span className="text-sm font-medium">
                                                {statusLabels[status as keyof typeof statusLabels]}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{count}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {percentage.toFixed(0)}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <RiEyeLine className="h-5 w-5" />
                            Métriques de Visibilité
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Vues par publication</span>
                            <span className="text-lg font-bold">{formatNumber(averageViewsPerPost)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Taux de visibilité</span>
                            <span className="text-lg font-bold">87%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Portée moyenne</span>
                            <span className="text-lg font-bold">142</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <RiHeartLine className="h-5 w-5" />
                            Métriques d'Engagement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Interactions par post</span>
                            <span className="text-lg font-bold">{formatNumber(averageInteractionsPerPost)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Taux d'interaction</span>
                            <span className="text-lg font-bold">{stats.averageEngagement.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Partages moyens</span>
                            <span className="text-lg font-bold">5.2</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <RiChat3Line className="h-5 w-5" />
                            Métriques de Discussion
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Commentaires par post</span>
                            <span className="text-lg font-bold">{formatNumber(averageCommentsPerPost)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Taux de réponse</span>
                            <span className="text-lg font-bold">73%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Discussions actives</span>
                            <span className="text-lg font-bold">23</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Priority Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <RiBarChartLine className="h-5 w-5" />
                        Distribution par Priorité
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        {Object.entries(postsByPriority).map(([priority, count]) => {
                            const percentage = (count / stats.totalPosts) * 100;
                            const priorityColors = {
                                urgent: "bg-red-50 text-red-600 border-red-200",
                                high: "bg-orange-50 text-orange-600 border-orange-200",
                                normal: "bg-blue-50 text-blue-600 border-blue-200",
                                low: "bg-gray-50 text-gray-600 border-gray-200"
                            };
                            const priorityLabels = {
                                urgent: "Urgent",
                                high: "Élevée",
                                normal: "Normale",
                                low: "Faible"
                            };

                            return (
                                <div key={priority} className={`p-4 rounded-lg border ${priorityColors[priority as keyof typeof priorityColors]}`}>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold mb-1">{count}</p>
                                        <p className="text-sm font-medium mb-2">
                                            {priorityLabels[priority as keyof typeof priorityLabels]}
                                        </p>
                                        <Badge variant="outline" className="text-xs">
                                            {percentage.toFixed(0)}%
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Trends */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <RiTimeLine className="h-5 w-5" />
                        Tendances d'Activité Récente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recentActivity.slice(0, 8).map((activity, index) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-white rounded-lg">
                                        {activity.type === "post_created" && <RiFileTextLine className="h-4 w-4 text-blue-500" />}
                                        {activity.type === "comment_added" && <RiChat3Line className="h-4 w-4 text-green-500" />}
                                        {activity.type === "interaction" && <RiHeartLine className="h-4 w-4 text-red-500" />}
                                        {activity.type === "homework_submitted" && <RiHomeLine className="h-4 w-4 text-orange-500" />}
                                        {activity.type === "quiz_completed" && <RiQuestionLine className="h-4 w-4 text-purple-500" />}
                                    </div>
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
                                </div>

                                <Badge variant="outline" className="text-xs">
                                    #{index + 1}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}