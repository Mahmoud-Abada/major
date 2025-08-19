"use client";

import CreateUserForm from "@/components/forms/CreateUserForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateClassroomUserPage() {
    const router = useRouter();
    const { user } = useAuthContext();

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
            // Here we'll use the same registration API as the signup forms
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

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
        />
    );
}