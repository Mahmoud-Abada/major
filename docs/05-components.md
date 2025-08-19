# Components

## Component Architecture

The application follows a hierarchical component structure with clear separation of concerns and reusability patterns.

## Component Categories

### 1. UI Components (`components/ui/`)
Base-level components built on Radix UI primitives with custom styling.

#### Core UI Components
```typescript
// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

// Dialog Component
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}
```

#### Form Components
```typescript
// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// Select Component
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}
```

### 2. Form Components (`components/forms/`)
Specialized form components with validation and state management.

#### Base Form Component
```typescript
// components/forms/BaseForm.tsx
interface BaseFormProps<T> {
  onSubmit: (data: T) => Promise<void>;
  validationSchema: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  children: React.ReactNode;
}

export function BaseForm<T>({
  onSubmit,
  validationSchema,
  defaultValues,
  children,
}: BaseFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  );
}
```

#### Specific Form Components
```typescript
// Student Create Form
export function StudentCreateForm() {
  const [createStudent] = useCreateStudentMutation();

  const handleSubmit = async (data: StudentFormData) => {
    await createStudent(data).unwrap();
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      validationSchema={studentSchema}
    >
      <FormField name="name" label="Full Name" />
      <FormField name="email" label="Email" type="email" />
      <FormField name="phoneNumber" label="Phone Number" />
      <Button type="submit">Create Student</Button>
    </BaseForm>
  );
}
```

### 3. Authentication Components (`components/auth/`)
Components handling authentication flows and protection.

#### Auth Guard
```typescript
// components/auth/AuthGuard.tsx
interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback = <LoadingSpinner />,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) return fallback;
  
  if (!isAuthenticated) {
    redirect("/signin");
  }

  if (requiredRole && user?.userType !== requiredRole) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
}
```

#### Sign In Form
```typescript
// components/auth/SigninForm.tsx
export function SigninForm() {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      router.push("/classroom/dashboard");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      validationSchema={loginSchema}
    >
      <FormField name="identifier" label="Email or Username" />
      <FormField name="password" label="Password" type="password" />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </BaseForm>
  );
}
```

### 4. Classroom Components (`components/classroom/`)
Domain-specific components for classroom management.

#### Classroom Card
```typescript
// components/classroom/ClassroomCard.tsx
interface ClassroomCardProps {
  classroom: Classroom;
  onEdit?: (classroom: Classroom) => void;
  onDelete?: (id: string) => void;
}

export function ClassroomCard({
  classroom,
  onEdit,
  onDelete,
}: ClassroomCardProps) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>{classroom.name}</CardTitle>
        <CardDescription>{classroom.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {classroom.studentCount} students
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {classroom.subjectCount} subjects
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit?.(classroom)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete?.(classroom.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### Student Selector
```typescript
// components/classroom/StudentSelector.tsx
interface StudentSelectorProps {
  selectedStudents: string[];
  onSelectionChange: (students: string[]) => void;
  classroomId?: string;
}

export function StudentSelector({
  selectedStudents,
  onSelectionChange,
  classroomId,
}: StudentSelectorProps) {
  const { data: students } = useGetStudentsQuery({ classroomId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Select Students</h3>
        <Button
          variant="outline"
          onClick={() => onSelectionChange(students?.map(s => s.id) || [])}
        >
          Select All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students?.map((student) => (
          <div
            key={student.id}
            className="flex items-center space-x-2"
          >
            <Checkbox
              id={student.id}
              checked={selectedStudents.includes(student.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectionChange([...selectedStudents, student.id]);
                } else {
                  onSelectionChange(
                    selectedStudents.filter(id => id !== student.id)
                  );
                }
              }}
            />
            <label htmlFor={student.id} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={student.profilePicture} />
                <AvatarFallback>{student.name[0]}</AvatarFallback>
              </Avatar>
              <span>{student.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Dialog Components (`components/dialogs/`)
Modal dialogs for complex interactions.

#### Enhanced Link Groups Dialog
```typescript
// components/dialogs/EnhancedLinkGroupsToClassroomsDialog.tsx
interface LinkGroupsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGroups: string[];
  onSuccess?: () => void;
}

export function EnhancedLinkGroupsToClassroomsDialog({
  open,
  onOpenChange,
  selectedGroups,
  onSuccess,
}: LinkGroupsDialogProps) {
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [linkGroups] = useLinkGroupsToClassroomsMutation();

  const handleSubmit = async () => {
    try {
      await linkGroups({
        groupIds: selectedGroups,
        classroomIds: selectedClassrooms,
      }).unwrap();
      
      toast.success("Groups linked successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to link groups");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Link Groups to Classrooms</DialogTitle>
          <DialogDescription>
            Select classrooms to link with the selected groups.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <ClassroomSelector
            selectedClassrooms={selectedClassrooms}
            onSelectionChange={setSelectedClassrooms}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedClassrooms.length === 0}
          >
            Link Groups
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 6. Common Components (`components/common/`)
Shared utility components used across the application.

#### Loading Spinner
```typescript
// components/common/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  );
}
```

#### Error Boundary
```typescript
// components/common/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export function ErrorBoundary({ children, fallback: Fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryPrimitive
      fallback={({ error, resetErrorBoundary }) => (
        Fallback ? (
          <Fallback error={error} reset={resetErrorBoundary} />
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <Button onClick={resetErrorBoundary}>Try again</Button>
          </div>
        )
      )}
    >
      {children}
    </ErrorBoundaryPrimitive>
  );
}
```

## Component Patterns

### 1. Compound Components
Components that work together to form a complete UI pattern.

```typescript
// Dialog compound component
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 2. Render Props Pattern
Components that accept render functions for flexible rendering.

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  renderActions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  renderActions,
}: DataTableProps<T>) {
  return (
    <Table>
      {/* Table implementation */}
      {renderActions && (
        <TableCell>
          {renderActions(item)}
        </TableCell>
      )}
    </Table>
  );
}
```

### 3. Higher-Order Components
Components that enhance other components with additional functionality.

```typescript
// withAuth HOC
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuthContext();
    
    if (!isAuthenticated) {
      return <LoginPrompt />;
    }
    
    return <Component {...props} />;
  };
}
```

## Component Best Practices

### 1. TypeScript Integration
- Define clear interfaces for all props
- Use generic types for reusable components
- Leverage TypeScript for better IntelliSense

### 2. Performance Optimization
```typescript
// Memoization for expensive components
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onAction,
}: ExpensiveComponentProps) {
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);

  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onAction={handleAction} />
      ))}
    </div>
  );
});
```

### 3. Accessibility
```typescript
// Accessible form field
export function FormField({ name, label, error, ...props }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### 4. Responsive Design
```typescript
// Responsive component with mobile-first approach
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}
```

### 5. Internationalization
```typescript
// Internationalized component
export function WelcomeMessage({ userName }: { userName: string }) {
  const t = useTranslations('common');
  
  return (
    <h1 className="text-2xl font-bold">
      {t('welcome', { name: userName })}
    </h1>
  );
}
```

## Component Testing

### Unit Testing
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Component Documentation

Each component should include:
- Clear TypeScript interfaces
- JSDoc comments for complex props
- Usage examples
- Accessibility considerations
- Performance notes where relevant