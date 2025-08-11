"use client";

import CreateUserForm from "@/components/forms/CreateUserForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Mock user data - in real app this would come from API
const mockUser = {
    id: "1",
    name: "Ahmed Ben Ali",
    email: "ahmed@example.com",
    phone: "+213 555 0123",
    userType: "teacher",
    status: "active",
    createdAt: "2024-01-15",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: {
        fullLocation: "Algiers, Algeria",
        wilaya: "Algiers",
        commune: "Bab El Oued",
    },
    specialization: "Mathematics",
    bio: "Experienced mathematics teacher with 10+ years of teaching experience.",
};

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuthContext();
    const userId = params.id as string;

    // In real app, fetch user data based on userId
    const user = mockUser;

    const handleSubmit = async (formData: any) => {
        if (!currentUser) {
            toast.error("You must be logged in to edit users");
            return;
        }

        if (currentUser.userType !== "school") {
            toast.error("Only schools can edit users");
            return;
        }

        try {
            // Here we'll use the update user API
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.status === "success") {
                toast.success(`${formData.userData.userType} updated successfully!`, {
                    description: `${formData.userData.name} has been updated.`,
                });
                router.push(`/classroom/users/${userId}`);
            } else {
                throw new Error(result.message || "Failed to update user");
            }
        } catch (error: any) {
            console.error("Failed to update user:", error);
            toast.error("Failed to update user", {
                description: error.message || "An unexpected error occurred",
            });
        }
    };

    const handleCancel = () => {
        router.push(`/classroom/users/${userId}`);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>User not found</p>
            </div>
        );
    }

    // Convert user data to form format
    const initialData = {
        userType: user.userType,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ").slice(1).join(" "),
        email: user.email,
        phone: user.phone,
        interests: user.bio,
        // Add other fields as needed
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-6 px-4 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Edit User
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Update {user.name}'s information
                    </p>
                </div>

                <CreateUserForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    initialData={initialData}
                    isEditing={true}
                />
            </div>
        </div>
    );
}