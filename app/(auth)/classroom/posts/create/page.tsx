"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreatePost } from '@/hooks/usePosts';
import { PostFormData } from '@/types/classroom';
import {
    ArrowLeft,
    Eye,
    Paperclip,
    Pin,
    Plus,
    Save,
    Send,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const POST_TYPES = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'poll', label: 'Poll' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'material', label: 'Material' }
];

export default function CreatePostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const createMutation = useCreatePost();

    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        content: '',
        type: 'announcement',
        tags: [],
        isPinned: false,
        attachments: []
    });

    const [newTag, setNewTag] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);

    const handleSubmit = async (publish: boolean = false) => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast({
                title: 'Error',
                description: 'Title and content are required',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsPublishing(publish);

            const postData = {
                ...formData,
                isPublished: publish,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            await createMutation.mutate(postData);

            toast({
                title: 'Success',
                description: `Post ${publish ? 'published' : 'saved as draft'} successfully`,
            });

            router.push('/classroom/posts');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create post',
                variant: 'destructive',
            });
        } finally {
            setIsPublishing(false);
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setFormData(prev => ({
            ...prev,
            attachments: [...(prev.attachments || []), ...files]
        }));
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments?.filter((_, i) => i !== index) || []
        }));
    };

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <p className="text-muted-foreground">
                        Create and share content with your classroom
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter post title..."
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <Label htmlFor="content">Content *</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your post content..."
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                />
                            </div>

                            {/* Attachments */}
                            <div className="space-y-2">
                                <Label>Attachments</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <Paperclip className="h-4 w-4 mr-2" />
                                        Add Files
                                    </Button>
                                </div>

                                {formData.attachments && formData.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                                <span className="text-sm">{file.name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Add a tag..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" variant="outline" onClick={addTag}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.tags && formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
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
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Post Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Post Type */}
                            <div className="space-y-2">
                                <Label>Post Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {POST_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Classroom */}
                            <div className="space-y-2">
                                <Label>Classroom</Label>
                                <Select
                                    value={formData.classroom || ''}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, classroom: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select classroom" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="class1">Mathematics 101</SelectItem>
                                        <SelectItem value="class2">Physics 201</SelectItem>
                                        <SelectItem value="class3">Chemistry 301</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Due Date (for homework/quiz) */}
                            {(formData.type === 'homework' || formData.type === 'quiz') && (
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            dueDate: e.target.value ? new Date(e.target.value).getTime() : undefined
                                        }))}
                                    />
                                </div>
                            )}

                            {/* Pin Post */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pin className="h-4 w-4" />
                                    <Label>Pin Post</Label>
                                </div>
                                <Switch
                                    checked={formData.isPinned}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPinned: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={() => handleSubmit(false)}
                                variant="outline"
                                className="w-full"
                                disabled={createMutation.loading}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save as Draft
                            </Button>

                            <Button
                                onClick={() => handleSubmit(true)}
                                className="w-full"
                                disabled={createMutation.loading || isPublishing}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {isPublishing ? 'Publishing...' : 'Publish Post'}
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => router.push('/classroom/posts')}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}