/**
 * Enhanced Add Students to Classroom Dialog
 * Professional UI with drag-and-drop and multi-select modes
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
    BookOpen,
    Search,
    User,
    UserPlus,
    X,
    CheckCircle,
    MousePointer,
    Hand,
    ArrowRight,
    MapPin,
    DollarSign,
    GripVertical,
    Plus,
    RotateCcw,
    Mail,
    Phone,
    Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface AddStudentsToClassroomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroomId?: string;
    classroomTitle?: string;
    preSelectedStudents?: string[];
    onSuccess?: () => void;
}

export default function EnhancedAddStudentsToClassroomDialog({
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
    const [isDragMode, setIsDragMode] = useState(true);
    const [activeStudent, setActiveStudent] = useState<any>(null);
    const [assignments, setAssignments] = useState<Array<{ classroomId: string, studentId: string }>>([]);

    // Multi-select mode states
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);

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
                },
                {
                    _id: "6",
                    name: "Leila Boumediene",
                    email: "leila.boumediene@email.com",
                    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
                    level: "University",
                    major: "Biology",
                    phone: "+213 555 0106"
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
                toast.success("Student assigned to classroom! You can undo or assign more.");
            } else {
                toast.info("This student is already assigned to this classroom.");
            }
        }
    };

    const removeAssignment = (classroomId: string, studentId: string) => {
        setAssignments(prev => prev.filter(assignment =>
            !(assignment.classroomId === classroomId && assignment.studentId === studentId)
        ));
        toast.info("Assignment removed. You can restore it by dragging again.");
    };

    const handleMultiSelectAssign = () => {
        if (selectedStudents.length === 0 || selectedClassrooms.length === 0) {
            toast.error("Please select at least one student and one classroom");
            return;
        }

        const newAssignments = selectedClassrooms.flatMap(classroomId =>
            selectedStudents.map(studentId => ({ classroomId, studentId }))
        );

        // Filter out existing assignments
        const uniqueAssignments = newAssignments.filter(newAssignment =>
            !assignments.some(existingAssignment =>
                existingAssignment.classroomId === newAssignment.classroomId &&
                existingAssignment.studentId === newAssignment.studentId
            )
        );

        if (uniqueAssignments.length === 0) {
            toast.info("All selected combinations are already assigned");
            return;
        }

        setAssignments(prev => [...prev, ...uniqueAssignments]);
        setSelectedStudents([]);
        setSelectedClassrooms([]);
        toast.success(`Added ${uniqueAssignments.length} new assignment${uniqueAssignments.length > 1 ? 's' : ''}!`);
    };

    const handleAssignAll = async () => {
        if (assignments.length === 0) {
            toast.error("No assignments to save. Create some assignments first.");
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
                setSelectedStudents([]);
                setSelectedClassrooms([]);
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
        setSelectedStudents([]);
        setSelectedClassrooms([]);
        setStudentSearch("");
        setClassroomSearch("");
        onOpenChange(false);
    };

    const clearAllAssignments = () => {
        setAssignments([]);
        setSelectedStudents([]);
        setSelectedClassrooms([]);
        toast.info("All assignments cleared");
    };

    const getClassroomById = (id: string) => classrooms.find(c => c._id === id);
    const getStudentById = (id: string) => students.find(s => s._id === id);
    const getStudentInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getTeacherName = (teacher: any) => {
        if (!teacher) return "Teacher not assigned";
        if (typeof teacher === "string") return teacher;
        if (typeof teacher === "object") {
            return teacher.name || teacher.username || "Teacher not assigned";
        }
        return "Teacher not assigned";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <UserPlus className="h-6 w-6" />
                        Add Students to Classroom{classroomTitle ? `: ${classroomTitle}` : 's'}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Assign students to classrooms to give them access to materials, sessions, and activities.
                    </DialogDescription>

                    {/* Mode Toggle */}
                    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <MousePointer className="h-4 w-4" />
                                <span className="text-sm font-medium">Multi-Select</span>
                            </div>
                            <Switch
                                checked={isDragMode}
                                onCheckedChange={setIsDragMode}
                                className="data-[state=checked]:bg-purple-600"
                            />
                            <div className="flex items-center space-x-2">
                                <Hand className="h-4 w-4" />
                                <span className="text-sm font-medium">Drag & Drop</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAllAssignments}
                                disabled={assignments.length === 0}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Clear All ({assignments.length})
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    {isDragMode ? (
                        <DragDropMode />
                    ) : (
                        <MultiSelectMode />
                    )}
                </div>

                <DialogFooter className="flex items-center justify-between pt-6">
                    <div className="flex items-center space-x-4">
                        {assignments.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{assignments.length} assignment{assignments.length > 1 ? 's' : ''} ready to save</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button variant="outline" onClick={handleCancel} disabled={isAdding}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignAll}
                            disabled={assignments.length === 0 || isAdding}
                            className="min-w-[140px]"
                        >
                            {isAdding ? "Assigning..." : `Save Assignments (${assignments.length})`}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );