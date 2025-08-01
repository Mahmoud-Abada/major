import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Activity {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  status: string;
  organizer: {
    name: string;
    id: string;
    role: string;
  };
  participants: {
    name: string;
    id: string;
    role: string;
    status: string;
  }[];
  type: string;
}

interface GroupActivitiesProps {
  activities: Activity[];
  activityTypes: string[];
  onViewActivity?: (activityId: string) => void;
  onAddActivity?: () => void;
}

export function GroupActivities({
  activities,
  activityTypes,
  onViewActivity,
  onAddActivity,
}: GroupActivitiesProps) {
  const columns: TableColumn[] = [
    {
      header: "Activity",
      accessorKey: "title",
      cell: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.description && (
            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "startDate",
      cell: (value, row) => {
        const startDate = new Date(value);

        if (row.endDate) {
          const endDate = new Date(row.endDate);

          if (startDate.toDateString() === endDate.toDateString()) {
            return (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {startDate.toLocaleDateString()},{" "}
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {endDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          }

          return (
            <div className="space-y-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  From: {startDate.toLocaleDateString()},{" "}
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  To: {endDate.toLocaleDateString()},{" "}
                  {endDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        }

        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {startDate.toLocaleDateString()},{" "}
              {startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (value) => value || "N/A",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      header: "Participants",
      accessorKey: "participants",
      cell: (value) => value.length,
    },
  ];

  // Group activities by status
  const upcomingActivities = activities.filter((activity) => {
    const startDate = new Date(activity.startDate);
    return (
      startDate > new Date() && activity.status.toLowerCase() !== "cancelled"
    );
  });

  const pastActivities = activities.filter((activity) => {
    const startDate = new Date(activity.startDate);
    return (
      startDate <= new Date() || activity.status.toLowerCase() === "cancelled"
    );
  });

  // Group activities by type for summary
  const activitiesByType = activities.reduce(
    (acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Group activities by status for summary
  const activitiesByStatus = activities.reduce(
    (acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Group Activities</h3>
        {onAddActivity && (
          <Button onClick={onAddActivity}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {upcomingActivities.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                activities.filter((a) => a.status.toLowerCase() === "completed")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                activities.filter((a) => a.status.toLowerCase() === "cancelled")
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(activitiesByType).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                {type}
              </div>
              <div className="text-2xl font-bold mt-1">{count}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((count / activities.length) * 100)}% of activities
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            <Clock className="h-4 w-4 mr-2" />
            Upcoming Activities
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Past Activities
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            All Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <ProfileTable
            columns={columns}
            data={upcomingActivities}
            onRowClick={
              onViewActivity ? (row) => onViewActivity(row.id) : undefined
            }
            emptyState={
              <div className="text-center py-8">
                <Clock className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No upcoming activities
                </p>
                {onAddActivity && (
                  <Button className="mt-4" size="sm" onClick={onAddActivity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                )}
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <ProfileTable
            columns={columns}
            data={pastActivities}
            onRowClick={
              onViewActivity ? (row) => onViewActivity(row.id) : undefined
            }
            emptyState={
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No past activities</p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <ProfileTable
            columns={columns}
            data={activities}
            onRowClick={
              onViewActivity ? (row) => onViewActivity(row.id) : undefined
            }
            emptyState={
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No activities found
                </p>
                {onAddActivity && (
                  <Button className="mt-4" size="sm" onClick={onAddActivity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                )}
              </div>
            }
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{activity.title}</div>
                  <StatusBadge status={activity.status} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {activity.participants.slice(0, 5).map((participant) => (
                    <div
                      key={participant.id}
                      className="text-xs px-2 py-1 rounded-full bg-muted flex items-center gap-1"
                    >
                      <span>{participant.name}</span>
                      <StatusBadge
                        status={participant.status}
                        className="text-[10px] py-0 px-1"
                      />
                    </div>
                  ))}
                  {activity.participants.length > 5 && (
                    <div className="text-xs px-2 py-1 rounded-full bg-muted">
                      +{activity.participants.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
