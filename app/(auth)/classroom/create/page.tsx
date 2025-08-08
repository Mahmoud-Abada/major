/**
 * Create Classroom Page
 * Page for creating new classrooms with proper API integration
 */

"use client";

import ClassroomCreateForm from "@/components/forms/ClassroomCreateForm";
import { useClassroomApi } from "@/hooks/useClassroomApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateClassroomPage() {
    const router = useRouter();
    const { createClassrooms, isCreating } = useClassroomApi();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (classroomData: any) => {
        setIsSubmitting(true);

        try {
            await createClassrooms([classroomData]);

            // Redirect to classrooms list on success
            router.push("/classroom/classrooms");
        } catch (error) {
            console.error("Failed to create classroom:", error);
            // Error notification will be handled by the service
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/classroom/classrooms");
    };

    return (
        <div className="container mx-auto py-6">
            <ClassroomCreateForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={isCreating || isSubmitting}
            />
        </div>
    );
}