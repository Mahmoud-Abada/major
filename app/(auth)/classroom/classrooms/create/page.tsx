"use client";

import ClassroomCreateForm from "@/components/forms/ClassroomCreateForm";
import { useToast } from '@/components/ui/use-toast';
import { useCreateClassrooms } from '@/hooks/useClassroom';
import { useRouter } from 'next/navigation';

// Simple toast replacement - you can integrate with your preferred toast library
const toast = {
    success: (message: string) => console.log("Success:", message),
    error: (message: string) => console.error("Error:", message),
};

export default function CreateClassroomPage() {
    const router = useRouter();
    const { toast: useToastHook } = useToast();
    const { mutate: createClassrooms, loading } = useCreateClassrooms();

    const handleSubmit = async (data: any) => {
        try {
            await createClassrooms({ classrooms: [data.classroomsData] });

            useToastHook({
                title: 'نجح',
                description: 'تم إنشاء الفصل الدراسي بنجاح'
            });

            toast.success("تم إنشاء الفصل الدراسي بنجاح");
            router.push("/classroom/classes");
        } catch (error: any) {
            console.error("Error creating classroom:", error);

            useToastHook({
                title: 'خطأ',
                description: error.message || 'فشل في إنشاء الفصل الدراسي',
                variant: 'destructive'
            });

            toast.error("حدث خطأ أثناء إنشاء الفصل الدراسي");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <ClassroomCreateForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
        />
    );
}