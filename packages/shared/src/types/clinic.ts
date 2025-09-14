import { z } from 'zod';

// Clinic Types
export const ClinicTypeSchema = z.enum(['HOSPITAL', 'CLINIC', 'PHYSIOTHERAPY_CENTER', 'WELLNESS_CENTER']);
export type ClinicType = z.infer<typeof ClinicTypeSchema>;

export const ClinicStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED']);
export type ClinicStatus = z.infer<typeof ClinicStatusSchema>;

// Address Schema
export const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default('India'),
    coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }).optional(),
});

export type Address = z.infer<typeof AddressSchema>;

// Base Clinic Schema
export const BaseClinicSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100),
    type: ClinicTypeSchema,
    status: ClinicStatusSchema,
    description: z.string().max(1000).optional(),
    address: AddressSchema,
    phone: z.string().min(10).max(15),
    email: z.string().email(),
    website: z.string().url().optional(),
    logo: z.string().url().optional(),
    images: z.array(z.string().url()).default([]),
    amenities: z.array(z.string()).default([]),
    operatingHours: z.object({
        monday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
        tuesday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
        wednesday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
        thursday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
        friday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
        saturday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
        sunday: z.object({
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
        }),
    }),
    rating: z.number().min(0).max(5).default(0),
    totalReviews: z.number().min(0).default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type BaseClinic = z.infer<typeof BaseClinicSchema>;

// Physiotherapy Center Specific Schema
export const PhysiotherapyCenterSchema = BaseClinicSchema.extend({
    type: z.literal('PHYSIOTHERAPY_CENTER'),
    specializations: z.array(z.string()),
    equipment: z.array(z.string()),
    services: z.array(z.string()),
    homeVisitAvailable: z.boolean().default(false),
    homeVisitRadius: z.number().min(0).max(50).optional(),
    consultationFee: z.number().min(0),
    homeVisitFee: z.number().min(0).optional(),
    insuranceAccepted: z.array(z.string()).default([]),
    languages: z.array(z.string()).default(['English']),
});

export type PhysiotherapyCenter = z.infer<typeof PhysiotherapyCenterSchema>;

// Hospital Specific Schema
export const HospitalSchema = BaseClinicSchema.extend({
    type: z.literal('HOSPITAL'),
    departments: z.array(z.string()),
    emergencyServices: z.boolean().default(false),
    ambulanceService: z.boolean().default(false),
    icuBeds: z.number().min(0).default(0),
    generalBeds: z.number().min(0).default(0),
    accreditation: z.array(z.string()).default([]),
    insuranceAccepted: z.array(z.string()).default([]),
    languages: z.array(z.string()).default(['English']),
});

export type Hospital = z.infer<typeof HospitalSchema>;

// Union type for all clinic types
export type Clinic = BaseClinic | PhysiotherapyCenter | Hospital;

// Clinic Staff Schema
export const ClinicStaffSchema = z.object({
    id: z.string().uuid(),
    clinicId: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.enum(['OWNER', 'MANAGER', 'DOCTOR', 'PHYSIOTHERAPIST', 'RECEPTIONIST', 'NURSE']),
    permissions: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
    joinedAt: z.string().datetime(),
});

export type ClinicStaff = z.infer<typeof ClinicStaffSchema>;

// Clinic Creation Schemas
export const CreateClinicSchema = z.object({
    name: z.string().min(1).max(100),
    type: ClinicTypeSchema,
    description: z.string().max(1000).optional(),
    address: AddressSchema,
    phone: z.string().min(10).max(15),
    email: z.string().email(),
    website: z.string().url().optional(),
    amenities: z.array(z.string()).default([]),
    operatingHours: BaseClinicSchema.shape.operatingHours,
    specializations: z.array(z.string()).optional(),
    equipment: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    homeVisitAvailable: z.boolean().optional(),
    homeVisitRadius: z.number().min(0).max(50).optional(),
    consultationFee: z.number().min(0).optional(),
    homeVisitFee: z.number().min(0).optional(),
    insuranceAccepted: z.array(z.string()).default([]),
    languages: z.array(z.string()).default(['English']),
});

export type CreateClinic = z.infer<typeof CreateClinicSchema>;

// Clinic Query Schemas
export const ClinicQuerySchema = z.object({
    type: ClinicTypeSchema.optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    specializations: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    homeVisitAvailable: z.boolean().optional(),
    minRating: z.number().min(0).max(5).optional(),
    maxDistance: z.number().min(0).optional(), // in kilometers
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
});

export type ClinicQuery = z.infer<typeof ClinicQuerySchema>;
