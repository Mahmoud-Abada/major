"use client";

import TeacherCreateForm from "@/components/forms/TeacherCreateForm";
import { TeacherFormData } from "@/lib/validations/forms";
import { addTeacher } from "@/store/slices/classroom/teachersSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
// Simple toast replacement - you can integrate with your preferred toast library
const toast = {
  success: (message: string) => console.log("Success:", message),
  error: (message: string) => console.error("Error:", message),
};

export default function CreateTeacherPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: TeacherFormData) => {
    setLoading(true);
    try {
      // Generate a unique ID for the teacher
      const teacherData = {
        ...data,
        id: `teacher_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        payments: [],
      };

      dispatch(addTeacher(teacherData));
      toast.success("تم إضافة المعلم بنجاح");
      router.push("/classroom/teachers");
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error("حدث خطأ أثناء إضافة المعلم");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <TeacherCreateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
