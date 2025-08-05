"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    RiAlarmWarningLine,
    RiBarChartLine,
    RiBookLine,
    RiCheckLine,
    RiFileTextLine,
    RiStarLine,
    RiTimeLine,
    RiRidingLine,
    RiUserLine
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import type {
    ClassHomeworkOverview,
    Homework,
    HomeworkSubmission,
    StudentHomeworkSummary
} from "./types";

interface HomeworkStatsProps {
    homeworks: Homework[];
    submissions: HomeworkSubmission[];
    studentSummaries: StudentHomeworkSummary[];
    classOverviews: ClassHomeworkOverview[];
}

export function HomeworkStats({
    homeworks,
    submissions,
    studentSummaries,
    classOverviews
}: HomeworkStatsProps) {
    const t = useTranslations('homework');

    // Calculate statistics
    const totalHomeworks = homeworks.length;
    const activeHomeworks = homeworks.filter(h => h.status === "assigned" || h.status === "in_progress").length;
    const completedHomeworks = homeworks.filter(h => h.status === "completed").length;
    const overdueHomeworks = homeworks.filter(h => h.status === "overdue").length;

    const totalSubmissions = submissions.length;
    const submittedCount = submissions.filter(s => s.status !== "not_submitted").length;
    const gradedCount = submissions.filter(s => s.status === "graded").length;
    const lateCount = submissions.filter(s => s.isLate).length;

    const submissionRate = totalSubmissions > 0 ? (submittedCount / totalSubmissions) * 100 : 0;
    const gradingRate = submittedCount > 0 ? (gradedCount / submittedCount) * 100 : 0;
    const onTimeRate = submittedCount > 0 ? ((submittedCount - lateCount) / submittedCount) * 100 : 0;

    // Average grade calculation
    const gradesWithValues = submissions.filter(s => s.grade !== undefined);
    const averageGrade = gradesWithValues.length > 0 ?
        gradesWithValues.reduce((sum, s) => sum + s.grade!, 0) / gradesWithValues.length : 0;

    // Today's statistics
    const today = new Date().toISOString().split('T')[0];
    const todayHomeworks = homeworks.filter(h => h.assignedDate === today);
    const dueTodayHomeworks = homeworks.filter(h => h.dueDate === today);

    // Subject distribution
    const subjectDistribution = homeworks.reduce((acc, homework) => {
        acc[homework.subject] = (acc[homework.subject] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Type distribution
    const typeDistribution = homeworks.reduce((acc, homework) => {
        acc[homework.type] = (acc[homework.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Priority distribution
    const priorityDistribution = homeworks.reduce((acc, homework) => {
        acc[homework.priority] = (acc[homework.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Upcoming deadlines
    const now = new Date();
    const upcomingDeadlines = homeworks
        .filter(h => new Date(h.dueDate) > now && h.status !== "completed")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    // Top performing classes
    const topClasses = classOverviews
        .sort((a, b) => b.averageSubmissionRate - a.averageSubmissionRate)
        .slice(0, 5);

    return (
        <div className="space-y-3 md:space-y-4 p-2 md:p-0">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Card className="shadow-sm">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg shrink-0">
                                <RiBookLine className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-muted-foreground truncate">
                                    {t('totalAssignments')}
                                </p>
                                <p className="text-lg md:text-2xl font-bold">{totalHomeworks}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-green-100 rounded-lg shrink-0">
                                <RiUserLine className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-muted-foreground truncate">
                                    {t('submissions')}
                                </p>
                                <p className="text-lg md:text-2xl font-bold">{totalSubmissions}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Overview */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        {t('todayActivity') || "Today's Activity"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-base md:text-lg font-bold text-blue-600">{todayHomeworks.length}</p>
                            <p className="text-xs text-muted-foreground">{t('assignedToday') || 'Assigned Today'}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-orange-50 rounded-lg text-center">
                            <p className="text-base md:text-lg font-bold text-orange-600">{dueTodayHomeworks.length}</p>
                            <p className="text-xs text-muted-foreground">{t('dueToday') || 'Due Today'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-green-50 rounded-lg text-center">
                            <p className="text-base md:text-lg font-bold text-green-600">{activeHomeworks}</p>
                            <p className="text-xs text-muted-foreground">{t('active') || 'Active'}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-red-50 rounded-lg text-center">
                            <p className="text-base md:text-lg font-bold text-red-600">{overdueHomeworks}</p>
                            <p className="text-xs text-muted-foreground">{t('overdue')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiBarChartLine className="h-4 w-4" />
                        {t('performanceOverview') || 'Performance Overview'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <div>
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span>{t('submissionRate') || 'Submission Rate'}</span>
                            <span className="font-medium">{submissionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={submissionRate} className="h-1.5 md:h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span>{t('gradingProgress') || 'Grading Progress'}</span>
                            <span className="font-medium">{gradingRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={gradingRate} className="h-1.5 md:h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span>{t('onTimeRate') || 'On-Time Rate'}</span>
                            <span className="font-medium">{onTimeRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={onTimeRate} className="h-1.5 md:h-2" />
                    </div>

                    {averageGrade > 0 && (
                        <div className="text-center pt-2">
                            <p className="text-base md:text-lg font-bold">{averageGrade.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{t('averageGrade')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Subject Distribution */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiFileTextLine className="h-4 w-4" />
                        {t('subjectDistribution') || 'Subject Distribution'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(subjectDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 6)
                            .map(([subject, count]) => (
                                <div key={subject} className="flex items-center justify-between">
                                    <span className="text-xs md:text-sm truncate flex-1 mr-2">{subject}</span>
                                    <Badge variant="outline" className="text-xs shrink-0">
                                        {count}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Type Distribution */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiStarLine className="h-4 w-4" />
                        {t('assignmentTypes') || 'Assignment Types'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(typeDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-xs md:text-sm capitalize flex-1 mr-2">{type}</span>
                                    <Badge
                                        variant={type === "project" ? "default" : "secondary"}
                                        className="text-xs shrink-0"
                                    >
                                        {count}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiAlarmWarningLine className="h-4 w-4" />
                        {t('priorityLevels') || 'Priority Levels'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        {Object.entries(priorityDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([priority, count]) => (
                                <div key={priority} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {priority === "urgent" && <RiAlarmWarningLine className="h-3 w-3 md:h-4 md:w-4 text-red-600 shrink-0" />}
                                        {priority === "high" && <RiStarLine className="h-3 w-3 md:h-4 md:w-4 text-orange-600 shrink-0" />}
                                        {priority === "medium" && <RiTimeLine className="h-3 w-3 md:h-4 md:w-4 text-blue-600 shrink-0" />}
                                        {priority === "low" && <RiCheckLine className="h-3 w-3 md:h-4 md:w-4 text-green-600 shrink-0" />}
                                        <span className="text-xs md:text-sm capitalize truncate">{priority}</span>
                                    </div>
                                    <Badge
                                        variant={
                                            priority === "urgent" ? "destructive" :
                                                priority === "high" ? "default" :
                                                    priority === "medium" ? "secondary" : "outline"
                                        }
                                        className="text-xs shrink-0 ml-2"
                                    >
                                        {count}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Performing Classes */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiRidingLine className="h-4 w-4" />
                        {t('topClasses') || 'Top Classes'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        {topClasses.map((classOverview, index) => (
                            <div key={classOverview.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <span className="text-xs md:text-sm truncate">{classOverview.className}</span>
                                </div>
                                <Badge 
                                    variant={classOverview.averageSubmissionRate >= 90 ? "default" : "secondary"}
                                    className="text-xs shrink-0 ml-2"
                                >
                                    {classOverview.averageSubmissionRate.toFixed(1)}%
                                </Badge>
                            </div>
                        ))}

                        {topClasses.length === 0 && (
                            <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                                {t('noClassData') || 'No class data available'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        {t('upcomingDeadlines') || 'Upcoming Deadlines'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        {upcomingDeadlines.map((homework) => {
                            const dueDate = new Date(homework.dueDate);
                            const now = new Date();
                            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <div key={homework.id} className="flex items-start gap-2 md:gap-3">
                                    <div className="p-1 md:p-1.5 bg-muted rounded-full mt-0.5 shrink-0">
                                        <RiBookLine className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs md:text-sm font-medium truncate">
                                            {homework.title}
                                        </p>
                                        <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                                            <Badge variant="outline" className="text-xs">
                                                {homework.subject}
                                            </Badge>
                                            <Badge
                                                variant={daysUntilDue <= 1 ? "destructive" : daysUntilDue <= 3 ? "secondary" : "outline"}
                                                className="text-xs"
                                            >
                                                {daysUntilDue === 0 ? t('today') || "Today" :
                                                    daysUntilDue === 1 ? t('tomorrow') || "Tomorrow" :
                                                        `${daysUntilDue} ${t('days') || 'days'}`}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {homework.className} • {dueDate.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {upcomingDeadlines.length === 0 && (
                            <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                                {t('noUpcomingDeadlines') || 'No upcoming deadlines'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base">
                        {t('quickStats') || 'Quick Stats'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
                        <div>
                            <p className="text-base md:text-lg font-bold">{completedHomeworks}</p>
                            <p className="text-xs text-muted-foreground">{t('completedAssignments')}</p>
                        </div>
                        <div>
                            <p className="text-base md:text-lg font-bold">{gradedCount}</p>
                            <p className="text-xs text-muted-foreground">{t('graded')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}