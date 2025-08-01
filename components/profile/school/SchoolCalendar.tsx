import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category: string;
  isAllDay: boolean;
  organizer: {
    name: string;
    id: string;
    role: string;
  };
}

interface SchoolCalendarProps {
  events: CalendarEvent[];
  categories: string[];
  onViewEvent?: (eventId: string) => void;
  onAddEvent?: () => void;
  onDateSelect?: (date: Date) => void;
  onCategoryFilter?: (category: string) => void;
}

export function SchoolCalendar({
  events,
  categories,
  onViewEvent,
  onAddEvent,
  onDateSelect,
  onCategoryFilter,
}: SchoolCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  // Filter events for the selected date
  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const selected = new Date(selectedDate);

        // Reset time part for comparison if it's an all-day event
        if (event.isAllDay) {
          return (
            eventStart.toDateString() === selected.toDateString() ||
            eventEnd.toDateString() === selected.toDateString() ||
            (eventStart <= selected && eventEnd >= selected)
          );
        }

        // For time-specific events
        return (
          eventStart.toDateString() === selected.toDateString() ||
          eventEnd.toDateString() === selected.toDateString()
        );
      })
    : [];

  // Group events by category for summary
  const eventsByCategory = events.reduce(
    (acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get upcoming events (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const columns: TableColumn[] = [
    {
      header: "Event",
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
        const endDate = new Date(row.endDate);

        if (row.isAllDay) {
          if (startDate.toDateString() === endDate.toDateString()) {
            return (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{startDate.toLocaleDateString()}</span>
                <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">
                  All day
                </span>
              </div>
            );
          }

          return (
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">
                All day
              </span>
            </div>
          );
        }

        if (startDate.toDateString() === endDate.toDateString()) {
          return (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
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
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                From: {startDate.toLocaleDateString()},{" "}
                {startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
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
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (value) => value || "N/A",
    },
    {
      header: "Organizer",
      accessorKey: "organizer",
      cell: (value) => (
        <a
          href={`/classroom/${value.role}s/${value.id}`}
          className="hover:underline"
        >
          {value.name}
        </a>
      ),
    },
  ];

  // Get dates with events for highlighting in calendar
  const datesWithEvents = events.reduce((dates, event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    // For multi-day events, add all dates in between
    if (start.toDateString() !== end.toDateString()) {
      const dateArray = [];
      const currentDate = new Date(start);

      while (currentDate <= end) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return [...dates, ...dateArray];
    }

    return [...dates, start];
  }, [] as Date[]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">School Calendar</h3>
        <div className="flex items-center gap-2">
          {onCategoryFilter && (
            <Select onValueChange={onCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {onAddEvent && (
            <Button onClick={onAddEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(eventsByCategory).map(([category, count]) => (
          <Card key={category}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                {category}
              </div>
              <div className="text-2xl font-bold mt-1">{count}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((count / events.length) * 100)}% of events
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="calendar">
        <TabsList className="w-full">
          <TabsTrigger value="calendar" className="flex-1">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            All Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  modifiers={{
                    event: datesWithEvents,
                  }}
                  modifiersStyles={{
                    event: {
                      fontWeight: "bold",
                      backgroundColor: "rgba(var(--primary), 0.1)",
                      borderRadius: "0.25rem",
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  Events for {selectedDate?.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventsForSelectedDate.length > 0 ? (
                  <ProfileTable
                    columns={columns}
                    data={eventsForSelectedDate}
                    onRowClick={
                      onViewEvent ? (row) => onViewEvent(row.id) : undefined
                    }
                  />
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      No events scheduled for this date
                    </p>
                    {onAddEvent && (
                      <Button className="mt-4" size="sm" onClick={onAddEvent}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Upcoming Events (Next 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <ProfileTable
                  columns={columns}
                  data={upcomingEvents}
                  onRowClick={
                    onViewEvent ? (row) => onViewEvent(row.id) : undefined
                  }
                />
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    No upcoming events in the next 7 days
                  </p>
                  {onAddEvent && (
                    <Button className="mt-4" size="sm" onClick={onAddEvent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Events</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <ProfileTable
                  columns={columns}
                  data={events}
                  onRowClick={
                    onViewEvent ? (row) => onViewEvent(row.id) : undefined
                  }
                />
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No events found</p>
                  {onAddEvent && (
                    <Button className="mt-4" size="sm" onClick={onAddEvent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
