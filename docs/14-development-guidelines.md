# Development Guidelines

## Code Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// ✅ Good: Use specific types
interface UserFormData {
  name: string;
  email: string;
  age: number;
}

// ❌ Bad: Avoid any
interface UserFormData {
  [key: string]: any;
}

// ✅ Good: Use type guards
function isStudent(user: User): user is Student {
  return user.userType === 'student';
}

// ✅ Good: Use generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

#### Naming Conventions
```typescript
// ✅ Good: Descriptive names
const getUsersByClassroom = (classroomId: string) => { /* ... */ };
const isUserAuthenticated = (user: User) => { /* ... */ };

// ❌ Bad: Abbreviated or unclear names
const getUsrs = (cId: string) => { /* ... */ };
const chkAuth = (u: User) => { /* ... */ };

// ✅ Good: Consistent naming patterns
interface CreateUserRequest { /* ... */ }
interface UpdateUserRequest { /* ... */ }
interface DeleteUserRequest { /* ... */ }

// ✅ Good: Boolean prefixes
const isLoading = true;
const hasPermission = false;
const canEdit = true;
```

### React Component Guidelines

#### Component Structure
```typescript
// ✅ Good: Well-structured component
interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function StudentCard({
  student,
  onEdit,
  onDelete,
  className,
}: StudentCardProps) {
  // Hooks at the top
  const { t } = useTranslations('students');
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleEdit = useCallback(() => {
    onEdit?.(student);
  }, [onEdit, student]);

  const handleDelete = useCallback(async () => {
    if (!confirm(t('confirmDelete'))) return;
    
    setIsLoading(true);
    try {
      await onDelete?.(student.id);
    } finally {
      setIsLoading(false);
    }
  }, [onDelete, student.id, t]);

  // Early returns
  if (!student) {
    return <div>Student not found</div>;
  }

  // Main render
  return (
    <Card className={cn("p-4", className)}>
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
        <CardDescription>{student.email}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleEdit} disabled={isLoading}>
          {t('edit')}
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? t('deleting') : t('delete')}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### Hook Guidelines
```typescript
// ✅ Good: Custom hook with clear responsibility
export function useStudentManagement(classroomId: string) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  const {
    data: students,
    isLoading,
    error,
    refetch,
  } = useGetStudentsQuery({ classroomId });

  const [deleteStudent] = useDeleteStudentMutation();

  const handleDeleteSelected = useCallback(async () => {
    const promises = selectedStudents.map(id => deleteStudent(id));
    await Promise.all(promises);
    setSelectedStudents([]);
    refetch();
  }, [selectedStudents, deleteStudent, refetch]);

  const toggleStudentSelection = useCallback((studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  }, []);

  return {
    students,
    selectedStudents,
    isLoading,
    error,
    handleDeleteSelected,
    toggleStudentSelection,
    refetch,
  };
}

// ❌ Bad: Hook doing too many things
export function useEverything() {
  // Too many responsibilities
}
```

### State Management Guidelines

#### Redux Slice Structure
```typescript
// ✅ Good: Well-organized slice
interface StudentsState {
  items: Student[];
  selectedIds: string[];
  filters: StudentFilters;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  items: [],
  selectedIds: [],
  filters: {
    search: '',
    classroomId: '',
    status: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.items = action.payload;
    },
    
    toggleSelection: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      const index = state.selectedIds.indexOf(studentId);
      
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(studentId);
      }
    },
    
    updateFilters: (state, action: PayloadAction<Partial<StudentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});
```

#### RTK Query Best Practices
```typescript
// ✅ Good: Well-structured API slice
export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedResponse<Student>, StudentFilters>({
      query: (filters) => ({
        url: '/students',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Student' as const, id })),
              { type: 'Student', id: 'LIST' },
            ]
          : [{ type: 'Student', id: 'LIST' }],
      // Transform response to match client expectations
      transformResponse: (response: any): PaginatedResponse<Student> => ({
        data: response.students || [],
        pagination: {
          page: response.page || 1,
          limit: response.limit || 10,
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        },
      }),
    }),

    createStudent: builder.mutation<Student, CreateStudentRequest>({
      query: (student) => ({
        url: '/students',
        method: 'POST',
        body: student,
      }),
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
      // Optimistic update
      onQueryStarted: async (newStudent, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdStudent } = await queryFulfilled;
          
          // Update cache optimistically
          dispatch(
            studentsApi.util.updateQueryData('getStudents', {}, (draft) => {
              draft.data.unshift(createdStudent);
              draft.pagination.total += 1;
            })
          );
        } catch (error) {
          // Handle error
        }
      },
    }),
  }),
});
```

## File Organization

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Protected route group
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── auth/             # Authentication components
│   ├── classroom/        # Feature-specific components
│   └── common/           # Shared components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility libraries
├── services/             # API services
├── store/                # Redux store
│   ├── api/              # RTK Query APIs
│   ├── slices/           # Redux slices
│   └── types/            # Store-specific types
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
└── styles/               # Additional styles
```

### File Naming Conventions
```
// Components: PascalCase
StudentCard.tsx
ClassroomList.tsx
AuthGuard.tsx

// Hooks: camelCase with 'use' prefix
useAuth.ts
useClassroom.ts
useLocalStorage.ts

// Utilities: camelCase
dateUtils.ts
stringUtils.ts
apiUtils.ts

// Types: camelCase with descriptive suffix
authTypes.ts
classroomTypes.ts
apiTypes.ts

// Constants: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts
```

## Error Handling

### Component Error Boundaries
```typescript
// ✅ Good: Comprehensive error boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Report to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We're sorry, but something unexpected happened.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
          >
            Try again
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-muted rounded">
              <summary>Error details</summary>
              <pre className="mt-2 text-sm">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
// ✅ Good: Consistent error handling
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    showToast?: boolean;
    fallbackValue?: T;
    onError?: (error: Error) => void;
  } = {}
): Promise<T | undefined> {
  try {
    return await apiCall();
  } catch (error) {
    const apiError = handleAPIError(error);
    
    // Log error
    console.error('API call failed:', apiError);
    
    // Show user-friendly message
    if (options.showToast) {
      toast.error(getUserFriendlyErrorMessage(error));
    }
    
    // Call custom error handler
    if (options.onError && error instanceof Error) {
      options.onError(error);
    }
    
    // Return fallback value or undefined
    return options.fallbackValue;
  }
}

// Usage
const students = await handleApiCall(
  () => studentsApi.getStudents({ classroomId }),
  {
    showToast: true,
    fallbackValue: [],
    onError: (error) => {
      // Custom error handling
      if (isAuthError(error)) {
        router.push('/signin');
      }
    },
  }
);
```

## Performance Guidelines

### Component Optimization
```typescript
// ✅ Good: Optimized component
export const StudentList = React.memo(function StudentList({
  students,
  onStudentSelect,
  selectedStudents,
}: StudentListProps) {
  // Memoize expensive calculations
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

  // Memoize callbacks
  const handleStudentClick = useCallback(
    (studentId: string) => {
      onStudentSelect(studentId);
    },
    [onStudentSelect]
  );

  return (
    <div className="space-y-2">
      {sortedStudents.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          isSelected={selectedStudents.includes(student.id)}
          onClick={handleStudentClick}
        />
      ))}
    </div>
  );
});

// ✅ Good: Memoized student card
const StudentCard = React.memo(function StudentCard({
  student,
  isSelected,
  onClick,
}: StudentCardProps) {
  const handleClick = useCallback(() => {
    onClick(student.id);
  }, [onClick, student.id]);

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-colors",
        isSelected && "bg-primary/10"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={student.profilePicture} />
          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
      </div>
    </Card>
  );
});
```

### Data Fetching Optimization
```typescript
// ✅ Good: Optimized data fetching
export function useOptimizedStudents(classroomId: string) {
  // Use RTK Query with proper caching
  const {
    data: students,
    isLoading,
    error,
  } = useGetStudentsQuery(
    { classroomId },
    {
      // Skip if no classroomId
      skip: !classroomId,
      // Refetch on window focus
      refetchOnFocus: true,
      // Cache for 5 minutes
      pollingInterval: 5 * 60 * 1000,
    }
  );

  // Memoize derived data
  const studentsByGrade = useMemo(() => {
    if (!students) return {};
    
    return students.reduce((acc, student) => {
      const grade = student.academicInfo?.level || 'Unknown';
      if (!acc[grade]) acc[grade] = [];
      acc[grade].push(student);
      return acc;
    }, {} as Record<string, Student[]>);
  }, [students]);

  return {
    students: students || [],
    studentsByGrade,
    isLoading,
    error,
  };
}
```

## Testing Guidelines

### Component Testing
```typescript
// ✅ Good: Comprehensive component test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentCard } from './StudentCard';

const mockStudent: Student = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  userType: 'student',
  // ... other required fields
};

describe('StudentCard', () => {
  it('renders student information correctly', () => {
    render(
      <StudentCard
        student={mockStudent}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    
    render(
      <StudentCard
        student={mockStudent}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockStudent);
  });

  it('shows confirmation before deleting', async () => {
    const onDelete = jest.fn();
    window.confirm = jest.fn(() => true);
    
    render(
      <StudentCard
        student={mockStudent}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(onDelete).toHaveBeenCalledWith(mockStudent.id);
    });
  });
});
```

### Hook Testing
```typescript
// ✅ Good: Hook test
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );

    expect(result.current[0]).toBe('initial');
  });

  it('stores and retrieves values correctly', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test-key')).toBe('"new value"');
  });
});
```

## Security Guidelines

### Input Validation
```typescript
// ✅ Good: Comprehensive validation
import { z } from 'zod';

const createStudentSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  
  phoneNumber: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  
  dateOfBirth: z.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 16 && age <= 100;
      },
      'Student must be between 16 and 100 years old'
    ),
});

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}
```

### Authentication Security
```typescript
// ✅ Good: Secure token handling
export function setSecureToken(token: string): void {
  // Use httpOnly cookies in production
  if (process.env.NODE_ENV === 'production') {
    document.cookie = `auth-token=${token}; path=/; secure; samesite=strict; httponly`;
  } else {
    // Fallback for development
    localStorage.setItem('auth-token', token);
  }
}

export function getSecureToken(): string | null {
  if (process.env.NODE_ENV === 'production') {
    // Token will be sent automatically with requests
    return null;
  } else {
    return localStorage.getItem('auth-token');
  }
}

// ✅ Good: Permission checking
export function requirePermission(
  user: AuthUser,
  permission: Permission
): void {
  if (!hasPermission(user, permission)) {
    throw new Error('Insufficient permissions');
  }
}
```

## Documentation Guidelines

### Code Documentation
```typescript
/**
 * Manages student data for a specific classroom
 * 
 * @param classroomId - The ID of the classroom to manage students for
 * @returns Object containing student data and management functions
 * 
 * @example
 * ```tsx
 * function ClassroomPage({ classroomId }: { classroomId: string }) {
 *   const {
 *     students,
 *     selectedStudents,
 *     toggleStudentSelection,
 *     deleteSelectedStudents
 *   } = useStudentManagement(classroomId);
 * 
 *   return (
 *     <div>
 *       {students.map(student => (
 *         <StudentCard
 *           key={student.id}
 *           student={student}
 *           isSelected={selectedStudents.includes(student.id)}
 *           onToggleSelect={() => toggleStudentSelection(student.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useStudentManagement(classroomId: string) {
  // Implementation...
}
```

### README Documentation
```markdown
# Component Name

Brief description of what the component does.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `student` | `Student` | Yes | - | The student object to display |
| `onEdit` | `(student: Student) => void` | No | - | Callback when edit button is clicked |
| `className` | `string` | No | - | Additional CSS classes |

## Usage

```tsx
import { StudentCard } from './StudentCard';

function StudentList({ students }: { students: Student[] }) {
  const handleEdit = (student: Student) => {
    // Handle edit logic
  };

  return (
    <div>
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
```

## Accessibility

This component follows WCAG 2.1 guidelines:
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Sufficient color contrast ratios
```

## Best Practices Summary

1. **Type Safety**: Use TypeScript strictly, avoid `any`
2. **Component Design**: Keep components focused and reusable
3. **Performance**: Use React.memo, useMemo, and useCallback appropriately
4. **Error Handling**: Implement comprehensive error boundaries and API error handling
5. **Testing**: Write tests for critical functionality
6. **Security**: Validate inputs and handle authentication securely
7. **Documentation**: Document complex logic and component APIs
8. **Code Organization**: Follow consistent file structure and naming conventions