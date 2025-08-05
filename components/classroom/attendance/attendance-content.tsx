"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    RiAddLine,
    RiCalendarLine,
    RiCheckLine,
    RiCloseLine,
    RiDeleteBinLine,
    RiEditLine,
    RiEyeLine,
    RiFileExcel2Line,
    RiPrinterLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
import { useState } from "react";
import { AttendanceDetailsDialog } from "./attendance-details-dialog";
import { AttendanceStats } from "./attendance-stats";
import { CreateEventDialog } from "./create-event-dialog";
import type { AttendanceEvent, AttendanceRecord, ClassroomAttendance, StudentAttendance } from "./types";
import { UpdateAttendanceDialog } from "./update-attendance-dialog";

export default function AttendanceContent() {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [attendanceEvents, setAttendanceEvents] = useState<AttendanceEvent[]>([]);
    const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);
    const [classroomAttendance, setClassroomAttendance] = useState<ClassroomAttendance[]>([]);

    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<AttendanceEvent | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);

    const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
    const [isUpdateAttendanceDialogOpen, setIsUpdateAttendanceDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("events");

    const handleCreateEvent = (newEvent: Omit<AttendanceEvent, "id">) => {
        const event: AttendanceEvent = {
            ...newEvent,
            id: `event_${Date.now()}`,
        };
        setAttendanceEvents([...attendanceEvents, event]);
        setIsCreateEventDialogOpen(false);
    };

    const handleUpdateAttendance = (updatedRecord: AttendanceRecord) => {
        setAttendanceRecords(records =>
            records.map(record => record.id === updatedRecord.id ? updatedRecord : record)
        );
        setIsUpdateAttendanceDialogOpen(false);
        setSelectedRecord(null);
    };

    const handleDeleteEvent = (eventId: string) => {
        setAttendanceEvents(events => events.filter(event => event.id !== eventId));
    };

    const handleViewDetails = (item: AttendanceRecord | AttendanceEvent | StudentAttendance) => {
        if ('studentId' in item && 'status' in item) {
            setSelectedRecord(item as AttendanceRecord);
        } else if ('totalStudents' in item && 'attendanceRate' in item && 'events' in item) {
            // This is a StudentAttendance
            setSelectedStudent(item as StudentAttendance);
        } else {
            setSelectedEvent(item as AttendanceEvent);
        }
        setIsDetailsDialogOpen(true);
    };

    const handleEditAttendance = (record: AttendanceRecord) => {
        setSelectedRecord(record);
        setIsUpdateAttendanceDialogOpen(true);
    };

    // Column definitions for events table
    const eventsColumns = [
        {
            accessorKey: "title",
            header: "Event",
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
                <div>
                    <div className="font-medium">{row.original.title}</div>
                    <div className="text-sm text-muted-foreground">{row.original.className}</div>
                </div>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
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
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
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
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
                <div className="flex items-center gap-2">
                    <RiUserLine size={16} className="text-muted-foreground" />
                    <span className="text-sm">{row.original.teacherName}</span>
                </div>
            ),
        },
        {
            accessorKey: "attendanceRate",
            header: "Attendance",
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                        {row.original.presentCount + row.original.lateCount}/{row.original.totalStudents}
                    </span>
                    <Badge variant={row.original.attendanceRate >= 80 ? "default" : "destructive"}>
                        {row.original.attendanceRate.toFixed(1)}%
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
                <Badge variant={
                    row.original.status === "completed" ? "default" :
                        row.original.status === "ongoing" ? "secondary" :
                            row.original.status === "scheduled" ? "outline" : "destructive"
                }>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: AttendanceEvent } }) => (
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
                        onClick={() => handleDeleteEvent(row.original.id)}
                    >
                        <RiDeleteBinLine size={16} />
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Column definitions for records table
    const recordsColumns = [
        {
            accessorKey: "studentName",
            header: "Student",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
                <div>
                    <div className="font-medium">{row.original.studentName}</div>
                    <div className="text-sm text-muted-foreground">{row.original.className}</div>
                </div>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
                <span className="text-sm">
                    {new Date(row.original.date).toLocaleDateString()}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
                <Badge variant={
                    row.original.status === "present" ? "default" :
                        row.original.status === "late" ? "secondary" :
                            row.original.status === "excused" ? "outline" : "destructive"
                }>
                    <div className="flex items-center gap-1">
                        {row.original.status === "present" && <RiCheckLine size={14} />}
                        {row.original.status === "absent" && <RiCloseLine size={14} />}
                        {row.original.status === "late" && <RiTimeLine size={14} />}
                        {row.original.status === "excused" && <RiUserLine size={14} />}
                        {row.original.status}
                    </div>
                </Badge>
            ),
        },
        {
            accessorKey: "timeIn",
            header: "Time In",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
                <span className="text-sm font-mono">
                    {row.original.timeIn || "-"}
                </span>
            ),
        },
        {
            accessorKey: "timeOut",
            header: "Time Out",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
                <span className="text-sm font-mono">
                    {row.original.timeOut || "-"}
                </span>
            ),
        },
        {
            accessorKey: "markedBy",
            header: "Marked By",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
                <span className="text-sm">{row.original.markedBy}</span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: AttendanceRecord } }) => (
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
                        onClick={() => handleEditAttendance(row.original)}
                    >
                        <RiEditLine size={16} />
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Column definitions for student attendance table
    const studentColumns = [
        {
            accessorKey: "studentName",
            header: "Student",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <div>
                    <div className="font-medium">{row.original.studentName}</div>
                    <div className="text-sm text-muted-foreground">{row.original.className}</div>
                </div>
            ),
        },
        {
            accessorKey: "totalDays",
            header: "Total Days",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <span className="font-mono">{row.original.totalDays}</span>
            ),
        },
        {
            accessorKey: "presentDays",
            header: "Present",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-green-600">{row.original.presentDays}</span>
                    <RiCheckLine size={16} className="text-green-600" />
                </div>
            ),
        },
        {
            accessorKey: "absentDays",
            header: "Absent",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-red-600">{row.original.absentDays}</span>
                    <RiCloseLine size={16} className="text-red-600" />
                </div>
            ),
        },
        {
            accessorKey: "lateDays",
            header: "Late",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-orange-600">{row.original.lateDays}</span>
                    <RiTimeLine size={16} className="text-orange-600" />
                </div>
            ),
        },
        {
            accessorKey: "attendanceRate",
            header: "Rate",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <Badge variant={row.original.attendanceRate >= 80 ? "default" : "destructive"}>
                    {row.original.attendanceRate.toFixed(1)}%
                </Badge>
            ),
        },
        {
            accessorKey: "lastAttendance",
            header: "Last Seen",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
                <div className="text-sm">
                    {row.original.lastAttendance ? (
                        <div>
                            <div>{new Date(row.original.lastAttendance.date).toLocaleDateString()}</div>
                            <Badge variant="outline" className="text-xs">
                                {row.original.lastAttendance.status}
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">No records</span>
                    )}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: StudentAttendance } }) => (
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

    // Column definitions for classroom attendance table
    const classroomColumns = [
        {
            accessorKey: "className",
            header: "Class",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
                <div className="font-medium">{row.original.className}</div>
            ),
        },
        {
            accessorKey: "totalStudents",
            header: "Total Students",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
                <span className="font-mono">{row.original.totalStudents}</span>
            ),
        },
        {
            accessorKey: "presentCount",
            header: "Present",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-green-600">{row.original.presentCount}</span>
                    <RiCheckLine size={16} className="text-green-600" />
                </div>
            ),
        },
        {
            accessorKey: "absentCount",
            header: "Absent",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-red-600">{row.original.absentCount}</span>
                    <RiCloseLine size={16} className="text-red-600" />
                </div>
            ),
        },
        {
            accessorKey: "attendanceRate",
            header: "Rate",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
                <Badge variant={row.original.attendanceRate >= 80 ? "default" : "destructive"}>
                    {row.original.attendanceRate.toFixed(1)}%
                </Badge>
            ),
        },
        {
            accessorKey: "events",
            header: "Events",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
                <span className="font-mono">{row.original.events.length}</span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: ClassroomAttendance } }) => (
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
                    <AttendanceStats
                        events={attendanceEvents}
                        records={attendanceRecords}
                        studentAttendance={studentAttendance}
                        classroomAttendance={classroomAttendance}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-2">
                            <AttendanceStats
                                events={attendanceEvents}
                                records={attendanceRecords}
                                studentAttendance={studentAttendance}
                                classroomAttendance={classroomAttendance}
                            />
                        </div>
                    </details>
                </div>

                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Attendance Management</h1>
                        <p className="text-muted-foreground">Track and manage student attendance across all classes</p>
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
                        <Button onClick={() => setIsCreateEventDialogOpen(true)}>
                            <RiAddLine size={16} />
                            Create Event
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="records">Records</TabsTrigger>
                        <TabsTrigger value="students">Students</TabsTrigger>
                        <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={attendanceEvents}
                                    columns={eventsColumns}
                                    searchKey="title"
                                    searchPlaceholder="Search events..."
                                    onDataChange={setAttendanceEvents}
                                    filters={[
                                        {
                                            key: "status",
                                            label: "Status",
                                            options: [
                                                { label: "Scheduled", value: "scheduled" },
                                                { label: "Ongoing", value: "ongoing" },
                                                { label: "Completed", value: "completed" },
                                                { label: "Cancelled", value: "cancelled" },
                                            ]
                                        },
                                        {
                                            key: "className",
                                            label: "Class",
                                            options: [
                                                { label: "1ère AS Sciences", value: "1ère AS Sciences" },
                                                { label: "1ère AS Lettres", value: "1ère AS Lettres" },
                                                { label: "2ème AS Sciences", value: "2ème AS Sciences" },
                                                { label: "2ème AS Lettres", value: "2ème AS Lettres" },
                                                { label: "3ème AS Sciences", value: "3ème AS Sciences" },
                                                { label: "3ème AS Lettres", value: "3ème AS Lettres" },
                                                { label: "Terminal Sciences", value: "Terminal Sciences" },
                                                { label: "Terminal Lettres", value: "Terminal Lettres" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="records" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={attendanceRecords}
                                    columns={recordsColumns}
                                    searchKey="studentName"
                                    searchPlaceholder="Search students..."
                                    filters={[
                                        {
                                            key: "status",
                                            label: "Status",
                                            options: [
                                                { label: "Present", value: "present" },
                                                { label: "Absent", value: "absent" },
                                                { label: "Late", value: "late" },
                                                { label: "Excused", value: "excused" },
                                            ]
                                        },
                                        {
                                            key: "className",
                                            label: "Class",
                                            options: [
                                                { label: "1ère AS Sciences", value: "1ère AS Sciences" },
                                                { label: "1ère AS Lettres", value: "1ère AS Lettres" },
                                                { label: "2ème AS Sciences", value: "2ème AS Sciences" },
                                                { label: "2ème AS Lettres", value: "2ème AS Lettres" },
                                                { label: "3ème AS Sciences", value: "3ème AS Sciences" },
                                                { label: "3ème AS Lettres", value: "3ème AS Lettres" },
                                                { label: "Terminal Sciences", value: "Terminal Sciences" },
                                                { label: "Terminal Lettres", value: "Terminal Lettres" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Attendance Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={studentAttendance}
                                    columns={studentColumns}
                                    searchKey="studentName"
                                    searchPlaceholder="Search students..."
                                    filters={[
                                        {
                                            key: "className",
                                            label: "Class",
                                            options: [
                                                { label: "1ère AS Sciences", value: "1ère AS Sciences" },
                                                { label: "1ère AS Lettres", value: "1ère AS Lettres" },
                                                { label: "2ème AS Sciences", value: "2ème AS Sciences" },
                                                { label: "2ème AS Lettres", value: "2ème AS Lettres" },
                                                { label: "3ème AS Sciences", value: "3ème AS Sciences" },
                                                { label: "3ème AS Lettres", value: "3ème AS Lettres" },
                                                { label: "Terminal Sciences", value: "Terminal Sciences" },
                                                { label: "Terminal Lettres", value: "Terminal Lettres" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classrooms" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Classroom Attendance Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={classroomAttendance}
                                    columns={classroomColumns}
                                    searchKey="className"
                                    searchPlaceholder="Search classrooms..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs */}
            <CreateEventDialog
                open={isCreateEventDialogOpen}
                onOpenChange={setIsCreateEventDialogOpen}
                onSubmit={handleCreateEvent}
            />

            {selectedRecord && (
                <UpdateAttendanceDialog
                    open={isUpdateAttendanceDialogOpen}
                    onOpenChange={setIsUpdateAttendanceDialogOpen}
                    record={selectedRecord}
                    onSubmit={handleUpdateAttendance}
                />
            )}

            {(selectedRecord || selectedEvent || selectedStudent) && (
                <AttendanceDetailsDialog
                    open={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    data={selectedRecord || selectedEvent || selectedStudent}
                />
            )}
        </div>
    );
}