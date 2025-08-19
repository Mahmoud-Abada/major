# Architecture

## System Architecture

The frontend follows a modern React architecture with Next.js App Router, emphasizing modularity, type safety, and performance.

## Directory Structure

```
client/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Protected routes group
│   │   ├── classroom/     # Classroom management pages
│   │   ├── inbox/         # Messaging interface
│   │   ├── profile/       # User profile pages
│   │   └── users/         # User management pages
│   ├── signin/            # Authentication pages
│   ├── signup/
│   ├── forgot-password/
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── auth/             # Authentication components
│   ├── classroom/        # Classroom-specific components
│   ├── dialogs/          # Modal dialogs
│   └── common/           # Shared components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API services
├── store/                # Redux store
│   ├── api/              # RTK Query APIs
│   ├── slices/           # Redux slices
│   └── types/            # Store types
├── types/                # TypeScript definitions
├── utils/                # Helper functions
└── styles/               # Global styles
```

## Architectural Patterns

### 1. Component Architecture

#### Component Hierarchy
```
App Layout
├── Theme Provider
├── Auth Provider
├── Redux Provider
├── Internationalization Provider
└── Calendar Provider
```

#### Component Types
- **Page Components**: Route-level components in `app/` directory
- **Layout Components**: Shared layouts for route groups
- **UI Components**: Reusable base components in `components/ui/`
- **Feature Components**: Domain-specific components
- **Form Components**: Specialized form handling components

### 2. State Management Architecture

#### Redux Store Structure
```
store/
├── api/                  # RTK Query endpoints
│   ├── baseApi.ts       # Base API configuration
│   ├── authApi.ts       # Authentication endpoints
│   ├── classroomApi.ts  # Classroom management
│   ├── groupApi.ts      # Group management
│   └── ...
├── slices/              # Redux slices
│   ├── authSlice.ts     # Authentication state
│   ├── classroom/       # Classroom domain slices
│   └── ...
└── store.ts             # Store configuration
```

#### State Flow
1. **UI Components** dispatch actions
2. **RTK Query** handles API calls and caching
3. **Redux Slices** manage local state
4. **Selectors** provide computed state to components

### 3. Authentication Architecture

#### JWT Flow
```
1. User Login → API Request
2. Server Response → JWT Token
3. Token Storage → Secure cookies/localStorage
4. Request Middleware → Auto-attach token
5. Token Verification → Server validation
6. Route Protection → Middleware checks
```

#### Authentication Layers
- **Middleware**: Route-level protection (`middleware.ts`)
- **Context**: React context for auth state (`AuthContext.tsx`)
- **Guards**: Component-level protection (`AuthGuard.tsx`)
- **Hooks**: Authentication utilities (`useAuth.ts`)

### 4. API Architecture

#### Service Layer
```
services/
├── auth.ts              # Authentication service
├── classroom-api.ts     # Classroom operations
├── locale.ts            # Localization service
└── session.ts           # Session management
```

#### RTK Query Integration
- **Base API**: Centralized configuration with auth headers
- **Endpoints**: Type-safe API definitions
- **Caching**: Automatic response caching and invalidation
- **Error Handling**: Centralized error processing

### 5. Routing Architecture

#### App Router Structure
```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── (auth)/              # Protected route group
│   ├── layout.tsx       # Auth layout
│   └── classroom/       # Classroom routes
│       ├── dashboard/
│       ├── classes/
│       └── students/
└── signin/              # Public routes
```

#### Route Protection
- **Middleware**: Server-side route protection
- **Layout Guards**: Layout-level authentication
- **Page Guards**: Component-level protection

## Data Flow

### 1. Component Data Flow
```
User Interaction → Component → Hook → Service → API → Store → Component Update
```

### 2. Authentication Flow
```
Login Form → Auth Service → JWT Token → Store → Route Access → Protected Component
```

### 3. API Data Flow
```
Component → RTK Query Hook → API Service → Server → Cache → Component Re-render
```

## Design Patterns

### 1. Container/Presentational Pattern
- **Containers**: Handle data fetching and state management
- **Presentational**: Focus on UI rendering and user interaction

### 2. Custom Hooks Pattern
- **Data Hooks**: API data fetching (`useClassroom`, `useAuth`)
- **UI Hooks**: UI state management (`useLoadingState`, `useMobile`)
- **Utility Hooks**: Common functionality (`useToast`)

### 3. Provider Pattern
- **Context Providers**: Share state across component tree
- **HOC Pattern**: Higher-order components for common functionality

### 4. Compound Component Pattern
- **Dialog Components**: Modal dialogs with multiple parts
- **Form Components**: Complex forms with multiple sections

## Performance Considerations

### 1. Code Splitting
- **Route-based**: Automatic splitting by Next.js
- **Component-based**: Dynamic imports for heavy components
- **Library Splitting**: Separate vendor bundles

### 2. Caching Strategy
- **RTK Query**: Automatic API response caching
- **Next.js**: Static generation and ISR
- **Browser**: Service worker caching

### 3. Optimization Techniques
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive computations
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Next.js automatic image optimization

## Security Architecture

### 1. Authentication Security
- **JWT Verification**: Server-side token validation
- **Secure Storage**: HttpOnly cookies for tokens
- **CSRF Protection**: Cross-site request forgery prevention

### 2. Route Security
- **Middleware Protection**: Server-side route guards
- **Role-based Access**: Permission-based component rendering
- **API Security**: Authenticated API requests

### 3. Data Security
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Sanitized user input
- **Type Safety**: TypeScript for runtime safety