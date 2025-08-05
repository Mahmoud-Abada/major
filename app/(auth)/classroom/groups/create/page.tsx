"use client";

import GroupCreateForm from "@/components/forms/GroupCreateForm";
import { GroupFormData } from "@/lib/validations/forms";
import { addGroup } from "@/store/slices/classroom/groupsSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
// Simple toast replacement - you can integrate with your preferred toast library
const toast = {
    success: (message: string) => console.log("Success:", message),
    error: (message: string) => console.error("Error:", message),
};

export default function CreateGroupPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: GroupFormData) => {
        setLoading(true);
        try {
            // Generate a unique ID for the group
            const groupData = {
                ...data,
                id: `group_${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            dispatch(addGroup(groupData));
            toast.success("تم إضافة المجموعة بنجاح");
            router.push("/classroom/groups");
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error("حدث خطأ أثناء إضافة المجموعة");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto py-6">
            <GroupCreateForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
            />
        </div>
    );
}