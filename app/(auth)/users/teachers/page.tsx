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
import { BookOpen, Download, Plus, Search, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
// Empty teachers array - will be populated from API
const mockTeachers: any[] = [];

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

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  // Filter and sort teachers
  const filteredTeachers = useMemo(() => {
    let filtered = mockTeachers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.subjects.some((subject) =>
            subject.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter((teacher) =>
        teacher.subjects.includes(selectedSubject)
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((teacher) => teacher.status === selectedStatus);
    }

    // Sort teachers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case "experience":
          return b.yearsOfExperience - a.yearsOfExperience;
        case "employment":
          return b.employmentDate.getTime() - a.employmentDate.getTime();
        case "subjects":
          return a.subjects.length - b.subjects.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedSubject, selectedStatus, sortBy]);

  // Get teacher statistics
  const teacherStats = useMemo(() => {
    const allSubjects = mockTeachers.flatMap((t) => t.subjects);
    const subjectCounts = allSubjects.reduce((acc, subject) => {
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      total: mockTeachers.length,
      active: mockTeachers.filter((t) => t.status === "active").length,
      avgExperience: Math.round(
        mockTeachers.reduce((sum, t) => sum + t.yearsOfExperience, 0) /
        mockTeachers.length
      ),
      totalSubjects: Object.keys(subjectCounts).length,
      subjectCounts,
    };
    return stats;
  }, []);

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for teachers:`, selectedTeachers);
    setSelectedTeachers([]);
  };

  const allSubjects = Array.from(
    new Set(mockTeachers.flatMap((t) => t.subjects))
  ).sort();

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
            <BookOpen className="h-8 w-8" />
            Teacher Management
          </h1>
          <p className="text-muted-foreground">
            Manage all teachers in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Teachers
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/users/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{teacherStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Teachers</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {teacherStats.active}
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {teacherStats.avgExperience}
              </div>
              <p className="text-xs text-muted-foreground">Avg. Experience (years)</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {teacherStats.totalSubjects}
              </div>
              <p className="text-xs text-muted-foreground">Subjects Taught</p>
            </CardContent>
          </Card>
        </motion.div>
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
            placeholder="Search teachers by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {allSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
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
            <SelectItem value="experience">Experience</SelectItem>
            <SelectItem value="employment">Employment Date</SelectItem>
            <SelectItem value="subjects">Subject Count</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bulk Actions */}
      {selectedTeachers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-muted rounded-lg"
        >
          <span className="text-sm font-medium">
            {selectedTeachers.length} teacher(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("assign")}
            >
              Assign Classes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("schedule")}
            >
              Update Schedule
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
              onClick={() => setSelectedTeachers([])}
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Teachers Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredTeachers.map((teacher) => (
          <motion.div key={teacher.id} variants={itemVariants}>
            <UserCard
              user={teacher}
              isSelected={selectedTeachers.includes(teacher.id)}
              onSelect={() => handleSelectTeacher(teacher.id)}
              onView={(id) => (window.location.href = `/users/${id}`)}
              onEdit={(id) => (window.location.href = `/users/${id}/edit`)}
              onDelete={(id) => console.log("Delete teacher:", id)}
              showTeacherInfo={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
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
        Showing {filteredTeachers.length} of {mockTeachers.length} teachers
      </motion.div>
    </div>
  );
}