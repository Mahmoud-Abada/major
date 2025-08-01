/**
 * Group API Endpoints
 * RTK Query endpoints for group management
 */
import type {
  AddGroupToClassroomParams,
  AddStudentToGroupParams,
  ApiResponse,
  CreateGroupParams,
  Group,
  UpdateGroupParams,
} from "@/store/types/api";
import { baseApi } from "./baseApi";

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all groups
    getGroups: builder.query<
      ApiResponse<Group[]>,
      { schoolId?: string; status?: "active" | "archived" }
    >({
      query: (params) => ({
        url: "/get-groups",
        method: "POST",
        body: params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Group" as const, id })),
              { type: "Group", id: "LIST" },
            ]
          : [{ type: "Group", id: "LIST" }],
    }),

    // Get single group by ID
    getGroup: builder.query<ApiResponse<Group>, string>({
      query: (groupId) => ({
        url: "/get-group",
        method: "POST",
        body: { groupId },
      }),
      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Create new groups
    createGroups: builder.mutation<ApiResponse<Group[]>, CreateGroupParams>({
      query: (params) => ({
        url: "/create-group",
        method: "POST",
        body: params.groups,
      }),
      invalidatesTags: [{ type: "Group", id: "LIST" }],
    }),

    // Update group
    updateGroup: builder.mutation<ApiResponse<Group>, UpdateGroupParams>({
      query: (params) => ({
        url: "/update-group",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Delete group
    deleteGroup: builder.mutation<ApiResponse<void>, string>({
      query: (groupId) => ({
        url: "/delete-group",
        method: "DELETE",
        body: { groupId },
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Add student to group
    addStudentToGroup: builder.mutation<
      ApiResponse<void>,
      AddStudentToGroupParams[]
    >({
      query: (assignments) => ({
        url: "/add-group-student",
        method: "POST",
        body: assignments,
      }),
      invalidatesTags: (result, error, assignments) => [
        ...assignments.map(({ group }) => ({
          type: "Group" as const,
          id: group,
        })),
        { type: "Group", id: "LIST" },
      ],
    }),

    // Remove student from group
    removeStudentFromGroup: builder.mutation<
      ApiResponse<void>,
      { groupId: string; studentId: string }
    >({
      query: ({ groupId, studentId }) => ({
        url: "/remove-group-student",
        method: "POST",
        body: { group: groupId, student: studentId },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Add group to classroom
    addGroupToClassroom: builder.mutation<
      ApiResponse<void>,
      AddGroupToClassroomParams[]
    >({
      query: (assignments) => ({
        url: "/add-group-classroom",
        method: "POST",
        body: assignments,
      }),
      invalidatesTags: (result, error, assignments) => [
        ...assignments.map(({ classroom }) => ({
          type: "Classroom" as const,
          id: classroom,
        })),
        ...assignments.map(({ group }) => ({
          type: "Group" as const,
          id: group,
        })),
      ],
    }),

    // Remove group from classroom
    removeGroupFromClassroom: builder.mutation<
      ApiResponse<void>,
      { classroomId: string; groupId: string }
    >({
      query: ({ classroomId, groupId }) => ({
        url: "/remove-group-classroom",
        method: "POST",
        body: { classroom: classroomId, group: groupId },
      }),
      invalidatesTags: (result, error, { classroomId, groupId }) => [
        { type: "Classroom", id: classroomId },
        { type: "Group", id: groupId },
      ],
    }),

    // Archive/Unarchive group
    archiveGroup: builder.mutation<
      ApiResponse<void>,
      { groupId: string; isArchived: boolean }
    >({
      query: ({ groupId, isArchived }) => ({
        url: "/update-group",
        method: "POST",
        body: {
          groupId,
          groupData: { isArchived },
        },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
    }),

    // Get group members
    getGroupMembers: builder.query<ApiResponse<any[]>, string>({
      query: (groupId) => ({
        url: "/get-group-members",
        method: "POST",
        body: { groupId },
      }),
      providesTags: (result, error, groupId) => [
        { type: "Group", id: `${groupId}_MEMBERS` },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupsMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useAddStudentToGroupMutation,
  useRemoveStudentFromGroupMutation,
  useAddGroupToClassroomMutation,
  useRemoveGroupFromClassroomMutation,
  useArchiveGroupMutation,
  useGetGroupMembersQuery,
} = groupApi;
