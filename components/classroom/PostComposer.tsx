/**
 * PostComposer Component
 * Enhanced component for creating and editing classroom posts
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    Calendar,
    FileText,
    Image,
    Link,
    MessageSquare,
    Paperclip,
    Plus,
    Send,
    Settings,
    Upload,
    Users,
    X
} from "lucide-react";
import { useState } from "react";

interface Post {
  id?: string;
  type: "announcement" | "homework" | "quiz" | "poll" | "material";
  title: string;
  content: string;
  attachments?: string[];
  dueDate?: string;
  isPublished: boolean;
  allowComments: boolean;
  targetAudience?: "all" | "students" | "parents";
  priority?: "low" | "medium" | "high";
}

interface PostComposerProps {
  post?: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
  className?: string;
  isLoading?: boolean;
}

export function PostComposer({
  post,
  onSave,
  onCancel,
  className,
  isLoading = false,
}: PostComposerProps) {
  const [formData, setFormData] = useState<Post>(
    post || {
      type: "announcement",
      title: "",
      content: "",
      attachments: [],
      isPublished: true,
      allowComments: true,
      targetAudience: "all",
      priority: "medium",
    }
  );

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [attachmentDialog, setAttachmentDialog] = useState(false);
  const [newAttachment, setNewAttachment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setFormData({
        ...formData,
        attachments: [...(formData.attachments || []), newAttachment.trim()],
      });
      setNewAttachment("");
      setAttachmentDialog(false);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...(formData.attachments || [])];
    updatedAttachments.splice(index, 1);
    setFormData({ ...formData, attachments: updatedAttachments });
  };

  const getTypeIcon = (type: Post["type"]) => {
    switch (type) {
      case "announcement":
        return <MessageSquare className="h-4 w-4" />;
      case "homework":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <AlertCircle className="h-4 w-4" />;
      case "poll":
        return <Users className="h-4 w-4" />;
      case "material":
        return <Paperclip className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Post["type"]) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800";
      case "homework":
        return "bg-orange-100 text-orange-800";
      case "quiz":
        return "bg-purple-100 text-purple-800";
      case "poll":
        return "bg-green-100 text-green-800";
      case "material":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Post["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isFormValid = formData.title.trim() && formData.content.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon(formData.type)}
            {post ? "Edit Post" : "Create New Post"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(["announcement", "homework", "quiz", "poll", "material"] as const).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={formData.type === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({ ...formData, type })}
                  className="flex items-center gap-2"
                >
                  {getTypeIcon(type)}
                  <span className="capitalize">{type}</span>
                </Button>
              ))}
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title..."
                className="mt-1"
                required
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content here..."
                className="mt-1 min-h-32"
                required
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.content.length} characters
              </div>
            </div>

            {/* Due Date (for homework and quiz) */}
            {(formData.type === "homework" || formData.type === "quiz") && (
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate || ""}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            )}

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Attachments</Label>
                <Dialog open={attachmentDialog} onOpenChange={setAttachmentDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attachment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Attachment</DialogTitle>
                      <DialogDescription>
                        Add a file, link, or resource to your post.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="attachment-url">File URL or Link</Label>
                        <Input
                          id="attachment-url"
                          value={newAttachment}
                          onChange={(e) => setNewAttachment(e.target.value)}
                          placeholder="https://example.com/file.pdf"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </Button>
                        <Button type="button" variant="outline" className="flex-1">
                          <Image className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                        <Button type="button" variant="outline" className="flex-1">
                          <Link className="h-4 w-4 mr-2" />
                          Add Link
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAttachmentDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddAttachment}>
                        Add Attachment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <AnimatePresence>
                    {formData.attachments.map((attachment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate">{attachment}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Basic Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Publish Immediately</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this post visible to students
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublished: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comments">Allow Comments</Label>
                  <p className="text-xs text-muted-foreground">
                    Let students comment on this post
                  </p>
                </div>
                <Switch
                  id="comments"
                  checked={formData.allowComments}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, allowComments: checked })
                  }
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Advanced Settings
              </Button>

              <AnimatePresence>
                {showAdvancedSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4 border-t pt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select
                          value={formData.targetAudience}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, targetAudience: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All (Students & Parents)</SelectItem>
                            <SelectItem value="students">Students Only</SelectItem>
                            <SelectItem value="parents">Parents Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, priority: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview */}
            <div>
              <Label>Preview</Label>
              <Card className="mt-2">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{formData.title || "Post Title"}</h4>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getTypeColor(formData.type))}
                        >
                          {formData.type}
                        </Badge>
                        {formData.priority !== "medium" && (
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getPriorityColor(formData.priority))}
                          >
                            {formData.priority} priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.content || "Post content will appear here..."}
                      </p>
                      {formData.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(formData.dueDate).toLocaleString()}
                        </div>
                      )}
                      {formData.attachments && formData.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Paperclip className="h-3 w-3" />
                          {formData.attachments.length} attachment(s)
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {!formData.isPublished && (
                  <Badge variant="outline" className="bg-yellow-50">
                    Draft
                  </Badge>
                )}
                <span>
                  Target: {formData.targetAudience === "all" ? "All" : formData.targetAudience}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {formData.isPublished ? "Publish" : "Save Draft"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}