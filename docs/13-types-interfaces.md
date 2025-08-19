# Types & Interfaces

## Overview

The application uses comprehensive TypeScript type definitions to ensure type safety, improve developer experience, and provide clear contracts between different parts of the system.

## Core Types

### User Types
```typescript
// types/authTypes.ts
export type UserRole = 'student' | 'teacher' | 'school';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  profilePicture?: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  location: LocationData;
  preferences: string[];
  socialLinks?: SocialLinks;
  description?: string;
}

export interface AuthUser extends BaseUser {
  userType: UserRole;
  token: string;
  refreshToken?: string;
}

export interface Student extends BaseUser {
  userType: 'student';
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  parentContact?: string;
  classrooms: string[]; // Classroom IDs
  groups: string[]; // Group IDs
  academicInfo?: {
    level: string;
    specialization?: string;
    enrollmentDate: Date;
  };
}

export interface Teacher extends BaseUser {
  userType: 'teacher';
  subjects: string[];
  experience: number;
  qualifications: string[];
  classrooms: string[]; // Classroom IDs
  schedule?: TeacherSchedule;
}

export interface School extends BaseUser {
  userType: 'school';
  schoolType: SchoolType;
  representativeName: string;
  representativeRole: string;
  approximateTeachers: number;
  approximateStudents: number;
  numberOfBranches: number;
  isValidated: boolean;
  validationNote?: string;
  attachments?: Attachment[];
}

export type SchoolType = 
  | 'private'
  | 'public'
  | 'language'
  | 'university'
  | 'formation'
  | 'support'
  | 'private-university'
  | 'preschool';

export interface LocationData {
  wilaya: string;
  commune: string;
  fullLocation: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SocialLinks {
  website?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface Attachment {
  id: string;
  url: string;
  type: string;
  title: string;
  uploadedAt: Date;
}
```

### Classroom Types
```typescript
// types/classroom.ts
export interface Classroom {
  id: string;
  name: string;
  description?: string;
  subject: string;
  teacherId: string;
  teacher: Teacher;
  studentIds: string[];
  students: Student[];
  groupIds: string[];
  groups: Group[];
  capacity?: number;
  status: ClassroomStatus;
  schedule?: ClassSchedule[];
  createdAt: Date;
  updatedAt: Date;
  settings: ClassroomSettings;
  stats: ClassroomStats;
}

export type ClassroomStatus = 'active' | 'inactive' | 'archived';

export interface ClassSchedule {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  room?: string;
  isRecurring: boolean;
  exceptions?: Date[]; // Dates when class is cancelled
}

export type DayOfWeek = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface ClassroomSettings {
  allowStudentPosts: boolean;
  requireApprovalForPosts: boolean;
  allowFileUploads: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  gradingScale: GradingScale;
  attendanceRequired: boolean;
}

export interface GradingScale {
  type: 'percentage' | 'points' | 'letter';
  maxValue: number;
  passingGrade: number;
  letterGrades?: LetterGrade[];
}

export interface LetterGrade {
  letter: string;
  minValue: number;
  maxValue: number;
}

export interface ClassroomStats {
  totalStudents: number;
  activeStudents: number;
  averageAttendance: number;
  averageGrade: number;
  totalAssignments: number;
  completedAssignments: number;
  totalPosts: number;
  lastActivity: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  classroomIds: string[];
  studentIds: string[];
  students: Student[];
  teacherId: string;
  teacher: Teacher;
  type: GroupType;
  maxSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GroupType = 'study' | 'project' | 'discussion' | 'lab';
```

### API Types
```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ClassroomFilters extends FilterOptions {
  teacherId?: string;
  subject?: string;
  status?: ClassroomStatus | 'all';
  hasStudents?: boolean;
}

export interface StudentFilters extends FilterOptions {
  classroomId?: string;
  groupId?: string;
  verified?: boolean;
  gender?: 'male' | 'female';
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface TeacherFilters extends FilterOptions {
  subjects?: string[];
  experienceRange?: {
    min: number;
    max: number;
  };
  hasClassrooms?: boolean;
}

// Request/Response types for specific endpoints
export interface CreateClassroomRequest {
  name: string;
  description?: string;
  subject: string;
  teacherId: string;
  capacity?: number;
  schedule?: Omit<ClassSchedule, 'id'>[];
  settings?: Partial<ClassroomSettings>;
}

export interface UpdateClassroomRequest extends Partial<CreateClassroomRequest> {
  id: string;
}

export interface AddStudentsToClassroomRequest {
  classroomId: string;
  studentIds: string[];
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  classroomIds: string[];
  studentIds: string[];
  teacherId: string;
  type: GroupType;
  maxSize?: number;
}
```

### Attendance Types
```typescript
// types/attendance.ts
export interface AttendanceRecord {
  id: string;
  studentId: string;
  student: Student;
  classroomId: string;
  classroom: Classroom;
  date: Date;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  markedBy: string; // Teacher ID
  createdAt: Date;
  updatedAt: Date;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceSession {
  id: string;
  classroomId: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  attendanceRecords: AttendanceRecord[];
  createdBy: string; // Teacher ID
}

export interface AttendanceStats {
  studentId: string;
  classroomId: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  lastAttendance?: Date;
}

export interface ClassAttendanceStats {
  classroomId: string;
  date: Date;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  attendanceRate: number;
}
```

### Marks and Grading Types
```typescript
// types/marks.ts
export interface Mark {
  id: string;
  studentId: string;
  student: Student;
  classroomId: string;
  classroom: Classroom;
  subject: string;
  assignmentId?: string;
  assignment?: Assignment;
  value: number;
  maxValue: number;
  percentage: number;
  letterGrade?: string;
  type: MarkType;
  period: GradingPeriod;
  date: Date;
  notes?: string;
  gradedBy: string; // Teacher ID
  createdAt: Date;
  updatedAt: Date;
}

export type MarkType = 
  | 'exam'
  | 'quiz'
  | 'assignment'
  | 'project'
  | 'participation'
  | 'homework'
  | 'lab'
  | 'presentation';

export type GradingPeriod = 
  | 'quarter1'
  | 'quarter2'
  | 'quarter3'
  | 'quarter4'
  | 'semester1'
  | 'semester2'
  | 'final'
  | 'midterm';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classroomId: string;
  classroom: Classroom;
  type: MarkType;
  maxPoints: number;
  dueDate: Date;
  assignedDate: Date;
  instructions?: string;
  attachments?: Attachment[];
  submissions: AssignmentSubmission[];
  isPublished: boolean;
  allowLateSubmissions: boolean;
  lateSubmissionPenalty?: number;
  createdBy: string; // Teacher ID
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  student: Student;
  submittedAt: Date;
  isLate: boolean;
  content?: string;
  attachments?: Attachment[];
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  gradedAt?: Date;
  gradedBy?: string; // Teacher ID
}

export type SubmissionStatus = 
  | 'draft'
  | 'submitted'
  | 'graded'
  | 'returned'
  | 'late';

export interface GradeReport {
  studentId: string;
  classroomId: string;
  period: GradingPeriod;
  marks: Mark[];
  averageGrade: number;
  letterGrade: string;
  rank?: number;
  totalStudents?: number;
  generatedAt: Date;
}
```

### Communication Types
```typescript
// types/communication.ts
export interface Post {
  id: string;
  title?: string;
  content: string;
  type: PostType;
  authorId: string;
  author: User;
  classroomId?: string;
  classroom?: Classroom;
  attachments?: Attachment[];
  tags?: string[];
  isPublished: boolean;
  isPinned: boolean;
  allowComments: boolean;
  comments: Comment[];
  likes: Like[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = 
  | 'announcement'
  | 'assignment'
  | 'discussion'
  | 'resource'
  | 'event';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  parentCommentId?: string; // For nested comments
  replies?: Comment[];
  likes: Like[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  user: User;
  targetId: string; // Post or Comment ID
  targetType: 'post' | 'comment';
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  recipientId?: string;
  recipient?: User;
  conversationId: string;
  content: string;
  type: MessageType;
  attachments?: Attachment[];
  isRead: boolean;
  readAt?: Date;
  isEdited: boolean;
  editedAt?: Date;
  replyToId?: string; // Message being replied to
  createdAt: Date;
  updatedAt: Date;
}

export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // For group conversations
  participantIds: string[];
  participants: User[];
  lastMessage?: Message;
  lastActivity: Date;
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ConversationType = 'direct' | 'group' | 'classroom';
```

### Form Types
```typescript
// types/forms.ts
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  defaultValue?: any;
  disabled?: boolean;
  description?: string;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: any) => string | null;
}

export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Specific form data types
export interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  userType: UserRole;
  location: LocationData;
  agreeToTerms: boolean;
}

export interface StudentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  parentContact?: string;
  location: LocationData;
  profilePicture?: File;
}

export interface ClassroomFormData {
  name: string;
  description?: string;
  subject: string;
  teacherId: string;
  capacity?: number;
  schedule?: ClassSchedule[];
}
```

### UI Component Types
```typescript
// types/ui.ts
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends ComponentProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  rowKey?: keyof T | ((record: T) => string);
  selectedRows?: string[];
  onRowSelect?: (selectedRows: string[]) => void;
}

export interface ModalProps extends ComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### State Management Types
```typescript
// types/store.ts
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: Date;
}

export interface PaginatedState<T> {
  items: T[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  filters: Record<string, any>;
}

// Redux slice states
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastActivity: number | null;
}

export interface ClassroomState {
  classrooms: Classroom[];
  selectedClassroom: Classroom | null;
  filters: ClassroomFilters;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

export interface StudentState {
  students: Student[];
  selectedStudents: string[];
  filters: StudentFilters;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}
```

## Type Guards and Utilities

### Type Guards
```typescript
// types/guards.ts
export function isStudent(user: BaseUser): user is Student {
  return (user as Student).userType === 'student';
}

export function isTeacher(user: BaseUser): user is Teacher {
  return (user as Teacher).userType === 'teacher';
}

export function isSchool(user: BaseUser): user is School {
  return (user as School).userType === 'school';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
}

export function hasPermission(user: AuthUser, permission: string): boolean {
  // Implementation depends on your permission system
  return true; // Placeholder
}
```

### Utility Types
```typescript
// types/utils.ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// API utility types
export type ApiEndpoint<TRequest = void, TResponse = any> = 
  TRequest extends void 
    ? () => Promise<TResponse>
    : (request: TRequest) => Promise<TResponse>;

export type MutationResult<T> = {
  data?: T;
  error?: string;
  loading: boolean;
};

export type QueryResult<T> = {
  data?: T;
  error?: string;
  loading: boolean;
  refetch: () => void;
};
```

## Best Practices

### 1. Type Organization
- Group related types in dedicated files
- Use consistent naming conventions
- Export types from index files for easy imports
- Keep types close to their usage when possible

### 2. Interface Design
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Prefer composition over inheritance
- Make optional properties explicit

### 3. Generic Types
- Use generic types for reusable interfaces
- Provide default type parameters when appropriate
- Use constraints to limit generic types
- Document complex generic types

### 4. Type Safety
- Avoid `any` type whenever possible
- Use type guards for runtime type checking
- Leverage TypeScript's strict mode
- Use utility types for type transformations

### 5. Documentation
- Add JSDoc comments for complex types
- Provide examples for generic types
- Document type constraints and assumptions
- Keep type definitions up to date with implementation