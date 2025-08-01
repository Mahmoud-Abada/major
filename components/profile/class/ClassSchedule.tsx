import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface SchedulePeriod {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  subject: string;
  subjectId?: string;
  teacher: string;
  teacherId?: string;
  room?: string;
  dayOfWeek: string;
}

interface ClassScheduleProps {
  schedule: {
    periods: SchedulePeriod[];
    effectiveFrom: string;
    effectiveTo: string;
    daysOfWeek: string[];
  };
}

export function ClassSchedule({ schedule }: ClassScheduleProps) {
  // Group periods by day of week
  const periodsByDay = schedule.periods.reduce(
    (acc, period) => {
      const day = period.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(period);
      return acc;
    },
    {} as Record<string, SchedulePeriod[]>,
  );

  // Sort periods by start time
  Object.keys(periodsByDay).forEach((day) => {
    periodsByDay[day].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });

  const columns: TableColumn[] = [
    { header: "Period", accessorKey: "name" },
    {
      header: "Time",
      accessorKey: "startTime",
      cell: (value, row) => `${value} - ${row.endTime}`,
    },
    {
      header: "Subject",
      accessorKey: "subject",
      cell: (value, row) =>
        row.subjectId ? (
          <a
            href={`/classroom/subjects/${row.subjectId}`}
            className="hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        ),
    },
    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: (value, row) =>
        row.teacherId ? (
          <a
            href={`/classroom/teachers/${row.teacherId}`}
            className="hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        ),
    },
    { header: "Room", accessorKey: "room" },
  ];

  // Calculate class hours per day
  const hoursPerDay = schedule.daysOfWeek.reduce(
    (acc, day) => {
      const periods = periodsByDay[day] || [];
      if (periods.length === 0) return acc;

      const totalMinutes = periods.reduce((sum, period) => {
        const startParts = period.startTime.split(":").map(Number);
        const endParts = period.endTime.split(":").map(Number);

        const startMinutes = startParts[0] * 60 + startParts[1];
        const endMinutes = endParts[0] * 60 + endParts[1];

        return sum + (endMinutes - startMinutes);
      }, 0);

      acc[day] = (totalMinutes / 60).toFixed(1);
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Class Schedule</h3>
          <p className="text-sm text-muted-foreground">
            Effective from{" "}
            {new Date(schedule.effectiveFrom).toLocaleDateString()}
            {schedule.effectiveTo &&
              ` to ${new Date(schedule.effectiveTo).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-primary/10 text-primary p-2 rounded-md">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Current Term</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{schedule.periods.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Days per Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {schedule.daysOfWeek.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">First Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {schedule.periods.reduce((earliest, period) => {
                return period.startTime < earliest
                  ? period.startTime
                  : earliest;
              }, "23:59")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {schedule.periods.reduce((latest, period) => {
                return period.endTime > latest ? period.endTime : latest;
              }, "00:00")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        {schedule.daysOfWeek.map((day) => (
          <Card key={day}>
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
              <div className="text-2xl font-bold mt-1">
                {periodsByDay[day]?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {hoursPerDay[day] || 0} hours
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={schedule.daysOfWeek[0]}>
        <TabsList className="w-full">
          {schedule.daysOfWeek.map((day) => (
            <TabsTrigger key={day} value={day} className="flex-1">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {schedule.daysOfWeek.map((day) => (
          <TabsContent key={day} value={day}>
            <Card>
              <CardContent className="pt-6">
                {periodsByDay[day] && periodsByDay[day].length > 0 ? (
                  <ProfileTable columns={columns} data={periodsByDay[day]} />
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      No classes scheduled for this day
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
