"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    RiAddLine,
    RiAttachmentLine,
    RiCalendarLine,
    RiDeleteBinLine,
    RiFileTextLine,
    RiImageLine,
    RiSaveLine,
    RiSendPlaneLine
} from "@remixicon/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import type { Post } from "./types";

interface CreatePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "announcement" as Post["type"],
        classId: "",
        subject: "",
        priority: "normal" as Post["priority"],
        visibility: "class_only" as Post["visibility"],
        dueDate: undefined as Date | undefined,
        tags: [] as string[],
        settings: {
            allowComments: true,
            allowInteractions: true,
            requireApproval: false,
            notifyOnComment: true,
            notifyOnInteraction: false,
        }
    });

    const [newTag, setNewTag] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setAttachments(prev => [...prev, ...files]);
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (asDraft = false) => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log("Creating post:", {
                ...formData,
                status: asDraft ? "draft" : "published",
                attachments: attachments.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            });

            // Reset form
            setFormData({
                title: "",
                content: "",
                type: "announcement",
                classId: "",
                subject: "",
                priority: "normal",
                visibility: "class_only",
                dueDate: undefined,
                tags: [],
                settings: {
                    allowComments: true,
                    allowInteractions: true,
                    requireApproval: false,
                    notifyOnComment: true,
                    notifyOnInteraction: false,
                }
            });
            setAttachments([]);
            setNewTag("");

            onOpenChange(false);
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <RiImageLine className="h-4 w-4" />;
        if (file.type === 'application/pdf') return <RiFileTextLine className="h-4 w-4" />;
        return <RiAttachmentLine className="h-4 w-4" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer une Nouvelle Publication</DialogTitle>
                    <DialogDescription>
                        Partagez du contenu avec vos étudiants et collègues
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type de Publication</Label>
                                <Select value={formData.type} onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, type: value as Post["type"] }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="announcement">Annonce</SelectItem>
                                        <SelectItem value="homework">Devoir</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="poll">Sondage</SelectItem>
                                        <SelectItem value="discussion">Discussion</SelectItem>
                                        <SelectItem value="resource">Ressource</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priorité</Label>
                                <Select value={formData.priority} onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, priority: value as Post["priority"] }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Faible</SelectItem>
                                        <SelectItem value="normal">Normale</SelectItem>
                                        <SelectItem value="high">Élevée</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class">Classe</Label>
                                <Select value={formData.classId} onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, classId: value }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une classe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="class-1">1ère AS Sciences</SelectItem>
                                        <SelectItem value="class-2">Terminal Lettres</SelectItem>
                                        <SelectItem value="class-3">2ème AS Maths</SelectItem>
                                        <SelectItem value="all">Toutes les classes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Matière</Label>
                                <Input
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="Ex: Mathématiques, Physique..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Titre</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Titre de votre publication..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Contenu</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Décrivez votre publication..."
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* Due Date (for homework/quiz) */}
                    {(formData.type === "homework" || formData.type === "quiz") && (
                        <div className="space-y-2">
                            <Label>Date d'échéance</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <RiCalendarLine className="mr-2 h-4 w-4" />
                                        {formData.dueDate ? (
                                            format(formData.dueDate, "PPP", { locale: fr })
                                        ) : (
                                            <span>Sélectionner une date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.dueDate}
                                        onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Ajouter un tag..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <Button type="button" variant="outline" onClick={handleAddTag}>
                                <RiAddLine className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <RiDeleteBinLine className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                        <Label>Pièces jointes</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                                accept="image/*,.pdf,.doc,.docx,.txt"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <RiAttachmentLine className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Cliquez pour ajouter des fichiers
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Images, PDF, Documents (Max 10MB par fichier)
                                </p>
                            </label>
                        </div>

                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                        <div className="flex items-center gap-2">
                                            {getFileIcon(file)}
                                            <span className="text-sm">{file.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {formatFileSize(file.size)}
                                            </Badge>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveAttachment(index)}
                                        >
                                            <RiDeleteBinLine className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Paramètres</Label>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibilité</Label>
                                <Select value={formData.visibility} onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, visibility: value as Post["visibility"] }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="class_only">Classe uniquement</SelectItem>
                                        <SelectItem value="private">Privé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="allow-comments">Autoriser les commentaires</Label>
                                <Switch
                                    id="allow-comments"
                                    checked={formData.settings.allowComments}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, allowComments: checked }
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="allow-interactions">Autoriser les interactions</Label>
                                <Switch
                                    id="allow-interactions"
                                    checked={formData.settings.allowInteractions}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, allowInteractions: checked }
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="notify-comments">Notifier les nouveaux commentaires</Label>
                                <Switch
                                    id="notify-comments"
                                    checked={formData.settings.notifyOnComment}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, notifyOnComment: checked }
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit(true)}
                        disabled={isSubmitting || !formData.title.trim()}
                    >
                        <RiSaveLine className="h-4 w-4 mr-2" />
                        Sauvegarder comme brouillon
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                    >
                        <RiSendPlaneLine className="h-4 w-4 mr-2" />
                        Publier
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}