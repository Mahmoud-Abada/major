/**
 * AttendanceGrid Component
 * Enhanced grid for managing student attendance with bulk operations
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    Check,
    ChevronDown,
    Clock,
    Download,
    Filter,
    MoreHorizontal,
    Save,
    Search,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  grade: string;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

interface AttendanceGridProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  selectedDate: string;
  onAttendanceChange: (records: AttendanceRecord[]) => void;
  onSave: () => void;
  className?: string;
  isLoading?: boolean;
}

export function AttendanceGrid({
  students,
  attendanceRecords,
  selectedDate,
  onAttendanceChange,
  onSave,
  className,
  isLoading = false,
}: AttendanceGridProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<"present" | "absent" | "late" | "excused">("present");
  const [bulkNotes, setBulkNotes] = useState("");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;

    const record = attendanceRecords.find(
      (r) => r.studentId === student.id && r.date === selectedDate
    );
    return record?.status === statusFilter;
  });

  const getAttendanceRecord = (studentId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === selectedDate
    );
  };

  const updateAttendance = (studentId: string, status: AttendanceRecord["status"], notes?: string) => {
    const updatedRecords = attendanceRecords.filter(
      (r) => !(r.studentId === studentId && r.date === selectedDate)
    );
    
    updatedRecords.push({
      studentId,
      date: selectedDate,
      status,
      notes: notes || "",
    });

    onAttendanceChange(updatedRecords);
  };

  const handleBulkUpdate = () => {
    selectedStudents.forEach((studentId) => {
      updateAttendance(studentId, bulkStatus, bulkNotes);
    });
    setSelectedStudents([]);
    setBulkNotes("");
    setShowBulkDialog(false);
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return <Check className="h-3 w-3" />;
      case "absent":
        return <X className="h-3 w-3" />;
      case "late":
        return <Clock className="h-3 w-3" />;
      case "excused":
        return <Calendar className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStudentInitials = (student: Student) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  const attendanceStats = {
    present: attendanceRecords.filter((r) => r.date === selectedDate && r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.date === selectedDate && r.status === "absent").length,
    late: attendanceRecords.filter((r) => r.date === selectedDate && r.status === "late").length,
    excused: attendanceRecords.filter((r) => r.date === selectedDate && r.status === "excused").length,
  };

  const totalMarked = Object.values(attendanceStats).reduce((sum, count) => sum + count, 0);
  const attendanceRate = students.length > 0 ? ((attendanceStats.present + attendanceStats.late) / students.length) * 100 : 0;

  return (
    <div className={className}>
      {/* Header with Stats */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Attendance for {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50">
                {attendanceRate.toFixed(1)}% Present
              </Badge>
              <Button onClick={onSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
              <div className="text-sm text-muted-foreground">Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{attendanceStats.excused}</div>
              <div className="text-sm text-muted-foreground">Excused</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
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

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={filteredStudents.length === 0}
              >
                {selectedStudents.length === filteredStudents.length ? "Deselect All" : "Select All"}
              </Button>

              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedStudents.length === 0}
                  >
                    Bulk Update ({selectedStudents.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Update Attendance</DialogTitle>
                    <DialogDescription>
                      Update attendance status for {selectedStudents.length} selected students.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bulk-status">Status</Label>
                      <Select value={bulkStatus} onValueChange={(value: any) => setBulkStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bulk-notes">Notes (optional)</Label>
                      <Textarea
                        id="bulk-notes"
                        placeholder="Add notes for all selected students..."
                        value={bulkNotes}
                        onChange={(e) => setBulkNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBulkUpdate}>
                      Update {selectedStudents.length} Students
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Attendance
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredStudents.map((student, index) => {
            const record = getAttendanceRecord(student.id);
            const isSelected = selectedStudents.includes(student.id);

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "transition-all duration-200",
                  isSelected && "ring-2 ring-primary",
                  record?.status && "border-l-4",
                  record?.status === "present" && "border-l-green-500",
                  record?.status === "absent" && "border-l-red-500",
                  record?.status === "late" && "border-l-yellow-500",
                  record?.status === "excused" && "border-l-blue-500"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter((id) => id !== student.id));
                            }
                          }}
                        />

                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {getStudentInitials(student)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {student.firstName} {student.lastName}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              Grade {student.grade}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {student.email}
                          </p>
                          {record?.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              "{record.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {record?.status && (
                          <Badge
                            variant="outline"
                            className={cn("flex items-center gap-1", getStatusColor(record.status))}
                          >
                            {getStatusIcon(record.status)}
                            {record.status}
                          </Badge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {record?.status || "Mark"}
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateAttendance(student.id, "present")}
                            >
                              <Check className="h-4 w-4 mr-2 text-green-600" />
                              Present
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateAttendance(student.id, "absent")}
                            >
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              Absent
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateAttendance(student.id, "late")}
                            >
                              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                              Late
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateAttendance(student.id, "excused")}
                            >
                              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                              Excused
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No students found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}