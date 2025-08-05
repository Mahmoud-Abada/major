/**
 * API Types and Interfaces
 * Centralized type definitions for API interactions
 */

// Base entity interface
export interface BaseEntity {
    id: string;
    createdAt: number;
    updatedAt: number;
}

// User types
export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin' | 'parent';
    isActive: boolean;
    lastLoginAt?: number;
    preferences?: UserPreferences;
    profile?: UserProfile;
}

export interface UserPreferences {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: NotificationPreferences;
    timezone: string;
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    types: {
        assignments: boolean;
        grades: boolean;
        announcements: boolean;
        reminders: boolean;
    };
}

export interface UserProfile {
    bio?: string;
    phone?: string;
    address?: Address;
    dateOfBirth?: number;
    gender?: 'male' | 'female' | 'other';
    emergencyContact?: EmergencyContact;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
}

// Authentication types
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher';
    inviteCode?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// File types
export interface FileUpload {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    uploadedBy: string;
    uploadedAt: number;
    metadata?: FileMetadata;
}

export interface FileMetadata {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
    [key: string]: any;
}

// Notification types
export interface Notification extends BaseEntity {
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    data?: any;
    isRead: boolean;
    readAt?: number;
    actionUrl?: string;
    actionText?: string;
}

// Analytics types
export interface AnalyticsEvent {
    event: string;
    userId?: string;
    sessionId: string;
    timestamp: number;
    properties?: Record<string, any>;
    context?: {
        page: string;
        referrer?: string;
        userAgent: string;
        ip?: string;
    };
}

export interface AnalyticsMetrics {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    topPages: Array<{
        page: string;
        views: number;
        uniqueViews: number;
    }>;
    userGrowth: Array<{
        date: string;
        newUsers: number;
        totalUsers: number;
    }>;
}

// Search types
export interface SearchRequest {
    query: string;
    filters?: SearchFilters;
    sort?: SearchSort;
    pagination?: {
        page: number;
        limit: number;
    };
}

export interface SearchFilters {
    type?: string[];
    dateRange?: {
        start: number;
        end: number;
    };
    tags?: string[];
    author?: string;
    [key: string]: any;
}

export interface SearchSort {
    field: string;
    order: 'asc' | 'desc';
}

export interface SearchResult<T = any> {
    items: T[];
    total: number;
    facets?: SearchFacets;
    suggestions?: string[];
}

export interface SearchFacets {
    [key: string]: Array<{
        value: string;
        count: number;
    }>;
}

// Webhook types
export interface WebhookEvent {
    id: string;
    type: string;
    data: any;
    timestamp: number;
    source: string;
    version: string;
}

export interface WebhookSubscription {
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
    secret: string;
    createdAt: number;
    lastDeliveryAt?: number;
    failureCount: number;
}

// Audit types
export interface AuditLog extends BaseEntity {
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    changes?: {
        before: any;
        after: any;
    };
    metadata?: {
        ip: string;
        userAgent: string;
        location?: string;
    };
}

// System types
export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'down';
    version: string;
    uptime: number;
    services: Array<{
        name: string;
        status: 'healthy' | 'degraded' | 'down';
        responseTime?: number;
        lastCheck: number;
    }>;
    metrics: {
        memoryUsage: number;
        cpuUsage: number;
        diskUsage: number;
        activeConnections: number;
    };
}

export interface SystemConfig {
    maintenance: {
        enabled: boolean;
        message?: string;
        scheduledAt?: number;
    };
    features: {
        [key: string]: boolean;
    };
    limits: {
        maxFileSize: number;
        maxFilesPerUpload: number;
        rateLimit: {
            requests: number;
            window: number;
        };
    };
}

// Error types
export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: any;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    code: string;
    errors?: ValidationError[];
    details?: any;
    timestamp: number;
    requestId: string;
}

// Generic utility types
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type Required<T> = {
    [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// API method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    cache?: boolean;
    cacheTtl?: number;
}

export interface ResponseConfig {
    transformResponse?: (data: any) => any;
    validateResponse?: (data: any) => boolean;
}