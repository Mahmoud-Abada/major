import { Parent, ParentFormData } from "@/types/classroom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Empty parents array - will be populated from API
const mockParents: any[] = [];

interface ParentsState {
  parents: Parent[];
  selectedParent: Parent | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
    wilaya: string[];
    relationship: string[];
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ParentsState = {
  parents: mockParents,
  selectedParent: null,
  loading: false,
  error: null,
  filters: {
    status: [],
    wilaya: [],
    relationship: [],
    search: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: mockParents.length,
  },
};

const parentsSlice = createSlice({
  name: "parents",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // CRUD operations
    addParent: (state, action: PayloadAction<ParentFormData>) => {
      const newParent: Parent = {
        ...action.payload,
        id: `parent-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.parents.push(newParent);
      state.pagination.total += 1;
    },

    updateParent: (
      state,
      action: PayloadAction<{ id: string; data: Partial<ParentFormData> }>,
    ) => {
      const { id, data } = action.payload;
      const index = state.parents.findIndex((parent) => parent.id === id);
      if (index !== -1) {
        state.parents[index] = {
          ...state.parents[index],
          ...data,
          updatedAt: new Date(),
        };
        if (state.selectedParent?.id === id) {
          state.selectedParent = state.parents[index];
        }
      }
    },

    deleteParent: (state, action: PayloadAction<string>) => {
      state.parents = state.parents.filter(
        (parent) => parent.id !== action.payload,
      );
      state.pagination.total -= 1;
      if (state.selectedParent?.id === action.payload) {
        state.selectedParent = null;
      }
    },

    deleteMultipleParents: (state, action: PayloadAction<string[]>) => {
      state.parents = state.parents.filter(
        (parent) => !action.payload.includes(parent.id),
      );
      state.pagination.total -= action.payload.length;
      if (
        state.selectedParent &&
        action.payload.includes(state.selectedParent.id)
      ) {
        state.selectedParent = null;
      }
    },

    // Selection
    setSelectedParent: (state, action: PayloadAction<Parent | null>) => {
      state.selectedParent = action.payload;
    },

    // Filters
    setFilters: (
      state,
      action: PayloadAction<Partial<ParentsState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        status: [],
        wilaya: [],
        relationship: [],
        search: "",
      };
    },

    // Pagination
    setPagination: (
      state,
      action: PayloadAction<Partial<ParentsState["pagination"]>>,
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Bulk operations
    updateParentStatus: (
      state,
      action: PayloadAction<{ ids: string[]; status: Parent["status"] }>,
    ) => {
      const { ids, status } = action.payload;
      state.parents.forEach((parent) => {
        if (ids.includes(parent.id)) {
          parent.status = status;
          parent.updatedAt = new Date();
        }
      });
    },

    // Student relationship operations
    addStudentToParent: (
      state,
      action: PayloadAction<{ parentId: string; studentId: string }>,
    ) => {
      const { parentId, studentId } = action.payload;
      const parent = state.parents.find((p) => p.id === parentId);
      if (parent && !parent.studentIds.includes(studentId)) {
        parent.studentIds.push(studentId);
        parent.updatedAt = new Date();
      }
    },

    removeStudentFromParent: (
      state,
      action: PayloadAction<{ parentId: string; studentId: string }>,
    ) => {
      const { parentId, studentId } = action.payload;
      const parent = state.parents.find((p) => p.id === parentId);
      if (parent) {
        parent.studentIds = parent.studentIds.filter((id) => id !== studentId);
        parent.updatedAt = new Date();
      }
    },

    // Payment operations
    addPaymentToParent: (
      state,
      action: PayloadAction<{ parentId: string; payment: any }>,
    ) => {
      const { parentId, payment } = action.payload;
      const parent = state.parents.find((p) => p.id === parentId);
      if (parent) {
        parent.payments.push(payment);
        parent.paidAmount += payment.amount;
        parent.pendingAmount -= payment.amount;
        parent.updatedAt = new Date();
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addParent,
  updateParent,
  deleteParent,
  deleteMultipleParents,
  setSelectedParent,
  setFilters,
  clearFilters,
  setPagination,
  updateParentStatus,
  addStudentToParent,
  removeStudentFromParent,
  addPaymentToParent,
} = parentsSlice.actions;

// Selectors
export const selectAllParents = (state: RootState) => state.parents.parents;
export const selectSelectedParent = (state: RootState) =>
  state.parents.selectedParent;
export const selectParentsLoading = (state: RootState) => state.parents.loading;
export const selectParentsError = (state: RootState) => state.parents.error;
export const selectParentsFilters = (state: RootState) => state.parents.filters;
export const selectParentsPagination = (state: RootState) =>
  state.parents.pagination;

// Filtered parents selector
export const selectFilteredParents = (state: RootState) => {
  const { parents, filters } = state.parents;

  return parents.filter((parent) => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(parent.status)) {
      return false;
    }

    // Wilaya filter
    if (filters.wilaya.length > 0 && !filters.wilaya.includes(parent.wilaya)) {
      return false;
    }

    // Relationship filter
    if (
      filters.relationship.length > 0 &&
      !filters.relationship.includes(parent.relationship)
    ) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        parent.name.toLowerCase().includes(searchLower) ||
        parent.parentId.toLowerCase().includes(searchLower) ||
        parent.email.toLowerCase().includes(searchLower) ||
        parent.occupation.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

export const selectParentById = (state: RootState, id: string) =>
  state.parents.parents.find((parent) => parent.id === id);

export const selectParentsByStudent = (state: RootState, studentId: string) =>
  state.parents.parents.filter((parent) =>
    parent.studentIds.includes(studentId),
  );

export const selectActiveParents = (state: RootState) =>
  state.parents.parents.filter((parent) => parent.status === "Active");

export const selectParentsByWilaya = (state: RootState, wilaya: string) =>
  state.parents.parents.filter((parent) => parent.wilaya === wilaya);

export default parentsSlice.reducer;
