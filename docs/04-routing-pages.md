# Routing & Pages

## Next.js App Router

The application uses Next.js 15 App Router for file-based routing with enhanced features like layouts, loading states, and error boundaries.

## Route Structure

### Public Routes
Routes accessible without authentication:

```
/                    # Landing page
/signin              # User login
/signup              # User registration
/forgot-password     # Password recovery
/reset-password      # Password reset
/otp                 # OTP verification
/unauthorized        # Access denied page
```

### Protected Routes
Routes requiring authentication (grouped under `(auth)`):

```
/classroom/          # Classroom management
├── dashboard/       # Main dashboard
├── classes/         # Class management
├── classrooms/      # Classroom overview
├── students/        # Student management
├── teachers/        # Teacher management
├── parents/         # Parent management
├── groups/          # Group management
├── attendance/      # Attendance tracking
├── marks/           # Grade management
├── schedule/        # Class schedules
├── calendar/        # Calendar view
├── posts/           # Announcements
├── homeworks/       # Assignment management
├── payments/        # Payment tracking
├── statistics/      # Analytics
└── create/          # Create new entities

/inbox/              # Messaging system
/profile/            # User profile
├── edit/            # Profile editing
├── settings/        # User settings
└── demo/            # Demo features

/users/              # User management
├── students/        # Student users
├── teachers/        # Teacher users
├── parents/         # Parent users
├── admins/          # Admin users
├── create/          # Create new user
└── [id]/            # User details
```

## Route Groups

### (auth) Group
Protected routes that require authentication:

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AuthGuard>
        <div className="flex">
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </AuthGuard>
    </div>
  );
}
```

## Page Components

### Landing Page
```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
```

### Authentication Pages

#### Sign In
```typescript
// app/signin/page.tsx
export default function SignInPage() {
  return (
    <AuthLayout>
      <SigninForm />
    </AuthLayout>
  );
}
```

#### Sign Up
```typescript
// app/signup/page.tsx
export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
```

### Dashboard
```typescript
// app/(auth)/classroom/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header title="Dashboard" />
      <StatsCards />
      <Charts />
      <RecentActivity />
    </div>
  );
}
```

## Route Protection

### Middleware Protection
Server-side route protection using Next.js middleware:

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromRequest(request);

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const isValidToken = await verifyToken(token);
    if (!isValidToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}
```

### Component-Level Protection
Client-side protection using React components:

```typescript
// components/auth/AuthGuard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    redirect("/signin");
  }

  return <>{children}</>;
}
```

## Dynamic Routes

### User Profile
```typescript
// app/(auth)/users/[id]/page.tsx
interface UserPageProps {
  params: { id: string };
}

export default function UserPage({ params }: UserPageProps) {
  const { data: user } = useGetUserQuery(params.id);
  
  return (
    <div>
      <ProfileHeader user={user} />
      <ProfileTabs userId={params.id} />
    </div>
  );
}
```

## Layouts

### Root Layout
Global layout with providers and theme setup:

```typescript
// app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body>
        <ReduxProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              <AuthProvider>
                <CalendarProvider>
                  {children}
                  <Toaster />
                </CalendarProvider>
              </AuthProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
```

### Auth Layout
Layout for protected routes:

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" />
            <Breadcrumb />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
```

## Navigation

### Sidebar Navigation
```typescript
// components/app-sidebar.tsx
const navigationItems = [
  {
    title: "Dashboard",
    url: "/classroom/dashboard",
    icon: Home,
  },
  {
    title: "Classes",
    url: "/classroom/classes",
    icon: BookOpen,
  },
  {
    title: "Students",
    url: "/classroom/students",
    icon: Users,
  },
  // ... more items
];
```

### Breadcrumb Navigation
```typescript
// components/breadcrumb.tsx
export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <BreadcrumbItem key={segment}>
            <BreadcrumbLink href={`/${segments.slice(0, index + 1).join("/")}`}>
              {formatSegment(segment)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

## Route Metadata

### Page Metadata
```typescript
// app/(auth)/classroom/dashboard/page.tsx
export const metadata: Metadata = {
  title: "Dashboard | Classroom Management",
  description: "Overview of classroom activities and statistics",
};
```

### Dynamic Metadata
```typescript
// app/(auth)/users/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const user = await getUser(params.id);
  
  return {
    title: `${user.name} | User Profile`,
    description: `Profile page for ${user.name}`,
  };
}
```

## Loading States

### Page Loading
```typescript
// app/(auth)/classroom/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

### Error Boundaries
```typescript
// app/(auth)/classroom/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

## Route Patterns

### CRUD Operations
```
/classroom/students/          # List students
/classroom/students/create    # Create student
/classroom/students/[id]      # View student
/classroom/students/[id]/edit # Edit student
```

### Nested Resources
```
/classroom/classes/[classId]/students     # Students in class
/classroom/classes/[classId]/attendance   # Class attendance
/classroom/classes/[classId]/marks        # Class grades
```

## Best Practices

1. **Route Organization**: Group related routes using route groups
2. **Layout Reuse**: Use layouts for shared UI across route groups
3. **Loading States**: Provide loading.tsx for better UX
4. **Error Handling**: Implement error.tsx for graceful error handling
5. **Metadata**: Add appropriate metadata for SEO
6. **Protection**: Implement both server and client-side route protection
7. **Navigation**: Provide clear navigation patterns
8. **Dynamic Routes**: Use dynamic routes for resource-specific pages