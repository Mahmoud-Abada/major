/**
 * Create Group Page
 * Page for creating new groups with proper API integration
 */

"use client";

import GroupCreateForm from "@/components/forms/GroupCreateForm";
import { useGroupApi } from "@/hooks/useGroupApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateGroupPage() {
  const router = useRouter();
  const groupApi = useGroupApi({ showToasts: false }); // Disable service toasts, use sonner instead
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (groupData: any) => {
    setIsSubmitting(true);

    try {
      const result = await groupApi.createGroups([groupData]);

      if (result && result.success && result.data && result.data.length > 0) {
        toast.success(result.message || "Group created successfully", {
          duration: 4000,
        });

        // Redirect to groups list on success
        router.push("/classroom/groups");
      } else {
        const errorMessage = result?.message || "Failed to create group";
        toast.error(errorMessage, {
          duration: 8000,
        });
      }
    } catch (error: any) {
      console.error("Failed to create group:", error);

      let errorMessage = "An unexpected error occurred while creating the group";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage, {
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/classroom/groups");
  };

  return (
    <div className="container mx-auto py-6">
      <GroupCreateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={groupApi.isCreating || isSubmitting}
      />
    </div>
  );
}