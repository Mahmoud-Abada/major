/**
 * Droppable Classroom Component for Drag & Drop
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDroppable } from "@dnd-kit/core";
import { BookOpen, MapPin, Plus, Users, X } from "lucide-react";

interface DroppableClassroomProps {
    classroom: {
        _id: string;
        title: string;
        field: string;
        level: string;
        teacher?: string | {
            name?: string;
            username?: string;
        };
        price: number;
        mode: string;
        maxStudents: number;
        color: string;
        frontPicture: string;
        location?: {
            commune: string;
        };
    };
    linkedGroups: any[];
    onRemoveGroup: (groupId: string) => void;
}

export function DroppableClassroom({ classroom, linkedGroups, onRemoveGroup }: DroppableClassroomProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: classroom._id,
        data: {
            type: 'classroom',
            classroom,
        },
    });

    const getTeacherName = () => {
        if (!classroom.teacher) return "Teacher not assigned";

        if (typeof classroom.teacher === "string") {
            return classroom.teacher;
        }

        if (typeof classroom.teacher === "object") {
            return classroom.teacher.name || classroom.teacher.username || "Teacher not assigned";
        }

        return "Teacher not assigned";
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                bg-white border-2 rounded-lg p-4 transition-all duration-200
                ${isOver
                    ? 'border-green-500 bg-green-50 shadow-lg scale-102'
                    : 'border-green-200 hover:border-green-400 hover:shadow-md'
                }
            `}
        >
            <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {classroom.frontPicture ? (
                        <img
                            src={classroom.frontPicture}
                            alt={classroom.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{classroom.title}</p>
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: classroom.color }}
                        />
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 truncate">
                        {getTeacherName()}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                            {classroom.field}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {classroom.level}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Max: {classroom.maxStudents}
                        </span>
                        {classroom.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {classroom.location.commune}
                            </span>
                        )}
                        <span className="font-medium">
                            {classroom.price?.toLocaleString()} DA/{classroom.mode}
                        </span>
                    </div>

                    {/* Linked Groups */}
                    {linkedGroups.length > 0 && (
                        <div className="border-t pt-2">
                            <p className="text-xs font-medium text-green-700 mb-2">
                                Linked Groups ({linkedGroups.length})
                            </p>
                            <div className="space-y-1">
                                {linkedGroups.map((group) => (
                                    <div
                                        key={group._id}
                                        className="flex items-center justify-between bg-green-100 rounded px-2 py-1"
                                    >
                                        <span className="text-xs font-medium truncate">
                                            {group.title}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onRemoveGroup(group._id)}
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
                            <div className="flex items-center justify-center bg-green-100 border-2 border-dashed border-green-400 rounded-lg py-2">
                                <Plus className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm font-medium text-green-700">
                                    Drop group here to link
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}