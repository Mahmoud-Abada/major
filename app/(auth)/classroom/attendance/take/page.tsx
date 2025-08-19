"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { classroomApi } from "@/services/classroom-api";
import { ArrowLeft, Save, UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Student {
    id: string;
    name: string;
    isPresent: boolean;
    note?: string;
}

export default function TakeAttendancePage() {
    console.log("TakeAttendancePage component rendered");
    const router = useRouter();
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState<string>("");
    const [eventId, setEventId] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchClassrooms = useCallback(async () => {
        try {
            const response = await classroomApi.getClassrooms({
                status: "notArchived",
                pagination: { numItems: 100, cursor: null },
            });
            console.log("Classrooms response:", response);
            console.log("Classrooms data:", response.data);
            setClassrooms(response.data || []);
        } catch (error: any) {
            console.error("Failed to fetch classrooms:", error);
            setClassrooms([]);
        }
    }, []);

    useEffect(() => {
        fetchClassrooms();
    }, [fetchClassrooms]);

    const handleClassroomChange = (classroomId: string) => {
        setSelectedClassroom(classroomId);
        // In a real app, you would fetch students for this classroom
        // For now, we'll create some mock students
        setStudents([
            { id: "1", name: "Student 1", isPresent: true },
            { id: "2", name: "Student 2", isPresent: true },
            { id: "3", name: "Student 3", isPresent: false },
        ]);
    };

    const toggleStudentAttendance = (studentId: string) => {
        setStudents(prev =>
            prev.map(student =>
                student.id === studentId
                    ? { ...student, isPresent: !student.isPresent }
                    : student
            )
        );
    };

    const updateStudentNote = (studentId: string, note: string) => {
        setStudents(prev =>
            prev.map(student =>
                student.id === studentId ? { ...student, note } : student
            )
        );
    };

    const handleSubmit = async () => {
        if (!selectedClassroom || !eventId) {
            toast({
                title: "Error",
                description: "Please select a classroom and enter an event ID",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const studentsAttendance = students.map(student => ({
                student: student.id,
                isPresent: student.isPresent,
                presentTime: student.isPresent ? Date.now() : undefined,
                absenceReason: !student.isPresent ? "Absent" : undefined,
                note: student.note || undefined,
            }));

            await classroomApi.addStudentAttendance(
                studentsAttendance,
                selectedClassroom,
                eventId
            );

            toast({
                title: "Success",
                description: "Attendance recorded successfully",
            });

            router.push("/classroom/attendance");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to record attendance",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Take Attendance</h1>
                    <p className="text-muted-foreground">
                        Record student attendance for a class session
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="classroom">Classroom</Label>
                                <Select value={selectedClassroom} onValueChange={handleClassroomChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select classroom" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(() => {
                                            const validClassrooms = classrooms?.filter(classroom =>
                                                classroom?.id &&
                                                typeof classroom.id === 'string' &&
                                                classroom.id.trim() !== ''
                                            ) || [];

                                            if (validClassrooms.length === 0) {
                                                return (
                                                    <SelectItem value="no-classrooms" disabled>
                                                        No classrooms available
                                                    </SelectItem>
                                                );
                                            }

                                            return validClassrooms.map((classroom) => (
                                                <SelectItem key={classroom.id} value={classroom.id}>
                                                    {classroom.title || 'Untitled Classroom'}
                                                </SelectItem>
                                            ));
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="eventId">Event ID</Label>
                                <Input
                                    id="eventId"
                                    placeholder="Enter event ID"
                                    value={eventId}
                                    onChange={(e) => setEventId(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !selectedClassroom || !eventId}
                                className="w-full"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? "Saving..." : "Save Attendance"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Students ({students.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {students.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        Please select a classroom to view students
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {students.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                    <span className="text-sm font-medium">
                                                        {student.name.split(" ").map(n => n[0]).join("")}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Button
                                                            size="sm"
                                                            variant={student.isPresent ? "default" : "outline"}
                                                            onClick={() => toggleStudentAttendance(student.id)}
                                                        >
                                                            {student.isPresent ? (
                                                                <>
                                                                    <UserCheck className="h-3 w-3 mr-1" />
                                                                    Present
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserX className="h-3 w-3 mr-1" />
                                                                    Absent
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-48">
                                                <Textarea
                                                    placeholder="Add note..."
                                                    value={student.note || ""}
                                                    onChange={(e) => updateStudentNote(student.id, e.target.value)}
                                                    className="min-h-[60px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}