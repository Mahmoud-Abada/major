"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    Camera,
    Check,
    Move,
    RotateCcw,
    Trash2,
    Upload,
    X,
    ZoomIn,
    ZoomOut
} from "lucide-react";
import { useRef, useState } from "react";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarChange: (avatarUrl: string | null) => void;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
};

const buttonSizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
  size = "lg",
  editable = true,
  className = "",
}: AvatarUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length >= 2 
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : name.charAt(0).toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would upload to a server here
      // For now, we'll just use the preview URL
      onAvatarChange(previewUrl);
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been successfully updated.",
      });
      
      setIsDialogOpen(false);
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(null);
    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been removed.",
    });
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsDialogOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentAvatar} alt={userName} />
        <AvatarFallback className="text-lg font-semibold">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <>
          <Button
            size="sm"
            variant="secondary"
            className={`absolute -bottom-1 -right-1 ${buttonSizeClasses[size]} rounded-full p-0 shadow-lg`}
            onClick={triggerFileInput}
          >
            <Camera className="h-3 w-3" />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
                <DialogDescription>
                  Preview your new profile picture and make adjustments if needed.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Preview */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={previewUrl || currentAvatar} alt={userName} />
                      <AvatarFallback className="text-2xl font-semibold">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Upload Options */}
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Different Image
                    </Button>
                    
                    {currentAvatar && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        disabled={isUploading}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Image Editing Controls (placeholder for future enhancement) */}
                  {previewUrl && (
                    <Card>
                      <CardContent className="p-4">
                        <Label className="text-sm font-medium mb-3 block">
                          Image Adjustments
                        </Label>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm" disabled>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <Move className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Advanced editing coming soon
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!previewUrl || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}