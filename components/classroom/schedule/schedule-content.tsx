"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RiAddLine,
  RiAlarmWarningLine,
  RiCalendarLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiFileExcel2Line,
  RiMapPinLine,
  RiPrinterLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import { useState } from "react";
import { CreateScheduleDialog } from "./create-schedule-dialog";
import { ScheduleDetailsDialog } from "./schedule-details-dialog";
import { ScheduleStats } from "./schedule-stats";
import type {
  ClassSchedule,
  Room,
  ScheduleEntry,
  TeacherSchedule,
} from "./types";
import { UpdateScheduleDialog } from "./update-schedule-dialog";
import { WeeklyCalendar } from "./weekly-calendar";
// Empty data arrays - will be populated from API
const mockClassSchedules: any[] = [];
const mockRooms: any[] = [];
const mockScheduleEntries: any[] = [];
const mockTeacherSchedules: any[] = [];

export default function ScheduleContent() {
  const [scheduleEntries, setScheduleEntries] =
    useState<ScheduleEntry[]>(mockScheduleEntries);
  const [classSchedules, setClassSchedules] =
    useState<ClassSchedule[]>(mockClassSchedules);
  const [teacherSchedules, setTeacherSchedules] =
    useState<TeacherSchedule[]>(mockTeacherSchedules);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);

  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(
    null,
  );
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(
    null,
  );
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherSchedule | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  const handleCreateEntry = (newEntry: Omit<ScheduleEntry, "id">) => {
    const entry: ScheduleEntry = {
      ...newEntry,
      id: `schedule_${Date.now()}`,
    };
    setScheduleEntries([...scheduleEntries, entry]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEntry = (updatedEntry: ScheduleEntry) => {
    setScheduleEntries((entries) =>
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      ),
    );
    setIsUpdateDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    setScheduleEntries((entries) =>
      entries.filter((entry) => entry.id !== entryId),
    );
  };

  const handleViewDetails = (
    item: ScheduleEntry | ClassSchedule | TeacherSchedule,
  ) => {
    if ("startTime" in item && "endTime" in item) {
      setSelectedEntry(item as ScheduleEntry);
    } else if (
      "subjects" in item &&
      "schedule" in item &&
      "totalWeeklyHours" in item
    ) {
      if ("className" in item) {
        setSelectedClass(item as ClassSchedule);
      } else {
        setSelectedTeacher(item as TeacherSchedule);
      }
    }
    setIsDetailsDialogOpen(true);
  };

  const handleEditEntry = (entry: ScheduleEntry) => {
    setSelectedEntry(entry);
    setIsUpdateDialogOpen(true);
  };

  // Column definitions for schedule entries table
  const entriesColumns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.className}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <Badge variant="outline">{row.original.subject}</Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <div className="flex items-center gap-2">
          <RiCalendarLine size={16} className="text-muted-foreground" />
          <span className="text-sm">
            {new Date(row.original.date).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Time",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <div className="flex items-center gap-2">
          <RiTimeLine size={16} className="text-muted-foreground" />
          <span className="text-sm font-mono">
            {row.original.startTime} - {row.original.endTime}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "teacherName",
      header: "Teacher",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <div className="flex items-center gap-2">
          <RiUserLine size={16} className="text-muted-foreground" />
          <span className="text-sm">{row.original.teacherName}</span>
        </div>
      ),
    },
    {
      accessorKey: "roomName",
      header: "Room",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <div className="flex items-center gap-2">
          <RiMapPinLine size={16} className="text-muted-foreground" />
          <span className="text-sm">{row.original.roomName || "TBD"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <Badge
          variant={
            row.original.status === "completed"
              ? "default"
              : row.original.status === "ongoing"
                ? "secondary"
                : row.original.status === "cancelled"
                  ? "destructive"
                  : row.original.status === "postponed"
                    ? "outline"
                    : "outline"
          }
        >
          <div className="flex items-center gap-1">
            {row.original.status === "completed" && <RiCheckLine size={14} />}
            {row.original.status === "cancelled" && (
              <RiAlarmWarningLine size={14} />
            )}
            {row.original.status}
          </div>
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: ScheduleEntry } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            <RiEyeLine size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditEntry(row.original)}
          >
            <RiEditLine size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEntry(row.original.id)}
          >
            <RiDeleteBinLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Column definitions for class schedules table
  const classColumns = [
    {
      accessorKey: "className",
      header: "Class",
      cell: ({ row }: { row: { original: ClassSchedule } }) => (
        <div>
          <div className="font-medium">{row.original.className}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.academicYear}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalWeeklyHours",
      header: "Weekly Hours",
      cell: ({ row }: { row: { original: ClassSchedule } }) => (
        <span className="font-mono">
          {row.original.totalWeeklyHours.toFixed(1)}h
        </span>
      ),
    },
    {
      accessorKey: "subjects",
      header: "Subjects",
      cell: ({ row }: { row: { original: ClassSchedule } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.subjects.slice(0, 3).map((subject, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {subject.subject}
            </Badge>
          ))}
          {row.original.subjects.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.subjects.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Sessions",
      cell: ({ row }: { row: { original: ClassSchedule } }) => (
        <span className="font-mono">{row.original.schedule.length}</span>
      ),
    },
    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }: { row: { original: ClassSchedule } }) => (
        <Badge variant="outline">{row.original.semester}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: ClassSchedule } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            <RiEyeLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Column definitions for teacher schedules table
  const teacherColumns = [
    {
      accessorKey: "teacherName",
      header: "Teacher",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => (
        <div className="font-medium">{row.original.teacherName}</div>
      ),
    },
    {
      accessorKey: "totalWeeklyHours",
      header: "Weekly Hours",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">
            {row.original.totalWeeklyHours.toFixed(1)}h
          </span>
          <span className="text-sm text-muted-foreground">
            / {row.original.maxWeeklyHours}h
          </span>
        </div>
      ),
    },
    {
      accessorKey: "subjects",
      header: "Subjects",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.subjects.slice(0, 2).map((subject, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {subject}
            </Badge>
          ))}
          {row.original.subjects.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.subjects.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "classes",
      header: "Classes",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => (
        <span className="font-mono">{row.original.classes.length}</span>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Sessions",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => (
        <span className="font-mono">{row.original.schedule.length}</span>
      ),
    },
    {
      accessorKey: "workload",
      header: "Utilization",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => {
        const utilizationRate =
          (row.original.totalWeeklyHours / row.original.maxWeeklyHours) * 100;
        return (
          <Badge
            variant={
              utilizationRate >= 90
                ? "destructive"
                : utilizationRate >= 70
                  ? "default"
                  : "secondary"
            }
          >
            {utilizationRate.toFixed(1)}%
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: TeacherSchedule } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            <RiEyeLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Column definitions for rooms table
  const roomColumns = [
    {
      accessorKey: "name",
      header: "Room",
      cell: ({ row }: { row: { original: Room } }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.location}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: { original: Room } }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }: { row: { original: Room } }) => (
        <span className="font-mono">{row.original.capacity}</span>
      ),
    },
    {
      accessorKey: "equipment",
      header: "Equipment",
      cell: ({ row }: { row: { original: Room } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.equipment.slice(0, 2).map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
          {row.original.equipment.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.equipment.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Bookings",
      cell: ({ row }: { row: { original: Room } }) => (
        <span className="font-mono">{row.original.schedule.length}</span>
      ),
    },
    {
      accessorKey: "isAvailable",
      header: "Status",
      cell: ({ row }: { row: { original: Room } }) => (
        <Badge variant={row.original.isAvailable ? "default" : "destructive"}>
          {row.original.isAvailable ? "Available" : "Occupied"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Room } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original as any)}
          >
            <RiEyeLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="flex flex-1 gap-4 p-2">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-4 space-y-4">
          <ScheduleStats
            entries={scheduleEntries}
            classSchedules={classSchedules}
            teacherSchedules={teacherSchedules}
            rooms={rooms}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Stats - Collapsible */}
        <div className="lg:hidden mb-4">
          <details className="group">
            <summary className="flex items-center justify-between p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
              <span className="font-medium">Statistics</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-2">
              <ScheduleStats
                entries={scheduleEntries}
                classSchedules={classSchedules}
                teacherSchedules={teacherSchedules}
                rooms={rooms}
              />
            </div>
          </details>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Schedule Management</h1>
            <p className="text-muted-foreground">
              Manage class schedules, timetables, and room bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RiFileExcel2Line size={16} />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RiPrinterLine size={16} />
              Print
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <RiAddLine size={16} />
              Add Session
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="entries">All Sessions</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyCalendar
                  entries={scheduleEntries}
                  onEntryClick={handleViewDetails}
                  onEntryEdit={handleEditEntry}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Schedule Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={scheduleEntries}
                  columns={entriesColumns}
                  searchKey="title"
                  searchPlaceholder="Search sessions..."
                  onDataChange={setScheduleEntries}
                  filters={[
                    {
                      key: "subject",
                      label: "Subject",
                      options: [
                        { label: "Mathematics", value: "Mathematics" },
                        { label: "Physics", value: "Physics" },
                        { label: "Chemistry", value: "Chemistry" },
                        { label: "Biology", value: "Biology" },
                        { label: "Arabic", value: "Arabic" },
                        { label: "French", value: "French" },
                        { label: "English", value: "English" },
                        { label: "History", value: "History" },
                        { label: "Geography", value: "Geography" },
                      ],
                    },
                    {
                      key: "type",
                      label: "Type",
                      options: [
                        { label: "Lecture", value: "lecture" },
                        { label: "Lab", value: "lab" },
                        { label: "Tutorial", value: "tutorial" },
                        { label: "Exam", value: "exam" },
                        { label: "Meeting", value: "meeting" },
                      ],
                    },
                    {
                      key: "status",
                      label: "Status",
                      options: [
                        { label: "Scheduled", value: "scheduled" },
                        { label: "Ongoing", value: "ongoing" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" },
                        { label: "Postponed", value: "postponed" },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={classSchedules}
                  columns={classColumns}
                  searchKey="className"
                  searchPlaceholder="Search classes..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={teacherSchedules}
                  columns={teacherColumns}
                  searchKey="teacherName"
                  searchPlaceholder="Search teachers..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={rooms}
                  columns={roomColumns}
                  searchKey="name"
                  searchPlaceholder="Search rooms..."
                  filters={[
                    {
                      key: "type",
                      label: "Type",
                      options: [
                        { label: "Classroom", value: "classroom" },
                        { label: "Laboratory", value: "laboratory" },
                        { label: "Auditorium", value: "auditorium" },
                        { label: "Library", value: "library" },
                        { label: "Gym", value: "gym" },
                        { label: "Office", value: "office" },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateScheduleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateEntry}
      />

      {selectedEntry && (
        <UpdateScheduleDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          entry={selectedEntry}
          onSubmit={handleUpdateEntry}
        />
      )}

      {(selectedEntry || selectedClass || selectedTeacher) && (
        <ScheduleDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          data={selectedEntry || selectedClass || selectedTeacher}
        />
      )}
    </div>
  );
}
