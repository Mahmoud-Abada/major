# Styling & Theming

## Overview

The application uses a comprehensive design system built with Tailwind CSS, featuring a custom color palette, typography system, and full dark/light theme support.

## Design System

### Color Palette
```typescript
// tailwind.config.ts
const colors = {
  primary: {
    DEFAULT: "#4F46E5", // indigo-600
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5", // main primary
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  secondary: {
    DEFAULT: "#10B981", // emerald-500
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981", // main secondary
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
  },
  accent: {
    DEFAULT: "#F59E0B", // amber-500
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B", // main accent
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },
  dark: {
    DEFAULT: "#1E293B", // slate-800
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B", // main dark
    900: "#0F172A",
  },
};
```

### Typography
```typescript
// tailwind.config.ts
const fontFamily = {
  sans: ["var(--font-inter)", "sans-serif"],
  kufi: ["var(--font-kufi)", "sans-serif"],
  arabic: ['"Noto Naskh Arabic"', "sans-serif"],
};
```

### Spacing and Layout
```css
/* Custom spacing utilities */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-padding {
  @apply py-12 lg:py-16;
}

.card-padding {
  @apply p-6 lg:p-8;
}
```

## Theme System

### Theme Provider
```typescript
// components/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

### Theme Toggle Component
```typescript
// components/common/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### CSS Variables for Theming
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}
```

## Component Styling

### Base UI Components

#### Button Component
```typescript
// components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### Card Component
```typescript
// components/ui/card.tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
```

### Custom Component Styling

#### Classroom Card
```typescript
// components/classroom/ClassroomCard.tsx
export function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {classroom.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {classroom.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {classroom.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{classroom.studentCount} students</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{classroom.subject}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={classroom.teacher.avatar} />
              <AvatarFallback>{classroom.teacher.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {classroom.teacher.name}
            </span>
          </div>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
```

## Responsive Design

### Breakpoint System
```css
/* Tailwind CSS breakpoints */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */

/* Custom responsive utilities */
@layer utilities {
  .container-responsive {
    @apply w-full mx-auto px-4;
    @apply sm:px-6 lg:px-8;
    @apply max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl;
  }
  
  .grid-responsive {
    @apply grid grid-cols-1;
    @apply sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
    @apply gap-4 lg:gap-6;
  }
}
```

### Mobile-First Components
```typescript
// components/layout/ResponsiveLayout.tsx
export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden">
        <MobileHeader />
      </div>
      
      {/* Desktop layout */}
      <div className="hidden lg:flex">
        <Sidebar />
        <main className="flex-1">
          <Header />
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile layout */}
      <div className="lg:hidden">
        <main className="pb-16">
          <div className="p-4">
            {children}
          </div>
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
}
```

## Animation and Transitions

### CSS Animations
```css
/* app/globals.css */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Framer Motion Integration
```typescript
// components/animations/AnimatedWrapper.tsx
import { motion } from "framer-motion";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedWrapper({
  children,
  className,
  delay = 0,
}: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.25, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## RTL Support

### RTL-Specific Styles
```css
/* styles/rtl.css */
[dir="rtl"] {
  text-align: right;
}

/* Flex direction reversal */
[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

/* Spacing adjustments */
[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

/* Border radius adjustments */
[dir="rtl"] .rounded-l-lg {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

[dir="rtl"] .rounded-r-lg {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

/* Custom RTL utilities */
.rtl\:text-right[dir="rtl"] {
  text-align: right;
}

.rtl\:flex-row-reverse[dir="rtl"] {
  flex-direction: row-reverse;
}
```

### RTL-Aware Components
```typescript
// components/ui/RTLAwareCard.tsx
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export function RTLAwareCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        isRTL && "font-kufi",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

## Utility Classes

### Custom Utility Classes
```css
@layer utilities {
  /* Layout utilities */
  .center {
    @apply flex items-center justify-center;
  }
  
  .center-col {
    @apply flex flex-col items-center justify-center;
  }
  
  /* Text utilities */
  .text-balance {
    text-wrap: balance;
  }
  
  .text-pretty {
    text-wrap: pretty;
  }
  
  /* Spacing utilities */
  .space-y-section {
    @apply space-y-8 lg:space-y-12;
  }
  
  /* Interactive utilities */
  .interactive {
    @apply transition-all duration-200 hover:scale-105 active:scale-95;
  }
  
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  }
  
  /* Status utilities */
  .status-active {
    @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
  }
  
  .status-inactive {
    @apply bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200;
  }
  
  .status-pending {
    @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
  }
}
```

## Best Practices

### 1. Consistent Spacing
- Use Tailwind's spacing scale consistently
- Create custom spacing utilities for common patterns
- Maintain consistent padding and margins across components

### 2. Color Usage
- Use semantic color names (primary, secondary, accent)
- Ensure sufficient contrast ratios for accessibility
- Test colors in both light and dark themes

### 3. Typography
- Establish a clear type hierarchy
- Use consistent font weights and sizes
- Ensure readability across different screen sizes

### 4. Component Variants
- Use class-variance-authority for component variants
- Keep variant logic centralized and reusable
- Document available variants and their use cases

### 5. Responsive Design
- Follow mobile-first approach
- Test components across all breakpoints
- Use responsive utilities appropriately

### 6. Performance
- Minimize CSS bundle size with Tailwind's purge feature
- Use CSS-in-JS sparingly for dynamic styles
- Optimize animations for performance

### 7. Accessibility
- Ensure sufficient color contrast
- Use semantic HTML elements
- Provide focus indicators for interactive elements
- Test with screen readers and keyboard navigation