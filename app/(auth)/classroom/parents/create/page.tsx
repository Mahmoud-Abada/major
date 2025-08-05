"use client";

import ParentCreateForm from "@/components/forms/ParentCreateForm";
import { ParentFormData } from "@/lib/validations/forms";
import { addParent } from "@/store/slices/classroom/parentsSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
// Simple toast replacement - you can integrate with your preferred toast library
const toast = {
    success: (message: string) => console.log("Success:", message),
    error: (message: string) => console.error("Error:", message),
};

export default function CreateParentPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: ParentFormData) => {
        setLoading(true);
        try {
            // Generate a unique ID for the parent
            const parentData = {
                ...data,
                id: `parent_${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                payments: [],
            };

            dispatch(addParent(parentData));
            toast.success("تم إضافة ولي الأمر بنجاح");
            router.push("/classroom/parents");
        } catch (error) {
            console.error("Error creating parent:", error);
            toast.error("حدث خطأ أثناء إضافة ولي الأمر");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto py-6">
            <ParentCreateForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
            />
        </div>
    );
}