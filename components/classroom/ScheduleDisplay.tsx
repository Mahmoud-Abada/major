/**
 * ScheduleDisplay Component
 * Displays class schedules in a formatted layout
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface ScheduleSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface ScheduleDisplayProps {
  schedule: ScheduleSlot[];
  title?: string;
  className?: string;
  compact?: boolean;
  showDuration?: boolean;
}

export function ScheduleDisplay({
  schedule,
  title = "Schedule",
  className,
  compact = false,
  showDuration = true,
}: ScheduleDisplayProps) {
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedSchedule = schedule.sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day),
  );

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const getTotalWeeklyHours = (): string => {
    let totalMinutes = 0;

    schedule.forEach((slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`);
      const end = new Date(`1970-01-01T${slot.endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      totalMinutes += diffMs / (1000 * 60);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const getDayAbbreviation = (day: string): string => {
    const abbreviations: Record<string, string> = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };
    return abbreviations[day] || day;
  };

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" />
          {title}
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedSchedule.map((slot, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {getDayAbbreviation(slot.day)} {slot.startTime}-{slot.endTime}
            </Badge>
          ))}
        </div>
        {showDuration && (
          <p className="text-xs text-muted-foreground">
            Total: {getTotalWeeklyHours()}/week
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
        {showDuration && (
          <p className="text-sm text-muted-foreground">
            {schedule.length} session{schedule.length !== 1 ? "s" : ""} •{" "}
            {getTotalWeeklyHours()} total
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedSchedule.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="min-w-[60px] justify-center"
                >
                  {getDayAbbreviation(slot.day)}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  {showDuration && (
                    <span className="text-xs text-muted-foreground">
                      ({calculateDuration(slot.startTime, slot.endTime)})
                    </span>
                  )}
                </div>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Weekly calendar view component
interface WeeklyScheduleViewProps {
  schedule: ScheduleSlot[];
  className?: string;
}

export function WeeklyScheduleView({
  schedule,
  className,
}: WeeklyScheduleViewProps) {
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const scheduleByDay = schedule.reduce(
    (acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
      acc[slot.day].push(slot);
      return acc;
    },
    {} as Record<string, ScheduleSlot[]>,
  );

  return (
    <div className={cn("grid grid-cols-7 gap-2", className)}>
      {daysOrder.map((day) => (
        <div key={day} className="space-y-2">
          <div className="text-center">
            <h4 className="text-sm font-medium">{day.slice(0, 3)}</h4>
          </div>
          <div className="space-y-1">
            {scheduleByDay[day]?.map((slot, index) => (
              <div
                key={index}
                className="bg-primary/10 text-primary text-xs p-2 rounded text-center"
              >
                <div className="font-medium">{slot.startTime}</div>
                <div>-</div>
                <div>{slot.endTime}</div>
              </div>
            )) || (
              <div className="text-center text-muted-foreground text-xs py-4">
                No class
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Schedule summary component
interface ScheduleSummaryProps {
  schedule: ScheduleSlot[];
  className?: string;
}

export function ScheduleSummary({ schedule, className }: ScheduleSummaryProps) {
  const getTotalSessions = () => schedule.length;

  const getTotalWeeklyHours = (): number => {
    let totalMinutes = 0;

    schedule.forEach((slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`);
      const end = new Date(`1970-01-01T${slot.endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      totalMinutes += diffMs / (1000 * 60);
    });

    return totalMinutes / 60;
  };

  const getAverageSessionDuration = (): string => {
    if (schedule.length === 0) return "0h";

    const totalHours = getTotalWeeklyHours();
    const avgHours = totalHours / schedule.length;
    const hours = Math.floor(avgHours);
    const minutes = Math.round((avgHours - hours) * 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const getMostCommonDay = (): string => {
    const dayCounts = schedule.reduce(
      (acc, slot) => {
        acc[slot.day] = (acc[slot.day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostCommon = Object.entries(dayCounts).reduce((a, b) =>
      dayCounts[a[0]] > dayCounts[b[0]] ? a : b,
    );

    return mostCommon ? mostCommon[0] : "None";
  };

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <div className="text-2xl font-bold text-primary">
          {getTotalSessions()}
        </div>
        <div className="text-xs text-muted-foreground">Sessions/Week</div>
      </div>

      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <div className="text-2xl font-bold text-primary">
          {getTotalWeeklyHours().toFixed(1)}h
        </div>
        <div className="text-xs text-muted-foreground">Total Hours</div>
      </div>

      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <div className="text-lg font-bold text-primary">
          {getAverageSessionDuration()}
        </div>
        <div className="text-xs text-muted-foreground">Avg Duration</div>
      </div>

      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <div className="text-lg font-bold text-primary">
          {getMostCommonDay().slice(0, 3)}
        </div>
        <div className="text-xs text-muted-foreground">Most Common</div>
      </div>
    </div>
  );
}

// Export all components
export { ScheduleSummary, WeeklyScheduleView };
