/**
 * Enhanced Drag & Drop Add Students to Classroom Dialog
 * Allows dragging students to classrooms with visual feedback
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { BookOpen, CheckCircle, Search, User, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DraggableStudent } from "./components/DraggableStudent";
import { DroppableClassroomForStudents } from "./components/DroppableClassroomForStudents";

interface AddStudentsToClassroomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroomId?: string;
    classroomTitle?: string;
    preSelectedStudents?: string[];
    onSuccess?: () => void;
}

export default function DragDropAddStudentsToClassroomDialog({
    open,
    onOpenChange,
    classroomId,
    classroomTitle,
    preSelectedStudents = [],
    onSuccess,
}: AddStudentsToClassroomDialogProps) {
    const [studentSearch, setStudentSearch] = useState("");
    const [classroomSearch, setClassroomSearch] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [activeStudent, setActiveStudent] = useState<any>(null);
    const [assignments, setAssignments] = useState<Array<{ classroomId: string, studentId: string }>>([]);

    // State for fetched data
    const [students, setStudents] = useState<any[]>([]);
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [classroomsLoading, setClassroomsLoading] = useState(false);

    // DnD sensors
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        })
    );

    // Mock students data - replace with actual API call
    const fetchStudents = async () => {
        setStudentsLoading(true);

        try {
            // Mock data - replace with actual API call
            const mockStudents = [
                {
                    _id: "1",
                    name: "Ahmed Benali",
                    email: "ahmed.benali@email.com",
                    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                    level: "University",
                    major: "Physics",
                    phone: "+213 555 0101"
                },
                {
                    _id: "2",
                    name: "Fatima Khelifi",
                    email: "fatima.khelifi@email.com",
                    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                    level: "University",
                    major: "Mathematics",
                    phone: "+213 555 0102"
                },
                {
                    _id: "3",
                    name: "Youssef Amrani",
                    email: "youssef.amrani@email.com",
                    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    level: "High School",
                    major: "Sciences",
                    phone: "+213 555 0103"
                },
                {
                    _id: "4",
                    name: "Amina Meziane",
                    email: "amina.meziane@email.com",
                    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                    level: "University",
                    major: "Chemistry",
                    phone: "+213 555 0104"
                },
                {
                    _id: "5",
                    name: "Omar Benaissa",
                    email: "omar.benaissa@email.com",
                    level: "High School",
                    major: "Literature",
                    phone: "+213 555 0105"
                }
            ];

            setStudents(mockStudents);
        } catch (error) {
            setStudents([]);
            toast.error("Failed to load students");
        } finally {
            setStudentsLoading(false);
        }
    };

    // Fetch classrooms
    const fetchClassrooms = async () => {
        setClassroomsLoading(true);

        try {
            const token = sessionStorage.getItem("access_token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const requestBody = {
                status: "notArchived",
                pagination: { numItems: 100, cursor: null },
                groupPagination: { numItems: 1, cursor: null },
            };

            const response = await fetch("http://127.0.0.1:3001/classroom/get-classrooms", {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setClassrooms(data.payload?.classrooms || []);
        } catch (error) {
            setClassrooms([]);
        } finally {
            setClassroomsLoading(false);
        }
    };

    // Fetch data when dialog opens
    useEffect(() => {
        if (open && typeof window !== 'undefined') {
            fetchStudents();
            fetchClassrooms();
        }
    }, [open]);

    // Filter students and classrooms based on search
    const filteredStudents = useMemo(() => {
        return students.filter((student) =>
            student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
            (student.major || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
            (student.level || "").toLowerCase().includes(studentSearch.toLowerCase())
        );
    }, [students, studentSearch]);

    const filteredClassrooms = useMemo(() => {
        // If specific classroom is provided, show only that one
        if (classroomId) {
            return classrooms.filter(c => c._id === classroomId);
        }

        return classrooms.filter((classroom) =>
            classroom.title.toLowerCase().includes(classroomSearch.toLowerCase()) ||
            classroom.field.toLowerCase().includes(classroomSearch.toLowerCase()) ||
            classroom.level.toLowerCase().includes(classroomSearch.toLowerCase())
        );
    }, [classrooms, classroomSearch, classroomId]);

    const handleDragStart = (event: DragStartEvent) => {
        const student = students.find(s => s._id === event.active.id);
        setActiveStudent(student);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveStudent(null);

        if (over && active.id !== over.id) {
            const studentId = active.id as string;
            const targetClassroomId = over.id as string;

            // Check if this assignment already exists
            const exists = assignments.some(assignment =>
                assignment.studentId === studentId && assignment.classroomId === targetClassroomId
            );

            if (!exists) {
                setAssignments(prev => [...prev, { classroomId: targetClassroomId, studentId }]);
                toast.success("Student assigned to classroom! Click 'Assign All' to save.");
            } else {
                toast.info("This student is already assigned to this classroom.");
            }
        }
    };

    const removeAssignment = (classroomId: string, studentId: string) => {
        setAssignments(prev => prev.filter(assignment =>
            !(assignment.classroomId === classroomId && assignment.studentId === studentId)
        ));
    };

    const handleAssignAll = async () => {
        if (assignments.length === 0) {
            toast.error("No assignments to save. Drag students to classrooms first.");
            return;
        }

        setIsAdding(true);

        try {
            const token = sessionStorage.getItem("access_token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("http://127.0.0.1:3001/classroom/classroom-add-student", {
                method: "POST",
                headers,
                body: JSON.stringify(assignments),
            });

            if (!response.ok) {
                let errorData;
                try {
                    const text = await response.text();
                    errorData = JSON.parse(text);
                } catch {
                    errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
                }
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            let result;
            try {
                const text = await response.text();
                result = JSON.parse(text);
            } catch (error) {
                throw new Error("Server returned invalid JSON response");
            }

            if (result.status === "success") {
                toast.success(`Successfully assigned ${assignments.length} student${assignments.length > 1 ? 's' : ''} to classroom${assignments.length > 1 ? 's' : ''}!`);

                // Reset state
                setAssignments([]);
                setStudentSearch("");
                setClassroomSearch("");

                // Call success callback and close dialog
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.message || "Failed to assign students to classrooms");
            }

        } catch (error: any) {
            const errorMessage = error?.message || "Failed to assign students to classrooms";
            toast.error(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setAssignments([]);
        setStudentSearch("");
        setClassroomSearch("");
        onOpenChange(false);
    };

    const getClassroomById = (id: string) => classrooms.find(c => c._id === id);
    const getStudentById = (id: string) => students.find(s => s._id === id);
    const getStudentInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Add Students to Classroom{classroomTitle ? `: ${classroomTitle}` : 's'} (Drag & Drop)
                    </DialogTitle>
                    <DialogDescription>
                        Drag students from the left panel and drop them onto classrooms on the right to assign them.
                        Students will gain access to classroom materials and sessions.
                    </DialogDescription>
                </DialogHeader>

                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-2 gap-6 py-4 min-h-[600px]">
                        {/* Students Section (Left) */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Students (Drag to assign)
                                </Label>
                                <div className="relative mt-2">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search students..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <ScrollArea className="h-[500px] border rounded-md p-4 bg-purple-50/30">
                                {studentsLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No students found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredStudents.map((student) => (
                                            <DraggableStudent key={student._id} student={student} />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Classrooms Section (Right) */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Classroom{!classroomId ? 's' : ''} (Drop students here)
                                </Label>
                                {!classroomId && (
                                    <div className="relative mt-2">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search classrooms..."
                                            value={classroomSearch}
                                            onChange={(e) => setClassroomSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                )}
                            </div>

                            <ScrollArea className="h-[500px] border rounded-md p-4 bg-green-50/30">
                                {classroomsLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : filteredClassrooms.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No classrooms found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredClassrooms.map((classroom) => (
                                            <DroppableClassroomForStudents
                                                key={classroom._id}
                                                classroom={classroom}
                                                assignedStudents={assignments
                                                    .filter(assignment => assignment.classroomId === classroom._id)
                                                    .map(assignment => getStudentById(assignment.studentId))
                                                    .filter(Boolean)
                                                }
                                                onRemoveStudent={(studentId) => removeAssignment(classroom._id, studentId)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    <DragOverlay>
                        {activeStudent && (
                            <div className="bg-white border-2 border-purple-500 rounded-lg p-4 shadow-lg opacity-90">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={activeStudent.profilePicture} alt={activeStudent.name} />
                                        <AvatarFallback>{getStudentInitials(activeStudent.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{activeStudent.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {activeStudent.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                <Separator />

                {/* Assignments Summary */}
                {assignments.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-md max-h-32 overflow-y-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Pending Assignments ({assignments.length})</span>
                        </div>
                        <div className="space-y-1">
                            {assignments.map((assignment, index) => {
                                const classroom = getClassroomById(assignment.classroomId);
                                const student = getStudentById(assignment.studentId);
                                return (
                                    <div key={index} className="flex items-center justify-between text-sm bg-white rounded px-2 py-1">
                                        <span>
                                            <strong>{student?.name}</strong> → <strong>{classroom?.title}</strong>
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removeAssignment(assignment.classroomId, assignment.studentId)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isAdding}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssignAll}
                        disabled={assignments.length === 0 || isAdding}
                    >
                        {isAdding ? "Assigning..." : `Assign All (${assignments.length})`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}