import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit3, Save, X } from "lucide-react";
import { ReactNode, useState } from "react";

interface ProfileInfoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  editableContent?: ReactNode;
  onSave?: () => void;
  className?: string;
}

export function ProfileInfoCard({
  title,
  description,
  children,
  editableContent,
  onSave,
  className,
}: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {editableContent && (
          <div>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={handleEdit}>
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing && editableContent ? editableContent : children}
      </CardContent>
    </Card>
  );
}
