/**
 * AttendanceTable Component
 * Specialized table for displaying attendance records with filtering and statistics
 */
"use client";
import { ProfileTable, TableColumn } from "@/components/profile/ProfileTable";
import { StatusBadge } from "@/components/profile/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { Attendance } from "@/store/types/api";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  Edit,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface AttendanceTableProps {
  attendance: Attendance[];
  onEdit?: (attendanceId: string) => void;
  onExport?: () => void;
  showActions?: boolean;
  showStudentColumn?: boolean;
  className?: string;
}

export function AttendanceTable({
  attendance,
  onEdit,
  onExport,
  showActions = true,
  showStudentColumn = true,
  className,
}: AttendanceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter attendance based on search and filter criteria
  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      !searchQuery ||
      record.studentName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;

    const matchesDate =
      !dateFilter ||
      new Date(record.date).toDateString() === dateFilter.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort attendance
  const sortedAttendance = [...filteredAttendance].sort((a, b) => {
    let aValue: any = a[sortField as keyof Attendance];
    let bValue: any = b[sortField as keyof Attendance];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "present":
        return "text-green-600";
      case "absent":
        return "text-red-600";
      case "late":
        return "text-yellow-600";
      case "excused":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "present":
        return "✓";
      case "absent":
        return "✗";
      case "late":
        return "⏰";
      case "excused":
        return "📋";
      default:
        return "?";
    }
  };

  const columns: TableColumn[] = [
    ...(showStudentColumn
      ? [
          {
            header: "Student",
            accessorKey: "studentName" as keyof Attendance,
            cell: (value: string) => (
              <div className="font-medium">{value || "Unknown Student"}</div>
            ),
          },
        ]
      : []),
    {
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort("date")}
          className="h-auto p-0 font-semibold"
        >
          Date
          {sortField === "date" &&
            (sortDirection === "asc" ? (
              <TrendingUp className="ml-1 h-3 w-3" />
            ) : (
              <TrendingDown className="ml-1 h-3 w-3" />
            ))}
        </Button>
      ),
      accessorKey: "date" as keyof Attendance,
      cell: (value: number) => (
        <div className="text-sm">{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort("status")}
          className="h-auto p-0 font-semibold"
        >
          Status
          {sortField === "status" &&
            (sortDirection === "asc" ? (
              <TrendingUp className="ml-1 h-3 w-3" />
            ) : (
              <TrendingDown className="ml-1 h-3 w-3" />
            ))}
        </Button>
      ),
      accessorKey: "status" as keyof Attendance,
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon(value)}</span>
          <StatusBadge status={value} />
        </div>
      ),
    },
    {
      header: "Notes",
      accessorKey: "notes" as keyof Attendance,
      cell: (value?: string) => (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {value || "-"}
        </div>
      ),
    },
    {
      header: "Time Recorded",
      accessorKey: "createdAt" as keyof Attendance,
      cell: (value?: number) => (
        <div className="text-xs text-muted-foreground">
          {value ? new Date(value).toLocaleString() : "-"}
        </div>
      ),
    },
  ];

  const calculateStats = () => {
    if (filteredAttendance.length === 0) return null;

    const statusCounts = filteredAttendance.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const presentCount = statusCounts.present || 0;
    const totalCount = filteredAttendance.length;
    const attendanceRate =
      totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

    return {
      ...statusCounts,
      total: totalCount,
      attendanceRate: attendanceRate.toFixed(1),
    };
  };

  const stats = calculateStats();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="excused">Excused</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-40">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateFilter ? format(dateFilter, "MMM dd") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
              {dateFilter && (
                <div className="p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateFilter(undefined)}
                    className="w-full"
                  >
                    Clear date filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {onExport && (
          <Button variant="outline" onClick={onExport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Records</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.attendanceRate}%
            </div>
            <div className="text-xs text-muted-foreground">Attendance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.present || 0}
            </div>
            <div className="text-xs text-muted-foreground">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.absent || 0}
            </div>
            <div className="text-xs text-muted-foreground">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.late || 0}
            </div>
            <div className="text-xs text-muted-foreground">Late</div>
          </div>
        </div>
      )}

      {/* Table */}
      <ProfileTable
        columns={columns}
        data={sortedAttendance}
        actions={
          showActions
            ? (row: Attendance) => (
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(row.id)}
                      title="Edit attendance"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            : undefined
        }
        emptyState={
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              No attendance records found
            </div>
            {searchQuery || filterStatus !== "all" || dateFilter ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setDateFilter(undefined);
                }}
              >
                Clear filters
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">
                Attendance records will appear here once they are recorded
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

// Attendance summary component
interface AttendanceSummaryProps {
  attendance: Attendance[];
  className?: string;
}

export function AttendanceSummary({
  attendance,
  className,
}: AttendanceSummaryProps) {
  if (attendance.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No attendance data available
      </div>
    );
  }

  const statusCounts = attendance.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalRecords = attendance.length;
  const presentCount = statusCounts.present || 0;
  const attendanceRate = (presentCount / totalRecords) * 100;

  // Calculate weekly attendance pattern
  const weeklyPattern = attendance.reduce(
    (acc, record) => {
      const date = new Date(record.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      if (!acc[dayName]) {
        acc[dayName] = { total: 0, present: 0 };
      }
      acc[dayName].total++;
      if (record.status === "present") {
        acc[dayName].present++;
      }
      return acc;
    },
    {} as Record<string, { total: number; present: number }>,
  );

  // Calculate monthly trend (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentAttendance = attendance.filter(
    (record) => new Date(record.date) >= thirtyDaysAgo,
  );

  const recentPresentCount = recentAttendance.filter(
    (record) => record.status === "present",
  ).length;

  const recentAttendanceRate =
    recentAttendance.length > 0
      ? (recentPresentCount / recentAttendance.length) * 100
      : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">{totalRecords}</div>
          <div className="text-sm text-muted-foreground">Total Sessions</div>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {attendanceRate.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Overall Rate</div>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {recentAttendanceRate.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Last 30 Days</div>
        </div>
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {statusCounts.late || 0}
          </div>
          <div className="text-sm text-muted-foreground">Times Late</div>
        </div>
      </div>

      {/* Status Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Attendance Distribution</h3>
        <div className="space-y-2">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percentage = (count / totalRecords) * 100;
            const color =
              status === "present"
                ? "bg-green-500"
                : status === "absent"
                  ? "bg-red-500"
                  : status === "late"
                    ? "bg-yellow-500"
                    : "bg-blue-500";

            return (
              <div
                key={status}
                className="flex items-center justify-between p-2 bg-muted/50 rounded"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm font-medium capitalize">
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Pattern */}
      {Object.keys(weeklyPattern).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Weekly Attendance Pattern
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => {
              const dayData = weeklyPattern[day];
              const dayRate = dayData
                ? (dayData.present / dayData.total) * 100
                : 0;

              return (
                <div
                  key={day}
                  className="text-center p-3 bg-muted/50 rounded-lg"
                >
                  <div className="text-xs font-medium mb-1">
                    {day.slice(0, 3)}
                  </div>
                  <div className="text-lg font-bold">{dayRate.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">
                    {dayData ? `${dayData.present}/${dayData.total}` : "0/0"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
