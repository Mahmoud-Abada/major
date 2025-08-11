/**
 * Classroom Service
 * Handles classroom-specific API operations
 */
import { BaseApiService } from "../base/ApiService";
import type {
  ApiResponse,
  Classroom,
  CreateClassroomParams,
  GetClassroomsParams,
  PaginatedResponse,
  UpdateClassroomParams,
} from "../classroom-api";

export class ClassroomService extends BaseApiService {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_CLASSROOM_API_URL ||
      "http://127.0.0.1:3001/classroom",
    );
  }

  // Get classrooms with filtering and pagination
  async getClassrooms(
    params: GetClassroomsParams,
  ): Promise<PaginatedResponse<Classroom>> {
    return this.post("/get-classrooms", params);
  }

  // Get single classroom by ID
  async getClassroom(classroomId: string): Promise<Classroom> {
    const response = await this.post<PaginatedResponse<Classroom>>(
      "/get-classrooms",
      {
        classroomId,
        pagination: { numItems: 1 },
        fetchBy: { userType: "teacher", userId: "current" }, // This should be dynamic
      },
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("Classroom not found");
    }

    return response.data[0];
  }

  // Create new classrooms
  async createClassrooms(
    params: CreateClassroomParams,
  ): Promise<ApiResponse<Classroom[]>> {
    return this.post("/create-classroom", params.classrooms);
  }

  // Update classroom
  async updateClassroom(
    params: UpdateClassroomParams,
  ): Promise<ApiResponse<Classroom>> {
    return this.post("/update-classroom", params);
  }

  // Delete classroom
  async deleteClassroom(classroomId: string): Promise<ApiResponse<void>> {
    return this.delete("/delete-classroom", { classroomId });
  }

  // Add student to classroom
  async addClassroomStudent(
    assignments: Array<{ classroom: string; student: string }>,
  ): Promise<ApiResponse<void>> {
    return this.post("/add-classroom-student", assignments);
  }

  // Get classroom statistics
  async getClassroomStats(classroomId: string): Promise<any> {
    // This would be a custom endpoint for getting classroom statistics
    // For now, we'll aggregate data from other endpoints
    const classroom = await this.getClassroom(classroomId);

    return {
      totalStudents: classroom.currentStudents || 0,
      maxStudents: classroom.maxStudents || 0,
      // Add more statistics as needed
    };
  }

  // Search classrooms
  async searchClassrooms(
    query: string,
    filters?: Partial<GetClassroomsParams>,
  ): Promise<PaginatedResponse<Classroom>> {
    return this.getClassrooms({
      ...filters,
      // Add search functionality to the API params
      pagination: { numItems: 20 },
      fetchBy: { userType: "teacher", userId: "current" },
    });
  }
}
