// Import zod first
import { z } from 'zod';

// Export all types from shared package
export * from './user';
export * from './appointment';
export * from './clinic';
export * from './payment';
export * from './ai';

// Common utility types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}

export interface SearchParams {
    query?: string;
    filters?: Record<string, any>;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

// Error types
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
}

// File upload types
export interface FileUpload {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: string;
}

// Notification types
export const NotificationTypeSchema = z.enum([
    'APPOINTMENT_REMINDER',
    'APPOINTMENT_CONFIRMED',
    'APPOINTMENT_CANCELLED',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'EXERCISE_REMINDER',
    'PROGRESS_UPDATE',
    'NEW_MESSAGE',
    'SYSTEM_UPDATE',
    'PROMOTIONAL'
]);

export const NotificationStatusSchema = z.enum(['UNREAD', 'READ', 'ARCHIVED']);

export interface Notification {
    id: string;
    userId: string;
    type: z.infer<typeof NotificationTypeSchema>;
    title: string;
    message: string;
    status: z.infer<typeof NotificationStatusSchema>;
    data?: Record<string, any>;
    scheduledAt?: string;
    sentAt?: string;
    createdAt: string;
}

// Constants
export const USER_ROLES = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    PHYSIOTHERAPIST: 'PHYSIOTHERAPIST',
    ADMIN: 'ADMIN',
    CLINIC_MANAGER: 'CLINIC_MANAGER',
} as const;

export const APPOINTMENT_STATUS = {
    SCHEDULED: 'SCHEDULED',
    CONFIRMED: 'CONFIRMED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
    RESCHEDULED: 'RESCHEDULED',
} as const;

export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
} as const;

