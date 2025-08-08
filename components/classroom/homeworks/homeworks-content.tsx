"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RiAddLine,
  RiAlarmWarningLine,
  RiBookLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiFileExcel2Line,
  RiPrinterLine,
  RiStarLine,
  RiTimeLine,
} from "@remixicon/react";
import { useState } from "react";
import { CreateHomeworkDialog } from "./create-homework-dialog";
import { HomeworkDetailsDialog } from "./homework-details-dialog";
import { HomeworkStats } from "./homework-stats";
import {
  mockClassHomeworkOverview,
  mockHomeworks,
  mockHomeworkSubmissions,
  mockStudentHomeworkSummary,
} from "./mock-data";
import type {
  ClassHomeworkOverview,
  Homework,
  HomeworkSubmission,
  StudentHomeworkSummary,
} from "./types";
import { UpdateHomeworkDialog } from "./update-homework-dialog";

export default function HomeworksContent() {
  const [homeworks, setHomeworks] = useState<Homework[]>(mockHomeworks);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(
    mockHomeworkSubmissions,
  );
  const [studentSummaries, setStudentSummaries] = useState<
    StudentHomeworkSummary[]
  >(mockStudentHomeworkSummary);
  const [classOverviews, setClassOverviews] = useState<ClassHomeworkOverview[]>(
    mockClassHomeworkOverview,
  );

  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    null,
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<HomeworkSubmission | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentHomeworkSummary | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("homeworks");

  const handleCreateHomework = (newHomework: Omit<Homework, "id">) => {
    const homework: Homework = {
      ...newHomework,
      id: `homework_${Date.now()}`,
    };
    setHomeworks([homework, ...homeworks]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateHomework = (updatedHomework: Homework) => {
    setHomeworks(
      homeworks.map((hw) =>
        hw.id === updatedHomework.id ? updatedHomework : hw,
      ),
    );
    setIsUpdateDialogOpen(false);
    setSelectedHomework(null);
  };

  const handleDeleteHomework = (homeworkId: string) => {
    setHomeworks(homeworks.filter((hw) => hw.id !== homeworkId));
  };

  const handleViewDetails = (
    item: Homework | HomeworkSubmission | StudentHomeworkSummary,
  ) => {
    if ("title" in item && "subject" in item) {
      setSelectedHomework(item as Homework);
    } else if ("homeworkId" in item && "studentName" in item) {
      setSelectedSubmission(item as HomeworkSubmission);
    } else {
      setSelectedStudent(item as StudentHomeworkSummary);
    }
    setIsDetailsDialogOpen(true);
  };

  const handleEditHomework = (homework: Homework) => {
    setSelectedHomework(homework);
    setIsUpdateDialogOpen(true);
  };

  // Column definitions for homeworks table
  const homeworksColumns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: { row: { original: Homework } }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.className}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }: { row: { original: Homework } }) => (
        <Badge variant="outline">{row.original.subject}</Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: { original: Homework } }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }: { row: { original: Homework } }) => (
        <Badge
          variant={
            row.original.priority === "urgent"
              ? "destructive"
              : row.original.priority === "high"
                ? "default"
                : row.original.priority === "medium"
                  ? "secondary"
                  : "outline"
          }
        >
          <div className="flex items-center gap-1">
            {row.original.priority === "urgent" && (
              <RiAlarmWarningLine size={12} />
            )}
            {row.original.priority === "high" && <RiStarLine size={12} />}
            {row.original.priority}
          </div>
        </Badge>
      ),
    },
    {
      accessorKey: "assignedDate",
      header: "Assigned",
      cell: ({ row }: { row: { original: Homework } }) => (
        <span className="text-sm">
          {new Date(row.original.assignedDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: { row: { original: Homework } }) => {
        const dueDate = new Date(row.original.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && row.original.status !== "completed";
        const isDueSoon =
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 2;

        return (
          <div className="flex items-center gap-2">
            <RiCalendarLine size={16} className="text-muted-foreground" />
            <span
              className={`text-sm ${
                isOverdue
                  ? "text-red-600 font-medium"
                  : isDueSoon
                    ? "text-orange-600 font-medium"
                    : ""
              }`}
            >
              {dueDate.toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Homework } }) => (
        <Badge
          variant={
            row.original.status === "completed"
              ? "default"
              : row.original.status === "overdue"
                ? "destructive"
                : row.original.status === "in_progress"
                  ? "secondary"
                  : row.original.status === "assigned"
                    ? "outline"
                    : "secondary"
          }
        >
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "teacherName",
      header: "Teacher",
      cell: ({ row }: { row: { original: Homework } }) => (
        <span className="text-sm">{row.original.teacherName}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Homework } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            <RiEyeLine size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditHomework(row.original)}
          >
            <RiEditLine size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteHomework(row.original.id)}
          >
            <RiDeleteBinLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Column definitions for submissions table
  const submissionsColumns = [
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) => {
        const homework = homeworks.find(
          (h) => h.id === row.original.homeworkId,
        );
        return (
          <div>
            <div className="font-medium">{row.original.studentName}</div>
            <div className="text-sm text-muted-foreground">
              {homework?.title}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "homeworkId",
      header: "Subject",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) => {
        const homework = homeworks.find(
          (h) => h.id === row.original.homeworkId,
        );
        return <Badge variant="outline">{homework?.subject}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) => (
        <Badge
          variant={
            row.original.status === "graded"
              ? "default"
              : row.original.status === "submitted"
                ? "secondary"
                : row.original.status === "late"
                  ? "destructive"
                  : row.original.status === "returned"
                    ? "outline"
                    : "secondary"
          }
        >
          <div className="flex items-center gap-1">
            {row.original.status === "graded" && <RiCheckLine size={14} />}
            {row.original.status === "not_submitted" && (
              <RiCloseLine size={14} />
            )}
            {row.original.isLate && <RiTimeLine size={14} />}
            {row.original.status.replace("_", " ")}
          </div>
        </Badge>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) => (
        <span className="text-sm">
          {row.original.submittedAt
            ? new Date(row.original.submittedAt).toLocaleDateString()
            : "Not submitted"}
        </span>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) => {
        const homework = homeworks.find(
          (h) => h.id === row.original.homeworkId,
        );
        return (
          <div className="text-sm font-mono">
            {row.original.grade !== undefined
              ? `${row.original.grade}/${homework?.totalMarks || "?"}`
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "isLate",
      header: "Late",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) =>
        row.original.isLate ? (
          <Badge variant="destructive" className="text-xs">
            {row.original.daysLate} day{row.original.daysLate !== 1 ? "s" : ""}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">On time</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: HomeworkSubmission } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            <RiEyeLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Column definitions for student summaries table
  const studentColumns = [
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <div>
          <div className="font-medium">{row.original.studentName}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.className}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalHomeworks",
      header: "Total",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <span className="font-mono">{row.original.totalHomeworks}</span>
      ),
    },
    {
      accessorKey: "submittedCount",
      header: "Submitted",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-green-600">
            {row.original.submittedCount}
          </span>
          <RiCheckLine size={16} className="text-green-600" />
        </div>
      ),
    },
    {
      accessorKey: "lateCount",
      header: "Late",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-orange-600">
            {row.original.lateCount}
          </span>
          <RiTimeLine size={16} className="text-orange-600" />
        </div>
      ),
    },
    {
      accessorKey: "notSubmittedCount",
      header: "Missing",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-red-600">
            {row.original.notSubmittedCount}
          </span>
          <RiCloseLine size={16} className="text-red-600" />
        </div>
      ),
    },
    {
      accessorKey: "submissionRate",
      header: "Rate",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <Badge
          variant={
            row.original.submissionRate >= 80 ? "default" : "destructive"
          }
        >
          {row.original.submissionRate.toFixed(1)}%
        </Badge>
      ),
    },
    {
      accessorKey: "averageGrade",
      header: "Avg Grade",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <span className="font-mono">
          {row.original.averageGrade
            ? row.original.averageGrade.toFixed(1)
            : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: StudentHomeworkSummary } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            <RiEyeLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Column definitions for class overviews table
  const classColumns = [
    {
      accessorKey: "className",
      header: "Class",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <div className="font-medium">{row.original.className}</div>
      ),
    },
    {
      accessorKey: "totalHomeworks",
      header: "Total",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <span className="font-mono">{row.original.totalHomeworks}</span>
      ),
    },
    {
      accessorKey: "activeHomeworks",
      header: "Active",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-blue-600">
            {row.original.activeHomeworks}
          </span>
          <RiBookLine size={16} className="text-blue-600" />
        </div>
      ),
    },
    {
      accessorKey: "completedHomeworks",
      header: "Completed",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-green-600">
            {row.original.completedHomeworks}
          </span>
          <RiCheckLine size={16} className="text-green-600" />
        </div>
      ),
    },
    {
      accessorKey: "overdueHomeworks",
      header: "Overdue",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-red-600">
            {row.original.overdueHomeworks}
          </span>
          <RiAlarmWarningLine size={16} className="text-red-600" />
        </div>
      ),
    },
    {
      accessorKey: "averageSubmissionRate",
      header: "Submission Rate",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <Badge
          variant={
            row.original.averageSubmissionRate >= 80 ? "default" : "destructive"
          }
        >
          {row.original.averageSubmissionRate.toFixed(1)}%
        </Badge>
      ),
    },
    {
      accessorKey: "averageGrade",
      header: "Avg Grade",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <span className="font-mono">
          {row.original.averageGrade
            ? row.original.averageGrade.toFixed(1)
            : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: ClassHomeworkOverview } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original as any)}
          >
            <RiEyeLine size={16} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="flex flex-1 gap-4 p-2">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-4 space-y-4">
          <HomeworkStats
            homeworks={homeworks}
            submissions={submissions}
            studentSummaries={studentSummaries}
            classOverviews={classOverviews}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Stats - Collapsible */}
        <div className="lg:hidden mb-4">
          <details className="group">
            <summary className="flex items-center justify-between p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
              <span className="font-medium">Statistics</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-2">
              <HomeworkStats
                homeworks={homeworks}
                submissions={submissions}
                studentSummaries={studentSummaries}
                classOverviews={classOverviews}
              />
            </div>
          </details>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Homework Management</h1>
            <p className="text-muted-foreground">
              Assign, track, and grade student homework assignments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RiFileExcel2Line size={16} />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RiPrinterLine size={16} />
              Print
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <RiAddLine size={16} />
              Create Homework
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homeworks">Homeworks</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="homeworks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Homeworks</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={homeworks}
                  columns={homeworksColumns}
                  searchKey="title"
                  searchPlaceholder="Search homeworks..."
                  onDataChange={setHomeworks}
                  filters={[
                    {
                      key: "subject",
                      label: "Subject",
                      options: [
                        { label: "Mathematics", value: "Mathematics" },
                        { label: "Physics", value: "Physics" },
                        { label: "Chemistry", value: "Chemistry" },
                        { label: "Biology", value: "Biology" },
                        { label: "Arabic", value: "Arabic" },
                        { label: "French", value: "French" },
                        { label: "English", value: "English" },
                        { label: "History", value: "History" },
                        { label: "Geography", value: "Geography" },
                      ],
                    },
                    {
                      key: "type",
                      label: "Type",
                      options: [
                        { label: "Assignment", value: "assignment" },
                        { label: "Project", value: "project" },
                        { label: "Reading", value: "reading" },
                        { label: "Exercise", value: "exercise" },
                        { label: "Research", value: "research" },
                      ],
                    },
                    {
                      key: "priority",
                      label: "Priority",
                      options: [
                        { label: "Urgent", value: "urgent" },
                        { label: "High", value: "high" },
                        { label: "Medium", value: "medium" },
                        { label: "Low", value: "low" },
                      ],
                    },
                    {
                      key: "status",
                      label: "Status",
                      options: [
                        { label: "Draft", value: "draft" },
                        { label: "Assigned", value: "assigned" },
                        { label: "In Progress", value: "in_progress" },
                        { label: "Completed", value: "completed" },
                        { label: "Overdue", value: "overdue" },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Homework Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={submissions}
                  columns={submissionsColumns}
                  searchKey="studentName"
                  searchPlaceholder="Search students..."
                  filters={[
                    {
                      key: "status",
                      label: "Status",
                      options: [
                        { label: "Not Submitted", value: "not_submitted" },
                        { label: "Submitted", value: "submitted" },
                        { label: "Late", value: "late" },
                        { label: "Graded", value: "graded" },
                        { label: "Returned", value: "returned" },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={studentSummaries}
                  columns={studentColumns}
                  searchKey="studentName"
                  searchPlaceholder="Search students..."
                  filters={[
                    {
                      key: "className",
                      label: "Class",
                      options: [
                        {
                          label: "1ère AS Sciences",
                          value: "1ère AS Sciences",
                        },
                        { label: "1ère AS Lettres", value: "1ère AS Lettres" },
                        {
                          label: "2ème AS Sciences",
                          value: "2ème AS Sciences",
                        },
                        { label: "2ème AS Lettres", value: "2ème AS Lettres" },
                        {
                          label: "3ème AS Sciences",
                          value: "3ème AS Sciences",
                        },
                        { label: "3ème AS Lettres", value: "3ème AS Lettres" },
                        {
                          label: "Terminal Sciences",
                          value: "Terminal Sciences",
                        },
                        {
                          label: "Terminal Lettres",
                          value: "Terminal Lettres",
                        },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={classOverviews}
                  columns={classColumns}
                  searchKey="className"
                  searchPlaceholder="Search classes..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateHomeworkDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateHomework}
      />

      {selectedHomework && (
        <UpdateHomeworkDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          homework={selectedHomework}
          onSubmit={handleUpdateHomework}
        />
      )}

      {(selectedHomework || selectedSubmission || selectedStudent) && (
        <HomeworkDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          data={selectedHomework || selectedSubmission || selectedStudent}
        />
      )}
    </div>
  );
}
