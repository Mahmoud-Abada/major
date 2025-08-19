/**
 * Droppable Group Component for Students Drag & Drop
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDroppable } from "@dnd-kit/core";
import { Calendar, Plus, UserPlus, Users, X } from "lucide-react";

interface DroppableGroupForStudentsProps {
    group: {
        _id: string;
        title: string;
        major?: string;
        field?: string;
        level: string;
        description: string;
        maxStudents: number;
        isSemestral: boolean;
        color: string;
        frontPicture: string;
        startDate: number;
        endDate: number;
    };
    assignedStudents: any[];
    onRemoveStudent: (studentId: string) => void;
}

export function DroppableGroupForStudents({ group, assignedStudents, onRemoveStudent }: DroppableGroupForStudentsProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: group._id,
        data: {
            type: 'group',
            group,
        },
    });

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const getStudentInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                bg-white border-2 rounded-lg p-4 transition-all duration-200
                ${isOver
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-102'
                    : 'border-blue-200 hover:border-blue-400 hover:shadow-md'
                }
            `}
        >
            <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {group.frontPicture ? (
                        <img
                            src={group.frontPicture}
                            alt={group.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{group.title}</p>
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: group.color }}
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                            {group.major || group.field}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {group.level}
                        </Badge>
                        {group.isSemestral && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                Semestral
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Max: {group.maxStudents}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(group.startDate)} - {formatDate(group.endDate)}
                        </span>
                    </div>

                    {/* Assigned Students */}
                    {assignedStudents.length > 0 && (
                        <div className="border-t pt-2">
                            <p className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1">
                                <UserPlus className="h-3 w-3" />
                                Group Members ({assignedStudents.length})
                            </p>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {assignedStudents.map((student) => (
                                    <div
                                        key={student._id}
                                        className="flex items-center justify-between bg-blue-100 rounded px-2 py-1"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={student.profilePicture} alt={student.name} />
                                                <AvatarFallback className="text-xs">
                                                    {getStudentInitials(student.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium truncate">
                                                {student.name}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onRemoveStudent(student._id)}
                                            className="h-5 w-5 p-0 hover:bg-red-100"
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
                        <div className="border-t pt-2 mt-2">
                            <div className="flex items-center justify-center bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg py-2">
                                <Plus className="h-4 w-4 text-blue-600 mr-1" />
                                <span className="text-sm font-medium text-blue-700">
                                    Drop student here to add to group
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}