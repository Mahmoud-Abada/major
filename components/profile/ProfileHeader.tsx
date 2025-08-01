import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, Share, Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  status?: string;
  id?: string;
  backLink: string;
  backLabel?: string;
  actions?: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function ProfileHeader({
  name,
  avatar,
  status,
  id,
  backLink,
  backLabel = "Back",
  actions,
  onEdit,
  onDelete,
  onShare,
}: ProfileHeaderProps) {
  return (
    <div className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 md:h-24">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href={backLink} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{backLabel}</span>
              </a>
            </Button>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            {avatar && (
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h1 className="text-xl font-semibold flex items-center">
                {name}
                {status && (
                  <Badge
                    className="ml-2"
                    variant={
                      status.toLowerCase() === "active" ? "default" : "outline"
                    }
                  >
                    {status}
                  </Badge>
                )}
              </h1>
              {id && <p className="text-sm text-muted-foreground">{id}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {actions}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
