"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    RiAlarmWarningLine,
    RiBarChartLine,
    RiBookLine,
    RiCalendarLine,
    RiCheckLine,
    RiCloseLine,
    RiFileTextLine,
    RiInformationLine,
    RiStarLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
import type { Homework, HomeworkSubmission, StudentHomeworkSummary } from "./types";

interface HomeworkDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Homework | HomeworkSubmission | StudentHomeworkSummary | null;
}

export function HomeworkDetailsDialog({ open, onOpenChange, data }: HomeworkDetailsDialogProps) {
    if (!data) return null;

    // Determine the type of data
    const isHomework = 'title' in data && 'subject' in data && 'assignedDate' in data;
    const isSubmission = 'homeworkId' in data && 'studentName' in data;
    const isStudentSummary = 'recentSubmissions' in data && 'upcomingHomeworks' in data;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isHomework && <RiBookLine className="h-5 w-5" />}
                        {isSubmission && <RiFileTextLine className="h-5 w-5" />}
                        {isStudentSummary && <RiBarChartLine className="h-5 w-5" />}
                        {isHomework && (data as Homework).title}
                        {isSubmission && `Submission - ${(data as HomeworkSubmission).studentName}`}
                        {isStudentSummary && `Student Summary - ${(data as StudentHomeworkSummary).studentName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isHomework && "Detailed homework assignment information"}
                        {isSubmission && "Detailed submission information"}
                        {isStudentSummary && "Comprehensive student homework performance"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Homework Details */}
                    {isHomework && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiInformationLine className="h-4 w-4" />
                                        Assignment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                            <Badge variant="outline" className="mt-1">
                                                {(data as Homework).subject}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Class</p>
                                            <p className="text-sm font-medium mt-1">{(data as Homework).className}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                                            <Badge variant="secondary" className="mt-1 capitalize">
                                                {(data as Homework).type}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Priority</p>
                                            <Badge
                                                variant={
                                                    (data as Homework).priority === "urgent" ? "destructive" :
                                                        (data as Homework).priority === "high" ? "default" :
                                                            (data as Homework).priority === "medium" ? "secondary" : "outline"
                                                }
                                                className="mt-1"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {(data as Homework).priority === "urgent" && <RiAlarmWarningLine size={12} />}
                                                    {(data as Homework).priority === "high" && <RiStarLine size={12} />}
                                                    {(data as Homework).priority}
                                                </div>
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Assigned Date</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {new Date((data as Homework).assignedDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {new Date((data as Homework).dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <Badge
                                                variant={
                                                    (data as Homework).status === "completed" ? "default" :
                                                        (data as Homework).status === "overdue" ? "destructive" :
                                                            (data as Homework).status === "in_progress" ? "secondary" :
                                                                (data as Homework).status === "assigned" ? "outline" : "secondary"
                                                }
                                                className="mt-1"
                                            >
                                                {(data as Homework).status.replace("_", " ")}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
                                            <p className="text-lg font-bold mt-1">
                                                {(data as Homework).totalMarks || "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                            <p className="text-sm font-medium mt-1">
                                                {(data as Homework).estimatedDuration ?
                                                    `${(data as Homework).estimatedDuration} minutes` :
                                                    "Not specified"
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                                            <Badge variant="outline" className="mt-1 capitalize">
                                                {(data as Homework).difficulty}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiFileTextLine className="h-4 w-4" />
                                        Description & Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                                        <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                                            {(data as Homework).description}
                                        </p>
                                    </div>

                                    {(data as Homework).instructions && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Instructions</p>
                                            <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                                                {(data as Homework).instructions}
                                            </p>
                                        </div>
                                    )}

                                    {(data as Homework).tags && (data as Homework).tags!.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Tags</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {(data as Homework).tags!.map((tag, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiUserLine className="h-4 w-4" />
                                        Assignment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Assigned By</p>
                                        <p className="text-sm font-medium mt-1">{(data as Homework).teacherName}</p>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">
                                                    {new Date((data as Homework).createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">
                                                    {new Date((data as Homework).updatedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Submission Details */}
                    {isSubmission && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiInformationLine className="h-4 w-4" />
                                        Submission Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Student</p>
                                            <p className="text-sm font-medium mt-1">{(data as HomeworkSubmission).studentName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <Badge
                                                variant={
                                                    (data as HomeworkSubmission).status === "graded" ? "default" :
                                                        (data as HomeworkSubmission).status === "submitted" ? "secondary" :
                                                            (data as HomeworkSubmission).status === "late" ? "destructive" :
                                                                (data as HomeworkSubmission).status === "returned" ? "outline" : "secondary"
                                                }
                                                className="mt-1"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {(data as HomeworkSubmission).status === "graded" && <RiCheckLine size={14} />}
                                                    {(data as HomeworkSubmission).status === "not_submitted" && <RiCloseLine size={14} />}
                                                    {(data as HomeworkSubmission).isLate && <RiTimeLine size={14} />}
                                                    {(data as HomeworkSubmission).status.replace("_", " ")}
                                                </div>
                                            </Badge>
                                        </div>
                                    </div>

                                    {(data as HomeworkSubmission).submittedAt && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm">
                                                        {new Date((data as HomeworkSubmission).submittedAt!).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Late Status</p>
                                                {(data as HomeworkSubmission).isLate ? (
                                                    <Badge variant="destructive" className="mt-1">
                                                        {(data as HomeworkSubmission).daysLate} day{(data as HomeworkSubmission).daysLate !== 1 ? 's' : ''} late
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="mt-1">
                                                        On time
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(data as HomeworkSubmission).grade !== undefined && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Grade</p>
                                                <p className="text-lg font-bold mt-1">
                                                    {(data as HomeworkSubmission).grade}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Graded By</p>
                                                <p className="text-sm font-medium mt-1">
                                                    {(data as HomeworkSubmission).gradedBy || "Not graded"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {(data as HomeworkSubmission).content && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Submission Content</p>
                                            <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                                                {(data as HomeworkSubmission).content}
                                            </p>
                                        </div>
                                    )}

                                    {(data as HomeworkSubmission).feedback && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Teacher Feedback</p>
                                            <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                                                {(data as HomeworkSubmission).feedback}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Student Summary Details */}
                    {isStudentSummary && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiInformationLine className="h-4 w-4" />
                                        Student Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Student</p>
                                            <p className="text-sm font-medium mt-1">{(data as StudentHomeworkSummary).studentName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Class</p>
                                            <p className="text-sm font-medium mt-1">{(data as StudentHomeworkSummary).className}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-lg font-bold">{(data as StudentHomeworkSummary).totalHomeworks}</p>
                                            <p className="text-xs text-muted-foreground">Total</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <p className="text-lg font-bold text-green-600">
                                                {(data as StudentHomeworkSummary).submittedCount}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Submitted</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-lg font-bold text-orange-600">
                                                {(data as StudentHomeworkSummary).lateCount}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Late</p>
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <p className="text-lg font-bold text-red-600">
                                                {(data as StudentHomeworkSummary).notSubmittedCount}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Missing</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Submission Rate</span>
                                            <span className="font-medium">
                                                {(data as StudentHomeworkSummary).submissionRate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={(data as StudentHomeworkSummary).submissionRate} className="h-2" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>On-Time Rate</span>
                                            <span className="font-medium">
                                                {(data as StudentHomeworkSummary).onTimeRate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={(data as StudentHomeworkSummary).onTimeRate} className="h-2" />
                                    </div>

                                    {(data as StudentHomeworkSummary).averageGrade && (
                                        <div className="text-center">
                                            <p className="text-lg font-bold">
                                                {(data as StudentHomeworkSummary).averageGrade.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Average Grade</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {(data as StudentHomeworkSummary).upcomingHomeworks.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <RiTimeLine className="h-4 w-4" />
                                            Upcoming Homeworks
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {(data as StudentHomeworkSummary).upcomingHomeworks.slice(0, 3).map((homework) => (
                                                <div key={homework.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium">{homework.title}</p>
                                                        <p className="text-xs text-muted-foreground">{homework.subject}</p>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {new Date(homework.dueDate).toLocaleDateString()}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {(data as StudentHomeworkSummary).overdueHomeworks.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <RiAlarmWarningLine className="h-4 w-4 text-red-600" />
                                            Overdue Homeworks
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {(data as StudentHomeworkSummary).overdueHomeworks.slice(0, 3).map((homework) => (
                                                <div key={homework.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium">{homework.title}</p>
                                                        <p className="text-xs text-muted-foreground">{homework.subject}</p>
                                                    </div>
                                                    <Badge variant="destructive">
                                                        {new Date(homework.dueDate).toLocaleDateString()}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}