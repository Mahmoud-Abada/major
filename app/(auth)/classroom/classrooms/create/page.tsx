"use client";

import ClassroomCreateForm from "@/components/forms/ClassroomCreateForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClassroomApi } from "@/hooks/useClassroomApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateClassroomPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const classroomApi = useClassroomApi({ showToasts: false });

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast.error("You must be logged in to create a classroom");
      return;
    }

    try {
      // Transform form data to match backend API structure and Convex schema
      const classroomData = {
        // Handle user type logic: if user is school, put their ID in school field
        // If user is teacher, put their ID in teacher field
        teacher: user.userType === 'school' ?
          (formData.teacher || "jh7ce7gp2qk7pcmpaw0q5m3m3x7n7tqh") :
          user.id,
        school: user.userType === 'school' ? user.id : (formData.school || null),
        owner: user.id, // Owner is always the current user (must be valid Convex ID)
        title: formData.title,
        location: {
          fullLocation: formData.location?.fullLocation || undefined,
          coordinates: {
            lat: parseFloat(String(formData.location?.coordinates?.lat)) || 0.0,
            long: parseFloat(String(formData.location?.coordinates?.long)) || 0.0
          },
          // Convex schema requires these to be non-empty strings
          wilaya: formData.location?.wilaya || "Unknown",
          commune: formData.location?.commune || "Unknown",
        },
        frontPicture: formData.frontPicture || "https://mock-storage.com/default-front.jpg",
        backPicture: formData.backPicture || "https://mock-storage.com/default-back.jpg",
        isArchived: false,
        description: formData.description || undefined, // Optional field
        field: formData.field,
        level: formData.level,
        majors: [], // Backend expects majors array
        color: formData.color,
        maxStudents: formData.maxStudents ? Number(formData.maxStudents) : null,
        price: Number(formData.price) || 0, // Required field
        schedule: (formData.schedule || []).map((item: any) => ({
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          isOnline: item.isOnline || false,
          link: item.link || "",
        })),
        mode: formData.mode,
        // Use perEach only as requested
        perEach: formData.mode === 'monthly' ? Number(formData.perDuration || 30) :
          formData.mode === 'sessional' ? Number(formData.perSessions || 10) :
            Number(formData.perSemester || 1),
        isGrouped: false, // Default value
      };

      console.log("Creating classroom with data:", JSON.stringify(classroomData, null, 2));

      const result = await classroomApi.createClassrooms([classroomData]);

      if (result && result.success && result.data && result.data.length > 0) {
        toast.success(result.message || "Classroom created successfully", {
          duration: 4000,
        });

        // Redirect to the classes list page
        router.push("/classroom/classes");
      } else {
        // Show error message from backend
        const errorMessage = result?.message || result?.errors?.[0] || "Failed to create classroom - no data returned";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error creating classroom:", error);

      // Handle specific API errors
      let errorMessage = "Failed to create classroom";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage, {
        duration: 8000, // Show error longer so user can read it
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
