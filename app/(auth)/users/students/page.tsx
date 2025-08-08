"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCard } from "@/components/users/user-card";
import { motion } from "framer-motion";
import {
  Download,
  GraduationCap,
  Plus,
  Search,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
// Empty students array - will be populated from API
const mockStudents: any[] = [];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = mockStudents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by grade
    if (selectedGrade !== "all") {
      filtered = filtered.filter((student) => student.grade === selectedGrade);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (student) => student.status === selectedStatus,
      );
    }

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
          );
        case "studentId":
          return a.studentId.localeCompare(b.studentId);
        case "grade":
          return a.grade.localeCompare(b.grade);
        case "enrollment":
          return b.enrollmentDate.getTime() - a.enrollmentDate.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedGrade, selectedStatus, sortBy]);

  // Get student statistics
  const studentStats = useMemo(() => {
    const stats = {
      total: mockStudents.length,
      active: mockStudents.filter((s) => s.status === "active").length,
      byGrade: mockStudents.reduce(
        (acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
    return stats;
  }, []);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for students:`, selectedStudents);
    setSelectedStudents([]);
  };

  const grades = Array.from(new Set(mockStudents.map((s) => s.grade))).sort();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Student Management
          </h1>
          <p className="text-muted-foreground">
            Manage all students in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Students
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/users/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{studentStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {studentStats.active}
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </motion.div>
        {Object.entries(studentStats.byGrade).map(([grade, count]) => (
          <motion.div key={grade} variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <p className="text-xs text-muted-foreground">Grade {grade}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name, email, or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="studentId">Student ID</SelectItem>
            <SelectItem value="grade">Grade</SelectItem>
            <SelectItem value="enrollment">Enrollment Date</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-muted rounded-lg"
        >
          <span className="text-sm font-medium">
            {selectedStudents.length} student(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("promote")}
            >
              Promote Grade
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("transfer")}
            >
              Transfer Class
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("export")}
            >
              Export Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedStudents([])}
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Students Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredStudents.map((student) => (
          <motion.div key={student.id} variants={itemVariants}>
            <UserCard
              user={student}
              isSelected={selectedStudents.includes(student.id)}
              onSelect={() => handleSelectStudent(student.id)}
              onView={(id) => (window.location.href = `/users/${id}`)}
              onEdit={(id) => (window.location.href = `/users/${id}/edit`)}
              onDelete={(id) => console.log("Delete student:", id)}
              showStudentInfo={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No students found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Results Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-muted-foreground"
      >
        Showing {filteredStudents.length} of {mockStudents.length} students
      </motion.div>
    </div>
  );
}
