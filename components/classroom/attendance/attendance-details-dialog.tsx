"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  RiBarChartLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiInformationLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import type {
  AttendanceEvent,
  AttendanceRecord,
  StudentAttendance,
} from "./types";

interface AttendanceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AttendanceRecord | AttendanceEvent | StudentAttendance | null;
}

export function AttendanceDetailsDialog({
  open,
  onOpenChange,
  data,
}: AttendanceDetailsDialogProps) {
  if (!data) return null;

  // Determine the type of data
  const isRecord = "status" in data && "studentName" in data;
  const isEvent =
    "totalStudents" in data &&
    "attendanceRate" in data &&
    !("recentRecords" in data);
  const isStudentSummary = "recentRecords" in data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isRecord && <RiUserLine className="h-5 w-5" />}
            {isEvent && <RiCalendarLine className="h-5 w-5" />}
            {isStudentSummary && <RiBarChartLine className="h-5 w-5" />}
            {isRecord &&
              `Attendance Record - ${(data as AttendanceRecord).studentName}`}
            {isEvent && (data as AttendanceEvent).title}
            {isStudentSummary &&
              `Student Summary - ${(data as StudentAttendance).studentName}`}
          </DialogTitle>
          <DialogDescription>
            {isRecord && "Detailed attendance record information"}
            {isEvent && "Detailed event and attendance information"}
            {isStudentSummary && "Comprehensive student attendance summary"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Attendance Record Details */}
          {isRecord && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiInformationLine className="h-4 w-4" />
                    Record Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Student
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as AttendanceRecord).studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Class
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as AttendanceRecord).className}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {new Date(
                            (data as AttendanceRecord).date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge
                        variant={
                          (data as AttendanceRecord).status === "present"
                            ? "default"
                            : (data as AttendanceRecord).status === "late"
                              ? "secondary"
                              : (data as AttendanceRecord).status === "excused"
                                ? "outline"
                                : "destructive"
                        }
                        className="mt-1"
                      >
                        <div className="flex items-center gap-1">
                          {(data as AttendanceRecord).status === "present" && (
                            <RiCheckLine size={14} />
                          )}
                          {(data as AttendanceRecord).status === "absent" && (
                            <RiCloseLine size={14} />
                          )}
                          {(data as AttendanceRecord).status === "late" && (
                            <RiTimeLine size={14} />
                          )}
                          {(data as AttendanceRecord).status === "excused" && (
                            <RiUserLine size={14} />
                          )}
                          {(data as AttendanceRecord).status}
                        </div>
                      </Badge>
                    </div>
                  </div>

                  {((data as AttendanceRecord).timeIn ||
                    (data as AttendanceRecord).timeOut) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Time In
                        </p>
                        <p className="text-sm font-mono mt-1">
                          {(data as AttendanceRecord).timeIn || "Not recorded"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Time Out
                        </p>
                        <p className="text-sm font-mono mt-1">
                          {(data as AttendanceRecord).timeOut || "Not recorded"}
                        </p>
                      </div>
                    </div>
                  )}

                  {(data as AttendanceRecord).notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Notes
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                        {(data as AttendanceRecord).notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiUserLine className="h-4 w-4" />
                    Tracking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Marked By
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {(data as AttendanceRecord).markedBy}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Marked At
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {new Date(
                            (data as AttendanceRecord).markedAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {new Date(
                            (data as AttendanceRecord).updatedAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Event Details */}
          {isEvent && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiInformationLine className="h-4 w-4" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Class
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as AttendanceEvent).className}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Subject
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as AttendanceEvent).subjectName ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {new Date(
                            (data as AttendanceEvent).date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Time
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-mono">
                          {(data as AttendanceEvent).startTime} -{" "}
                          {(data as AttendanceEvent).endTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Teacher
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as AttendanceEvent).teacherName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge
                        variant={
                          (data as AttendanceEvent).status === "completed"
                            ? "default"
                            : (data as AttendanceEvent).status === "ongoing"
                              ? "secondary"
                              : (data as AttendanceEvent).status === "scheduled"
                                ? "outline"
                                : "destructive"
                        }
                        className="mt-1"
                      >
                        {(data as AttendanceEvent).status}
                      </Badge>
                    </div>
                  </div>

                  {(data as AttendanceEvent).description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                        {(data as AttendanceEvent).description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBarChartLine className="h-4 w-4" />
                    Attendance Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {(data as AttendanceEvent).presentCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">
                        {(data as AttendanceEvent).absentCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">
                        {(data as AttendanceEvent).lateCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {(data as AttendanceEvent).excusedCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Excused</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Attendance Rate</span>
                      <span className="font-medium">
                        {(data as AttendanceEvent).attendanceRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(data as AttendanceEvent).attendanceRate}
                      className="h-2"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Total Students: {(data as AttendanceEvent).totalStudents}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Student Summary Details */}
          {isStudentSummary && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiInformationLine className="h-4 w-4" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Student
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as StudentAttendance).studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Class
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as StudentAttendance).className}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {(data as StudentAttendance).totalDays}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Days
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {(data as StudentAttendance).presentDays}
                      </p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">
                        {(data as StudentAttendance).absentDays}
                      </p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">
                        {(data as StudentAttendance).lateDays}
                      </p>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Attendance Rate</span>
                      <span className="font-medium">
                        {(data as StudentAttendance).attendanceRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(data as StudentAttendance).attendanceRate}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBarChartLine className="h-4 w-4" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(data as StudentAttendance).monthlyStats.map((month) => (
                      <div key={month.month} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{month.month}</span>
                          <span className="font-medium">
                            {month.presentDays}/{month.totalDays} (
                            {month.attendanceRate.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress
                          value={month.attendanceRate}
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {(data as StudentAttendance).lastAttendance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <RiTimeLine className="h-4 w-4" />
                      Last Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(
                            (data as StudentAttendance).lastAttendance!.date,
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {
                            (data as StudentAttendance).lastAttendance!
                              .className
                          }
                        </p>
                      </div>
                      <Badge variant="outline">
                        {(data as StudentAttendance).lastAttendance!.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
