"use client";

import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { classroomApi, type Attendance } from "@/services/classroom-api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Shield,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const ATTENDANCE_STATUS = [
  {
    value: "present",
    label: "Present",
    color: "bg-green-100 text-green-800",
    icon: UserCheck,
  },
  {
    value: "absent",
    label: "Absent",
    color: "bg-red-100 text-red-800",
    icon: UserX,
  },
  {
    value: "late",
    label: "Late",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  {
    value: "excused",
    label: "Excused",
    color: "bg-blue-100 text-blue-800",
    icon: Shield,
  },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // State management
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  // Calculate statistics
  const stats = {
    totalSessions: attendance.length,
    presentCount: attendance.filter(a => a.status === "present").length,
    absentCount: attendance.filter(a => a.status === "absent").length,
    lateCount: attendance.filter(a => a.status === "late").length,
    excusedCount: attendance.filter(a => a.status === "excused").length,
    attendanceRate: attendance.length > 0
      ? ((attendance.filter(a => a.status === "present" || a.status === "late" || a.status === "excused").length / attendance.length) * 100)
      : 0,
    punctualityRate: attendance.length > 0
      ? ((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
      : 0,
    recentTrend: "stable" as "improving" | "declining" | "stable",
    byStudent: {} as Record<string, { present: number; absent: number; late: number; excused: number; rate: number }>,
    byDate: {} as Record<string, { present: number; absent: number; late: number; excused: number }>
  };

  // Calculate by student stats
  attendance.forEach(record => {
    const studentKey = record.studentName || record.student;
    if (!stats.byStudent[studentKey]) {
      stats.byStudent[studentKey] = { present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
    }
    stats.byStudent[studentKey][record.status]++;
  });

  // Calculate rates for each student
  Object.keys(stats.byStudent).forEach(student => {
    const studentData = stats.byStudent[student];
    const total = studentData.present + studentData.absent + studentData.late + studentData.excused;
    studentData.rate = total > 0 ? ((studentData.present + studentData.late + studentData.excused) / total) * 100 : 0;
  });

  // API functions
  const fetchAttendance = useCallback(async () => {
    if (!selectedClassroom || selectedClassroom === "all-classrooms") return;

    setAttendanceLoading(true);
    setAttendanceError(null);

    try {
      const response = await classroomApi.getClassroomAttendance({
        classroomId: selectedClassroom,
        pagination: { numItems: 100, cursor: null },
      });

      // Transform backend data to frontend format
      const transformedData: Attendance[] = response.data?.attendances?.map((item: any) => ({
        id: item._id || Math.random().toString(),
        student: item.attendance?.student || '',
        studentName: item.relation?.student?.name || `Student ${item.attendance?.student}`,
        classroom: selectedClassroom,
        event: item.attendance?.event,
        date: item.attendance?.presentTime || Date.now(),
        status: item.attendance?.isPresent ? 'present' : 'absent',
        notes: item.attendance?.note || item.attendance?.absenceReason,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })) || [];

      setAttendance(transformedData);
    } catch (error: any) {
      setAttendanceError(error.message || "Failed to fetch attendance");
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive",
      });
    } finally {
      setAttendanceLoading(false);
    }
  }, [selectedClassroom]);

  const fetchClassrooms = useCallback(async () => {
    try {
      const response = await classroomApi.getClassrooms({
        status: "notArchived",
        pagination: { numItems: 100, cursor: null },
      });
      setClassrooms(response.data);
    } catch (error: any) {
      console.error("Failed to fetch classrooms:", error);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Load classrooms on mount
  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  // Load attendance when classroom or date changes
  useEffect(() => {
    if (selectedClassroom) {
      fetchAttendance();
    }
  }, [fetchAttendance]);

  // Filter attendance based on search and filters
  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.student.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !selectedStatus || selectedStatus === "all-status" || record.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Attendance actions
  const handleStatusChange = async (
    attendanceId: string,
    newStatus: string,
  ) => {
    try {
      // Find the attendance record to get the eventId
      const attendanceRecord = attendance.find(a => a.id === attendanceId);
      if (!attendanceRecord?.event) {
        toast({
          title: "Error",
          description: "Cannot update attendance: missing event information",
          variant: "destructive",
        });
        return;
      }

      await classroomApi.updateStudentAttendance({
        attendanceId,
        attendanceData: {
          absenceReason: newStatus === 'absent' ? 'Status changed to absent' : '',
          attachements: [],
        },
        eventId: attendanceRecord.event,
      });

      toast({
        title: "Success",
        description: "Attendance updated successfully",
      });

      refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    return (
      ATTENDANCE_STATUS.find((s) => s.value === status) || ATTENDANCE_STATUS[0]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all-status");
    setSelectedClassroom("all-classrooms");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track and manage student attendance across all classrooms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={attendanceLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${attendanceLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={() =>
              (window.location.href = "/classroom/attendance/take")
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Attendance Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.attendanceRate.toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.recentTrend === "improving" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : stats.recentTrend === "declining" ? (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    ) : (
                      <Minus className="h-3 w-3 text-gray-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${stats.recentTrend === "improving"
                        ? "text-green-600"
                        : stats.recentTrend === "declining"
                          ? "text-red-600"
                          : "text-gray-600"
                        }`}
                    >
                      {stats.recentTrend === "improving"
                        ? "Improving"
                        : stats.recentTrend === "declining"
                          ? "Declining"
                          : "Stable"}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Present Today
                  </p>
                  <p className="text-2xl font-bold">{stats.presentCount}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Punctuality Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.punctualityRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                {ATTENDANCE_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedClassroom}
              onValueChange={setSelectedClassroom}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Classroom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classrooms">All Classrooms</SelectItem>
                {classrooms?.map((classroom) => (
                  <SelectItem key={classroom.id} value={classroom.id}>
                    {classroom.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(selectedDate, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                />
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">
            Records ({filteredAttendance.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ATTENDANCE_STATUS.map((status) => {
              const count = attendance.filter(
                (record) => record.status === status.value,
              ).length;
              const percentage =
                stats.totalSessions > 0
                  ? (count / stats.totalSessions) * 100
                  : 0;
              const Icon = status.icon;

              return (
                <motion.div
                  key={status.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {status.label}
                          </p>
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% of total
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-full ${status.color.replace("text-", "bg-").replace("-800", "-50")}`}
                        >
                          <Icon
                            className={`h-6 w-6 ${status.color.replace("bg-", "text-").replace("-100", "-600")}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendance.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {selectedClassroom
                        ? "No attendance records found for the selected filters"
                        : "Please select a classroom to view attendance records"
                      }
                    </p>
                  </div>
                ) : (
                  filteredAttendance
                    .sort((a, b) => b.date - a.date)
                    .slice(0, 10)
                    .map((record) => {
                      const statusInfo = getStatusInfo(record.status);
                      const Icon = statusInfo.icon;

                      return (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-full ${statusInfo.color.replace("text-", "bg-").replace("-800", "-50")}`}
                            >
                              <Icon
                                className={`h-4 w-4 ${statusInfo.color.replace("bg-", "text-").replace("-100", "-600")}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                {record.studentName ||
                                  `Student ${record.student}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(record.date)} at{" "}
                                {formatTime(record.date)}
                              </p>
                              {record.notes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {record.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          {attendanceError && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{attendanceError}</p>
                <Button variant="outline" onClick={refresh} className="mt-2">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          <AttendanceTable
            attendance={filteredAttendance}
            loading={attendanceLoading}
            onStatusChange={handleStatusChange}
            showStudentColumn={true}
            showClassroomColumn={true}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Student Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byStudent).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No attendance data available for analytics
                    </p>
                  </div>
                ) : (
                  Object.entries(stats.byStudent)
                    .sort(([, a], [, b]) => b.rate - a.rate)
                    .slice(0, 10)
                    .map(([student, data]) => (
                      <div
                        key={student}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div>
                            <p className="font-medium">{student}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.present +
                                data.late +
                                data.excused +
                                data.absent}{" "}
                              total sessions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${data.rate >= 90
                              ? "text-green-600"
                              : data.rate >= 75
                                ? "text-yellow-600"
                                : "text-red-600"
                              }`}
                          >
                            {data.rate.toFixed(1)}%
                          </p>
                          <div className="flex gap-1 text-xs text-muted-foreground">
                            <span className="text-green-600">
                              {data.present}P
                            </span>
                            <span className="text-yellow-600">{data.late}L</span>
                            <span className="text-red-600">{data.absent}A</span>
                            <span className="text-blue-600">{data.excused}E</span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
