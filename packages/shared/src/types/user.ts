import { z } from 'zod';

// User Types
export const UserRoleSchema = z.enum(['PATIENT', 'DOCTOR', 'PHYSIOTHERAPIST', 'ADMIN', 'CLINIC_MANAGER']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export type Gender = z.infer<typeof GenderSchema>;

export const UserStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

// Base User Schema
export const BaseUserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    dateOfBirth: z.string().datetime().optional(),
    gender: GenderSchema.optional(),
    profileImage: z.string().url().optional(),
    role: UserRoleSchema,
    status: UserStatusSchema,
    isEmailVerified: z.boolean().default(false),
    isPhoneVerified: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type BaseUser = z.infer<typeof BaseUserSchema>;

// Patient Specific Schema
export const PatientProfileSchema = BaseUserSchema.extend({
    role: z.literal('PATIENT'),
    emergencyContact: z.object({
        name: z.string(),
        phone: z.string(),
        relationship: z.string(),
    }).optional(),
    medicalHistory: z.array(z.string()).default([]),
    allergies: z.array(z.string()).default([]),
    currentMedications: z.array(z.string()).default([]),
    insuranceInfo: z.object({
        provider: z.string(),
        policyNumber: z.string(),
        expiryDate: z.string().datetime().optional(),
    }).optional(),
});

export type PatientProfile = z.infer<typeof PatientProfileSchema>;

// Doctor Specific Schema
export const DoctorProfileSchema = BaseUserSchema.extend({
    role: z.literal('DOCTOR'),
    specialization: z.string(),
    qualifications: z.array(z.string()),
    experience: z.number().min(0),
    licenseNumber: z.string(),
    licenseExpiry: z.string().datetime(),
    consultationFee: z.number().min(0),
    languages: z.array(z.string()).default(['English']),
    availability: z.object({
        timezone: z.string(),
        workingDays: z.array(z.number().min(0).max(6)),
        workingHours: z.object({
            start: z.string(),
            end: z.string(),
        }),
    }),
    rating: z.number().min(0).max(5).default(0),
    totalConsultations: z.number().min(0).default(0),
    bio: z.string().max(1000).optional(),
    clinicId: z.string().uuid().optional(),
});

export type DoctorProfile = z.infer<typeof DoctorProfileSchema>;

// Physiotherapist Specific Schema
export const PhysiotherapistProfileSchema = BaseUserSchema.extend({
    role: z.literal('PHYSIOTHERAPIST'),
    specialization: z.array(z.string()),
    qualifications: z.array(z.string()),
    experience: z.number().min(0),
    licenseNumber: z.string(),
    licenseExpiry: z.string().datetime(),
    consultationFee: z.number().min(0),
    homeVisitFee: z.number().min(0),
    languages: z.array(z.string()).default(['English']),
    availability: z.object({
        timezone: z.string(),
        workingDays: z.array(z.number().min(0).max(6)),
        workingHours: z.object({
            start: z.string(),
            end: z.string(),
        }),
        homeVisitRadius: z.number().min(0).max(50), // in kilometers
    }),
    rating: z.number().min(0).max(5).default(0),
    totalSessions: z.number().min(0).default(0),
    bio: z.string().max(1000).optional(),
    clinicId: z.string().uuid().optional(),
    equipment: z.array(z.string()).default([]),
});

export type PhysiotherapistProfile = z.infer<typeof PhysiotherapistProfileSchema>;

// Union type for all user profiles
export type UserProfile = PatientProfile | DoctorProfile | PhysiotherapistProfile;

// Authentication Schemas
export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(10),
    role: UserRoleSchema,
    dateOfBirth: z.string().datetime().optional(),
    gender: GenderSchema.optional(),
});

export const AuthResponseSchema = z.object({
    user: BaseUserSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
