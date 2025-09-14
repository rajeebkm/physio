import { z } from 'zod';

// Currency Schema
export const CurrencySchema = z.enum(['INR', 'USD', 'EUR']);

// Payment Status Schema
export const PaymentStatusSchema = z.enum([
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'REFUNDED'
]);

// Payment Method Schema
export const PaymentMethodSchema = z.enum([
    'CARD',
    'UPI',
    'NET_BANKING',
    'WALLET',
    'CASH',
    'INSURANCE'
]);

// Payment Provider Schema
export const PaymentProviderSchema = z.enum([
    'RAZORPAY',
    'STRIPE',
    'PAYPAL',
    'CASHFREE',
    'PHONEPE',
    'GOOGLE_PAY'
]);

// Payment Schema
export const PaymentSchema = z.object({
    id: z.string().uuid(),
    amount: z.number().min(0),
    currency: CurrencySchema.default('INR'),
    status: PaymentStatusSchema,
    method: PaymentMethodSchema,
    provider: PaymentProviderSchema,
    providerTransactionId: z.string().optional(),
    providerOrderId: z.string().optional(),
    description: z.string().optional(),
    metadata: z.record(z.any()).default({}),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Create Payment Schema
export const CreatePaymentSchema = z.object({
    amount: z.number().min(1),
    currency: CurrencySchema.optional(),
    method: PaymentMethodSchema,
    provider: PaymentProviderSchema,
    description: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    appointmentId: z.string().uuid().optional(),
    subscriptionId: z.string().uuid().optional(),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

// Appointment Payment Schema
export const AppointmentPaymentSchema = z.object({
    id: z.string().uuid(),
    paymentId: z.string().uuid(),
    appointmentId: z.string().uuid(),
    patientId: z.string().uuid(),
    providerId: z.string().uuid(),
    consultationFee: z.number().min(0),
    platformFee: z.number().min(0),
    providerFee: z.number().min(0),
    taxAmount: z.number().min(0),
    discountAmount: z.number().min(0),
    finalAmount: z.number().min(0),
    createdAt: z.string().datetime(),
});

export type AppointmentPayment = z.infer<typeof AppointmentPaymentSchema>;

// Subscription Payment Schema
export const SubscriptionPaymentSchema = z.object({
    id: z.string().uuid(),
    paymentId: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    userId: z.string().uuid(),
    planId: z.string().uuid(),
    planName: z.string(),
    billingPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
    amount: z.number().min(0),
    nextBillingDate: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
});

export type SubscriptionPayment = z.infer<typeof SubscriptionPaymentSchema>;

// Refund Schema
export const RefundSchema = z.object({
    id: z.string().uuid(),
    paymentId: z.string().uuid(),
    amount: z.number().min(0),
    reason: z.string(),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
    providerRefundId: z.string().optional(),
    processedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
});

export type Refund = z.infer<typeof RefundSchema>;

// Subscription Plans Schema
export const SubscriptionPlanSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number().min(0),
    currency: CurrencySchema.default('INR'),
    billingPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
    features: z.array(z.string()),
    maxConsultations: z.number().min(-1), // -1 for unlimited
    maxTherapySessions: z.number().min(-1), // -1 for unlimited
    homeVisitIncluded: z.boolean().default(false),
    prioritySupport: z.boolean().default(false),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

// User Subscription Schema
export const UserSubscriptionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    planId: z.string().uuid(),
    status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'PAUSED']),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    autoRenew: z.boolean().default(true),
    remainingConsultations: z.number().min(0).default(0),
    remainingTherapySessions: z.number().min(0).default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

// Create Subscription Schema
export const CreateSubscriptionSchema = z.object({
    userId: z.string().uuid(),
    planId: z.string().uuid(),
    autoRenew: z.boolean().optional(),
});

export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;

// Export all types
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;
export type Currency = z.infer<typeof CurrencySchema>;

// Additional missing types
export type SubscriptionStatus = z.infer<typeof UserSubscriptionSchema>['status'];
export type BillingPeriod = z.infer<typeof SubscriptionPlanSchema>['billingPeriod'];