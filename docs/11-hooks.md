# Hooks

## Overview

The application uses a comprehensive set of custom React hooks to encapsulate business logic, manage state, and provide reusable functionality across components.

## Authentication Hooks

### useAuth Hook
```typescript
// hooks/useAuth.ts
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Usage example
export function ProfileComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
```

### useRouteProtection Hook
```typescript
// hooks/useRouteProtection.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

interface UseRouteProtectionOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useRouteProtection({
  requiredRole,
  redirectTo = '/signin',
  requireAuth = true,
}: UseRouteProtectionOptions = {}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role requirement
    if (requiredRole && user?.userType !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [user, isAuthenticated, loading, requiredRole, redirectTo, requireAuth, router]);

  return {
    isAuthorized: isAuthenticated && (!requiredRole || user?.userType === requiredRole),
    loading,
  };
}

// Usage example
export function TeacherDashboard() {
  const { isAuthorized, loading } = useRouteProtection({
    requiredRole: 'teacher',
  });

  if (loading) return <LoadingSpinner />;
  if (!isAuthorized) return null;

  return <div>Teacher Dashboard Content</div>;
}
```

## API Hooks

### useApi Hook
```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useApi<T = any, P = any>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
  } = options;

  const execute = useCallback(
    async (params: P) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction(params);
        setData(result);
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        
        if (showErrorToast) {
          toast.error(error.message);
        }
        
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Usage example
export function CreateStudentForm() {
  const { execute: createStudent, loading } = useApi(
    studentApi.createStudent,
    {
      showSuccessToast: true,
      successMessage: 'Student created successfully',
      onSuccess: () => {
        // Redirect or refresh data
        router.push('/students');
      },
    }
  );

  const handleSubmit = async (data: StudentFormData) => {
    await createStudent(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Student'}
      </Button>
    </form>
  );
}
```

### useClassroom Hook
```typescript
// hooks/useClassroom.ts
import { useState, useEffect, useCallback } from 'react';
import { useGetClassroomsQuery, useCreateClassroomMutation } from '@/store/api/classroomApi';

export function useClassroom() {
  const [filters, setFilters] = useState<ClassroomFilters>({
    search: '',
    teacherId: '',
    status: 'all',
    page: 1,
    limit: 10,
  });

  const {
    data: classroomsResponse,
    isLoading,
    error,
    refetch,
  } = useGetClassroomsQuery(filters);

  const [createClassroom, { isLoading: isCreating }] = useCreateClassroomMutation();

  const classrooms = classroomsResponse?.data || [];
  const pagination = classroomsResponse?.pagination;

  const updateFilters = useCallback((newFilters: Partial<ClassroomFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const createNewClassroom = useCallback(
    async (data: CreateClassroomRequest) => {
      try {
        await createClassroom(data).unwrap();
        toast.success('Classroom created successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to create classroom');
        throw error;
      }
    },
    [createClassroom, refetch]
  );

  return {
    classrooms,
    pagination,
    filters,
    isLoading,
    isCreating,
    error,
    updateFilters,
    changePage,
    createClassroom: createNewClassroom,
    refetch,
  };
}

// Usage example
export function ClassroomList() {
  const {
    classrooms,
    pagination,
    filters,
    isLoading,
    updateFilters,
    changePage,
  } = useClassroom();

  return (
    <div>
      <SearchInput
        value={filters.search}
        onChange={(search) => updateFilters({ search })}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid gap-4">
            {classrooms.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
          
          <Pagination
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={changePage}
          />
        </>
      )}
    </div>
  );
}
```

## UI State Hooks

### useLoadingState Hook
```typescript
// hooks/useLoadingState.ts
import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export function useLoadingState(initialState: LoadingState = {}) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(initialState);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const withLoading = useCallback(
    async <T>(key: string, asyncFunction: () => Promise<T>): Promise<T> => {
      setLoading(key, true);
      try {
        return await asyncFunction();
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading]
  );

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading,
  };
}

// Usage example
export function StudentActions({ studentId }: { studentId: string }) {
  const { setLoading, isLoading, withLoading } = useLoadingState();

  const handleDelete = async () => {
    await withLoading('delete', async () => {
      await deleteStudent(studentId);
      toast.success('Student deleted');
    });
  };

  const handleUpdate = async (data: UpdateStudentData) => {
    await withLoading('update', async () => {
      await updateStudent(studentId, data);
      toast.success('Student updated');
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleUpdate}
        disabled={isLoading('update')}
      >
        {isLoading('update') ? 'Updating...' : 'Update'}
      </Button>
      
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={isLoading('delete')}
      >
        {isLoading('delete') ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}
```

### useMobile Hook
```typescript
// hooks/use-mobile.ts
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

// Usage example
export function ResponsiveComponent() {
  const isMobile = useMobile();

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

## Form Hooks

### useFormValidation Hook
```typescript
// hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: any): data is T => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path.length > 0) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors);
        }
        return false;
      }
    },
    [schema]
  );

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      try {
        const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: error.errors[0]?.message || 'Invalid value',
          }));
        }
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    hasErrors,
  };
}

// Usage example
const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(16, 'Must be at least 16 years old'),
});

export function StudentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const { errors, validate, validateField, hasErrors } = useFormValidation(studentSchema);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate(formData)) {
      // Submit form
      console.log('Form is valid:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="Name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <button type="submit" disabled={hasErrors}>
        Submit
      </button>
    </form>
  );
}
```

## Data Management Hooks

### useLocalStorage Hook
```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Usage example
export function UserPreferences() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="ar">Arabic</option>
      </select>
      
      <button onClick={removeTheme}>Reset Theme</button>
    </div>
  );
}
```

### useDebounce Hook
```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example
export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults } = useSearchQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      {searchResults?.map((result) => (
        <div key={result.id}>{result.name}</div>
      ))}
    </div>
  );
}
```

## Specialized Hooks

### useMarks Hook
```typescript
// hooks/useMarks.ts
import { useState, useCallback } from 'react';
import { useGetMarksQuery, useUpdateMarkMutation } from '@/store/api/markApi';

export function useMarks(classroomId: string) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');

  const {
    data: marks,
    isLoading,
    error,
    refetch,
  } = useGetMarksQuery({
    classroomId,
    subject: selectedSubject,
    period: selectedPeriod,
  });

  const [updateMark] = useUpdateMarkMutation();

  const updateStudentMark = useCallback(
    async (studentId: string, subject: string, mark: number) => {
      try {
        await updateMark({
          studentId,
          subject,
          mark,
          classroomId,
        }).unwrap();
        
        toast.success('Mark updated successfully');
      } catch (error) {
        toast.error('Failed to update mark');
        throw error;
      }
    },
    [updateMark, classroomId]
  );

  const getStudentAverage = useCallback(
    (studentId: string) => {
      if (!marks) return 0;
      
      const studentMarks = marks.filter(mark => mark.studentId === studentId);
      if (studentMarks.length === 0) return 0;
      
      const total = studentMarks.reduce((sum, mark) => sum + mark.value, 0);
      return total / studentMarks.length;
    },
    [marks]
  );

  const getClassAverage = useCallback(() => {
    if (!marks || marks.length === 0) return 0;
    
    const total = marks.reduce((sum, mark) => sum + mark.value, 0);
    return total / marks.length;
  }, [marks]);

  return {
    marks,
    isLoading,
    error,
    selectedSubject,
    selectedPeriod,
    setSelectedSubject,
    setSelectedPeriod,
    updateStudentMark,
    getStudentAverage,
    getClassAverage,
    refetch,
  };
}
```

### usePosts Hook
```typescript
// hooks/usePosts.ts
import { useState, useCallback } from 'react';
import { useGetPostsQuery, useCreatePostMutation } from '@/store/api/postApi';

export function usePosts(classroomId?: string) {
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'announcement' | 'assignment',
    page: 1,
    limit: 10,
  });

  const {
    data: postsResponse,
    isLoading,
    error,
    refetch,
  } = useGetPostsQuery({
    classroomId,
    ...filters,
  });

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();

  const posts = postsResponse?.data || [];
  const pagination = postsResponse?.pagination;

  const createNewPost = useCallback(
    async (postData: CreatePostRequest) => {
      try {
        await createPost({
          ...postData,
          classroomId,
        }).unwrap();
        
        toast.success('Post created successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to create post');
        throw error;
      }
    },
    [createPost, classroomId, refetch]
  );

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return {
    posts,
    pagination,
    filters,
    isLoading,
    isCreating,
    error,
    createPost: createNewPost,
    updateFilters,
    refetch,
  };
}
```

## Best Practices

### 1. Hook Composition
- Keep hooks focused on a single responsibility
- Compose complex functionality from simpler hooks
- Use custom hooks to encapsulate business logic

### 2. Error Handling
- Always handle errors in async hooks
- Provide meaningful error messages
- Use error boundaries for critical failures

### 3. Performance
- Use useCallback and useMemo appropriately
- Avoid creating new objects in dependency arrays
- Debounce expensive operations

### 4. Type Safety
- Use TypeScript for all custom hooks
- Define clear interfaces for hook parameters and return values
- Leverage generic types for reusable hooks

### 5. Testing
- Write unit tests for custom hooks
- Use React Testing Library's renderHook utility
- Test both success and error scenarios