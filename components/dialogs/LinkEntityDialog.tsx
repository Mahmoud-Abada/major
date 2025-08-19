import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    BookOpen,
    DollarSign,
    GraduationCap,
    Link,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Search,
    User,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EntityInfo {
    id: string;
    type: 'group' | 'classroom' | 'student';
    title: string;
    subtitle?: string;
    details?: Record<string, any>;
}

interface LinkableItem {
    _id: string;
    title?: string;
    name?: string;
    field?: string;
    level?: string;
    major?: string;
    teacher?: string;
    location?: string;
    price?: number;
    capacity?: number;
    email?: string;
    phone?: string;
    picture?: string;
    [key: string]: any;
}

interface LinkEntityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityInfo: EntityInfo | null;
    linkType: 'classrooms' | 'groups' | 'students';
    allowMultiple?: boolean;
    onSuccess?: () => void;
}

const LinkEntityDialog: React.FC<LinkEntityDialogProps> = ({
    open,
    onOpenChange,
    entityInfo,
    linkType,
    allowMultiple = true,
    onSuccess,
}) => {
    const [items, setItems] = useState<LinkableItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('');

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (open) {
            fetchItems();
            setSelectedItems([]);
            setSelectedItem('');
            setSearchQuery('');
        }
    }, [open, linkType]);

    const fetchItems = async () => {
        if (!entityInfo) return;

        setLoading(true);
        try {
            const token = sessionStorage.getItem('access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let endpoint = '';
            let requestBody = {};

            switch (linkType) {
                case 'classrooms':
                    endpoint = 'http://127.0.0.1:3001/classroom/get-classrooms';
                    requestBody = {
                        status: 'all',
                        pagination: { numItems: 100, cursor: null },
                        groupPagination: { numItems: 1, cursor: null },
                    };
                    break;
                case 'groups':
                    endpoint = 'http://127.0.0.1:3001/classroom/get-groups';
                    requestBody = {
                        status: 'all',
                        pagination: { numItems: 100, cursor: null },
                    };
                    break;
                case 'students':
                    endpoint = 'http://127.0.0.1:3001/classroom/get-students';
                    requestBody = {
                        status: 'all',
                        pagination: { numItems: 100, cursor: null },
                    };
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const fetchedItems = data.payload?.[linkType] || [];
            setItems(fetchedItems);
        } catch (error) {
            console.error('Error fetching items:', error);
            toast.error(`Failed to load ${linkType}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter((item) => {
        const searchableText = [
            item.title,
            item.name,
            item.field,
            item.level,
            item.major,
            item.teacher,
            item.location,
            item.email,
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(searchQuery.toLowerCase());
    });

    const handleItemSelect = (itemId: string, selected: boolean) => {
        if (allowMultiple) {
            setSelectedItems(prev =>
                selected
                    ? [...prev, itemId]
                    : prev.filter(id => id !== itemId)
            );
        } else {
            setSelectedItem(selected ? itemId : '');
        }
    };

    const handleLink = async () => {
        if (!entityInfo) return;

        const itemsToLink = allowMultiple ? selectedItems : (selectedItem ? [selectedItem] : []);

        if (itemsToLink.length === 0) {
            toast.error(`Please select at least one ${linkType.slice(0, -1)}`);
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

            let endpoint = '';
            let requestBody = {};

            // Determine the correct API endpoint and request structure
            switch (`${entityInfo.type}-${linkType}`) {
                case 'group-classrooms':
                    endpoint = 'http://127.0.0.1:3001/classroom/link-group-to-classrooms';
                    requestBody = {
                        groupId: entityInfo.id,
                        classroomIds: itemsToLink,
                    };
                    break;
                case 'classroom-groups':
                    endpoint = 'http://127.0.0.1:3001/classroom/link-classroom-to-group';
                    requestBody = {
                        classroomId: entityInfo.id,
                        groupId: itemsToLink[0], // Classroom can only be linked to one group
                    };
                    break;
                case 'group-students':
                    endpoint = 'http://127.0.0.1:3001/classroom/add-students-to-group';
                    requestBody = {
                        groupId: entityInfo.id,
                        studentIds: itemsToLink,
                    };
                    break;
                case 'classroom-students':
                    endpoint = 'http://127.0.0.1:3001/classroom/add-students-to-classroom';
                    requestBody = {
                        classroomId: entityInfo.id,
                        studentIds: itemsToLink,
                    };
                    break;
                default:
                    throw new Error('Invalid link configuration');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to link ${linkType}`);
            }

            const result = await response.json();

            if (result.status === 'success' || result.success) {
                toast.success(`Successfully linked ${itemsToLink.length} ${linkType.slice(0, -1)}${itemsToLink.length > 1 ? 's' : ''}`);
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.message || `Failed to link ${linkType}`);
            }
        } catch (error: any) {
            console.error('Error linking items:', error);
            toast.error(error.message || `Failed to link ${linkType}`);
        } finally {
            setSaving(false);
        }
    };

    const getEntityIcon = (type: string) => {
        switch (type) {
            case 'group': return <Users className="h-4 w-4" />;
            case 'classroom': return <BookOpen className="h-4 w-4" />;
            case 'student': return <User className="h-4 w-4" />;
            default: return <Users className="h-4 w-4" />;
        }
    };

    const getLinkTypeIcon = (type: string) => {
        switch (type) {
            case 'classrooms': return <BookOpen className="h-4 w-4" />;
            case 'groups': return <Users className="h-4 w-4" />;
            case 'students': return <User className="h-4 w-4" />;
            default: return <Users className="h-4 w-4" />;
        }
    };

    const renderItemCard = (item: LinkableItem) => {
        const isSelected = allowMultiple
            ? selectedItems.includes(item._id)
            : selectedItem === item._id;

        return (
            <Card
                key={item._id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-sm border ${isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                onClick={() => handleItemSelect(item._id, !isSelected)}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        {allowMultiple ? (
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleItemSelect(item._id, !!checked)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1"
                            />
                        ) : (
                            <RadioGroup value={selectedItem} onValueChange={setSelectedItem}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={item._id}
                                        id={item._id}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </RadioGroup>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm leading-tight mb-1">
                                        {item.title || item.name}
                                    </h4>

                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {item.field && (
                                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                                {item.field}
                                            </Badge>
                                        )}
                                        {item.level && (
                                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                {item.level}
                                            </Badge>
                                        )}
                                        {item.major && (
                                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                <GraduationCap className="w-3 h-3 mr-1" />
                                                {item.major}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {item.picture && (
                                    <img
                                        src={item.picture}
                                        alt={item.title || item.name}
                                        className="w-10 h-10 rounded-md object-cover ml-2 flex-shrink-0"
                                    />
                                )}
                            </div>

                            <div className="space-y-1 text-xs text-muted-foreground">
                                {item.teacher && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{item.teacher}</span>
                                    </div>
                                )}
                                {item.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{item.location}</span>
                                    </div>
                                )}
                                {item.price && (
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        <span>${item.price}</span>
                                    </div>
                                )}
                                {item.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        <span>{item.email}</span>
                                    </div>
                                )}
                                {item.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        <span>{item.phone}</span>
                                    </div>
                                )}
                                {item.capacity && (
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>Capacity: {item.capacity}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (!entityInfo) return null;

    const selectedCount = allowMultiple ? selectedItems.length : (selectedItem ? 1 : 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                <div className="flex flex-col h-full max-h-[90vh]">
                    {/* Header */}
                    <DialogHeader className="px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {getEntityIcon(entityInfo.type)}
                                    <DialogTitle className="text-lg font-semibold">
                                        Link {entityInfo.type}
                                    </DialogTitle>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Entity Info */}
                    <div className="px-6 py-4 bg-muted/30">
                        <div className="flex items-center gap-3">
                            {entityInfo.details?.picture && (
                                <img
                                    src={entityInfo.details.picture}
                                    alt={entityInfo.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            )}
                            <div>
                                <h3 className="font-medium text-base">{entityInfo.title}</h3>
                                {entityInfo.subtitle && (
                                    <p className="text-sm text-muted-foreground">{entityInfo.subtitle}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="px-6 py-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={`Search ${linkType}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {getLinkTypeIcon(linkType)}
                                <span>{filteredItems.length} {linkType}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full px-6 py-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading {linkType}...</span>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-12">
                                    {getLinkTypeIcon(linkType)}
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {searchQuery ? `No ${linkType} match your search` : `No ${linkType} available`}
                                        </p>
                                        {searchQuery && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Try adjusting your search criteria
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredItems.map(renderItemCard)}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-background">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                {selectedCount > 0 && (
                                    <span>{selectedCount} {linkType.slice(0, -1)}{selectedCount > 1 ? 's' : ''} selected</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleLink}
                                    disabled={saving || selectedCount === 0}
                                    className="min-w-[100px]"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Linking...
                                        </>
                                    ) : (
                                        <>
                                            <Link className="h-4 w-4 mr-2" />
                                            Link ({selectedCount})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LinkEntityDialog;