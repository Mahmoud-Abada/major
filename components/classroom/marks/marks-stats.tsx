"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    RiBarChartLine,
    RiBookLine,
    RiFileTextLine,
    RiTimeLine,
    RiTrophyLine,
    RiUserLine
} from "@remixicon/react";
import type { GroupMark, Mark, StudentMark } from "./types";

interface MarksStatsProps {
    marks: Mark[];
    studentMarks: StudentMark[];
    groupMarks: GroupMark[];
}

export function MarksStats({ marks, studentMarks, groupMarks }: MarksStatsProps) {
    // Calculate statistics
    const totalMarks = marks.length;
    const publishedMarks = marks.filter(m => m.status === "published").length;
    const draftMarks = marks.filter(m => m.status === "draft").length;

    const totalStudentMarks = studentMarks.length;
    const passedStudents = studentMarks.filter(sm => {
        const percentage = (sm.obtainedMarks / sm.totalMarks) * 100;
        return percentage >= 60 && !sm.isExempted;
    }).length;

    const passRate = totalStudentMarks > 0 ? (passedStudents / totalStudentMarks) * 100 : 0;

    const averagePerformance = studentMarks.length > 0
        ? studentMarks.reduce((sum, sm) => {
            if (sm.isExempted) return sum;
            return sum + (sm.obtainedMarks / sm.totalMarks) * 100;
        }, 0) / studentMarks.filter(sm => !sm.isExempted).length
        : 0;

    // Subject distribution
    const subjectDistribution = marks.reduce((acc, mark) => {
        acc[mark.subject] = (acc[mark.subject] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Type distribution
    const typeDistribution = marks.reduce((acc, mark) => {
        acc[mark.type] = (acc[mark.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Recent activity
    const recentMarks = marks
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-4">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <RiFileTextLine className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Marks</p>
                                <p className="text-2xl font-bold">{totalMarks}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <RiUserLine className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Student Marks</p>
                                <p className="text-2xl font-bold">{totalStudentMarks}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiBarChartLine className="h-4 w-4" />
                        Performance Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Pass Rate</span>
                            <span className="font-medium">{passRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={passRate} className="h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Average Performance</span>
                            <span className="font-medium">{averagePerformance.toFixed(1)}%</span>
                        </div>
                        <Progress value={averagePerformance} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{publishedMarks}</p>
                            <p className="text-xs text-muted-foreground">Published</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-orange-600">{draftMarks}</p>
                            <p className="text-xs text-muted-foreground">Draft</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Subject Distribution */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiBookLine className="h-4 w-4" />
                        Subject Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(subjectDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 6)
                            .map(([subject, count]) => (
                                <div key={subject} className="flex items-center justify-between">
                                    <span className="text-sm truncate">{subject}</span>
                                    <Badge variant="outline" className="ml-2">
                                        {count}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Assessment Types */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiTrophyLine className="h-4 w-4" />
                        Assessment Types
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(typeDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-sm capitalize">{type}</span>
                                    <Badge
                                        variant={type === "exam" ? "default" : "secondary"}
                                        className="ml-2"
                                    >
                                        {count}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentMarks.map((mark) => (
                            <div key={mark.id} className="flex items-start gap-3">
                                <div className="p-1.5 bg-muted rounded-full mt-0.5">
                                    <RiFileTextLine className="h-3 w-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {mark.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {mark.subject}
                                        </Badge>
                                        <Badge
                                            variant={mark.status === "published" ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {mark.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(mark.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {recentMarks.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No recent activity
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-lg font-bold">{groupMarks.length}</p>
                            <p className="text-xs text-muted-foreground">Groups</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold">
                                {studentMarks.filter(sm => sm.isExempted).length}
                            </p>
                            <p className="text-xs text-muted-foreground">Exempted</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}