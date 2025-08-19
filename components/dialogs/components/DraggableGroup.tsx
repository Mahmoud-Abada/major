/**
 * Draggable Group Component for Drag & Drop
 */

import { Badge } from "@/components/ui/badge";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Users } from "lucide-react";

interface DraggableGroupProps {
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
}

export function DraggableGroup({ group }: DraggableGroupProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: group._id,
        data: {
            type: 'group',
            group,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                group cursor-grab active:cursor-grabbing
                bg-white border-2 border-blue-200 rounded-lg p-4 
                hover:border-blue-400 hover:shadow-md transition-all duration-200
                ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
            `}
        >
            <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 text-blue-600">
                    <GripVertical className="h-5 w-5" />
                </div>

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

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Max: {group.maxStudents}
                        </span>
                        <span>
                            {formatDate(group.startDate)} - {formatDate(group.endDate)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}