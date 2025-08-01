import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  rollNumber: string;
  attendance: number;
  performance: number;
  status: string;
}

interface ClassStudentsProps {
  students: Student[];
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  averageAttendance: number;
  averagePerformance: number;
  onViewStudent?: (studentId: string) => void;
  onAddStudent?: () => void;
}

export function ClassStudents({
  students,
  totalStudents,
  maleCount,
  femaleCount,
  averageAttendance,
  averagePerformance,
  onViewStudent,
  onAddStudent,
}: ClassStudentsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns: TableColumn[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          {row.avatar && (
            <img
              src={row.avatar}
              alt={value}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    { header: "Roll Number", accessorKey: "rollNumber" },
    {
      header: "Attendance",
      accessorKey: "attendance",
      cell: (value) => {
        const getAttendanceColor = (attendance: number) => {
          if (attendance >= 90) return "text-green-600 font-semibold";
          if (attendance >= 75) return "text-blue-600 font-semibold";
          if (attendance >= 60) return "text-yellow-600 font-semibold";
          return "text-red-600 font-semibold";
        };

        return <span className={getAttendanceColor(value)}>{value}%</span>;
      },
    },
    {
      header: "Performance",
      accessorKey: "performance",
      cell: (value) => {
        const getPerformanceColor = (performance: number) => {
          if (performance >= 90) return "text-green-600 font-semibold";
          if (performance >= 75) return "text-blue-600 font-semibold";
          if (performance >= 60) return "text-yellow-600 font-semibold";
          return "text-red-600 font-semibold";
        };

        return <span className={getPerformanceColor(value)}>{value}%</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  // Calculate performance distribution
  const performanceRanges = {
    excellent: students.filter((s) => s.performance >= 90).length,
    good: students.filter((s) => s.performance >= 75 && s.performance < 90)
      .length,
    average: students.filter((s) => s.performance >= 60 && s.performance < 75)
      .length,
    needsImprovement: students.filter((s) => s.performance < 60).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Class Students</h3>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {onAddStudent && (
            <Button onClick={onAddStudent}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Students
            </div>
            <div className="text-2xl font-bold mt-1">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Gender Distribution
            </div>
            <div className="text-2xl font-bold mt-1">
              <span className="text-blue-600">{maleCount}</span> /{" "}
              <span className="text-pink-600">{femaleCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Avg. Attendance
            </div>
            <div className="text-2xl font-bold mt-1">{averageAttendance}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Avg. Performance
            </div>
            <div className="text-2xl font-bold mt-1">{averagePerformance}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-green-600">Excellent</div>
            <div className="text-2xl font-bold mt-1">
              {performanceRanges.excellent}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-blue-600">Good</div>
            <div className="text-2xl font-bold mt-1">
              {performanceRanges.good}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-yellow-600">Average</div>
            <div className="text-2xl font-bold mt-1">
              {performanceRanges.average}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-red-600">
              Needs Improvement
            </div>
            <div className="text-2xl font-bold mt-1">
              {performanceRanges.needsImprovement}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfileTable
        columns={columns}
        data={filteredStudents}
        actions={(row) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewStudent && onViewStudent(row.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        emptyState={
          searchQuery ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No students match your search
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students in this class</p>
              {onAddStudent && (
                <Button className="mt-4" size="sm" onClick={onAddStudent}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
          )
        }
      />
    </div>
  );
}
