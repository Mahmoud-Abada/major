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
import { useAddGroupToClassroomMutation, useGetClassroomsQuery } from "@/store/api/classroomApi";
import { useGetGroupsQuery } from "@/store/api/groupApi";
import { BookOpen, Link, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
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

    // Fetch classrooms and groups
    const {
        data: classroomsResponse,
        isLoading: classroomsLoading,
    } = useGetClassroomsQuery({
        status: "notArchived",
        pagination: { numItems: 100, cursor: null },
        fetchBy: { userType: user?.userType || "teacher", userId: user?.id },
    });

    const {
        data: groupsResponse,
        isLoading: groupsLoading,
    } = useGetGroupsQuery({
        status: "notArchived",
        pagination: { numItems: 100, cursor: null },
        fetchBy: { userType: user?.userType || "teacher", userId: user?.id },
    });

    const [addGroupToClassroom] = useAddGroupToClassroomMutation();

    const classrooms = classroomsResponse?.data || [];
    const groups = groupsResponse?.data || [];

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
            group.field?.toLowerCase().includes(groupSearch.toLowerCase()) ||
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
            const assignments = selectedClassrooms.flatMap(classroom =>
                selectedGroups.map(group => ({
                    classroom,
                    group,
                }))
            );

            await addGroupToClassroom(assignments).unwrap();

            toast.success(
                `Successfully linked ${selectedGroups.length} group${selectedGroups.length > 1 ? 's' : ''} to ${selectedClassrooms.length} classroom${selectedClassrooms.length > 1 ? 's' : ''}`
            );

            // Reset selections
            setSelectedClassrooms([]);
            setSelectedGroups([]);
            setClassroomSearch("");
            setGroupSearch("");

            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to link groups to classrooms");
            console.error("Link error:", error);
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
                                            key={classroom.id}
                                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                            onClick={() => handleClassroomToggle(classroom.id)}
                                        >
                                            <Checkbox
                                                checked={selectedClassrooms.includes(classroom.id)}
                                                onChange={() => handleClassroomToggle(classroom.id)}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{classroom.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {classroom.field} • {classroom.level}
                                                </p>
                                            </div>
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
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
                                            key={group.id}
                                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                            onClick={() => handleGroupToggle(group.id)}
                                        >
                                            <Checkbox
                                                checked={selectedGroups.includes(group.id)}
                                                onChange={() => handleGroupToggle(group.id)}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{group.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {group.field || group.major} • {group.level}
                                                </p>
                                                {group.memberCount && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {group.memberCount} members
                                                    </p>
                                                )}
                                            </div>
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
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