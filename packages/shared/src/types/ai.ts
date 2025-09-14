import { z } from 'zod';

// AI/ML Types for Personalization and Analytics

// Symptom Tracking Schema
export const SymptomSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    symptom: z.string(),
    severity: z.number().min(0).max(10),
    duration: z.number().min(0), // in days
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'OCCASIONAL']),
    triggers: z.array(z.string()).default([]),
    notes: z.string().max(1000).optional(),
    recordedAt: z.string().datetime(),
});

export type Symptom = z.infer<typeof SymptomSchema>;

// Pain Assessment Schema
export const PainAssessmentSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    location: z.string(),
    intensity: z.number().min(0).max(10),
    type: z.enum(['SHARP', 'DULL', 'BURNING', 'THROBBING', 'ACHING', 'STABBING']),
    duration: z.number().min(0), // in minutes
    triggers: z.array(z.string()).default([]),
    reliefMethods: z.array(z.string()).default([]),
    impactOnDailyLife: z.number().min(0).max(10),
    recordedAt: z.string().datetime(),
});

export type PainAssessment = z.infer<typeof PainAssessmentSchema>;

// Mobility Assessment Schema
export const MobilityAssessmentSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    joint: z.string(),
    rangeOfMotion: z.number().min(0).max(10),
    flexibility: z.number().min(0).max(10),
    strength: z.number().min(0).max(10),
    stability: z.number().min(0).max(10),
    painLevel: z.number().min(0).max(10),
    functionalLimitations: z.array(z.string()).default([]),
    recordedAt: z.string().datetime(),
});

export type MobilityAssessment = z.infer<typeof MobilityAssessmentSchema>;

// AI Recommendation Schema
export const AIRecommendationSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.enum(['EXERCISE', 'LIFESTYLE', 'TREATMENT', 'PREVENTION', 'EMERGENCY']),
    title: z.string(),
    description: z.string(),
    confidence: z.number().min(0).max(1),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    actionItems: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        estimatedDuration: z.number().min(0), // in minutes
        difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
        equipment: z.array(z.string()).default([]),
        videoUrl: z.string().url().optional(),
        instructions: z.string().optional(),
    })),
    validUntil: z.string().datetime().optional(),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
});

export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;

// Exercise Schema
export const ExerciseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    bodyPart: z.array(z.string()),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    duration: z.number().min(0), // in minutes
    repetitions: z.number().min(0).optional(),
    sets: z.number().min(0).optional(),
    equipment: z.array(z.string()).default([]),
    instructions: z.string(),
    videoUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional(),
    benefits: z.array(z.string()).default([]),
    contraindications: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

// Personalized Exercise Plan Schema
export const ExercisePlanSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    goal: z.string(),
    duration: z.number().min(1), // in weeks
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    exercises: z.array(z.object({
        exerciseId: z.string().uuid(),
        name: z.string(),
        duration: z.number().min(0),
        repetitions: z.number().min(0).optional(),
        sets: z.number().min(0).optional(),
        restTime: z.number().min(0).optional(), // in seconds
        order: z.number().min(0),
        isOptional: z.boolean().default(false),
    })),
    schedule: z.array(z.object({
        dayOfWeek: z.number().min(0).max(6),
        timeOfDay: z.string(),
        duration: z.number().min(0),
        exercises: z.array(z.string().uuid()),
    })),
    progressTracking: z.object({
        completedSessions: z.number().min(0).default(0),
        totalSessions: z.number().min(0),
        averageCompletionRate: z.number().min(0).max(1).default(0),
        lastCompletedAt: z.string().datetime().optional(),
    }),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type ExercisePlan = z.infer<typeof ExercisePlanSchema>;

// Progress Tracking Schema
export const ProgressTrackingSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.enum(['PAIN', 'MOBILITY', 'STRENGTH', 'FLEXIBILITY', 'FUNCTIONAL']),
    metric: z.string(),
    value: z.number(),
    unit: z.string(),
    context: z.string().optional(),
    recordedAt: z.string().datetime(),
});

export type ProgressTracking = z.infer<typeof ProgressTrackingSchema>;

// AI Model Performance Schema
export const AIModelPerformanceSchema = z.object({
    id: z.string().uuid(),
    modelName: z.string(),
    version: z.string(),
    accuracy: z.number().min(0).max(1),
    precision: z.number().min(0).max(1),
    recall: z.number().min(0).max(1),
    f1Score: z.number().min(0).max(1),
    totalPredictions: z.number().min(0),
    correctPredictions: z.number().min(0),
    lastTrained: z.string().datetime(),
    createdAt: z.string().datetime(),
});

export type AIModelPerformance = z.infer<typeof AIModelPerformanceSchema>;

// AI Query Schemas
export const AIRecommendationQuerySchema = z.object({
    userId: z.string().uuid(),
    type: z.enum(['EXERCISE', 'LIFESTYLE', 'TREATMENT', 'PREVENTION', 'EMERGENCY']).optional(),
    category: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    isActive: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
});

export const ExerciseQuerySchema = z.object({
    category: z.string().optional(),
    bodyPart: z.array(z.string()).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    equipment: z.array(z.string()).optional(),
    duration: z.object({
        min: z.number().min(0).optional(),
        max: z.number().min(0).optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
});

export type AIRecommendationQuery = z.infer<typeof AIRecommendationQuerySchema>;
export type ExerciseQuery = z.infer<typeof ExerciseQuerySchema>;
