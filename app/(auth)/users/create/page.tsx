"use client";

import CreateUserForm from "@/components/forms/CreateUserForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRegisterMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast.error("You must be logged in to create users");
      return;
    }

    if (user.userType !== "school") {
      toast.error("Only schools can create users");
      return;
    }

    try {
      // Use the same RTK Query mutation as the signup forms
      const result = await registerMutation(formData).unwrap();

      if (result.status === "success") {
        toast.success(`${formData.userData.userType} created successfully!`, {
          description: `${formData.userData.name} has been added to your school.`,
        });
        router.push("/classroom/users");
      } else {
        throw new Error(result.message || "Failed to create user");
      }
    } catch (error: any) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user", {
        description: error.message || "An unexpected error occurred",
      });
    }
  };

  const handleCancel = () => {
    router.push("/classroom/users");
  };

  return (
    <CreateUserForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={isLoading}
    />
  );
}
