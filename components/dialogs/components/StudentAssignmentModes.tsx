/**
 * Student Assignment Mode Components
 * Drag & Drop and Multi-Select modes for student assignment
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
    BookOpen,
    DollarSign,
    GripVertical,
    Mail,
    MapPin,
    Phone,
    Plus,
    UserPlus,
    Users,
    X
} from "lucide-react";

// Draggable Student Card Component
export function DraggableStudentCard({ student }: { student: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: student._id,
        data: {
            type: 'student',
            student,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const getStudentInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                group cursor-grab active:cursor-grabbing
                bg-white border-2 border-purple-200 rounded-xl p-6 
                hover:border-purple-400 hover:shadow-lg transition-all duration-200
                ${isDragging ? 'opacity-50 shadow-2xl scale-105 rotate-2' : ''}
            `}
        >
            <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 text-purple-600 bg-purple-100 rounded-lg">
                    <GripVertical className="h-5 w-5" />
                </div>

                <Avatar className="h-16 w-16">
                    <AvatarImage src={student.profilePicture} alt={student.name} />
                    <AvatarFallback className="text-lg font-semibold">
                        {getStudentInitials(student.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                    <h3 className="font-semibold text-lg truncate">{student.name}</h3>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{student.email}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {student.level && (
                            <Badge variant="secondary" className="text-xs">
                                {student.level}
                            </Badge>
                        )}
                        {student.major && (
                            <Badge variant="outline" className="text-xs">
                                {student.major}
                            </Badge>
                        )}
                    </div>

                    {student.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{student.phone}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Droppable Classroom Card Component
export function DroppableClassroomForStudentsCard({
    classroom,
    assignedStudents,
    onRemoveStudent
}: {
    classroom: any,
    assignedStudents: any[],
    onRemoveStudent: (studentId: string) => void
}) {
    const { isOver, setNodeRef } = useDroppable({
        id: classroom._id,
        data: {
            type: 'classroom',
            classroom,
        },
    });

    const getTeacherName = (teacher: any) => {
        if (!teacher) return "Teacher not assigned";
        if (typeof teacher === "string") return teacher;
        if (typeof teacher === "object") {
            return teacher.name || teacher.username || "Teacher not assigned";
        }
        return "Teacher not assigned";
    };

    const getStudentInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                bg-white border-2 rounded-xl p-6 transition-all duration-200
                ${isOver
                    ? 'border-green-500 bg-green-50 shadow-lg scale-102 ring-2 ring-green-200'
                    : 'border-green-200 hover:border-green-400 hover:shadow-md'
                }
            `}
        >
            <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {classroom.frontPicture ? (
                        <img
                            src={classroom.frontPicture}
                            alt={classroom.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg truncate">{classroom.title}</h3>
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: classroom.color }}
                        />
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                        {getTeacherName(classroom.teacher)}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                            {classroom.field}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {classroom.level}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Max: {classroom.maxStudents}
                        </span>
                        {classroom.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {classroom.location.commune}
                            </span>
                        )}
                        <span className="flex items-center gap-1 font-medium">
                            <DollarSign className="h-4 w-4" />
                            {classroom.price?.toLocaleString()} DA/{classroom.mode}
                        </span>
                    </div>

                    {/* Assigned Students */}
                    {assignedStudents.length > 0 && (
                        <div className="border-t pt-3 mt-3">
                            <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                <UserPlus className="h-4 w-4" />
                                Assigned Students ({assignedStudents.length})
                            </p>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {assignedStudents.map((student) => (
                                    <div
                                        key={student._id}
                                        className="flex items-center justify-between bg-green-100 rounded-lg px-3 py-2"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={student.profilePicture} alt={student.name} />
                                                <AvatarFallback className="text-xs">
                                                    {getStudentInitials(student.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium truncate">
                                                {student.name}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onRemoveStudent(student._id)}
                                            className="h-6 w-6 p-0 hover:bg-red-100"
                                        >
                                            <X className="h-3 w-3 text-red-600" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Drop Zone Indicator */}
                    {isOver && (
                        <div className="border-t pt-3 mt-3">
                            <div className="flex items-center justify-center bg-green-100 border-2 border-dashed border-green-400 rounded-lg py-3">
                                <Plus className="h-5 w-5 text-green-600 mr-2" />
                                <span className="text-sm font-medium text-green-700">
                                    Drop student here to assign
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}