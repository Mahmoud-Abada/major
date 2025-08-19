/**
 * Add Students to Classroom Dialog
 * Allows adding multiple students to a classroom
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Search, User, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Student {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    level?: string;
    major?: string;
    phone?: string;
}

interface AddStudentsToClassroomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroomId?: string;
    classroomTitle?: string;
    preSelectedStudents?: string[];
    onSuccess?: () => void;
}

export default function AddStudentsToClassroomDialog({
    open,
    onOpenChange,
    classroomId,
    classroomTitle,
    preSelectedStudents = [],
    onSuccess,
}: AddStudentsToClassroomDialogProps) {
    const [selectedStudents, setSelectedStudents] = useState<string[]>(preSelectedStudents);
    const [studentSearch, setStudentSearch] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // State for fetched data
    const [students, setStudents] = useState<Student[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    // Mock students data - replace with actual API call
    const fetchStudents = async () => {
        setStudentsLoading(true);

        try {
            // Mock data - replace with actual API call
            const mockStudents: Student[] = [
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

    // Fetch data when dialog opens
    useEffect(() => {
        if (open && typeof window !== 'undefined') {
            fetchStudents();
        }
    }, [open]);

    // Filter students based on search
    const filteredStudents = useMemo(() => {
        return students.filter((student) =>
            student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
            (student.major || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
            (student.level || "").toLowerCase().includes(studentSearch.toLowerCase())
        );
    }, [students, studentSearch]);

    const handleStudentToggle = (studentId: string) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAdd = async () => {
        if (!classroomId) {
            toast.error("No classroom selected");
            return;
        }

        if (selectedStudents.length === 0) {
            toast.error("Please select at least one student");
            return;
        }

        setIsAdding(true);

        try {
            const classroomStudents = selectedStudents.map(studentId => ({
                classroomId,
                studentId,
            }));

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
                body: JSON.stringify(classroomStudents),
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
                toast.success(`Successfully added ${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} to ${classroomTitle || 'classroom'}`);

                // Reset selections
                setSelectedStudents([]);
                setStudentSearch("");

                // Call success callback and close dialog
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.message || "Failed to add students to classroom");
            }

        } catch (error: any) {
            const errorMessage = error?.message || "Failed to add students to classroom";
            toast.error(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setSelectedStudents([]);
        setStudentSearch("");
        onOpenChange(false);
    };

    const getStudentInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Add Students to Classroom
                    </DialogTitle>
                    <DialogDescription>
                        {classroomTitle ? (
                            <>Select students to add to <strong>{classroomTitle}</strong>. Students will gain access to all classroom materials and sessions.</>
                        ) : (
                            "Select students to add to the classroom. Students will gain access to all classroom materials and sessions."
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Students ({selectedStudents.length} selected)
                            </Label>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students by name, email, or major..."
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <ScrollArea className="h-80 border rounded-md p-4">
                            {studentsLoading ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No students found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredStudents.map((student) => (
                                        <div
                                            key={student._id}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer border border-transparent hover:border-border transition-all"
                                            onClick={() => handleStudentToggle(student._id)}
                                        >
                                            <Checkbox
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={() => handleStudentToggle(student._id)}
                                            />
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={student.profilePicture} alt={student.name} />
                                                <AvatarFallback>{getStudentInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{student.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {student.email}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {student.level && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                            {student.level}
                                                        </span>
                                                    )}
                                                    {student.major && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                            {student.major}
                                                        </span>
                                                    )}
                                                    {student.phone && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {student.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <Separator />

                {/* Summary */}
                {selectedStudents.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">
                            <strong>Summary:</strong> You are about to add{" "}
                            <strong>{selectedStudents.length}</strong> student{selectedStudents.length !== 1 ? "s" : ""} to{" "}
                            {classroomTitle ? <strong>{classroomTitle}</strong> : "the classroom"}.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isAdding}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        disabled={selectedStudents.length === 0 || isAdding}
                    >
                        {isAdding ? "Adding..." : `Add ${selectedStudents.length || ""} Student${selectedStudents.length !== 1 ? "s" : ""}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}