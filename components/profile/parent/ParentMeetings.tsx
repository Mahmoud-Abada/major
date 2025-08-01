import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Eye, Plus } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  teacher: string;
  teacherId: string;
  child: string;
  childId: string;
  status: string;
  notes?: string;
}

interface ParentMeetingsProps {
  meetings: Meeting[];
  upcomingCount: number;
  pastCount: number;
  onViewMeeting?: (meetingId: string) => void;
  onScheduleMeeting?: () => void;
}

export function ParentMeetings({
  meetings,
  upcomingCount,
  pastCount,
  onViewMeeting,
  onScheduleMeeting,
}: ParentMeetingsProps) {
  const columns: TableColumn[] = [
    { header: "Title", accessorKey: "title" },
    {
      header: "Date",
      accessorKey: "date",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    { header: "Time", accessorKey: "time" },
    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: (value, row) => (
        <a
          href={`/classroom/teachers/${row.teacherId}`}
          className="hover:underline"
        >
          {value}
        </a>
      ),
    },
    {
      header: "Child",
      accessorKey: "child",
      cell: (value, row) => (
        <a
          href={`/classroom/students/${row.childId}`}
          className="hover:underline"
        >
          {value}
        </a>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  // Filter upcoming and past meetings
  const currentDate = new Date();
  const upcomingMeetings = meetings.filter(
    (meeting) => new Date(meeting.date) >= currentDate,
  );
  const pastMeetings = meetings.filter(
    (meeting) => new Date(meeting.date) < currentDate,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Parent-Teacher Meetings</h3>
        {onScheduleMeeting && (
          <Button onClick={onScheduleMeeting}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingCount}</div>
            {upcomingMeetings.length > 0 && (
              <div className="mt-4 space-y-3">
                {upcomingMeetings.slice(0, 2).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString()} •{" "}
                        {meeting.time}
                      </p>
                    </div>
                    <StatusBadge status={meeting.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Past Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastCount}</div>
            {pastMeetings.length > 0 && (
              <div className="mt-4 space-y-3">
                {pastMeetings.slice(0, 2).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString()} •{" "}
                        {meeting.time}
                      </p>
                    </div>
                    <StatusBadge status={meeting.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProfileTable
        columns={columns}
        data={meetings}
        actions={(row) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewMeeting && onViewMeeting(row.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No meetings scheduled</p>
            {onScheduleMeeting && (
              <Button className="mt-4" size="sm" onClick={onScheduleMeeting}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
