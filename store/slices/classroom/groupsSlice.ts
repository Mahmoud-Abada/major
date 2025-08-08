import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Group interface since it's not in the main types
interface Group {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  type: "Study Group" | "Project Group" | "Activity Group" | "Other";
  status: "Active" | "Inactive" | "Completed";
  maxMembers: number;
  currentMembers: number;
  createdBy: string;
  memberIds: string[];
  classIds: string[];
  meetingSchedule?: {
    frequency: "Weekly" | "Bi-weekly" | "Monthly" | "As needed";
    day?: string;
    time?: string;
    location?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
      state.loading = false;
      state.error = null;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    updateGroup: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Group> }>,
    ) => {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = {
          ...state.groups[index],
          ...action.payload.data,
          updatedAt: new Date(),
        };
      }
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },
    addMemberToGroup: (
      state,
      action: PayloadAction<{ groupId: string; memberId: string }>,
    ) => {
      const groupIndex = state.groups.findIndex(
        (g) => g.id === action.payload.groupId,
      );
      if (groupIndex !== -1) {
        const currentGroup = state.groups[groupIndex];
        if (
          !currentGroup.memberIds.includes(action.payload.memberId) &&
          currentGroup.currentMembers < currentGroup.maxMembers
        ) {
          currentGroup.memberIds.push(action.payload.memberId);
          currentGroup.currentMembers = currentGroup.memberIds.length;
          currentGroup.updatedAt = new Date();
        }
      }
    },
    removeMemberFromGroup: (
      state,
      action: PayloadAction<{ groupId: string; memberId: string }>,
    ) => {
      const groupIndex = state.groups.findIndex(
        (g) => g.id === action.payload.groupId,
      );
      if (groupIndex !== -1) {
        const currentGroup = state.groups[groupIndex];
        currentGroup.memberIds = currentGroup.memberIds.filter(
          (id) => id !== action.payload.memberId,
        );
        currentGroup.currentMembers = currentGroup.memberIds.length;
        currentGroup.updatedAt = new Date();
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setGroups,
  addGroup,
  updateGroup,
  removeGroup,
  addMemberToGroup,
  removeMemberFromGroup,
} = groupsSlice.actions;

// Selectors
export const selectAllGroups = (state: { groups: GroupsState }) =>
  state.groups.groups;
export const selectGroupById = (state: { groups: GroupsState }, id: string) =>
  state.groups.groups.find((g) => g.id === id);
export const selectGroupsByType = (
  state: { groups: GroupsState },
  type: string,
) => state.groups.groups.filter((g) => g.type === type);
export const selectGroupsByCreator = (
  state: { groups: GroupsState },
  creatorId: string,
) => state.groups.groups.filter((g) => g.createdBy === creatorId);
export const selectActiveGroups = (state: { groups: GroupsState }) =>
  state.groups.groups.filter((g) => g.status === "Active");
export const selectGroupsLoading = (state: { groups: GroupsState }) =>
  state.groups.loading;
export const selectGroupsError = (state: { groups: GroupsState }) =>
  state.groups.error;

export default groupsSlice.reducer;
