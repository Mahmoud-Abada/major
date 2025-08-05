/**
 * PostFilters Component
 * Advanced filtering and search for posts
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PostFilters as PostFiltersType } from '@/types/classroom';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    Filter,
    Search,
    SlidersHorizontal,
    Tag,
    X
} from 'lucide-react';
import { useState } from 'react';

interface PostFiltersProps {
    filters: PostFiltersType;
    onFiltersChange: (filters: PostFiltersType) => void;
    onClear: () => void;
    className?: string;
}

const POST_TYPES = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'poll', label: 'Poll' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'material', label: 'Material' }
];

const MOCK_AUTHORS = [
    { value: 'teacher1', label: 'Dr. Smith' },
    { value: 'teacher2', label: 'Prof. Johnson' },
    { value: 'teacher3', label: 'Ms. Davis' }
];

const MOCK_CLASSROOMS = [
    { value: 'class1', label: 'Mathematics 101' },
    { value: 'class2', label: 'Physics 201' },
    { value: 'class3', label: 'Chemistry 301' }
];

export function PostFilters({
    filters,
    onFiltersChange,
    onClear,
    className = ''
}: PostFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTag, setNewTag] = useState('');

    const updateFilter = (key: keyof PostFiltersType, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const addTag = () => {
        if (newTag.trim() && !filters.tags?.includes(newTag.trim())) {
            updateFilter('tags', [...(filters.tags || []), newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateFilter('tags', filters.tags?.filter(tag => tag !== tagToRemove) || []);
    };

    const hasActiveFilters = () => {
        return !!(
            filters.type ||
            filters.author ||
            filters.classroomId ||
            filters.isPublished !== undefined ||
            filters.isPinned !== undefined ||
            filters.dateRange ||
            (filters.tags && filters.tags.length > 0)
        );
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.type) count++;
        if (filters.author) count++;
        if (filters.classroomId) count++;
        if (filters.isPublished !== undefined) count++;
        if (filters.isPinned !== undefined) count++;
        if (filters.dateRange) count++;
        if (filters.tags && filters.tags.length > 0) count += filters.tags.length;
        return count;
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                        {hasActiveFilters() && (
                            <Badge variant="secondary" className="ml-2">
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters() && (
                            <Button variant="ghost" size="sm" onClick={onClear}>
                                <X className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Post Type</Label>
                        <Select
                            value={filters.type || ''}
                            onValueChange={(value) => updateFilter('type', value || undefined)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Types</SelectItem>
                                {POST_TYPES.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Classroom</Label>
                        <Select
                            value={filters.classroomId || ''}
                            onValueChange={(value) => updateFilter('classroomId', value || undefined)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Classrooms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Classrooms</SelectItem>
                                {MOCK_CLASSROOMS.map(classroom => (
                                    <SelectItem key={classroom.value} value={classroom.value}>
                                        {classroom.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="space-y-4 pt-4 border-t">
                        {/* Author Filter */}
                        <div className="space-y-2">
                            <Label>Author</Label>
                            <Select
                                value={filters.author || ''}
                                onValueChange={(value) => updateFilter('author', value || undefined)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Authors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Authors</SelectItem>
                                    {MOCK_AUTHORS.map(author => (
                                        <SelectItem key={author.value} value={author.value}>
                                            {author.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filters */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Published Status</Label>
                                <Select
                                    value={filters.isPublished === undefined ? '' : filters.isPublished.toString()}
                                    onValueChange={(value) =>
                                        updateFilter('isPublished', value === '' ? undefined : value === 'true')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Posts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Posts</SelectItem>
                                        <SelectItem value="true">Published Only</SelectItem>
                                        <SelectItem value="false">Drafts Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <Label>Pinned Only</Label>
                                <Switch
                                    checked={filters.isPinned || false}
                                    onCheckedChange={(checked) => updateFilter('isPinned', checked || undefined)}
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.dateRange?.start
                                                ? format(new Date(filters.dateRange.start), 'PPP')
                                                : 'Start date'
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    updateFilter('dateRange', {
                                                        ...filters.dateRange,
                                                        start: date.getTime()
                                                    });
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.dateRange?.end
                                                ? format(new Date(filters.dateRange.end), 'PPP')
                                                : 'End date'
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    updateFilter('dateRange', {
                                                        ...filters.dateRange,
                                                        end: date.getTime()
                                                    });
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Tags Filter */}
                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Add tag filter..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" variant="outline" onClick={addTag}>
                                    <Tag className="h-4 w-4" />
                                </Button>
                            </div>

                            {filters.tags && filters.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {filters.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Active Filters Summary */}
                {hasActiveFilters() && (
                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Active Filters:</span>
                            <Button variant="ghost" size="sm" onClick={onClear}>
                                Clear All
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {filters.type && (
                                <Badge variant="outline">
                                    Type: {POST_TYPES.find(t => t.value === filters.type)?.label}
                                </Badge>
                            )}
                            {filters.author && (
                                <Badge variant="outline">
                                    Author: {MOCK_AUTHORS.find(a => a.value === filters.author)?.label}
                                </Badge>
                            )}
                            {filters.classroomId && (
                                <Badge variant="outline">
                                    Classroom: {MOCK_CLASSROOMS.find(c => c.value === filters.classroomId)?.label}
                                </Badge>
                            )}
                            {filters.isPublished !== undefined && (
                                <Badge variant="outline">
                                    {filters.isPublished ? 'Published' : 'Drafts'}
                                </Badge>
                            )}
                            {filters.isPinned && (
                                <Badge variant="outline">Pinned</Badge>
                            )}
                            {filters.dateRange && (
                                <Badge variant="outline">
                                    Date Range: {format(new Date(filters.dateRange.start), 'MMM d')} - {format(new Date(filters.dateRange.end), 'MMM d')}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}