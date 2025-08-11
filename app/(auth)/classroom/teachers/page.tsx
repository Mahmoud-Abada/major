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
  Edit,
  Eye,
  GraduationCap,
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

// Mock teacher data - replace with actual API call
const mockTeachers = [
  {
    id: "1",
    name: "Dr. Ahmed Benali",
    email: "ahmed.benali@school.com",
    phone: "+213 555 0123",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    userType: "teacher",
    subjects: ["Mathematics", "Physics"],
    level: ["High School", "University"],
    experience: 8,
    status: "active",
    location: "Algiers",
    bio: "Experienced mathematics and physics teacher with PhD in Applied Mathematics",
    classroomsCount: 3,
    studentsCount: 45,
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
  },
  {
    id: "2",
    name: "Prof. Fatima Khelifi",
    email: "fatima.khelifi@school.com",
    phone: "+213 555 0124",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    userType: "teacher",
    subjects: ["French", "Literature"],
    level: ["Middle School", "High School"],
    experience: 12,
    status: "active",
    location: "Oran",
    bio: "French literature specialist with extensive teaching experience",
    classroomsCount: 2,
    studentsCount: 38,
    createdAt: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
  },
  {
    id: "3",
    name: "Dr. Karim Messaoudi",
    email: "karim.messaoudi@school.com",
    phone: "+213 555 0125",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: "teacher",
    subjects: ["Chemistry", "Biology"],
    level: ["High School", "University"],
    experience: 10,
    status: "inactive",
    location: "Constantine",
    bio: "Chemistry professor specializing in organic chemistry and biochemistry",
    classroomsCount: 1,
    studentsCount: 22,
    createdAt: Date.now() - 3 * 365 * 24 * 60 * 60 * 1000,
  },
];

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  userType: string;
  subjects: string[];
  level: string[];
  experience: number;
  status: "active" | "inactive";
  location: string;
  bio: string;
  classroomsCount: number;
  studentsCount: number;
  createdAt: number;
}

export default function TeachersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [loading] = useState(false);

  // Filter teachers based on search and active tab
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjects.some(subject =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        teacher.location.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTab = true;
      switch (activeTab) {
        case "all":
          matchesTab = true;
          break;
        case "active":
          matchesTab = teacher.status === "active";
          break;
        case "inactive":
          matchesTab = teacher.status === "inactive";
          break;
        case "math":
          matchesTab = teacher.subjects.some(subject =>
            subject.toLowerCase().includes("math")
          );
          break;
        case "sciences":
          matchesTab = teacher.subjects.some(subject =>
            ["physics", "chemistry", "biology"].some(science =>
              subject.toLowerCase().includes(science)
            )
          );
          break;
        case "languages":
          matchesTab = teacher.subjects.some(subject =>
            ["french", "english", "arabic", "literature"].some(lang =>
              subject.toLowerCase().includes(lang)
            )
          );
          break;
        case "experienced":
          matchesTab = teacher.experience >= 10;
          break;
      }

      return matchesSearch && matchesTab;
    });
  }, [teachers, searchQuery, activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeTeachers = teachers.filter(t => t.status === "active");
    const inactiveTeachers = teachers.filter(t => t.status === "inactive");
    const totalStudents = teachers.reduce((sum, t) => sum + t.studentsCount, 0);
    const totalClassrooms = teachers.reduce((sum, t) => sum + t.classroomsCount, 0);
    const experiencedTeachers = teachers.filter(t => t.experience >= 10);

    return {
      total: teachers.length,
      active: activeTeachers.length,
      inactive: inactiveTeachers.length,
      totalStudents,
      totalClassrooms,
      experienced: experiencedTeachers.length,
    };
  }, [teachers]);

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return stats.total;
      case "active":
        return stats.active;
      case "inactive":
        return stats.inactive;
      case "math":
        return teachers.filter(t =>
          t.subjects.some(s => s.toLowerCase().includes("math"))
        ).length;
      case "sciences":
        return teachers.filter(t =>
          t.subjects.some(s =>
            ["physics", "chemistry", "biology"].some(science =>
              s.toLowerCase().includes(science)
            )
          )
        ).length;
      case "languages":
        return teachers.filter(t =>
          t.subjects.some(s =>
            ["french", "english", "arabic", "literature"].some(lang =>
              s.toLowerCase().includes(lang)
            )
          )
        ).length;
      case "experienced":
        return stats.experienced;
      default:
        return 0;
    }
  };

  const handleViewTeacher = (id: string) => {
    router.push(`/classroom/teachers/${id}`);
  };

  const handleEditTeacher = (id: string) => {
    router.push(`/classroom/teachers/${id}/edit`);
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      // TODO: Implement actual delete API call
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teacher");
    }
  };

  const handleAddTeacher = () => {
    router.push("/classroom/users/create");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage your teaching staff and their assignments
          </p>
        </div>
        <Button onClick={handleAddTeacher}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalStudents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalClassrooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Experienced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.experienced}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
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
              toast.success("Teachers refreshed");
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({getTabCount("all")})</TabsTrigger>
          <TabsTrigger value="active">Active ({getTabCount("active")})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({getTabCount("inactive")})</TabsTrigger>
          <TabsTrigger value="math">Math ({getTabCount("math")})</TabsTrigger>
          <TabsTrigger value="sciences">Sciences ({getTabCount("sciences")})</TabsTrigger>
          <TabsTrigger value="languages">Languages ({getTabCount("languages")})</TabsTrigger>
          <TabsTrigger value="experienced">Experienced ({getTabCount("experienced")})</TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {["all", "active", "inactive", "math", "sciences", "languages", "experienced"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading teachers...</p>
              </div>
            ) : filteredTeachers.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeachers.map((teacher) => (
                  <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback>
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{teacher.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {teacher.experience} years experience
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                          {teacher.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {teacher.phone}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Subjects:</div>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{teacher.classroomsCount} classrooms</span>
                        <span>{teacher.studentsCount} students</span>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTeacher(teacher.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTeacher(teacher.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
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
                    No teachers found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : `No ${tab === "all" ? "" : tab + " "}teachers available`}
                  </p>
                  {!searchQuery && tab === "all" && (
                    <Button onClick={handleAddTeacher}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First Teacher
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