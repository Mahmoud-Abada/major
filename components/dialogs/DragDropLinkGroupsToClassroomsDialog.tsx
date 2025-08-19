/**
 * Enhanced Drag & Drop Link Groups to Classrooms Dialog
 * Allows dragging groups to classrooms with visual feedback
 */

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
import { BookOpen, CheckCircle, Link, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DraggableGroup } from "./components/DraggableGroup";
import { DroppableClassroom } from "./components/DroppableClassroom";

interface LinkGroupsToClassroomsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preSelectedClassrooms?: string[];
    preSelectedGroups?: string[];
    onSuccess?: () => void;
}

export default function DragDropLinkGroupsToClassroomsDialog({
    open,
    onOpenChange,
    preSelectedClassrooms = [],
    preSelectedGroups = [],
    onSuccess,
}: LinkGroupsToClassroomsDialogProps) {
    const [classroomSearch, setClassroomSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [isLinking, setIsLinking] = useState(false);
    const [activeGroup, setActiveGroup] = useState<any>(null);
    const [linkedPairs, setLinkedPairs] = useState<Array<{ classroomId: string, groupId: string }>>([]);

    // State for fetched data
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [classroomsLoading, setClassroomsLoading] = useState(false);
    const [groupsLoading, setGroupsLoading] = useState(false);

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

    // Fetch classrooms using direct fetch
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

    // Fetch groups using direct fetch
    const fetchGroups = async () => {
        setGroupsLoading(true);

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
                pagination: { numItems: 1, cursor: null },
                groupPagination: { numItems: 100, cursor: null },
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
            setGroups(data.payload?.groups || []);
        } catch (error) {
            setGroups([]);
        } finally {
            setGroupsLoading(false);
        }
    };

    // Fetch data when dialog opens
    useEffect(() => {
        if (open && typeof window !== 'undefined') {
            fetchClassrooms();
            fetchGroups();
        }
    }, [open]);

    // Filter classrooms and groups based on search
    const filteredClassrooms = useMemo(() => {
        return classrooms.filter((classroom) =>
            classroom.title.toLowerCase().includes(classroomSearch.toLowerCase()) ||
            classroom.field.toLowerCase().includes(classroomSearch.toLowerCase()) ||
            classroom.level.toLowerCase().includes(classroomSearch.toLowerCase())
        );
    }, [classrooms, classroomSearch]);

    const filteredGroups = useMemo(() => {
        return groups.filter((group) =>
            group.title.toLowerCase().includes(groupSearch.toLowerCase()) ||
            (group.major || group.field || "").toLowerCase().includes(groupSearch.toLowerCase()) ||
            group.level.toLowerCase().includes(groupSearch.toLowerCase())
        );
    }, [groups, groupSearch]);

    const handleDragStart = (event: DragStartEvent) => {
        const group = groups.find(g => g._id === event.active.id);
        setActiveGroup(group);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveGroup(null);

        if (over && active.id !== over.id) {
            const groupId = active.id as string;
            const classroomId = over.id as string;

            // Check if this pair already exists
            const exists = linkedPairs.some(pair =>
                pair.groupId === groupId && pair.classroomId === classroomId
            );

            if (!exists) {
                setLinkedPairs(prev => [...prev, { classroomId, groupId }]);
                toast.success("Group linked to classroom! Click 'Link All' to save.");
            } else {
                toast.info("This group is already linked to this classroom.");
            }
        }
    };

    const removePair = (classroomId: string, groupId: string) => {
        setLinkedPairs(prev => prev.filter(pair =>
            !(pair.classroomId === classroomId && pair.groupId === groupId)
        ));
    };

    const handleLinkAll = async () => {
        if (linkedPairs.length === 0) {
            toast.error("No links to save. Drag groups to classrooms first.");
            return;
        }

        setIsLinking(true);

        try {
            const token = sessionStorage.getItem("access_token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("http://127.0.0.1:3001/classroom/group-add-classroom", {
                method: "POST",
                headers,
                body: JSON.stringify(linkedPairs),
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
                toast.success(`Successfully linked ${linkedPairs.length} group-classroom pair${linkedPairs.length > 1 ? 's' : ''}!`);

                // Reset state
                setLinkedPairs([]);
                setClassroomSearch("");
                setGroupSearch("");

                // Call success callback and close dialog
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.message || "Failed to link groups to classrooms");
            }

        } catch (error: any) {
            const errorMessage = error?.message || "Failed to link groups to classrooms";
            toast.error(errorMessage);
        } finally {
            setIsLinking(false);
        }
    };

    const handleCancel = () => {
        setLinkedPairs([]);
        setClassroomSearch("");
        setGroupSearch("");
        onOpenChange(false);
    };

    const getClassroomById = (id: string) => classrooms.find(c => c._id === id);
    const getGroupById = (id: string) => groups.find(g => g._id === id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        Link Groups to Classrooms (Drag & Drop)
                    </DialogTitle>
                    <DialogDescription>
                        Drag groups from the left panel and drop them onto classrooms on the right to create links.
                        You can link multiple groups to multiple classrooms.
                    </DialogDescription>
                </DialogHeader>

                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-2 gap-6 py-4 min-h-[600px]">
                        {/* Groups Section (Left) */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Groups (Drag to link)
                                </Label>
                                <div className="relative mt-2">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search groups..."
                                        value={groupSearch}
                                        onChange={(e) => setGroupSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <ScrollArea className="h-[500px] border rounded-md p-4 bg-blue-50/30">
                                {groupsLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : filteredGroups.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No groups found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredGroups.map((group) => (
                                            <DraggableGroup key={group._id} group={group} />
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
                                    Classrooms (Drop groups here)
                                </Label>
                                <div className="relative mt-2">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search classrooms..."
                                        value={classroomSearch}
                                        onChange={(e) => setClassroomSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
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
                                            <DroppableClassroom
                                                key={classroom._id}
                                                classroom={classroom}
                                                linkedGroups={linkedPairs
                                                    .filter(pair => pair.classroomId === classroom._id)
                                                    .map(pair => getGroupById(pair.groupId))
                                                    .filter(Boolean)
                                                }
                                                onRemoveGroup={(groupId) => removePair(classroom._id, groupId)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    <DragOverlay>
                        {activeGroup && (
                            <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        {activeGroup.frontPicture ? (
                                            <img
                                                src={activeGroup.frontPicture}
                                                alt={activeGroup.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Users className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{activeGroup.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activeGroup.major || activeGroup.field} • {activeGroup.level}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                <Separator />

                {/* Linked Pairs Summary */}
                {linkedPairs.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-md max-h-32 overflow-y-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Pending Links ({linkedPairs.length})</span>
                        </div>
                        <div className="space-y-1">
                            {linkedPairs.map((pair, index) => {
                                const classroom = getClassroomById(pair.classroomId);
                                const group = getGroupById(pair.groupId);
                                return (
                                    <div key={index} className="flex items-center justify-between text-sm bg-white rounded px-2 py-1">
                                        <span>
                                            <strong>{group?.title}</strong> → <strong>{classroom?.title}</strong>
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removePair(pair.classroomId, pair.groupId)}
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
                    <Button variant="outline" onClick={handleCancel} disabled={isLinking}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLinkAll}
                        disabled={linkedPairs.length === 0 || isLinking}
                    >
                        {isLinking ? "Linking..." : `Link All (${linkedPairs.length})`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}