import { z } from 'zod';

// Appointment Types
export const AppointmentTypeSchema = z.enum(['CONSULTATION', 'THERAPY_SESSION', 'FOLLOW_UP', 'EMERGENCY']);
export type AppointmentType = z.infer<typeof AppointmentTypeSchema>;

export const AppointmentStatusSchema = z.enum([
    'SCHEDULED',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
    'RESCHEDULED'
]);
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const ConsultationModeSchema = z.enum(['VIDEO', 'AUDIO', 'IN_PERSON', 'HOME_VISIT']);
export type ConsultationMode = z.infer<typeof ConsultationModeSchema>;

// Base Appointment Schema
export const BaseAppointmentSchema = z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid(),
    providerId: z.string().uuid(),
    type: AppointmentTypeSchema,
    status: AppointmentStatusSchema,
    mode: ConsultationModeSchema,
    scheduledAt: z.string().datetime(),
    duration: z.number().min(15).max(180), // in minutes
    notes: z.string().max(1000).optional(),
    symptoms: z.array(z.string()).default([]),
    diagnosis: z.string().optional(),
    prescription: z.string().optional(),
    followUpRequired: z.boolean().default(false),
    followUpDate: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type BaseAppointment = z.infer<typeof BaseAppointmentSchema>;

// Therapy Session Specific Schema
export const TherapySessionSchema = BaseAppointmentSchema.extend({
    type: z.literal('THERAPY_SESSION'),
    therapyType: z.string(),
    exercises: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        duration: z.number(),
        repetitions: z.number(),
        sets: z.number(),
        instructions: z.string(),
        videoUrl: z.string().url().optional(),
    })),
    painLevel: z.number().min(0).max(10).optional(),
    mobilityScore: z.number().min(0).max(10).optional(),
    progress: z.object({
        completedExercises: z.array(z.string()),
        notes: z.string().optional(),
        painLevelAfter: z.number().min(0).max(10).optional(),
        mobilityScoreAfter: z.number().min(0).max(10).optional(),
    }).optional(),
});

export type TherapySession = z.infer<typeof TherapySessionSchema>;

// Consultation Specific Schema
export const ConsultationSchema = BaseAppointmentSchema.extend({
    type: z.literal('CONSULTATION'),
    chiefComplaint: z.string(),
    medicalHistory: z.string().optional(),
    vitalSigns: z.object({
        bloodPressure: z.string().optional(),
        heartRate: z.number().optional(),
        temperature: z.number().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
    }).optional(),
    examination: z.string().optional(),
    diagnosis: z.string().optional(),
    treatmentPlan: z.string().optional(),
    medications: z.array(z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string(),
        instructions: z.string().optional(),
    })).default([]),
    labTests: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        urgency: z.enum(['ROUTINE', 'URGENT', 'EMERGENCY']),
    })).default([]),
});

export type Consultation = z.infer<typeof ConsultationSchema>;

// Union type for all appointment types
export type Appointment = BaseAppointment | TherapySession | Consultation;

// Appointment Creation Schemas
export const CreateAppointmentSchema = z.object({
    providerId: z.string().uuid(),
    type: AppointmentTypeSchema,
    mode: ConsultationModeSchema,
    scheduledAt: z.string().datetime(),
    duration: z.number().min(15).max(180),
    notes: z.string().max(1000).optional(),
    symptoms: z.array(z.string()).default([]),
});

export const RescheduleAppointmentSchema = z.object({
    appointmentId: z.string().uuid(),
    newScheduledAt: z.string().datetime(),
    reason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
    appointmentId: z.string().uuid(),
    reason: z.string().optional(),
});

export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;
export type RescheduleAppointment = z.infer<typeof RescheduleAppointmentSchema>;
export type CancelAppointment = z.infer<typeof CancelAppointmentSchema>;

// Appointment Query Schemas
export const AppointmentQuerySchema = z.object({
    patientId: z.string().uuid().optional(),
    providerId: z.string().uuid().optional(),
    status: AppointmentStatusSchema.optional(),
    type: AppointmentTypeSchema.optional(),
    mode: ConsultationModeSchema.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
});

export type AppointmentQuery = z.infer<typeof AppointmentQuerySchema>;
