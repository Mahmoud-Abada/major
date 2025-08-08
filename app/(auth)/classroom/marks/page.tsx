"use client";

import { MarksTable } from "@/components/marks/MarksTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useMarkOperations,
  useMarksManager,
  useMarkStatistics,
} from "@/hooks/useMarks";
import { Mark } from "@/types/classroom";
import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Minus,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const MARK_TYPES = [
  { value: "homework", label: "Homework", color: "bg-blue-100 text-blue-800" },
  { value: "quiz", label: "Quiz", color: "bg-green-100 text-green-800" },
  { value: "exam", label: "Exam", color: "bg-red-100 text-red-800" },
  {
    value: "participation",
    label: "Participation",
    color: "bg-purple-100 text-purple-800",
  },
];

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "French",
  "Arabic",
  "English",
  "History",
  "Geography",
  "Philosophy",
  "Computer Science",
  "Languages",
  "Literature",
];

export default function MarksPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarkType, setSelectedMarkType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  const { toast } = useToast();

  // Marks management
  const {
    marks,
    loading: marksLoading,
    error: marksError,
    refresh,
    updateParams,
  } = useMarksManager({
    studentId: selectedStudent || undefined,
    classroomId: selectedClassroom || undefined,
    markType: selectedMarkType || undefined,
  });

  const {
    createMark,
    updateMark,
    deleteMark,
    loading: operationsLoading,
  } = useMarkOperations();

  const stats = useMarkStatistics(marks);

  // Filter marks based on search and filters
  const filteredMarks = marks.filter((mark) => {
    const matchesSearch =
      mark.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.studentName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = !selectedSubject || mark.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  // Update params when filters change
  useEffect(() => {
    updateParams({
      studentId: selectedStudent || undefined,
      classroomId: selectedClassroom || undefined,
      markType: selectedMarkType || undefined,
    });
  }, [selectedStudent, selectedClassroom, selectedMarkType, updateParams]);

  // Mark actions
  const handleEditMark = (mark: Mark) => {
    // Open edit dialog/modal
    console.log("Edit mark:", mark);
  };

  const handleDeleteMark = async (markId: string) => {
    if (!confirm("Are you sure you want to delete this mark?")) return;

    try {
      await deleteMark(markId);
      toast({
        title: "Success",
        description: "Mark deleted successfully",
      });
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete mark",
        variant: "destructive",
      });
    }
  };

  const getMarkTypeInfo = (type: string) => {
    return MARK_TYPES.find((t) => t.value === type) || MARK_TYPES[0];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    if (score >= 40) return "outline";
    return "destructive";
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMarkType("");
    setSelectedSubject("");
    setSelectedStudent("");
    setSelectedClassroom("");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const calculatePercentage = (value: number, maxValue: number) => {
    return Math.round((value / maxValue) * 100);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marks & Grades</h1>
          <p className="text-muted-foreground">
            Manage student marks and track academic performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={marksLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${marksLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={() => (window.location.href = "/classroom/marks/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Mark
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
                    Total Marks
                  </p>
                  <p className="text-2xl font-bold">{stats.totalMarks}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <BookOpen className="h-6 w-6 text-blue-600" />
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
                    Average Score
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.averageScore.toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.recentTrend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : stats.recentTrend === "down" ? (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    ) : (
                      <Minus className="h-3 w-3 text-gray-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stats.recentTrend === "up"
                          ? "text-green-600"
                          : stats.recentTrend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {stats.recentTrend === "up"
                        ? "Improving"
                        : stats.recentTrend === "down"
                          ? "Declining"
                          : "Stable"}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <Award className="h-6 w-6 text-green-600" />
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
                    Passing Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.passingRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <Users className="h-6 w-6 text-purple-600" />
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
                    Highest Score
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.highestScore.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
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
                  placeholder="Search marks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={selectedMarkType}
              onValueChange={setSelectedMarkType}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {MARK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
          <TabsTrigger value="marks">
            All Marks ({filteredMarks.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Mark Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marks by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.byType).map(([type, data]) => {
                    const typeInfo = getMarkTypeInfo(type);
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {data.count} marks
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {data.average.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            average
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marks by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.bySubject)
                    .slice(0, 5)
                    .map(([subject, data]) => (
                      <div
                        key={subject}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="font-medium">{subject}</span>
                          <span className="text-sm text-muted-foreground">
                            {data.count} marks
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {data.average.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            average
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Marks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMarks
                  .sort((a, b) => (b.date || 0) - (a.date || 0))
                  .slice(0, 5)
                  .map((mark) => {
                    const percentage = calculatePercentage(
                      mark.value,
                      mark.maxValue,
                    );
                    const typeInfo = getMarkTypeInfo(mark.markType);

                    return (
                      <div
                        key={mark.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <div>
                            <p className="font-medium">{mark.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {mark.studentName} • {formatDate(mark.date)}
                            </p>
                            {mark.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {mark.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getScoreBadgeVariant(percentage)}>
                            {mark.value}/{mark.maxValue}
                          </Badge>
                          <p
                            className={`text-sm font-medium ${getScoreColor(percentage)}`}
                          >
                            {percentage}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="space-y-6">
          {marksError && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{marksError}</p>
                <Button variant="outline" onClick={refresh} className="mt-2">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          <MarksTable
            marks={filteredMarks}
            loading={marksLoading}
            onEdit={handleEditMark}
            onDelete={handleDeleteMark}
            showStudentColumn={true}
            showClassroomColumn={true}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Detailed analytics and reporting features coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
