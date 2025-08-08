"use client";

import StudentCreateForm from "@/components/forms/StudentCreateForm";
import { StudentFormData } from "@/lib/validations/forms";
import { addStudent } from "@/store/slices/classroom/studentsSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
// Simple toast replacement - you can integrate with your preferred toast library
const toast = {
  success: (message: string) => console.log("Success:", message),
  error: (message: string) => console.error("Error:", message),
};

export default function CreateStudentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: StudentFormData) => {
    setLoading(true);
    try {
      // Generate a unique ID for the student
      const studentData = {
        ...data,
        id: `student_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        payments: [],
      };

      dispatch(addStudent(studentData));
      toast.success("تم إضافة الطالب بنجاح");
      router.push("/classroom/students");
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("حدث خطأ أثناء إضافة الطالب");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <StudentCreateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
