"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    RiBarChartLine,
    RiCalendarEventLine,
    RiCheckLine,
    RiCloseLine,
    RiGroupLine,
    RiRidingLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import type { AttendanceEvent, AttendanceRecord, ClassroomAttendance, StudentAttendance } from "./types";

interface AttendanceStatsProps {
    events: AttendanceEvent[];
    records: AttendanceRecord[];
    studentAttendance: StudentAttendance[];
    classroomAttendance: ClassroomAttendance[];
}

export function AttendanceStats({
    events,
    records,
    studentAttendance,
    classroomAttendance
}: AttendanceStatsProps) {
    const t = useTranslations('attendance');

    // Calculate statistics
    const totalEvents = events.length;
    const totalRecords = records.length;
    const totalStudents = studentAttendance.length;
    const totalClassrooms = classroomAttendance.length;

    // Today's statistics
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = events.filter(e => e.date === today);
    const todayRecords = records.filter(r => r.date === today);

    const todayPresent = todayRecords.filter(r => r.status === "present").length;
    const todayAbsent = todayRecords.filter(r => r.status === "absent").length;
    const todayLate = todayRecords.filter(r => r.status === "late").length;
    const todayExcused = todayRecords.filter(r => r.status === "excused").length;

    const todayAttendanceRate = todayRecords.length > 0 ?
        ((todayPresent + todayLate) / todayRecords.length) * 100 : 0;

    // Overall statistics
    const overallPresent = records.filter(r => r.status === "present").length;
    const overallAbsent = records.filter(r => r.status === "absent").length;
    const overallLate = records.filter(r => r.status === "late").length;
    const overallExcused = records.filter(r => r.status === "excused").length;

    const overallAttendanceRate = records.length > 0 ?
        ((overallPresent + overallLate) / records.length) * 100 : 0;

    // Weekly statistics (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const weeklyRecords = records.filter(r => r.date >= weekAgoStr);
    const weeklyPresent = weeklyRecords.filter(r => r.status === "present" || r.status === "late").length;
    const weeklyAttendanceRate = weeklyRecords.length > 0 ?
        (weeklyPresent / weeklyRecords.length) * 100 : 0;

    // Class distribution
    const classDistribution = classroomAttendance.reduce((acc, classroom) => {
        acc[classroom.className] = {
            totalStudents: classroom.totalStudents,
            attendanceRate: classroom.attendanceRate
        };
        return acc;
    }, {} as Record<string, { totalStudents: number; attendanceRate: number }>);

    // Status distribution
    const statusDistribution = {
        present: overallPresent,
        absent: overallAbsent,
        late: overallLate,
        excused: overallExcused
    };

    // Recent events
    const recentEvents = events
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    // Top performing classes
    const topClasses = Object.entries(classDistribution)
        .sort(([, a], [, b]) => b.attendanceRate - a.attendanceRate)
        .slice(0, 5);

    return (
        <div className="space-y-3 md:space-y-4 p-2 md:p-0">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Card className="shadow-sm">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg shrink-0">
                                <RiCalendarEventLine className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-muted-foreground truncate">
                                    {t('totalEvents') || 'Total Events'}
                                </p>
                                <p className="text-lg md:text-2xl font-bold">{totalEvents}</p>
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
                                    {t('totalRecords') || 'Total Records'}
                                </p>
                                <p className="text-lg md:text-2xl font-bold">{totalRecords}</p>
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
                        {t('todayAttendance') || "Today's Attendance"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <div>
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span>{t('attendanceRate')}</span>
                            <span className="font-medium">{todayAttendanceRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={todayAttendanceRate} className="h-1.5 md:h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="text-center">
                            <p className="text-base md:text-lg font-bold text-green-600">{todayPresent}</p>
                            <p className="text-xs text-muted-foreground">{t('present')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-base md:text-lg font-bold text-red-600">{todayAbsent}</p>
                            <p className="text-xs text-muted-foreground">{t('absent')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="text-center">
                            <p className="text-base md:text-lg font-bold text-orange-600">{todayLate}</p>
                            <p className="text-xs text-muted-foreground">{t('late')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-base md:text-lg font-bold text-blue-600">{todayExcused}</p>
                            <p className="text-xs text-muted-foreground">{t('excused')}</p>
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
                            <span>{t('overallRate') || 'Overall Rate'}</span>
                            <span className="font-medium">{overallAttendanceRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={overallAttendanceRate} className="h-1.5 md:h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span>{t('weeklyRate') || 'Weekly Rate'}</span>
                            <span className="font-medium">{weeklyAttendanceRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={weeklyAttendanceRate} className="h-1.5 md:h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
                        <div className="text-center">
                            <p className="text-base md:text-lg font-bold">{totalStudents}</p>
                            <p className="text-xs text-muted-foreground">{t('students')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-base md:text-lg font-bold">{totalClassrooms}</p>
                            <p className="text-xs text-muted-foreground">{t('classes') || 'Classes'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiGroupLine className="h-4 w-4" />
                        {t('statusDistribution') || 'Status Distribution'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiCheckLine className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                                <span className="text-xs md:text-sm">{t('present')}</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-xs">
                                {statusDistribution.present}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiCloseLine className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                                <span className="text-xs md:text-sm">{t('absent')}</span>
                            </div>
                            <Badge variant="outline" className="bg-red-50 text-xs">
                                {statusDistribution.absent}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiTimeLine className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                                <span className="text-xs md:text-sm">{t('late')}</span>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-xs">
                                {statusDistribution.late}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiUserLine className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                <span className="text-xs md:text-sm">{t('excused')}</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-xs">
                                {statusDistribution.excused}
                            </Badge>
                        </div>
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
                        {topClasses.map(([className, stats], index) => (
                            <div key={className} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <span className="text-xs md:text-sm truncate">{className}</span>
                                </div>
                                <Badge
                                    variant={stats.attendanceRate >= 90 ? "default" : "secondary"}
                                    className="text-xs shrink-0 ml-2"
                                >
                                    {stats.attendanceRate.toFixed(1)}%
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

            {/* Recent Activity */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        {t('recentEvents') || 'Recent Events'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        {recentEvents.map((event) => (
                            <div key={event.id} className="flex items-start gap-2 md:gap-3">
                                <div className="p-1 md:p-1.5 bg-muted rounded-full mt-0.5 shrink-0">
                                    <RiCalendarEventLine className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm font-medium truncate">
                                        {event.title}
                                    </p>
                                    <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                                        <Badge variant="outline" className="text-xs">
                                            {event.className}
                                        </Badge>
                                        <Badge
                                            variant={event.status === "completed" ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {event.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(event.date).toLocaleDateString()} • {event.attendanceRate.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}

                        {recentEvents.length === 0 && (
                            <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                                {t('noRecentEvents') || 'No recent events'}
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
                            <p className="text-base md:text-lg font-bold">{todayEvents.length}</p>
                            <p className="text-xs text-muted-foreground">
                                {t('todayEvents') || "Today's Events"}
                            </p>
                        </div>
                        <div>
                            <p className="text-base md:text-lg font-bold">
                                {events.filter(e => e.status === "ongoing").length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t('ongoing') || 'Ongoing'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}