/**
 * Create Group Page
 * Page for creating new groups with proper API integration
 */

"use client";

import GroupCreateForm from "@/components/forms/GroupCreateForm";
import { useGroupApi } from "@/hooks/useGroupApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateGroupPage() {
  const router = useRouter();
  const { createGroups, isCreating } = useGroupApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (groupData: any) => {
    setIsSubmitting(true);

    try {
      await createGroups([groupData]);

      // Redirect to groups list on success
      router.push("/classroom/groups");
    } catch (error) {
      console.error("Failed to create group:", error);
      // Error notification will be handled by the service
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
        loading={isCreating || isSubmitting}
      />
    </div>
  );
}