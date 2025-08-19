# State Management

## Redux Toolkit Architecture

The application uses Redux Toolkit (RTK) with RTK Query for comprehensive state management, providing predictable state updates and efficient data fetching.

## Store Configuration

### Store Setup
```typescript
// store/store.ts
export const store = configureStore({
  reducer: {
    // Auth slice
    auth: authReducer,

    // Classroom management slices
    students: studentsReducer,
    teachers: teachersReducer,
    parents: parentsReducer,
    dashboard: dashboardReducer,

    // API slice
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          // RTK Query actions
          "api/executeQuery/pending",
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
        ],
      },
    }).concat(baseApi.middleware),
});
```

### Type Definitions
```typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## RTK Query API Layer

### Base API Configuration
```typescript
// store/api/baseApi.ts
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Classroom',
    'Student',
    'Teacher',
    'Parent',
    'Group',
    'Attendance',
    'Mark',
    'Post',
  ],
  endpoints: () => ({}),
});
```

### API Endpoints

#### Authentication API
```typescript
// store/api/authApi.ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;
```

#### Classroom API
```typescript
// store/api/classroomApi.ts
export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query<Classroom[], ClassroomFilters>({
      query: (filters) => ({
        url: '/classrooms',
        params: filters,
      }),
      providesTags: ['Classroom'],
    }),

    createClassroom: builder.mutation<Classroom, CreateClassroomRequest>({
      query: (classroom) => ({
        url: '/classrooms',
        method: 'POST',
        body: classroom,
      }),
      invalidatesTags: ['Classroom'],
    }),

    updateClassroom: builder.mutation<Classroom, UpdateClassroomRequest>({
      query: ({ id, ...classroom }) => ({
        url: `/classrooms/${id}`,
        method: 'PUT',
        body: classroom,
      }),
      invalidatesTags: ['Classroom'],
    }),

    deleteClassroom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/classrooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Classroom'],
    }),

    addStudentToClassroom: builder.mutation<void, AddStudentRequest>({
      query: ({ classroomId, studentId }) => ({
        url: `/classrooms/${classroomId}/students`,
        method: 'POST',
        body: { studentId },
      }),
      invalidatesTags: ['Classroom', 'Student'],
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
  useAddStudentToClassroomMutation,
} = classroomApi;
```

## Redux Slices

### Authentication Slice
```typescript
// store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastActivity: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastActivity: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<{
      user: User;
      token: string;
      refreshToken?: string;
    }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.lastActivity = Date.now();
    },

    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.lastActivity = null;
    },

    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setAuthState,
  clearAuthState,
  updateLastActivity,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
```

### Dashboard Slice
```typescript
// store/slices/classroom/dashboardSlice.ts
interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: Activity[];
  loading: boolean;
  error: string | null;
  selectedDateRange: DateRange;
}

const initialState: DashboardState = {
  stats: null,
  recentActivity: [],
  loading: false,
  error: null,
  selectedDateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },

    setRecentActivity: (state, action: PayloadAction<Activity[]>) => {
      state.recentActivity = action.payload;
    },

    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStats,
  setRecentActivity,
  setDateRange,
  setLoading,
  setError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
```

### Students Slice
```typescript
// store/slices/classroom/studentsSlice.ts
interface StudentsState {
  students: Student[];
  selectedStudents: string[];
  filters: StudentFilters;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  selectedStudents: [],
  filters: {
    search: '',
    classroomId: '',
    status: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },

    setSelectedStudents: (state, action: PayloadAction<string[]>) => {
      state.selectedStudents = action.payload;
    },

    toggleStudentSelection: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      const index = state.selectedStudents.indexOf(studentId);
      
      if (index > -1) {
        state.selectedStudents.splice(index, 1);
      } else {
        state.selectedStudents.push(studentId);
      }
    },

    setFilters: (state, action: PayloadAction<Partial<StudentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const {
  setStudents,
  setSelectedStudents,
  toggleStudentSelection,
  setFilters,
  clearFilters,
  setPagination,
} = studentsSlice.actions;

export default studentsSlice.reducer;
```

## State Usage Patterns

### Using RTK Query Hooks
```typescript
// Component using RTK Query
export function ClassroomList() {
  const [filters, setFilters] = useState<ClassroomFilters>({});
  
  const {
    data: classrooms,
    isLoading,
    error,
    refetch,
  } = useGetClassroomsQuery(filters);

  const [deleteClassroom] = useDeleteClassroomMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteClassroom(id).unwrap();
      toast.success('Classroom deleted successfully');
    } catch (error) {
      toast.error('Failed to delete classroom');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      {classrooms?.map((classroom) => (
        <ClassroomCard
          key={classroom.id}
          classroom={classroom}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### Using Redux Slices
```typescript
// Component using Redux slice
export function StudentSelector() {
  const dispatch = useAppDispatch();
  const { selectedStudents, filters } = useAppSelector(
    (state) => state.students
  );

  const handleStudentToggle = (studentId: string) => {
    dispatch(toggleStudentSelection(studentId));
  };

  const handleFilterChange = (newFilters: Partial<StudentFilters>) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div>
      <StudentFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
      <StudentList
        selectedStudents={selectedStudents}
        onStudentToggle={handleStudentToggle}
      />
    </div>
  );
}
```

## Advanced Patterns

### Optimistic Updates
```typescript
// Optimistic update example
export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateClassroom: builder.mutation<Classroom, UpdateClassroomRequest>({
      query: ({ id, ...classroom }) => ({
        url: `/classrooms/${id}`,
        method: 'PUT',
        body: classroom,
      }),
      // Optimistic update
      onQueryStarted: async ({ id, ...patch }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          classroomApi.util.updateQueryData('getClassrooms', undefined, (draft) => {
            const classroom = draft.find((c) => c.id === id);
            if (classroom) {
              Object.assign(classroom, patch);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});
```

### Selective Invalidation
```typescript
// Selective cache invalidation
export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addStudentToClassroom: builder.mutation<void, AddStudentRequest>({
      query: ({ classroomId, studentId }) => ({
        url: `/classrooms/${classroomId}/students`,
        method: 'POST',
        body: { studentId },
      }),
      // Invalidate specific cache entries
      invalidatesTags: (result, error, { classroomId }) => [
        { type: 'Classroom', id: classroomId },
        { type: 'Student', id: 'LIST' },
      ],
    }),
  }),
});
```

### Custom Middleware
```typescript
// Custom middleware for logging
const loggingMiddleware: Middleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Dispatching:', action);
    const result = next(action);
    console.log('Next state:', store.getState());
    return result;
  }
  return next(action);
};
```

## Performance Optimization

### Memoized Selectors
```typescript
// Memoized selectors with reselect
import { createSelector } from '@reduxjs/toolkit';

const selectStudents = (state: RootState) => state.students.students;
const selectFilters = (state: RootState) => state.students.filters;

export const selectFilteredStudents = createSelector(
  [selectStudents, selectFilters],
  (students, filters) => {
    return students.filter((student) => {
      if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.classroomId && student.classroomId !== filters.classroomId) {
        return false;
      }
      return true;
    });
  }
);
```

### Query Optimization
```typescript
// Skip queries when not needed
export function StudentProfile({ studentId }: { studentId?: string }) {
  const { data: student } = useGetStudentQuery(studentId!, {
    skip: !studentId,
  });

  // Polling for real-time updates
  const { data: attendance } = useGetAttendanceQuery(studentId!, {
    pollingInterval: 30000, // Poll every 30 seconds
    skip: !studentId,
  });

  return <div>{/* Component content */}</div>;
}
```

## Best Practices

1. **Normalize State**: Keep state flat and normalized
2. **Use RTK Query**: Prefer RTK Query for server state
3. **Minimize Subscriptions**: Only subscribe to needed state slices
4. **Memoize Selectors**: Use createSelector for expensive computations
5. **Handle Loading States**: Always handle loading and error states
6. **Type Safety**: Use TypeScript for all state definitions
7. **Cache Management**: Implement proper cache invalidation strategies
8. **Optimistic Updates**: Use for better user experience