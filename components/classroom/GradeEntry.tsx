/**
 * GradeEntry Component
 * Enhanced component for entering and managing student grades
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
import { Progress } from "@/components/ui/progress";
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
  Award,
  Calculator,
  Download,
  Edit,
  FileText,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Users,
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

interface Grade {
  id: string;
  studentId: string;
  subject: string;
  markType: "homework" | "quiz" | "exam" | "participation" | "project";
  value: number;
  maxValue: number;
  date: string;
  description?: string;
  isExempted?: boolean;
  weight?: number;
}

interface GradeEntryProps {
  students: Student[];
  grades: Grade[];
  subject: string;
  onGradesChange: (grades: Grade[]) => void;
  onSave: () => void;
  className?: string;
  isLoading?: boolean;
}

export function GradeEntry({
  students,
  grades,
  subject,
  onGradesChange,
  onSave,
  className,
  isLoading = false,
}: GradeEntryProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [markTypeFilter, setMarkTypeFilter] = useState<string>("all");
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showAddGradeDialog, setShowAddGradeDialog] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  // Form states
  const [newGrade, setNewGrade] = useState({
    markType: "homework" as Grade["markType"],
    value: "",
    maxValue: "20",
    description: "",
    date: new Date().toISOString().split("T")[0],
    weight: "1",
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStudentGrades = (studentId: string): Grade[] => {
    return grades.filter((g) => g.studentId === studentId);
  };

  const getStudentAverage = (studentId: string): number => {
    const studentGrades = getStudentGrades(studentId).filter(
      (g) => !g.isExempted,
    );
    if (studentGrades.length === 0) return 0;

    const totalWeightedScore = studentGrades.reduce((sum, grade) => {
      const percentage = (grade.value / grade.maxValue) * 100;
      const weight = grade.weight || 1;
      return sum + percentage * weight;
    }, 0);

    const totalWeight = studentGrades.reduce(
      (sum, grade) => sum + (grade.weight || 1),
      0,
    );
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBgColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100";
    if (percentage >= 80) return "bg-blue-100";
    if (percentage >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getMarkTypeColor = (markType: Grade["markType"]) => {
    switch (markType) {
      case "exam":
        return "bg-red-100 text-red-800";
      case "quiz":
        return "bg-blue-100 text-blue-800";
      case "homework":
        return "bg-green-100 text-green-800";
      case "participation":
        return "bg-purple-100 text-purple-800";
      case "project":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddGrade = (studentId: string) => {
    const grade: Grade = {
      id: `grade-${Date.now()}-${studentId}`,
      studentId,
      subject,
      markType: newGrade.markType,
      value: parseFloat(newGrade.value),
      maxValue: parseFloat(newGrade.maxValue),
      date: newGrade.date,
      description: newGrade.description,
      weight: parseFloat(newGrade.weight),
    };

    onGradesChange([...grades, grade]);
  };

  const handleBulkAddGrade = () => {
    const newGrades = selectedStudents.map((studentId) => ({
      id: `grade-${Date.now()}-${studentId}`,
      studentId,
      subject,
      markType: newGrade.markType,
      value: parseFloat(newGrade.value),
      maxValue: parseFloat(newGrade.maxValue),
      date: newGrade.date,
      description: newGrade.description,
      weight: parseFloat(newGrade.weight),
    }));

    onGradesChange([...grades, ...newGrades]);
    setSelectedStudents([]);
    setShowBulkDialog(false);
    resetForm();
  };

  const handleEditGrade = (grade: Grade) => {
    const updatedGrades = grades.map((g) => (g.id === grade.id ? grade : g));
    onGradesChange(updatedGrades);
    setEditingGrade(null);
  };

  const handleDeleteGrade = (gradeId: string) => {
    onGradesChange(grades.filter((g) => g.id !== gradeId));
  };

  const handleExemptStudent = (studentId: string, gradeId: string) => {
    const updatedGrades = grades.map((g) =>
      g.id === gradeId ? { ...g, isExempted: !g.isExempted } : g,
    );
    onGradesChange(updatedGrades);
  };

  const resetForm = () => {
    setNewGrade({
      markType: "homework",
      value: "",
      maxValue: "20",
      description: "",
      date: new Date().toISOString().split("T")[0],
      weight: "1",
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const getStudentInitials = (student: Student) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  const classAverage =
    students.length > 0
      ? students.reduce(
          (sum, student) => sum + getStudentAverage(student.id),
          0,
        ) / students.length
      : 0;

  return (
    <div className={className}>
      {/* Header with Stats */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Grades - {subject}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">
                Class Average: {classAverage.toFixed(1)}%
              </Badge>
              <Button onClick={onSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  grades.filter(
                    (g) => !g.isExempted && g.value / g.maxValue >= 0.9,
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Excellent (90%+)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  grades.filter(
                    (g) =>
                      !g.isExempted &&
                      g.value / g.maxValue >= 0.8 &&
                      g.value / g.maxValue < 0.9,
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Good (80-89%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  grades.filter(
                    (g) =>
                      !g.isExempted &&
                      g.value / g.maxValue >= 0.7 &&
                      g.value / g.maxValue < 0.8,
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Fair (70-79%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  grades.filter(
                    (g) => !g.isExempted && g.value / g.maxValue < 0.7,
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Needs Improvement
              </div>
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

            <Select value={markTypeFilter} onValueChange={setMarkTypeFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="exam">Exams</SelectItem>
                <SelectItem value="quiz">Quizzes</SelectItem>
                <SelectItem value="homework">Homework</SelectItem>
                <SelectItem value="participation">Participation</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={filteredStudents.length === 0}
              >
                {selectedStudents.length === filteredStudents.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>

              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedStudents.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Grade ({selectedStudents.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Grade to Multiple Students</DialogTitle>
                    <DialogDescription>
                      Add the same grade to {selectedStudents.length} selected
                      students.
                    </DialogDescription>
                  </DialogHeader>
                  <GradeForm grade={newGrade} onChange={setNewGrade} />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowBulkDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleBulkAddGrade}>
                      Add to {selectedStudents.length} Students
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
                    Export Grades
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calculator className="h-4 w-4 mr-2" />
                    Grade Calculator
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredStudents.map((student, index) => {
            const studentGrades = getStudentGrades(student.id);
            const average = getStudentAverage(student.id);
            const isSelected = selectedStudents.includes(student.id);

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "transition-all duration-200",
                    isSelected && "ring-2 ring-primary",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudents([
                                ...selectedStudents,
                                student.id,
                              ]);
                            } else {
                              setSelectedStudents(
                                selectedStudents.filter(
                                  (id) => id !== student.id,
                                ),
                              );
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
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={cn(
                              "text-lg font-bold",
                              getGradeColor(average),
                            )}
                          >
                            {average.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {studentGrades.length} grade
                            {studentGrades.length !== 1 ? "s" : ""}
                          </div>
                        </div>

                        <div className="w-20">
                          <Progress value={average} className="h-2" />
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Grade
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Add Grade for {student.firstName}{" "}
                                {student.lastName}
                              </DialogTitle>
                            </DialogHeader>
                            <GradeForm
                              grade={newGrade}
                              onChange={setNewGrade}
                            />
                            <DialogFooter>
                              <Button variant="outline" onClick={resetForm}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  handleAddGrade(student.id);
                                  resetForm();
                                }}
                              >
                                Add Grade
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Student Grades */}
                    {studentGrades.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Recent Grades
                        </h4>
                        <div className="grid gap-2">
                          {studentGrades.slice(-3).map((grade) => (
                            <div
                              key={grade.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    getMarkTypeColor(grade.markType),
                                  )}
                                >
                                  {grade.markType}
                                </Badge>
                                <span className="text-sm">
                                  {grade.description}
                                </span>
                                {grade.isExempted && (
                                  <Badge variant="outline" className="text-xs">
                                    Exempted
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "font-medium",
                                    grade.isExempted
                                      ? "text-muted-foreground"
                                      : getGradeColor(
                                          (grade.value / grade.maxValue) * 100,
                                        ),
                                  )}
                                >
                                  {grade.isExempted
                                    ? "EX"
                                    : `${grade.value}/${grade.maxValue}`}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => setEditingGrade(grade)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleExemptStudent(
                                          student.id,
                                          grade.id,
                                        )
                                      }
                                    >
                                      <Award className="h-4 w-4 mr-2" />
                                      {grade.isExempted
                                        ? "Remove Exemption"
                                        : "Exempt"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() =>
                                        handleDeleteGrade(grade.id)
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
              Try adjusting your search criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Grade Dialog */}
      {editingGrade && (
        <Dialog
          open={!!editingGrade}
          onOpenChange={() => setEditingGrade(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Grade</DialogTitle>
            </DialogHeader>
            <GradeForm
              grade={{
                markType: editingGrade.markType,
                value: editingGrade.value.toString(),
                maxValue: editingGrade.maxValue.toString(),
                description: editingGrade.description || "",
                date: editingGrade.date,
                weight: (editingGrade.weight || 1).toString(),
              }}
              onChange={(updatedGrade) => {
                setEditingGrade({
                  ...editingGrade,
                  markType: updatedGrade.markType,
                  value: parseFloat(updatedGrade.value),
                  maxValue: parseFloat(updatedGrade.maxValue),
                  description: updatedGrade.description,
                  date: updatedGrade.date,
                  weight: parseFloat(updatedGrade.weight),
                });
              }}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingGrade(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleEditGrade(editingGrade)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Grade Form Component
interface GradeFormProps {
  grade: {
    markType: Grade["markType"];
    value: string;
    maxValue: string;
    description: string;
    date: string;
    weight: string;
  };
  onChange: (grade: any) => void;
}

function GradeForm({ grade, onChange }: GradeFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="markType">Type</Label>
          <Select
            value={grade.markType}
            onValueChange={(value: Grade["markType"]) =>
              onChange({ ...grade, markType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homework">Homework</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="participation">Participation</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={grade.date}
            onChange={(e) => onChange({ ...grade, date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="value">Score</Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="0.5"
            value={grade.value}
            onChange={(e) => onChange({ ...grade, value: e.target.value })}
            placeholder="15"
          />
        </div>
        <div>
          <Label htmlFor="maxValue">Max Score</Label>
          <Input
            id="maxValue"
            type="number"
            min="1"
            value={grade.maxValue}
            onChange={(e) => onChange({ ...grade, maxValue: e.target.value })}
            placeholder="20"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            min="0.1"
            step="0.1"
            value={grade.weight}
            onChange={(e) => onChange({ ...grade, weight: e.target.value })}
            placeholder="1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="e.g., Chapter 5 Quiz, Midterm Exam..."
          value={grade.description}
          onChange={(e) => onChange({ ...grade, description: e.target.value })}
        />
      </div>
    </div>
  );
}
