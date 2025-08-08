/**
 * API Services Index
 * Central export for all API services
 */

// Core API services
export { authService } from '../auth';
export { ClassroomApiError, classroomApi, handleApiError, withRetry } from '../classroom-api';

// Enhanced service classes
export { ClassroomService, classroomService, createClassroomService } from './ClassroomService';
export { GroupService, createGroupService, groupService } from './GroupService';

// API utilities
export * from '../../lib/api-utils';

// Types
export type {
    ApiError, ApiResponse, Attendance, Classroom, CreateClassroomParams, GetClassroomsParams, Group,
    Mark, PaginatedResponse, Post, UpdateClassroomParams
} from '../classroom-api';

export type {
    ClassroomServiceOptions,
    GroupServiceOptions
} from './ClassroomService';
