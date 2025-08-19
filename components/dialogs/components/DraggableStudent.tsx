/**
 * Draggable Student Component for Drag & Drop
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Mail, Phone } from "lucide-react";

interface DraggableStudentProps {
    student: {
        _id: string;
        name: string;
        email: string;
        profilePicture?: string;
        level?: string;
        major?: string;
        phone?: string;
    };
}

export function DraggableStudent({ student }: DraggableStudentProps) {
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
                bg-white border-2 border-purple-200 rounded-lg p-4 
                hover:border-purple-400 hover:shadow-md transition-all duration-200
                ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
            `}
        >
            <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 text-purple-600">
                    <GripVertical className="h-5 w-5" />
                </div>

                <Avatar className="h-12 w-12">
                    <AvatarImage src={student.profilePicture} alt={student.name} />
                    <AvatarFallback>{getStudentInitials(student.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{student.name}</p>

                    <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{student.email}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
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
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}