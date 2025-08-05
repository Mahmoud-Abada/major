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
                                        <div className={`flex items-center gap-1 text-xs ${\n                      engagementTrend === 'up' ? 'text-green-600' : 'text-red-600'\n                    }`}>\n                      <TrendIcon className=\"h-3 w-3\" />\n                      {stats.engagementRate.toFixed(1)}% engagement\n                    </div>\n                  </div>\n                </div>\n                <div className=\"p-3 rounded-full bg-purple-50\">\n                  <Eye className=\"h-6 w-6 text-purple-600\" />\n                </div>\n              </div>\n            </CardContent>\n          </Card>\n        </motion.div>\n\n < motion.div\n          initial = {{ opacity: 0, y: 20 }
} \n          animate = {{ opacity: 1, y: 0 }}\n          transition = {{ duration: 0.3, delay: 0.3 }}\n >\n<Card>\n < CardContent className =\"p-6\">\n              <div className=\"flex items-center justify-between\">\n                <div>\n                  <p className=\"text-sm font-medium text-muted-foreground\">Avg Response Time</p>\n                  <p className=\"text-2xl font-bold\">{formatTime(stats.averageResponseTime)}</p>\n                  <div className=\"flex items-center gap-2 mt-1\">\n                    <div className=\"flex items-center gap-1 text-xs text-muted-foreground\">\n                      <Activity className=\"h-3 w-3\" />\n                      {stats.recentActivity} recent\n                    </div>\n                  </div>\n                </div>\n                <div className=\"p-3 rounded-full bg-green-50\">\n                  <Clock className=\"h-6 w-6 text-green-600\" />\n                </div>\n              </div>\n            </CardContent>\n          </Card>\n        </motion.div>\n      </div>\n\n      {/* Detailed Analytics */}\n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n        {/* Post Types Distribution */}\n        <motion.div\n          initial={{ opacity: 0, x: -20 }}\n          animate={{ opacity: 1, x: 0 }}\n          transition={{ duration: 0.3, delay: 0.4 }}\n        >\n          <Card>\n            <CardHeader>\n              <CardTitle className=\"flex items-center gap-2\">\n                <PieChart className=\"h-5 w-5\" />\n                Posts by Type\n              </CardTitle>\n            </CardHeader>\n            <CardContent className=\"space-y-4\">\n              {getTopPostTypes().map(([type, count], index) => {\n                const percentage = (count / stats.totalPosts) * 100;\n                return (\n                  <div key={type} className=\"space-y-2\">\n                    <div className=\"flex items-center justify-between\">\n                      <span className=\"text-sm font-medium capitalize\">{type}</span>\n                      <div className=\"flex items-center gap-2\">\n                        <span className=\"text-sm text-muted-foreground\">{count}</span>\n                        <Badge variant=\"secondary\" className=\"text-xs\">\n                          {percentage.toFixed(1)}%\n                        </Badge>\n                      </div>\n                    </div>\n                    <Progress value={percentage} className=\"h-2\" />\n                  </div>\n                );\n              })}\n            </CardContent>\n          </Card>\n        </motion.div>\n\n        {/* Top Authors */}\n        <motion.div\n          initial={{ opacity: 0, x: 20 }}\n          animate={{ opacity: 1, x: 0 }}\n          transition={{ duration: 0.3, delay: 0.5 }}\n        >\n          <Card>\n            <CardHeader>\n              <CardTitle className=\"flex items-center gap-2\">\n                <Users className=\"h-5 w-5\" />\n                Top Authors\n              </CardTitle>\n            </CardHeader>\n            <CardContent className=\"space-y-4\">\n              {getTopAuthors().map(([author, count], index) => {\n                const percentage = (count / stats.totalPosts) * 100;\n                return (\n                  <div key={author} className=\"space-y-2\">\n                    <div className=\"flex items-center justify-between\">\n                      <div className=\"flex items-center gap-2\">\n                        <div className=\"w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium\">\n                          {index + 1}\n                        </div>\n                        <span className=\"text-sm font-medium\">{author}</span>\n                      </div>\n                      <div className=\"flex items-center gap-2\">\n                        <span className=\"text-sm text-muted-foreground\">{count} posts</span>\n                        <Badge variant=\"secondary\" className=\"text-xs\">\n                          {percentage.toFixed(1)}%\n                        </Badge>\n                      </div>\n                    </div>\n                    <Progress value={percentage} className=\"h-2\" />\n                  </div>\n                );\n              })}\n            </CardContent>\n          </Card>\n        </motion.div>\n      </div>\n\n      {/* Engagement Metrics */}\n      <motion.div\n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.3, delay: 0.6 }}\n      >\n        <Card>\n          <CardHeader>\n            <CardTitle className=\"flex items-center gap-2\">\n              <BarChart3 className=\"h-5 w-5\" />\n              Engagement Overview\n            </CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n              <div className=\"text-center\">\n                <div className=\"text-2xl font-bold text-red-600\">{stats.engagementRate.toFixed(1)}%</div>\n                <p className=\"text-sm text-muted-foreground\">Engagement Rate</p>\n                <p className=\"text-xs text-muted-foreground mt-1\">\n                  (Likes + Comments) / Views\n                </p>\n              </div>\n              \n              <div className=\"text-center\">\n                <div className=\"text-2xl font-bold text-blue-600\">\n                  {(stats.totalViews / stats.totalPosts).toFixed(1)}\n                </div>\n                <p className=\"text-sm text-muted-foreground\">Avg Views per Post</p>\n                <p className=\"text-xs text-muted-foreground mt-1\">\n                  Total views divided by posts\n                </p>\n              </div>\n              \n              <div className=\"text-center\">\n                <div className=\"text-2xl font-bold text-green-600\">\n                  {((stats.totalLikes + stats.totalComments) / stats.totalPosts).toFixed(1)}\n                </div>\n                <p className=\"text-sm text-muted-foreground\">Avg Engagement per Post</p>\n                <p className=\"text-xs text-muted-foreground mt-1\">\n                  Likes and comments per post\n                </p>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n      </motion.div>\n    </div>\n  );\n}\n\n// Skeleton loader for PostStats\nexport function PostStatsSkeleton() {\n  return (\n    <div className=\"space-y-6\">\n      {/* Overview Cards Skeleton */}\n      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">\n        {Array.from({ length: 4 }).map((_, i) => (\n          <Card key={i}>\n            <CardContent className=\"p-6\">\n              <div className=\"flex items-center justify-between\">\n                <div className=\"space-y-2\">\n                  <div className=\"h-4 bg-muted rounded w-20 animate-pulse\" />\n                  <div className=\"h-8 bg-muted rounded w-16 animate-pulse\" />\n                  <div className=\"h-4 bg-muted rounded w-24 animate-pulse\" />\n                </div>\n                <div className=\"w-12 h-12 bg-muted rounded-full animate-pulse\" />\n              </div>\n            </CardContent>\n          </Card>\n        ))}\n      </div>\n\n      {/* Charts Skeleton */}\n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n        {Array.from({ length: 2 }).map((_, i) => (\n          <Card key={i}>\n            <CardHeader>\n              <div className=\"h-6 bg-muted rounded w-32 animate-pulse\" />\n            </CardHeader>\n            <CardContent className=\"space-y-4\">\n              {Array.from({ length: 4 }).map((_, j) => (\n                <div key={j} className=\"space-y-2\">\n                  <div className=\"flex justify-between\">\n                    <div className=\"h-4 bg-muted rounded w-20 animate-pulse\" />\n                    <div className=\"h-4 bg-muted rounded w-12 animate-pulse\" />\n                  </div>\n                  <div className=\"h-2 bg-muted rounded animate-pulse\" />\n                </div>\n              ))}\n            </CardContent>\n          </Card>\n        ))}\n      </div>\n\n      {/* Engagement Overview Skeleton */}\n      <Card>\n        <CardHeader>\n          <div className=\"h-6 bg-muted rounded w-40 animate-pulse\" />\n        </CardHeader>\n        <CardContent>\n          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n            {Array.from({ length: 3 }).map((_, i) => (\n              <div key={i} className=\"text-center space-y-2\">\n                <div className=\"h-8 bg-muted rounded w-16 mx-auto animate-pulse\" />\n                <div className=\"h-4 bg-muted rounded w-24 mx-auto animate-pulse\" />\n                <div className=\"h-3 bg-muted rounded w-32 mx-auto animate-pulse\" />\n              </div>\n            ))}\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  );\n}"