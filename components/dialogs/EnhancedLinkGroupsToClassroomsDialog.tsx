import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    GraduationCap,
    Link,
    Loader2,
    MapPin,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Group {
    _id: string;
    title: string;
    major: string;
    field: string;
    level: string;
    duration: string;
    capacity: number;
    startDate: string;
    endDate: string;
    picture?: string;
}

interface Classroom {
    _id: string;
    title: string;
    teacher: string;
    field: string;
    level: string;
    location: string;
    price: number;
    capacity: number;
    picture?: string;
}

interface PendingLink {
    groupId: string;
    classroomId: string;
    groupTitle: string;
    classroomTitle: string;
}

interface EnhancedLinkGroupsToClassroomsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preSelectedClassrooms?: string[];
    onSuccess?: () => void;
}

const EnhancedLinkGroupsToClassroomsDialog: React.FC<EnhancedLinkGroupsToClassroomsDialogProps> = ({
    open,
    onOpenChange,
    preSelectedClassrooms = [],
    onSuccess,
}) => {
    // State management
    const [groups, setGroups] = useState<Group[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);

    // Fetch data when dialog opens
    useEffect(() => {
        if (open) {
            fetchData();
            setSelectedClassrooms(preSelectedClassrooms);
        } else {
            // Reset state when dialog closes
            setPendingLinks([]);
            setSearchQuery('');
            setSelectedGroups([]);
            setSelectedClassrooms([]);
        }
    }, [open, preSelectedClassrooms]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Fetch groups and classrooms in parallel
            const [groupsResponse, classroomsResponse] = await Promise.all([
                fetch('http://127.0.0.1:3001/classroom/get-groups', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        status: 'all',
                        pagination: { numItems: 100, cursor: null },
                    }),
                }),
                fetch('http://127.0.0.1:3001/classroom/get-classrooms', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        status: 'all',
                        pagination: { numItems: 100, cursor: null },
                        groupPagination: { numItems: 1, cursor: null },
                    }),
                }),
            ]);

            if (!groupsResponse.ok || !classroomsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const [groupsData, classroomsData] = await Promise.all([
                groupsResponse.json(),
                classroomsResponse.json(),
            ]);

            setGroups(groupsData.payload?.groups || []);
            setClassrooms(classroomsData.payload?.classrooms || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Filter groups based on search
    const filteredGroups = groups.filter((group) =>
        group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.field.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter classrooms (show pre-selected or all if none selected)
    const filteredClassrooms = classrooms.filter((classroom) =>
        preSelectedClassrooms.length === 0 || preSelectedClassrooms.includes(classroom._id)
    );

    // Selection handlers
    const handleGroupSelect = (groupId: string, selected: boolean) => {
        setSelectedGroups(prev =>
            selected
                ? [...prev, groupId]
                : prev.filter(id => id !== groupId)
        );
    };

    const handleClassroomSelect = (classroomId: string, selected: boolean) => {
        setSelectedClassrooms(prev =>
            selected
                ? [...prev, classroomId]
                : prev.filter(id => id !== classroomId)
        );
    };

    const handleSelectAllGroups = (selected: boolean) => {
        setSelectedGroups(selected ? filteredGroups.map(g => g._id) : []);
    };

    const handleSelectAllClassrooms = (selected: boolean) => {
        setSelectedClassrooms(selected ? filteredClassrooms.map(c => c._id) : []);
    };

    // Create links from selected items
    const handleCreateLinks = () => {
        if (selectedGroups.length === 0 || selectedClassrooms.length === 0) {
            toast.error('Please select at least one group and one classroom');
            return;
        }

        const newLinks: PendingLink[] = [];

        selectedGroups.forEach(groupId => {
            selectedClassrooms.forEach(classroomId => {
                // Check if link already exists
                const existingLink = pendingLinks.find(
                    link => link.groupId === groupId && link.classroomId === classroomId
                );

                if (!existingLink) {
                    const group = groups.find(g => g._id === groupId);
                    const classroom = classrooms.find(c => c._id === classroomId);

                    if (group && classroom) {
                        newLinks.push({
                            groupId,
                            classroomId,
                            groupTitle: group.title,
                            classroomTitle: classroom.title,
                        });
                    }
                }
            });
        });

        if (newLinks.length === 0) {
            toast.info('All selected combinations are already linked');
            return;
        }

        setPendingLinks(prev => [...prev, ...newLinks]);
        setSelectedGroups([]);
        setSelectedClassrooms([]);
        toast.success(`Created ${newLinks.length} new links`);
    };

    // Remove link handler
    const handleRemoveLink = (groupId: string, classroomId: string) => {
        setPendingLinks(prev =>
            prev.filter(link => !(link.groupId === groupId && link.classroomId === classroomId))
        );
        toast.success('Link removed');
    };

    // Clear all links
    const handleClearAll = () => {
        setPendingLinks([]);
        setSelectedGroups([]);
        setSelectedClassrooms([]);
        toast.success('All links cleared');
    };

    // Save links
    const handleSaveLinks = async () => {
        if (pendingLinks.length === 0) {
            toast.error('No links to save');
            return;
        }

        setSaving(true);
        try {
            const token = sessionStorage.getItem('access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Save all links
            const promises = pendingLinks.map((link) =>
                fetch('http://127.0.0.1:3001/classroom/link-group-to-classroom', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        groupId: link.groupId,
                        classroomId: link.classroomId,
                    }),
                })
            );

            const responses = await Promise.all(promises);
            const failedLinks = responses.filter((response) => !response.ok);

            if (failedLinks.length > 0) {
                throw new Error(`Failed to save ${failedLinks.length} links`);
            }

            toast.success(`Successfully saved ${pendingLinks.length} links`);
            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving links:', error);
            toast.error('Failed to save some links');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] w-full h-full p-0">
                <div className="flex flex-col h-full">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-2xl font-bold">
                            Link Groups to Classrooms
                        </DialogTitle>
                        <DialogDescription>
                            Select groups and classrooms to create links between them
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Groups Panel */}
                        <div className="w-1/2 border-r flex flex-col">
                            <div className="p-4 border-b bg-blue-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                                        <Users className="h-5 w-5 mr-2" />
                                        Groups ({filteredGroups.length})
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selectedGroups.length === filteredGroups.length && filteredGroups.length > 0}
                                            onCheckedChange={handleSelectAllGroups}
                                        />
                                        <span className="text-sm">Select All</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search groups..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                {selectedGroups.length > 0 && (
                                    <Badge variant="secondary" className="mt-2">
                                        {selectedGroups.length} selected
                                    </Badge>
                                )}
                            </div>

                            <ScrollArea className="flex-1 p-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredGroups.map((group) => (
                                            <Card
                                                key={group._id}
                                                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${selectedGroups.includes(group._id)
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-border hover:border-blue-300'
                                                    }`}
                                                onClick={() => handleGroupSelect(group._id, !selectedGroups.includes(group._id))}
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox
                                                            checked={selectedGroups.includes(group._id)}
                                                            onCheckedChange={(checked) => handleGroupSelect(group._id, !!checked)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="flex-1">
                                                            <CardTitle className="text-base font-semibold text-blue-700 mb-2">
                                                                {group.title}
                                                            </CardTitle>
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    <GraduationCap className="w-3 h-3 mr-1" />
                                                                    {group.major}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {group.field}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {group.level}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        {group.picture && (
                                                            <img
                                                                src={group.picture}
                                                                alt={group.title}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <div className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-2" />
                                                            <span>{group.duration}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Users className="w-3 h-3 mr-2" />
                                                            <span>Capacity: {group.capacity}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="w-3 h-3 mr-2" />
                                                            <span>
                                                                {new Date(group.startDate).toLocaleDateString()} - {new Date(group.endDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {!loading && filteredGroups.length === 0 && (
                                    <div className="text-center py-12">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            {searchQuery ? 'No groups match your search' : 'No groups available'}
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Classrooms Panel */}
                        <div className="w-1/2 flex flex-col">
                            <div className="p-4 border-b bg-green-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-green-700 flex items-center">
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        Classrooms ({filteredClassrooms.length})
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selectedClassrooms.length === filteredClassrooms.length && filteredClassrooms.length > 0}
                                            onCheckedChange={handleSelectAllClassrooms}
                                        />
                                        <span className="text-sm">Select All</span>
                                    </div>
                                </div>

                                {selectedClassrooms.length > 0 && (
                                    <Badge variant="secondary" className="mb-2">
                                        {selectedClassrooms.length} selected
                                    </Badge>
                                )}

                                {selectedGroups.length > 0 && selectedClassrooms.length > 0 && (
                                    <Button
                                        onClick={handleCreateLinks}
                                        className="w-full mb-2"
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Links ({selectedGroups.length} × {selectedClassrooms.length})
                                    </Button>
                                )}
                            </div>

                            <ScrollArea className="flex-1 p-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredClassrooms.map((classroom) => {
                                            const classroomLinks = pendingLinks.filter(link => link.classroomId === classroom._id);

                                            return (
                                                <Card
                                                    key={classroom._id}
                                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${selectedClassrooms.includes(classroom._id)
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-border hover:border-green-300'
                                                        }`}
                                                    onClick={() => handleClassroomSelect(classroom._id, !selectedClassrooms.includes(classroom._id))}
                                                >
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox
                                                                checked={selectedClassrooms.includes(classroom._id)}
                                                                onCheckedChange={(checked) => handleClassroomSelect(classroom._id, !!checked)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div className="flex-1">
                                                                <CardTitle className="text-base font-semibold text-green-700 mb-2">
                                                                    {classroom.title}
                                                                </CardTitle>
                                                                <div className="flex flex-wrap gap-1 mb-2">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <Users className="w-3 h-3 mr-1" />
                                                                        {classroom.teacher}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {classroom.field}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {classroom.level}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            {classroom.picture && (
                                                                <img
                                                                    src={classroom.picture}
                                                                    alt={classroom.title}
                                                                    className="w-12 h-12 rounded-lg object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="pt-0">
                                                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                                            <div className="flex items-center">
                                                                <MapPin className="w-3 h-3 mr-2" />
                                                                <span>{classroom.location}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <DollarSign className="w-3 h-3 mr-2" />
                                                                <span>${classroom.price}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="w-3 h-3 mr-2" />
                                                                <span>Capacity: {classroom.capacity}</span>
                                                            </div>
                                                        </div>

                                                        {/* Pending Links */}
                                                        {classroomLinks.length > 0 && (
                                                            <div className="border-t pt-3">
                                                                <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                                                                    <Link className="w-4 h-4 mr-1" />
                                                                    Pending Links ({classroomLinks.length})
                                                                </h4>
                                                                <div className="space-y-1">
                                                                    {classroomLinks.map((link) => (
                                                                        <div
                                                                            key={`${link.groupId}-${link.classroomId}`}
                                                                            className="flex items-center justify-between bg-green-100 rounded-md p-2"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <span className="text-sm font-medium text-green-800 truncate">
                                                                                {link.groupTitle}
                                                                            </span>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleRemoveLink(link.groupId, link.classroomId)}
                                                                                className="h-6 w-6 p-0 text-green-600 hover:text-red-600 hover:bg-red-100 ml-2"
                                                                            >
                                                                                <X className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}

                                {!loading && filteredClassrooms.length === 0 && (
                                    <div className="text-center py-12">
                                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No classrooms available</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                {pendingLinks.length > 0 && (
                                    <>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                                            {pendingLinks.length} pending link{pendingLinks.length !== 1 ? 's' : ''}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleClearAll}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Clear All
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveLinks}
                                    disabled={saving || pendingLinks.length === 0}
                                    className="min-w-[120px]"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Link className="h-4 w-4 mr-2" />
                                            Save Links ({pendingLinks.length})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EnhancedLinkGroupsToClassroomsDialog;