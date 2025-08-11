"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Mock student data - replace with actual API call
const mockStudents = [
  {
    id: "1",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@student.com",
    phone: "+213 555 1001",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    userType: "student",
    grade: "High School",
    level: "12th Grade",
    status: "active",
    gpa: 16.5,
    attendance: 95,
    classroomsCount: 4,
    groupsCount: 2,
    location: "Algiers",
    dateOfBirth: "2005-03-15",
    enrollmentDate: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    createdAt: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
  },
  {
    id: "2",
    name: "Mohamed Benali",
    email: "mohamed.benali@student.com",
    phone: "+213 555 1002",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    userType: "student",
    grade: "University",
    level: "1st Year",
    status: "active",
    gpa: 14.2,
    attendance: 88,
    classroomsCount: 3,
    groupsCount: 1,
    location: "Oran",
    dateOfBirth: "2003-07-22",
    enrollmentDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
    subjects: ["Computer Science", "Mathematics", "English"],
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
  },
  {
    id: "3",
    name: "Amina Khelifi",
    email: "amina.khelifi@student.com",
    phone: "+213 555 1003",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    userType: "student",
    grade: "High School",
    level: "11th Grade",
    status: "inactive",
    gpa: 15.8,
    attendance: 92,
    classroomsCount: 5,
    groupsCount: 3,
    location: "Constantine",
    dateOfBirth: "2006-11-08",
    enrollmentDate: Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000,
    subjects: ["Literature", "French", "History"],
    createdAt: Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000,
  },
];

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  userType: string;
  grade: string;
  level: string;
  status: "active" | "inactive";
  gpa: number;
  attendance: number;
  classroomsCount: number;
  groupsCount: number;
  location: string;
  dateOfBirth: string;
  enrollmentDate: number;
  subjects: string[];
  createdAt: number;
}

export default function StudentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [students] = useState<Student[]>(mockStudents);
  const [loading] = useState(false);

  // Filter students based on search and active tab
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.subjects.some(subject =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        student.location.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTab = true;
      switch (activeTab) {
        case "all":
          matchesTab = true;
          break;
        case "active":
          matchesTab = student.status === "active";
          break;
        case "inactive":
          matchesTab = student.status === "inactive";
          break;
        case "high-school":
          matchesTab = student.grade === "High School";
          break;
        case "university":
          matchesTab = student.grade === "University";
          break;
        case "sciences":
          matchesTab = student.subjects.some(subject =>
            ["mathematics", "physics", "chemistry", "biology", "computer science"].some(science =>
              subject.toLowerCase().includes(science)
            )
          );
          break;
        case "literature":
          matchesTab = student.subjects.some(subject =>
            ["literature", "french", "english", "arabic", "history"].some(lit =>
              subject.toLowerCase().includes(lit)
            )
          );
          break;
        case "high-performers":
          matchesTab = student.gpa >= 15;
          break;
      }

      return matchesSearch && matchesTab;
    });
  }, [students, searchQuery, activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeStudents = students.filter(s => s.status === "active");
    const inactiveStudents = students.filter(s => s.status === "inactive");
    const highSchoolStudents = students.filter(s => s.grade === "High School");
    const universityStudents = students.filter(s => s.grade === "University");
    const highPerformers = students.filter(s => s.gpa >= 15);
    const averageGPA = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;
    const averageAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;

    return {
      total: students.length,
      active: activeStudents.length,
      inactive: inactiveStudents.length,
      highSchool: highSchoolStudents.length,
      university: universityStudents.length,
      highPerformers: highPerformers.length,
      averageGPA: Math.round(averageGPA * 10) / 10,
      averageAttendance: Math.round(averageAttendance),
    };
  }, [students]);

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return stats.total;
      case "active":
        return stats.active;
      case "inactive":
        return stats.inactive;
      case "high-school":
        return stats.highSchool;
      case "university":
        return stats.university;
      case "sciences":
        return students.filter(s =>
          s.subjects.some(sub =>
            ["mathematics", "physics", "chemistry", "biology", "computer science"].some(science =>
              sub.toLowerCase().includes(science)
            )
          )
        ).length;
      case "literature":
        return students.filter(s =>
          s.subjects.some(sub =>
            ["literature", "french", "english", "arabic", "history"].some(lit =>
              sub.toLowerCase().includes(lit)
            )
          )
        ).length;
      case "high-performers":
        return stats.highPerformers;
      default:
        return 0;
    }
  };

  const handleViewStudent = (id: string) => {
    router.push(`/classroom/students/${id}`);
  };

  const handleEditStudent = (id: string) => {
    router.push(`/classroom/students/${id}/edit`);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      // TODO: Implement actual delete API call
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  const handleAddStudent = () => {
    router.push("/classroom/users/create");
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage your students and track their progress
          </p>
        </div>
        <Button onClick={handleAddStudent}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High School</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.highSchool}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">University</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.university}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.highPerformers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.averageGPA}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {stats.averageAttendance}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement refresh functionality
              toast.success("Students refreshed");
            }}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="all">All ({getTabCount("all")})</TabsTrigger>
          <TabsTrigger value="active">Active ({getTabCount("active")})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({getTabCount("inactive")})</TabsTrigger>
          <TabsTrigger value="high-school">High School ({getTabCount("high-school")})</TabsTrigger>
          <TabsTrigger value="university">University ({getTabCount("university")})</TabsTrigger>
          <TabsTrigger value="sciences">Sciences ({getTabCount("sciences")})</TabsTrigger>
          <TabsTrigger value="literature">Literature ({getTabCount("literature")})</TabsTrigger>
          <TabsTrigger value="high-performers">Top Performers ({getTabCount("high-performers")})</TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {["all", "active", "inactive", "high-school", "university", "sciences", "literature", "high-performers"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading students...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {student.grade} - {student.level}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {student.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Age: {calculateAge(student.dateOfBirth)} years
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Subjects:</div>
                        <div className="flex flex-wrap gap-1">
                          {student.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-lg">{student.gpa}</div>
                          <div className="text-muted-foreground">GPA</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{student.attendance}%</div>
                          <div className="text-muted-foreground">Attendance</div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{student.classroomsCount} classrooms</span>
                        <span>{student.groupsCount} groups</span>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewStudent(student.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudent(student.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No students found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : `No ${tab === "all" ? "" : tab + " "}students available`}
                  </p>
                  {!searchQuery && tab === "all" && (
                    <Button onClick={handleAddStudent}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First Student
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}