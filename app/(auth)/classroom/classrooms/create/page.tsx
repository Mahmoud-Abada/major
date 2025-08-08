"use client";

import ClassroomCreateForm from "@/components/forms/ClassroomCreateForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClassroomApi } from "@/hooks/useClassroomApi";
import { Classroom } from "@/services/classroom-api";
import { useRouter } from "next/navigation";

export default function CreateClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const classroomApi = useClassroomApi({ showToasts: false });

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a classroom",
        variant: "destructive",
      });
      return;
    }

    try {
      // Transform form data to match backend API structure
      const classroomData: Omit<Classroom, 'id' | 'createdAt' | 'updatedAt'> = {
        teacher: user.id,
        school: formData.school || undefined,
        title: formData.title,
        location: formData.location,
        frontPicture: formData.frontPicture || undefined,
        backPicture: formData.backPicture || undefined,
        isArchived: false,
        description: formData.description || undefined,
        field: formData.field,
        level: formData.level,
        color: formData.color,
        maxStudents: formData.maxStudents || undefined,
        price: formData.price || 0,
        schedule: formData.schedule || [],
        mode: formData.mode,
        perDuration: formData.mode === 'monthly' ? (formData.perDuration || 30) : undefined,
        perSessions: formData.mode === 'sessional' ? (formData.perSessions || 10) : undefined,
        perSemester: formData.mode === 'semestrial' ? formData.perSemester : undefined,
      };

      console.log("Creating classroom with data:", JSON.stringify(classroomData, null, 2));

      const result = await classroomApi.createClassrooms([classroomData]);

      if (result && result.length > 0) {
        toast({
          title: "Success",
          description: "Classroom created successfully",
        });

        // Redirect to the classes list page
        router.push("/classroom/classes");
      } else {
        throw new Error("Failed to create classroom - no data returned");
      }
    } catch (error: any) {
      console.error("Error creating classroom:", error);

      // Handle specific API errors
      let errorMessage = "Failed to create classroom";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ClassroomCreateForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={classroomApi.isCreating}
    />
  );
}
