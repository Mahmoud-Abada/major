# API Integration

## API Architecture

The application uses a layered approach for API integration, combining RTK Query for data fetching with custom services for complex business logic.

## Base API Configuration

### RTK Query Base API
```typescript
// store/api/baseApi.ts
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      // Add locale for internationalization
      const locale = headers.get('locale') || 'en';
      headers.set('locale', locale);

      // Add content type
      headers.set('content-type', 'application/json');

      return headers;
    },
    // Global error handling
    responseHandler: async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return response.json();
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
    'Assignment',
    'Schedule',
  ],
  endpoints: () => ({}),
});
```

### Custom Fetch Utility
```typescript
// utils/customFetch.ts
interface FetchOptions extends RequestInit {
  locale?: string;
  timeout?: number;
}

export async function customFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    locale = 'en',
    timeout = 10000,
    headers = {},
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'locale': locale,
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }
    
    throw error;
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

## API Services

### Authentication Service
```typescript
// services/auth.ts
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  userData: {
    email: string;
    name: string;
    password: string;
    username: string;
    phoneNumber: string;
    userType: "student" | "teacher" | "school";
    location: LocationData;
  };
  schoolForm?: SchoolFormData;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  userType: "student" | "teacher" | "school";
  isVerified: boolean;
  token: string;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    locale?: string,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return customFetch<T>(url, {
      ...options,
      locale,
    });
  }

  async login(data: LoginRequest, locale?: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async register(data: RegisterRequest, locale?: string): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async sendOTP(data: SendOTPRequest, locale?: string): Promise<OTPResponse> {
    return this.makeRequest<OTPResponse>(
      "/auth/send-otp",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async verifyOTP(data: VerifyOTPRequest, locale?: string): Promise<VerifyOTPResponse> {
    return this.makeRequest<VerifyOTPResponse>(
      "/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }
}

export const authService = new AuthService();
```

### Classroom API Service
```typescript
// services/classroom-api.ts
export interface ClassroomFilters {
  search?: string;
  teacherId?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}

export interface CreateClassroomRequest {
  name: string;
  description?: string;
  teacherId: string;
  subject: string;
  capacity?: number;
}

class ClassroomApiService {
  async getClassrooms(filters: ClassroomFilters = {}): Promise<PaginatedResponse<Classroom>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    return customFetch<PaginatedResponse<Classroom>>(
      `/api/classrooms?${params.toString()}`
    );
  }

  async createClassroom(data: CreateClassroomRequest): Promise<Classroom> {
    return customFetch<Classroom>('/api/classrooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClassroom(id: string, data: Partial<CreateClassroomRequest>): Promise<Classroom> {
    return customFetch<Classroom>(`/api/classrooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClassroom(id: string): Promise<void> {
    return customFetch<void>(`/api/classrooms/${id}`, {
      method: 'DELETE',
    });
  }

  async addStudentsToClassroom(
    classroomId: string,
    studentIds: string[]
  ): Promise<void> {
    return customFetch<void>(`/api/classrooms/${classroomId}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentIds }),
    });
  }
}

export const classroomApiService = new ClassroomApiService();
```

## RTK Query Endpoints

### Authentication API
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
      transformResponse: (response: LoginResponse) => {
        // Transform response if needed
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        // Transform error response
        return {
          status: response.status,
          message: (response.data as any)?.message || 'Login failed',
        };
      },
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
      // Keep user data fresh
      keepUnusedDataFor: 300, // 5 minutes
    }),

    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      // Don't retry refresh token requests
      extraOptions: {
        maxRetries: 0,
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
      // Clear all cache on logout
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch (error) {
          // Handle logout error
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
```

### Classroom API
```typescript
// store/api/classroomApi.ts
export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query<PaginatedResponse<Classroom>, ClassroomFilters>({
      query: (filters) => ({
        url: '/classrooms',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Classroom' as const, id })),
              { type: 'Classroom', id: 'LIST' },
            ]
          : [{ type: 'Classroom', id: 'LIST' }],
      // Transform response to normalize data
      transformResponse: (response: any): PaginatedResponse<Classroom> => ({
        data: response.classrooms || [],
        pagination: {
          page: response.page || 1,
          limit: response.limit || 10,
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        },
      }),
    }),

    getClassroom: builder.query<Classroom, string>({
      query: (id) => `/classrooms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Classroom', id }],
    }),

    createClassroom: builder.mutation<Classroom, CreateClassroomRequest>({
      query: (classroom) => ({
        url: '/classrooms',
        method: 'POST',
        body: classroom,
      }),
      invalidatesTags: [{ type: 'Classroom', id: 'LIST' }],
      // Optimistic update
      onQueryStarted: async (newClassroom, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdClassroom } = await queryFulfilled;
          
          // Update the cache with the new classroom
          dispatch(
            classroomApi.util.updateQueryData('getClassrooms', {}, (draft) => {
              draft.data.unshift(createdClassroom);
              draft.pagination.total += 1;
            })
          );
        } catch (error) {
          // Handle error
        }
      },
    }),

    updateClassroom: builder.mutation<Classroom, { id: string } & Partial<CreateClassroomRequest>>({
      query: ({ id, ...patch }) => ({
        url: `/classrooms/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Classroom', id }],
      // Optimistic update
      onQueryStarted: async ({ id, ...patch }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          classroomApi.util.updateQueryData('getClassrooms', {}, (draft) => {
            const classroom = draft.data.find((c) => c.id === id);
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

    deleteClassroom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/classrooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Classroom', id },
        { type: 'Classroom', id: 'LIST' },
      ],
    }),

    addStudentsToClassroom: builder.mutation<void, {
      classroomId: string;
      studentIds: string[];
    }>({
      query: ({ classroomId, studentIds }) => ({
        url: `/classrooms/${classroomId}/students`,
        method: 'POST',
        body: { studentIds },
      }),
      invalidatesTags: (result, error, { classroomId }) => [
        { type: 'Classroom', id: classroomId },
        { type: 'Student', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useGetClassroomQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
  useAddStudentsToClassroomMutation,
} = classroomApi;
```

## Error Handling

### Global Error Handler
```typescript
// utils/error-handler.ts
export interface APIErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export function handleAPIError(error: unknown): APIErrorResponse {
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      errors: error.data?.errors,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('timeout')
  );
}

export function isAuthError(error: unknown): boolean {
  return error instanceof APIError && (
    error.status === 401 || 
    error.status === 403
  );
}
```

### RTK Query Error Handling
```typescript
// Custom base query with error handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store new token
      const { token } = refreshResult.data as { token: string };
      api.dispatch(setAuthState({ token }));

      // Retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch(clearAuthState());
      window.location.href = '/signin';
    }
  }

  return result;
};
```

## Data Transformation

### Response Transformation
```typescript
// Transform API response to match client expectations
export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], StudentFilters>({
      query: (filters) => ({
        url: '/students',
        params: filters,
      }),
      transformResponse: (response: any): Student[] => {
        return response.students?.map((student: any) => ({
          id: student._id,
          name: student.fullName,
          email: student.emailAddress,
          phoneNumber: student.phone,
          profilePicture: student.avatar || '/default-avatar.png',
          createdAt: new Date(student.createdAt),
          updatedAt: new Date(student.updatedAt),
          // Transform nested objects
          location: {
            wilaya: student.location?.wilaya || '',
            commune: student.location?.commune || '',
            coordinates: student.location?.coordinates || { lat: 0, lng: 0 },
          },
        })) || [];
      },
    }),
  }),
});
```

### Request Transformation
```typescript
// Transform client data for API
export const createStudentMutation = builder.mutation<Student, CreateStudentRequest>({
  query: (studentData) => ({
    url: '/students',
    method: 'POST',
    body: {
      // Transform client data to API format
      fullName: studentData.name,
      emailAddress: studentData.email,
      phone: studentData.phoneNumber,
      avatar: studentData.profilePicture,
      location: {
        wilaya: studentData.location.wilaya,
        commune: studentData.location.commune,
        coordinates: {
          lat: studentData.location.coordinates.lat,
          lng: studentData.location.coordinates.lng,
        },
      },
    },
  }),
});
```

## Caching Strategies

### Cache Configuration
```typescript
// Configure cache behavior
export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query<Classroom[], ClassroomFilters>({
      query: (filters) => ({ url: '/classrooms', params: filters }),
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
      // Provide tags for cache invalidation
      providesTags: ['Classroom'],
    }),

    getClassroomStats: builder.query<ClassroomStats, string>({
      query: (id) => `/classrooms/${id}/stats`,
      // Cache for 1 minute (frequently changing data)
      keepUnusedDataFor: 60,
      // Polling for real-time updates
      pollingInterval: 30000,
    }),
  }),
});
```

### Manual Cache Management
```typescript
// Manually update cache
export function useOptimisticClassroomUpdate() {
  const dispatch = useAppDispatch();

  const updateClassroomOptimistically = useCallback(
    (classroomId: string, updates: Partial<Classroom>) => {
      dispatch(
        classroomApi.util.updateQueryData('getClassrooms', {}, (draft) => {
          const classroom = draft.find(c => c.id === classroomId);
          if (classroom) {
            Object.assign(classroom, updates);
          }
        })
      );
    },
    [dispatch]
  );

  return updateClassroomOptimistically;
}
```

## Best Practices

1. **Error Handling**: Implement comprehensive error handling at all levels
2. **Type Safety**: Use TypeScript for all API interfaces and responses
3. **Caching**: Configure appropriate cache durations based on data volatility
4. **Optimistic Updates**: Use for better user experience with reversible operations
5. **Request Deduplication**: RTK Query automatically deduplicates identical requests
6. **Polling**: Use sparingly and only for critical real-time data
7. **Transformation**: Transform data at the API layer, not in components
8. **Authentication**: Handle token refresh and logout scenarios gracefully
9. **Loading States**: Always provide loading and error states in UI
10. **Retry Logic**: Implement appropriate retry strategies for failed requests