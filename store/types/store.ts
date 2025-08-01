/**
 * Store Types
 * TypeScript types for the Redux store
 */
import type { store } from "../store";

// Root state type
export type RootState = ReturnType<typeof store.getState>;

// App dispatch type
export type AppDispatch = typeof store.dispatch;

// Store type
export type AppStore = typeof store;

// Thunk API type for createAsyncThunk
export interface ThunkAPI {
  dispatch: AppDispatch;
  state: RootState;
  rejectValue: string;
}

// Selector type helper
export type Selector<T> = (state: RootState) => T;

// Action creator type helper
export type ActionCreator<P = void> = P extends void
  ? () => { type: string }
  : (payload: P) => { type: string; payload: P };

// Async thunk state
export interface AsyncThunkState {
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

// Entity state for normalized data
export interface EntityState<T> {
  ids: string[];
  entities: Record<string, T>;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

// Pagination state
export interface PaginationState {
  page: number;
  limit: number;
  total?: number;
  hasMore: boolean;
  cursor?: string;
}

// Filter state
export interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filters: Record<string, any>;
}

// List state combining entity, pagination, and filters
export interface ListState<T> extends EntityState<T> {
  pagination: PaginationState;
  filters: FilterState;
}

// Modal state
export interface ModalState {
  isOpen: boolean;
  data?: any;
  loading?: boolean;
  error?: string | null;
}

// Form state
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}
