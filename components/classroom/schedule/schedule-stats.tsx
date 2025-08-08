"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RiAlarmWarningLine,
  RiBarChartLine,
  RiBookLine,
  RiCalendarLine,
  RiMapPinLine,
  RiRidingLine,
  RiTimeLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import type {
  ClassSchedule,
  Room,
  ScheduleEntry,
  TeacherSchedule,
} from "./types";

interface ScheduleStatsProps {
  entries: ScheduleEntry[];
  classSchedules: ClassSchedule[];
  teacherSchedules: TeacherSchedule[];
  rooms: Room[];
}

export function ScheduleStats({
  entries,
  classSchedules,
  teacherSchedules,
  rooms,
}: ScheduleStatsProps) {
  const t = useTranslations("schedule");

  // Calculate statistics
  const totalEntries = entries.length;
  const totalClasses = classSchedules.length;
  const totalTeachers = teacherSchedules.length;
  const totalRooms = rooms.length;

  // Today's statistics
  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === today);
  const ongoingEntries = entries.filter((e) => e.status === "ongoing").length;
  const completedEntries = entries.filter(
    (e) => e.status === "completed",
  ).length;
  const cancelledEntries = entries.filter(
    (e) => e.status === "cancelled",
  ).length;

  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => {
    const start = new Date(`2000-01-01T${entry.startTime}`);
    const end = new Date(`2000-01-01T${entry.endTime}`);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  // Utilization rate (assuming 8 hours per day, 6 days per week)
  const maxPossibleHours = totalRooms * 8 * 6; // per week
  const utilizationRate =
    maxPossibleHours > 0 ? (totalHours / maxPossibleHours) * 100 : 0;

  // Conflicts count (simplified)
  const conflictsCount = Math.floor(Math.random() * 5); // Mock conflicts

  // Subject distribution
  const subjectDistribution = entries.reduce(
    (acc, entry) => {
      acc[entry.subject] = (acc[entry.subject] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Type distribution
  const typeDistribution = entries.reduce(
    (acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Day distribution
  const dayDistribution = entries.reduce(
    (acc, entry) => {
      acc[entry.dayOfWeek] = (acc[entry.dayOfWeek] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Teacher workload
  const teacherWorkload = teacherSchedules
    .map((teacher) => ({
      teacherId: teacher.teacherId,
      teacherName: teacher.teacherName,
      totalHours: teacher.totalWeeklyHours,
      utilizationRate:
        (teacher.totalWeeklyHours / teacher.maxWeeklyHours) * 100,
    }))
    .sort((a, b) => b.utilizationRate - a.utilizationRate)
    .slice(0, 5);

  // Room utilization
  const roomUtilization = rooms
    .map((room) => {
      const roomHours = room.schedule.reduce((sum, entry) => {
        const start = new Date(`2000-01-01T${entry.startTime}`);
        const end = new Date(`2000-01-01T${entry.endTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
      return {
        roomId: room.id,
        roomName: room.name,
        totalHours: roomHours,
        utilizationRate: (roomHours / (8 * 6)) * 100, // 8 hours per day, 6 days per week
      };
    })
    .sort((a, b) => b.utilizationRate - a.utilizationRate)
    .slice(0, 5);

  // Upcoming entries (next 24 hours)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const upcomingEntries = entries
    .filter((e) => e.date === today || e.date === tomorrowStr)
    .filter((e) => e.status === "scheduled").length;

  return (
    <div className="space-y-3 md:space-y-4 p-2 md:p-0">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg shrink-0">
                <RiCalendarLine className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {t("totalSessions") || "Total Sessions"}
                </p>
                <p className="text-lg md:text-2xl font-bold">{totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg shrink-0">
                <RiTimeLine className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {t("totalHours") || "Total Hours"}
                </p>
                <p className="text-lg md:text-2xl font-bold">
                  {totalHours.toFixed(0)}
                </p>
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
            {t("todaySchedule") || "Today's Schedule"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-base md:text-lg font-bold text-blue-600">
                {todayEntries.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("todaySessions") || "Today's Sessions"}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-orange-50 rounded-lg text-center">
              <p className="text-base md:text-lg font-bold text-orange-600">
                {ongoingEntries}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("ongoing") || "Ongoing"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-green-50 rounded-lg text-center">
              <p className="text-base md:text-lg font-bold text-green-600">
                {completedEntries}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("completed") || "Completed"}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-red-50 rounded-lg text-center">
              <p className="text-base md:text-lg font-bold text-red-600">
                {cancelledEntries}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("cancelled") || "Cancelled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utilization Overview */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <RiBarChartLine className="h-4 w-4" />
            {t("utilizationOverview") || "Utilization Overview"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div>
            <div className="flex justify-between text-xs md:text-sm mb-2">
              <span>{t("roomUtilization") || "Room Utilization"}</span>
              <span className="font-medium">{utilizationRate.toFixed(1)}%</span>
            </div>
            <Progress value={utilizationRate} className="h-1.5 md:h-2" />
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
            <div>
              <p className="text-base md:text-lg font-bold">{totalClasses}</p>
              <p className="text-xs text-muted-foreground">
                {t("classes") || "Classes"}
              </p>
            </div>
            <div>
              <p className="text-base md:text-lg font-bold">{totalTeachers}</p>
              <p className="text-xs text-muted-foreground">
                {t("teachers") || "Teachers"}
              </p>
            </div>
            <div>
              <p className="text-base md:text-lg font-bold">{totalRooms}</p>
              <p className="text-xs text-muted-foreground">
                {t("rooms") || "Rooms"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <RiBookLine className="h-4 w-4" />
            {t("subjectDistribution") || "Subject Distribution"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(subjectDistribution)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([subject, count]) => (
                <div
                  key={subject}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs md:text-sm truncate flex-1 mr-2">
                    {subject}
                  </span>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Types */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <RiCalendarLine className="h-4 w-4" />
            {t("sessionTypes") || "Session Types"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(typeDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-xs md:text-sm capitalize flex-1 mr-2">
                    {type}
                  </span>
                  <Badge
                    variant={type === "lecture" ? "default" : "secondary"}
                    className="text-xs shrink-0"
                  >
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Teachers by Workload */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <RiRidingLine className="h-4 w-4" />
            {t("teacherWorkload") || "Teacher Workload"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            {teacherWorkload.map((teacher, index) => (
              <div
                key={teacher.teacherId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-xs md:text-sm truncate">
                    {teacher.teacherName}
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {teacher.totalHours.toFixed(1)}h
                  </span>
                  <Badge
                    variant={
                      teacher.utilizationRate >= 90
                        ? "destructive"
                        : teacher.utilizationRate >= 70
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {teacher.utilizationRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}

            {teacherWorkload.length === 0 && (
              <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                {t("noTeacherData") || "No teacher data available"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Room Utilization */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <RiMapPinLine className="h-4 w-4" />
            {t("roomUtilization") || "Room Utilization"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            {roomUtilization.map((room, index) => (
              <div
                key={room.roomId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-xs md:text-sm truncate">
                    {room.roomName}
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {room.totalHours.toFixed(1)}h
                  </span>
                  <Badge
                    variant={
                      room.utilizationRate >= 80
                        ? "default"
                        : room.utilizationRate >= 50
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {room.utilizationRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}

            {roomUtilization.length === 0 && (
              <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                {t("noRoomData") || "No room data available"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conflicts & Issues */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            <RiAlarmWarningLine className="h-4 w-4" />
            {t("scheduleHealth") || "Schedule Health"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm flex-1 mr-2">
              {t("conflicts") || "Conflicts"}
            </span>
            <Badge
              variant={conflictsCount > 0 ? "destructive" : "default"}
              className="text-xs shrink-0"
            >
              {conflictsCount}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm flex-1 mr-2">
              {t("upcomingSessions") || "Upcoming Sessions"}
            </span>
            <Badge variant="outline" className="text-xs shrink-0">
              {upcomingEntries}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm flex-1 mr-2">
              {t("completionRate") || "Completion Rate"}
            </span>
            <Badge variant="default" className="text-xs shrink-0">
              {totalEntries > 0
                ? ((completedEntries / totalEntries) * 100).toFixed(1)
                : 0}
              %
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm md:text-base">
            {t("quickStats") || "Quick Stats"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
            <div>
              <p className="text-base md:text-lg font-bold">
                {upcomingEntries}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("upcoming") || "Upcoming"}
              </p>
            </div>
            <div>
              <p className="text-base md:text-lg font-bold">
                {Object.keys(dayDistribution).length}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("activeDays") || "Active Days"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
