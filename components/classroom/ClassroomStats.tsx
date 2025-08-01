/**
 * ClassroomStats Component
 * Displays comprehensive statistics for classrooms with charts and metrics
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ClassroomStats as StatsType } from "@/types/classroom";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface ClassroomStatsProps {
  stats: StatsType;
  className?: string;
  showTrends?: boolean;
  compact?: boolean;
}

export function ClassroomStats({
  stats,
  className,
  showTrends = true,
  compact = false,
}: ClassroomStatsProps) {
  const attendanceColor =
    stats.averageAttendance >= 90
      ? "text-green-600"
      : stats.averageAttendance >= 80
        ? "text-blue-600"
        : stats.averageAttendance >= 70
          ? "text-yellow-600"
          : "text-red-600";

  const gradeColor =
    stats.averageGrade >= 90
      ? "text-green-600"
      : stats.averageGrade >= 80
        ? "text-blue-600"
        : stats.averageGrade >= 70
          ? "text-yellow-600"
          : "text-red-600";

  const progressPercentage =
    stats.totalSessions > 0
      ? (stats.completedSessions / stats.totalSessions) * 100
      : 0;

  const occupancyPercentage = stats.maxStudents
    ? (stats.totalStudents / stats.maxStudents) * 100
    : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 95) return "text-red-600";
    if (percentage >= 85) return "text-yellow-600";
    return "text-green-600";
  };

  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-xl font-bold text-primary">
            {stats.totalStudents}
          </div>
          <div className="text-xs text-muted-foreground">Students</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className={`text-xl font-bold ${attendanceColor}`}>
            {stats.averageAttendance.toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground">Attendance</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className={`text-xl font-bold ${gradeColor}`}>
            {stats.averageGrade.toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Grade</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-xl font-bold text-primary">
            {stats.completedSessions}/{stats.totalSessions}
          </div>
          <div className="text-xs text-muted-foreground">Progress</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {/* Students Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          {stats.maxStudents && (
            <>
              <p
                className={`text-xs ${getOccupancyColor(occupancyPercentage)}`}
              >
                of {stats.maxStudents} max ({occupancyPercentage.toFixed(0)}%)
              </p>
              <Progress value={occupancyPercentage} className="h-2 mt-2" />
            </>
          )}
          {showTrends && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span>+2 this week</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${attendanceColor}`}>
            {stats.averageAttendance.toFixed(1)}%
          </div>
          <Progress value={stats.averageAttendance} className="h-2 mt-2" />
          {showTrends && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              {stats.averageAttendance >= 85 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span>Excellent</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  <span>Needs improvement</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Average Grade Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${gradeColor}`}>
            {stats.averageGrade.toFixed(1)}%
          </div>
          <Progress value={stats.averageGrade} className="h-2 mt-2" />
          {showTrends && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              {stats.averageGrade >= 80 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span>Above average</span>
                </>
              ) : (
                <>
                  <Target className="h-3 w-3 mr-1 text-yellow-600" />
                  <span>Room for growth</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.completedSessions}/{stats.totalSessions}
          </div>
          <p className="text-xs text-muted-foreground">
            sessions ({progressPercentage.toFixed(0)}% complete)
          </p>
          <div className="mt-2">
            <Progress value={progressPercentage} className="h-2" />
            <div
              className={`h-2 rounded-full mt-1 ${getProgressColor(progressPercentage)}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {showTrends && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {stats.totalSessions - stats.completedSessions} sessions
                remaining
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extended stats component with additional metrics
interface ExtendedClassroomStatsProps {
  stats: StatsType;
  className?: string;
}

export function ExtendedClassroomStats({
  stats,
  className,
}: ExtendedClassroomStatsProps) {
  const engagementScore =
    ((stats.totalPosts + stats.totalHomeworks + stats.totalQuizzes) /
      stats.totalStudents) *
    10;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Stats */}
      <ClassroomStats stats={stats} />

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posts & Content
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Posts
                </span>
                <Badge variant="secondary">{stats.totalPosts}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Announcements
                </span>
                <Badge variant="outline">{stats.totalAnnouncements}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Homework</span>
                <Badge variant="default">{stats.totalHomeworks}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Quizzes</span>
                <Badge variant="destructive">{stats.totalQuizzes}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {engagementScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Engagement Score
            </p>
            <Progress
              value={Math.min(engagementScore * 10, 100)}
              className="h-2"
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Based on content per student ratio
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activity Summary
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Active Students
                </span>
                <span className="text-sm font-medium">
                  {Math.round(
                    stats.totalStudents * (stats.averageAttendance / 100),
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Completion Rate
                </span>
                <span className="text-sm font-medium">
                  {(
                    (stats.completedSessions / stats.totalSessions) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Content/Student
                </span>
                <span className="text-sm font-medium">
                  {(stats.totalPosts / stats.totalStudents).toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stats comparison component
interface StatsComparisonProps {
  currentStats: StatsType;
  previousStats?: StatsType;
  className?: string;
}

export function StatsComparison({
  currentStats,
  previousStats,
  className,
}: StatsComparisonProps) {
  if (!previousStats) {
    return <ClassroomStats stats={currentStats} className={className} />;
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const attendanceChange = calculateChange(
    currentStats.averageAttendance,
    previousStats.averageAttendance,
  );
  const gradeChange = calculateChange(
    currentStats.averageGrade,
    previousStats.averageGrade,
  );
  const studentChange = calculateChange(
    currentStats.totalStudents,
    previousStats.totalStudents,
  );

  const renderTrend = (change: number) => {
    if (Math.abs(change) < 1) {
      return <span className="text-muted-foreground text-xs">No change</span>;
    }

    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? "text-green-600" : "text-red-600";

    return (
      <div className={`flex items-center text-xs ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.totalStudents}
            </div>
            {renderTrend(studentChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.averageAttendance.toFixed(1)}%
            </div>
            {renderTrend(attendanceChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.averageGrade.toFixed(1)}%
            </div>
            {renderTrend(gradeChange)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
