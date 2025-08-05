"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    RiAddLine,
    RiArchiveLine,
    RiAttachmentLine,
    RiBarChartLine,
    RiBookmarkLine,
    RiChat3Line,
    RiDeleteBinLine,
    RiDiscussLine,
    RiEditLine,
    RiEyeLine,
    RiFileTextLine,
    RiFilterLine,
    RiHeartLine,
    RiHomeLine,
    RiMoreLine,
    RiOpenSourceLine,
    RiPushpinLine,
    RiQuestionLine,
    RiSearchLine,
    RiShareLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
import { useState } from "react";
import { CreatePostDialog } from "./create-post-dialog";
import { PostDetailsDialog } from "./post-details-dialog";
import type { Post, PostFilter } from "./types";
// Empty posts array - will be populated from API
const mockPosts: any[] = [];

export function AllPostsView() {
    const [posts] = useState<Post[]>(mockPosts);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<PostFilter>({});
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.authorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = !filter.type || post.type === filter.type;
        const matchesStatus = !filter.status || post.status === filter.status;
        const matchesPriority = !filter.priority || post.priority === filter.priority;
        const matchesClass = !filter.classId || post.classId === filter.classId;

        return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesClass;
    });

    const getPostTypeIcon = (type: Post["type"]) => {
        switch (type) {
            case "announcement": return <RiFileTextLine className="h-4 w-4" />;
            case "homework": return <RiHomeLine className="h-4 w-4" />;
            case "quiz": return <RiQuestionLine className="h-4 w-4" />;
            case "poll": return <RiBarChartLine className="h-4 w-4" />;
            case "discussion": return <RiDiscussLine className="h-4 w-4" />;
            case "resource": return <RiOpenSourceLine className="h-4 w-4" />;
            default: return <RiFileTextLine className="h-4 w-4" />;
        }
    };

    const getPostTypeColor = (type: Post["type"]) => {
        switch (type) {
            case "announcement": return "default";
            case "homework": return "secondary";
            case "quiz": return "destructive";
            case "poll": return "outline";
            case "discussion": return "secondary";
            case "resource": return "default";
            default: return "secondary";
        }
    };

    const getPriorityColor = (priority: Post["priority"]) => {
        switch (priority) {
            case "urgent": return "destructive";
            case "high": return "secondary";
            case "normal": return "outline";
            case "low": return "outline";
            default: return "outline";
        }
    };

    const getStatusColor = (status: Post["status"]) => {
        switch (status) {
            case "published": return "default";
            case "draft": return "secondary";
            case "pending_approval": return "outline";
            case "archived": return "outline";
            default: return "secondary";
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Il y a moins d'1h";
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInHours < 48) return "Hier";
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    const handleViewPost = (post: Post) => {
        setSelectedPost(post);
        setShowDetailsDialog(true);
    };

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-1 gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Rechercher des publications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <RiFilterLine className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="p-2 space-y-2">
                                <Select value={filter.type || ""} onValueChange={(value) =>
                                    setFilter(prev => ({ ...prev, type: value as Post["type"] || undefined }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type de publication" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tous les types</SelectItem>
                                        <SelectItem value="announcement">Annonce</SelectItem>
                                        <SelectItem value="homework">Devoir</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="poll">Sondage</SelectItem>
                                        <SelectItem value="discussion">Discussion</SelectItem>
                                        <SelectItem value="resource">Ressource</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filter.status || ""} onValueChange={(value) =>
                                    setFilter(prev => ({ ...prev, status: value as Post["status"] || undefined }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tous les statuts</SelectItem>
                                        <SelectItem value="published">Publié</SelectItem>
                                        <SelectItem value="draft">Brouillon</SelectItem>
                                        <SelectItem value="pending_approval">En attente</SelectItem>
                                        <SelectItem value="archived">Archivé</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filter.priority || ""} onValueChange={(value) =>
                                    setFilter(prev => ({ ...prev, priority: value as Post["priority"] || undefined }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priorité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Toutes les priorités</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="high">Élevée</SelectItem>
                                        <SelectItem value="normal">Normale</SelectItem>
                                        <SelectItem value="low">Faible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
                    <RiAddLine className="h-4 w-4 mr-2" />
                    Nouvelle Publication
                </Button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <RiFileTextLine className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Aucune publication trouvée</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {searchTerm || Object.keys(filter).length > 0
                                    ? "Aucune publication ne correspond à vos critères de recherche."
                                    : "Commencez par créer votre première publication."
                                }
                            </p>
                            {!searchTerm && Object.keys(filter).length === 0 && (
                                <Button onClick={() => setShowCreateDialog(true)}>
                                    <RiAddLine className="h-4 w-4 mr-2" />
                                    Créer une Publication
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    filteredPosts.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={post.authorAvatar} />
                                            <AvatarFallback>
                                                {post.authorName.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3
                                                    className="font-medium text-base cursor-pointer hover:text-primary line-clamp-1"
                                                    onClick={() => handleViewPost(post)}
                                                >
                                                    {post.title}
                                                </h3>
                                                {post.priority === "urgent" && (
                                                    <RiPushpinLine className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <div className="flex items-center gap-1">
                                                    <RiUserLine className="h-3 w-3" />
                                                    <span>{post.authorName}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{post.className}</span>
                                                <span>•</span>
                                                <span>{post.subject}</span>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <RiTimeLine className="h-3 w-3" />
                                                    <span>{formatTimeAgo(post.createdAt)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant={getPostTypeColor(post.type)} className="text-xs">
                                                    <div className="flex items-center gap-1">
                                                        {getPostTypeIcon(post.type)}
                                                        <span className="capitalize">{post.type}</span>
                                                    </div>
                                                </Badge>

                                                <Badge variant={getStatusColor(post.status)} className="text-xs capitalize">
                                                    {post.status.replace('_', ' ')}
                                                </Badge>

                                                <Badge variant={getPriorityColor(post.priority)} className="text-xs capitalize">
                                                    {post.priority}
                                                </Badge>

                                                {post.attachments && post.attachments.length > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <RiAttachmentLine className="h-3 w-3 mr-1" />
                                                        {post.attachments.length}
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {post.content}
                                            </p>

                                            {post.dueDate && (
                                                <div className="flex items-center gap-1 text-sm text-orange-600 mb-3">
                                                    <RiTimeLine className="h-4 w-4" />
                                                    <span>Échéance: {new Date(post.dueDate).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <RiEyeLine className="h-4 w-4" />
                                                        <span>{post.interactions.views}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <RiHeartLine className="h-4 w-4" />
                                                        <span>{post.interactions.likes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <RiChat3Line className="h-4 w-4" />
                                                        <span>{post.comments.length}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <RiShareLine className="h-4 w-4" />
                                                        <span>{post.interactions.shares}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <RiBookmarkLine className="h-4 w-4" />
                                                        <span>{post.interactions.bookmarks}</span>
                                                    </div>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <RiMoreLine className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewPost(post)}>
                                                            <RiEyeLine className="h-4 w-4 mr-2" />
                                                            Voir les détails
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <RiEditLine className="h-4 w-4 mr-2" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <RiArchiveLine className="h-4 w-4 mr-2" />
                                                            Archiver
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <RiDeleteBinLine className="h-4 w-4 mr-2" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>

            {/* Dialogs */}
            <CreatePostDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />

            <PostDetailsDialog
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                post={selectedPost}
            />
        </div>
    );
}