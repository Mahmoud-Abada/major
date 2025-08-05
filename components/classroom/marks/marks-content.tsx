"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    RiAddLine,
    RiDeleteBinLine,
    RiEditLine,
    RiEyeLine,
    RiFileExcel2Line,
    RiPrinterLine
} from "@remixicon/react";
import { useState } from "react";
import { CreateMarkDialog } from "./create-mark-dialog";
import { MarkDetailsDialog } from "./mark-details-dialog";
import { MarksStats } from "./marks-stats";
import type { GroupMark, Mark, StudentMark } from "./types";
import { UpdateMarkDialog } from "./update-mark-dialog";
// Empty data arrays - will be populated from API
const mockMarks: any[] = [];
const mockStudentMarks: any[] = [];
const mockGroupMarks: any[] = [];

export default function MarksContent() {
    const [marks, setMarks] = useState<Mark[]>(mockMarks);
    const [studentMarks, setStudentMarks] = useState<StudentMark[]>(mockStudentMarks);
    const [groupMarks, setGroupMarks] = useState<GroupMark[]>(mockGroupMarks);
    const [selectedMark, setSelectedMark] = useState<Mark | null>(null);
    const [selectedStudentMark, setSelectedStudentMark] = useState<StudentMark | null>(null);
    const [selectedGroupMark, setSelectedGroupMark] = useState<GroupMark | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("marks");

    const handleCreateMark = (newMark: Omit<Mark, "id">) => {
        const mark: Mark = {
            ...newMark,
            id: `mark_${Date.now()}`,
        };
        setMarks([...marks, mark]);
        setIsCreateDialogOpen(false);
    };

    const handleUpdateMark = (updatedMark: Mark) => {
        setMarks(marks.map(mark => mark.id === updatedMark.id ? updatedMark : mark));
        setIsUpdateDialogOpen(false);
        setSelectedMark(null);
    };

    const handleDeleteMark = (markId: string) => {
        setMarks(marks.filter(mark => mark.id !== markId));
    };

    const handleViewDetails = (mark: Mark) => {
        setSelectedMark(mark);
        setIsDetailsDialogOpen(true);
    };

    const handleEditMark = (mark: Mark) => {
        setSelectedMark(mark);
        setIsUpdateDialogOpen(true);
    };

    // Column definitions for marks table
    const marksColumns = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }: { row: { original: Mark } }) => (
                <div className="font-medium">{row.original.title}</div>
            ),
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }: { row: { original: Mark } }) => (
                <Badge variant="outline">{row.original.subject}</Badge>
            ),
        },
        {
            accessorKey: "class",
            header: "Class",
            cell: ({ row }: { row: { original: Mark } }) => (
                <span className="text-sm">{row.original.class}</span>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }: { row: { original: Mark } }) => (
                <Badge variant={row.original.type === "exam" ? "default" : "secondary"}>
                    {row.original.type}
                </Badge>
            ),
        },
        {
            accessorKey: "totalMarks",
            header: "Total Marks",
            cell: ({ row }: { row: { original: Mark } }) => (
                <span className="font-mono">{row.original.totalMarks}</span>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }: { row: { original: Mark } }) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.original.date).toLocaleDateString()}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: Mark } }) => (
                <Badge variant={row.original.status === "published" ? "default" : "secondary"}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: Mark } }) => (
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
                        onClick={() => handleEditMark(row.original)}
                    >
                        <RiEditLine size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMark(row.original.id)}
                    >
                        <RiDeleteBinLine size={16} />
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Column definitions for student marks table
    const studentMarksColumns = [
        {
            accessorKey: "studentName",
            header: "Student",
            cell: ({ row }: { row: { original: StudentMark } }) => (
                <div className="font-medium">{row.original.studentName}</div>
            ),
        },
        {
            accessorKey: "studentId",
            header: "Student ID",
            cell: ({ row }: { row: { original: StudentMark } }) => (
                <span className="text-sm text-muted-foreground">{row.original.studentId}</span>
            ),
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }: { row: { original: StudentMark } }) => (
                <Badge variant="outline">{row.original.subject}</Badge>
            ),
        },
        {
            accessorKey: "obtainedMarks",
            header: "Obtained",
            cell: ({ row }: { row: { original: StudentMark } }) => (
                <span className="font-mono">{row.original.obtainedMarks}</span>
            ),
        },
        {
            accessorKey: "totalMarks",
            header: "Total",
            cell: ({ row }: { row: { original: StudentMark } }) => (
                <span className="font-mono">{row.original.totalMarks}</span>
            ),
        },
        {
            accessorKey: "percentage",
            header: "Percentage",
            cell: ({ row }: { row: { original: StudentMark } }) => {
                const percentage = (row.original.obtainedMarks / row.original.totalMarks) * 100;
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-mono">{percentage.toFixed(1)}%</span>
                        <Badge variant={percentage >= 60 ? "default" : "destructive"}>
                            {percentage >= 60 ? "Pass" : "Fail"}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "grade",
            header: "Grade",
            cell: ({ row }: { row: { original: StudentMark } }) => (
                <Badge variant="outline">{row.original.grade}</Badge>
            ),
        },
    ];

    // Column definitions for group marks table
    const groupMarksColumns = [
        {
            accessorKey: "groupName",
            header: "Group",
            cell: ({ row }: { row: { original: GroupMark } }) => (
                <div className="font-medium">{row.original.groupName}</div>
            ),
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }: { row: { original: GroupMark } }) => (
                <Badge variant="outline">{row.original.subject}</Badge>
            ),
        },
        {
            accessorKey: "totalStudents",
            header: "Students",
            cell: ({ row }: { row: { original: GroupMark } }) => (
                <span className="font-mono">{row.original.totalStudents}</span>
            ),
        },
        {
            accessorKey: "averageMarks",
            header: "Average",
            cell: ({ row }: { row: { original: GroupMark } }) => (
                <span className="font-mono">{row.original.averageMarks.toFixed(1)}</span>
            ),
        },
        {
            accessorKey: "passCount",
            header: "Passed",
            cell: ({ row }: { row: { original: GroupMark } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono">{row.original.passCount}</span>
                    <Badge variant="default">
                        {((row.original.passCount / row.original.totalStudents) * 100).toFixed(1)}%
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "failCount",
            header: "Failed",
            cell: ({ row }: { row: { original: GroupMark } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono">{row.original.failCount}</span>
                    <Badge variant="destructive">
                        {((row.original.failCount / row.original.totalStudents) * 100).toFixed(1)}%
                    </Badge>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-1 gap-4 p-2">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 shrink-0">
                <div className="sticky top-4 space-y-4">
                    <MarksStats
                        marks={marks}
                        studentMarks={studentMarks}
                        groupMarks={groupMarks}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-2">
                            <MarksStats
                                marks={marks}
                                studentMarks={studentMarks}
                                groupMarks={groupMarks}
                            />
                        </div>
                    </details>
                </div>

                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Marks Management</h1>
                        <p className="text-muted-foreground">Manage student marks, exams, and assessments</p>
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
                            Create Mark
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="marks">All Marks</TabsTrigger>
                        <TabsTrigger value="students">Student Marks</TabsTrigger>
                        <TabsTrigger value="groups">Group Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="marks" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Marks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={marks}
                                    columns={marksColumns}
                                    searchKey="title"
                                    searchPlaceholder="Search marks..."
                                    onDataChange={setMarks}
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
                                            ]
                                        },
                                        {
                                            key: "type",
                                            label: "Type",
                                            options: [
                                                { label: "Exam", value: "exam" },
                                                { label: "Quiz", value: "quiz" },
                                                { label: "Assignment", value: "assignment" },
                                                { label: "Test", value: "test" },
                                            ]
                                        },
                                        {
                                            key: "status",
                                            label: "Status",
                                            options: [
                                                { label: "Published", value: "published" },
                                                { label: "Draft", value: "draft" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Marks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={studentMarks}
                                    columns={studentMarksColumns}
                                    searchKey="studentName"
                                    searchPlaceholder="Search students..."
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
                                            ]
                                        },
                                        {
                                            key: "grade",
                                            label: "Grade",
                                            options: [
                                                { label: "A+", value: "A+" },
                                                { label: "A", value: "A" },
                                                { label: "B+", value: "B+" },
                                                { label: "B", value: "B" },
                                                { label: "C+", value: "C+" },
                                                { label: "C", value: "C" },
                                                { label: "D", value: "D" },
                                                { label: "F", value: "F" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="groups" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Group Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={groupMarks}
                                    columns={groupMarksColumns}
                                    searchKey="groupName"
                                    searchPlaceholder="Search groups..."
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
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs */}
            <CreateMarkDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateMark}
            />

            {selectedMark && (
                <UpdateMarkDialog
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                    mark={selectedMark}
                    onSubmit={handleUpdateMark}
                />
            )}

            {selectedMark && (
                <MarkDetailsDialog
                    open={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    mark={selectedMark}
                />
            )}
        </div>
    );
}