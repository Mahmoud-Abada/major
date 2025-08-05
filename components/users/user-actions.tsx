"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Copy,
  Download,
  Edit,
  Eye,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Shield,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface UserActionsProps {
  user: User;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: User["status"]) => void;
  onSendMessage?: (id: string) => void;
  onExport?: (id: string) => void;
  showQuickActions?: boolean;
}

export function UserActions({
  user,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onSendMessage,
  onExport,
  showQuickActions = false,
}: UserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAction = async (action: string, callback?: () => void) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (callback) {
        callback();
      }

      toast({
        title: "Success",
        description: `Action "${action}" completed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    handleAction("delete user", () => {
      onDelete?.(user.id);
      setShowDeleteDialog(false);
    });
  };

  const handleStatusChange = (newStatus: User["status"]) => {
    handleAction(`change status to ${newStatus}`, () => {
      onStatusChange?.(user.id, newStatus);
    });
  };

  const handleCopyInfo = () => {
    const userInfo = `${user.firstName} ${user.lastName}\n${user.email}\n${user.phoneNumber || "No phone"}`;
    navigator.clipboard.writeText(userInfo);
    toast({
      title: "Copied",
      description: "User information copied to clipboard.",
    });
  };

  const handleExport = () => {
    handleAction("export user data", () => {
      onExport?.(user.id);
    });
  };

  if (showQuickActions) {
    return (
      <div className="flex items-center gap-1">
        {onView && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(user.id)}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(user.id)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" disabled={isLoading}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Communication Actions */}
            <DropdownMenuItem onClick={() => window.open(`mailto:${user.email}`)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>

            {user.phoneNumber && (
              <DropdownMenuItem onClick={() => window.open(`tel:${user.phoneNumber}`)}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </DropdownMenuItem>
            )}

            {onSendMessage && (
              <DropdownMenuItem onClick={() => onSendMessage(user.id)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Status Actions */}
            {user.status !== "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                <UserCheck className="h-4 w-4 mr-2" />
                Activate
              </DropdownMenuItem>
            )}

            {user.status === "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange("inactive")}>
                <UserX className="h-4 w-4 mr-2" />
                Deactivate
              </DropdownMenuItem>
            )}

            {user.status !== "suspended" && (
              <DropdownMenuItem onClick={() => handleStatusChange("suspended")}>
                <Shield className="h-4 w-4 mr-2" />
                Suspend
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Utility Actions */}
            <DropdownMenuItem onClick={handleCopyInfo}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Info
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Destructive Actions */}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {user.firstName} {user.lastName}?
                This action cannot be undone and will permanently remove all user data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Primary Actions */}
        {onView && (
          <DropdownMenuItem onClick={() => onView(user.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(user.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Communication Actions */}
        <DropdownMenuItem onClick={() => window.open(`mailto:${user.email}`)}>
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </DropdownMenuItem>

        {user.phoneNumber && (
          <DropdownMenuItem onClick={() => window.open(`tel:${user.phoneNumber}`)}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </DropdownMenuItem>
        )}

        {onSendMessage && (
          <DropdownMenuItem onClick={() => onSendMessage(user.id)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Status Actions */}
        {user.status !== "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            <UserCheck className="h-4 w-4 mr-2" />
            Activate User
          </DropdownMenuItem>
        )}

        {user.status === "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("inactive")}>
            <UserX className="h-4 w-4 mr-2" />
            Deactivate User
          </DropdownMenuItem>
        )}

        {user.status !== "suspended" && (
          <DropdownMenuItem onClick={() => handleStatusChange("suspended")}>
            <Shield className="h-4 w-4 mr-2" />
            Suspend User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Utility Actions */}
        <DropdownMenuItem onClick={handleCopyInfo}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Information
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export User Data
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Destructive Actions */}
        <DropdownMenuItem
          onClick={() => setShowDeleteDialog(true)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.firstName} {user.lastName}?
              This action cannot be undone and will permanently remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}