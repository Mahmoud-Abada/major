/**
 * Link Groups to Classrooms Dialog
 * Allows linking multiple groups to multiple classrooms
 */

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
import { useAuthContext } from "@/contexts/AuthContext";
import { useAddGroupToClassroomMutation } from "@/store/api/classroomApi";
import { BookOpen, Link, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface LinkGroupsToClassroomsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preSelectedClassrooms?: string[];
    preSelectedGroups?: string[];
    onSuccess?: () => void;
}

export default function LinkGroupsToClassroomsDialog({
    open,
    onOpenChange,
    preSelectedClassrooms = [],
    preSelectedGroups = [],
    onSuccess,
}: LinkGroupsToClassroomsDialogProps) {
    const { user } = useAuthContext();
    const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>(preSelectedClassrooms);
    const [selectedGroups, setSelectedGroups] = useState<string[]>(preSelectedGroups);
    const [classroomSearch, setClassroomSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [isLinking, setIsLinking] = useState(false);

    // State for fetched data
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [classroomsLoading, setClassroomsLoading] = useState(false);
    const [groupsLoading, setGroupsLoading] = useState(false);

    const [addGroupToClassroom] = useAddGroupToClassroomMutation();

    // Fetch classrooms using direct fetch (same as pages)
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

    // Fetch groups using direct fetch (same as pages)
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

    const handleClassroomToggle = (classroomId: string) => {
        setSelectedClassrooms(prev =>
            prev.includes(classroomId)
                ? prev.filter(id => id !== classroomId)
                : [...prev, classroomId]
        );
    };

    const handleGroupToggle = (groupId: string) => {
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleLink = async () => {
        if (selectedClassrooms.length === 0 || selectedGroups.length === 0) {
            toast.error("Please select at least one classroom and one group");
            return;
        }

        setIsLinking(true);

        try {
            // Create all combinations of classroom-group pairs
            const groupClassrooms = selectedClassrooms.flatMap(classroomId =>
                selectedGroups.map(groupId => ({
                    classroomId,
                    groupId,
                }))
            );

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
                body: JSON.stringify(groupClassrooms),
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
                toast.success(`Successfully linked ${selectedGroups.length} group${selectedGroups.length > 1 ? 's' : ''} to ${selectedClassrooms.length} classroom${selectedClassrooms.length > 1 ? 's' : ''}`);

                // Reset selections
                setSelectedClassrooms([]);
                setSelectedGroups([]);
                setClassroomSearch("");
                setGroupSearch("");

                // Call success callback and close dialog
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.message || "Failed to link groups to classrooms");
            }

        } catch (error: any) {
            // Handle error response
            const errorMessage = error?.message || "Failed to link groups to classrooms";
            toast.error(errorMessage);
        } finally {
            setIsLinking(false);
        }
    };

    const handleCancel = () => {
        setSelectedClassrooms([]);
        setSelectedGroups([]);
        setClassroomSearch("");
        setGroupSearch("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        Link Groups to Classrooms
                    </DialogTitle>
                    <DialogDescription>
                        Select classrooms and groups to link them together. Students in the selected groups will be able to access the selected classrooms.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-4">
                    {/* Classrooms Section */}
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Classrooms ({selectedClassrooms.length} selected)
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

                        <ScrollArea className="h-64 border rounded-md p-4">
                            {classroomsLoading ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredClassrooms.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No classrooms found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredClassrooms.map((classroom) => (
                                        <div
                                            key={classroom._id}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer border border-transparent hover:border-border transition-all"
                                            onClick={() => handleClassroomToggle(classroom._id)}
                                        >
                                            <Checkbox
                                                checked={selectedClassrooms.includes(classroom._id)}
                                                onChange={() => handleClassroomToggle(classroom._id)}
                                            />
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
                                                <p className="font-medium truncate">{classroom.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {classroom.field} • {classroom.level}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        {classroom.price?.toLocaleString()} DA
                                                    </span>
                                                    {classroom.location && (
                                                        <span className="text-xs text-muted-foreground">
                                                            • {classroom.location.commune}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: classroom.color }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Groups Section */}
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Groups ({selectedGroups.length} selected)
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

                        <ScrollArea className="h-64 border rounded-md p-4">
                            {groupsLoading ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredGroups.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No groups found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredGroups.map((group) => (
                                        <div
                                            key={group._id}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer border border-transparent hover:border-border transition-all"
                                            onClick={() => handleGroupToggle(group._id)}
                                        >
                                            <Checkbox
                                                checked={selectedGroups.includes(group._id)}
                                                onChange={() => handleGroupToggle(group._id)}
                                            />
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
                                                <p className="font-medium truncate">{group.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {group.major || group.field} • {group.level}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        Max: {group.maxStudents} students
                                                    </span>
                                                    {group.isSemestral && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                            Semestral
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: group.color }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <Separator />

                {/* Summary */}
                {(selectedClassrooms.length > 0 || selectedGroups.length > 0) && (
                    <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">
                            <strong>Summary:</strong> You are about to link{" "}
                            <strong>{selectedGroups.length}</strong> group{selectedGroups.length !== 1 ? "s" : ""} to{" "}
                            <strong>{selectedClassrooms.length}</strong> classroom{selectedClassrooms.length !== 1 ? "s" : ""}.
                            This will create <strong>{selectedClassrooms.length * selectedGroups.length}</strong> connection{selectedClassrooms.length * selectedGroups.length !== 1 ? "s" : ""}.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isLinking}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLink}
                        disabled={selectedClassrooms.length === 0 || selectedGroups.length === 0 || isLinking}
                    >
                        {isLinking ? "Linking..." : "Link Groups to Classrooms"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}