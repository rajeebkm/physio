import Razorpay from 'razorpay';
import { getPostgresClient } from '../config/database';
import {
    CreatePayment,
    Payment,
    AppointmentPayment,
    SubscriptionPayment,
    Refund,
    PaymentStatus,
    PaymentMethod,
    PaymentProvider,
    Currency
} from '@physiotherapy/shared';
import logger from '../config/logger';
import * as crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class PaymentService {
    // Create payment order
    static async createPayment(data: CreatePayment): Promise<{ payment: Payment; order: any }> {
        try {
            const pgClient = await getPostgresClient();

            // Create payment record
            const paymentResult = await pgClient.query(`
        INSERT INTO payments (amount, currency, status, method, provider, description, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
                data.amount,
                data.currency || 'INR',
                'PENDING',
                data.method,
                data.provider,
                data.description,
                JSON.stringify(data.metadata || {})
            ]);

            const payment = paymentResult.rows[0];

            // Create Razorpay order
            const orderOptions = {
                amount: Math.round(data.amount * 100), // Convert to paise
                currency: data.currency || 'INR',
                receipt: payment.id,
                notes: {
                    payment_id: payment.id,
                    description: data.description,
                    ...data.metadata
                }
            };

            const razorpayOrder = await razorpay.orders.create(orderOptions as any);

            // Update payment with Razorpay order ID
            await pgClient.query(`
        UPDATE payments 
        SET provider_order_id = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [razorpayOrder.id, payment.id]);

            logger.info('Payment order created', {
                paymentId: payment.id,
                razorpayOrderId: razorpayOrder.id,
                amount: data.amount
            });

            return {
                payment: this.mapPaymentFromDB(payment),
                order: razorpayOrder
            };
        } catch (error) {
            logger.error('Create payment failed:', error);
            throw error;
        }
    }

    // Process payment (verify and update status)
    static async processPayment(
        paymentId: string,
        razorpayPaymentId: string,
        razorpaySignature: string
    ): Promise<Payment> {
        try {
            const pgClient = await getPostgresClient();

            // Get payment details
            const paymentResult = await pgClient.query(
                'SELECT * FROM payments WHERE id = $1',
                [paymentId]
            );

            if (paymentResult.rows.length === 0) {
                throw new Error('Payment not found');
            }

            const payment = paymentResult.rows[0];

            // Verify Razorpay signature
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
                .update(`${payment.provider_order_id}|${razorpayPaymentId}`)
                .digest('hex');

            if (expectedSignature !== razorpaySignature) {
                throw new Error('Invalid payment signature');
            }

            // Get payment details from Razorpay
            const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

            // Update payment status
            const status = razorpayPayment.status === 'captured' ? 'COMPLETED' : 'FAILED';

            await pgClient.query(`
        UPDATE payments 
        SET status = $1, provider_transaction_id = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [status, razorpayPaymentId, paymentId]);

            // If appointment payment, create appointment payment record
            if (payment.metadata?.appointmentId) {
                await this.createAppointmentPayment(paymentId, payment.metadata.appointmentId);
            }

            // If subscription payment, create subscription payment record
            if (payment.metadata?.subscriptionId) {
                await this.createSubscriptionPayment(paymentId, payment.metadata.subscriptionId);
            }

            logger.info('Payment processed', {
                paymentId,
                status,
                razorpayPaymentId
            });

            return this.mapPaymentFromDB({ ...payment, status, provider_transaction_id: razorpayPaymentId });
        } catch (error) {
            logger.error('Process payment failed:', error);
            throw error;
        }
    }

    // Create appointment payment
    static async createAppointmentPayment(paymentId: string, appointmentId: string): Promise<AppointmentPayment> {
        try {
            const pgClient = await getPostgresClient();

            // Get appointment details
            const appointmentResult = await pgClient.query(`
        SELECT a.*, p.consultation_fee, p.home_visit_fee
        FROM appointments a
        LEFT JOIN doctor_profiles p ON a.provider_id = p.user_id
        LEFT JOIN physiotherapist_profiles pt ON a.provider_id = pt.user_id
        WHERE a.id = $1
      `, [appointmentId]);

            if (appointmentResult.rows.length === 0) {
                throw new Error('Appointment not found');
            }

            const appointment = appointmentResult.rows[0];
            const consultationFee = appointment.consultation_fee || appointment.home_visit_fee || 0;
            const platformFee = Math.round(consultationFee * 0.15); // 15% platform fee
            const providerFee = consultationFee - platformFee;
            const taxAmount = Math.round(consultationFee * 0.18); // 18% GST
            const finalAmount = consultationFee + taxAmount;

            const appointmentPaymentResult = await pgClient.query(`
        INSERT INTO appointment_payments (
          payment_id, appointment_id, patient_id, provider_id,
          consultation_fee, platform_fee, provider_fee, tax_amount, final_amount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
                paymentId,
                appointmentId,
                appointment.patient_id,
                appointment.provider_id,
                consultationFee,
                platformFee,
                providerFee,
                taxAmount,
                finalAmount
            ]);

            return this.mapAppointmentPaymentFromDB(appointmentPaymentResult.rows[0]);
        } catch (error) {
            logger.error('Create appointment payment failed:', error);
            throw error;
        }
    }

    // Create subscription payment
    static async createSubscriptionPayment(paymentId: string, subscriptionId: string): Promise<SubscriptionPayment> {
        try {
            const pgClient = await getPostgresClient();

            // Get subscription details
            const subscriptionResult = await pgClient.query(`
        SELECT us.*, sp.name as plan_name, sp.billing_period, sp.price
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE us.id = $1
      `, [subscriptionId]);

            if (subscriptionResult.rows.length === 0) {
                throw new Error('Subscription not found');
            }

            const subscription = subscriptionResult.rows[0];

            const subscriptionPaymentResult = await pgClient.query(`
        INSERT INTO subscription_payments (
          payment_id, subscription_id, user_id, plan_id, plan_name, billing_period, amount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
                paymentId,
                subscriptionId,
                subscription.user_id,
                subscription.plan_id,
                subscription.plan_name,
                subscription.billing_period,
                subscription.price
            ]);

            return this.mapSubscriptionPaymentFromDB(subscriptionPaymentResult.rows[0]);
        } catch (error) {
            logger.error('Create subscription payment failed:', error);
            throw error;
        }
    }

    // Get payment by ID
    static async getPaymentById(paymentId: string): Promise<Payment | null> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(
                'SELECT * FROM payments WHERE id = $1',
                [paymentId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapPaymentFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Get payment by ID failed:', error);
            throw error;
        }
    }

    // Get payments with filters
    static async getPayments(filters: {
        userId?: string;
        status?: PaymentStatus;
        method?: PaymentMethod;
        provider?: PaymentProvider;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ payments: Payment[]; total: number }> {
        try {
            const pgClient = await getPostgresClient();

            let whereConditions: string[] = [];
            let queryParams: any[] = [];
            let paramCount = 0;

            if (filters.userId) {
                paramCount++;
                whereConditions.push(`(ap.patient_id = $${paramCount} OR ap.provider_id = $${paramCount})`);
                queryParams.push(filters.userId);
            }

            if (filters.status) {
                paramCount++;
                whereConditions.push(`p.status = $${paramCount}`);
                queryParams.push(filters.status);
            }

            if (filters.method) {
                paramCount++;
                whereConditions.push(`p.method = $${paramCount}`);
                queryParams.push(filters.method);
            }

            if (filters.provider) {
                paramCount++;
                whereConditions.push(`p.provider = $${paramCount}`);
                queryParams.push(filters.provider);
            }

            if (filters.startDate) {
                paramCount++;
                whereConditions.push(`p.created_at >= $${paramCount}`);
                queryParams.push(filters.startDate);
            }

            if (filters.endDate) {
                paramCount++;
                whereConditions.push(`p.created_at <= $${paramCount}`);
                queryParams.push(filters.endDate);
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            // Get total count
            const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM payments p
        LEFT JOIN appointment_payments ap ON p.id = ap.payment_id
        LEFT JOIN subscription_payments sp ON p.id = sp.payment_id
        ${whereClause}
      `;
            const countResult = await pgClient.query(countQuery, queryParams);
            const total = parseInt(countResult.rows[0].total);

            // Get payments with pagination
            paramCount++;
            const limit = filters.limit || 20;
            const offset = filters.offset || 0;

            const paymentsQuery = `
        SELECT DISTINCT p.*
        FROM payments p
        LEFT JOIN appointment_payments ap ON p.id = ap.payment_id
        LEFT JOIN subscription_payments sp ON p.id = sp.payment_id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

            queryParams.push(limit, offset);
            const paymentsResult = await pgClient.query(paymentsQuery, queryParams);

            const payments = paymentsResult.rows.map(row => this.mapPaymentFromDB(row));

            return { payments, total };
        } catch (error) {
            logger.error('Get payments failed:', error);
            throw error;
        }
    }

    // Create refund
    static async createRefund(paymentId: string, amount: number, reason: string): Promise<Refund> {
        try {
            const pgClient = await getPostgresClient();

            // Get payment details
            const paymentResult = await pgClient.query(
                'SELECT * FROM payments WHERE id = $1 AND status = $2',
                [paymentId, 'COMPLETED']
            );

            if (paymentResult.rows.length === 0) {
                throw new Error('Payment not found or not completed');
            }

            const payment = paymentResult.rows[0];

            if (!payment.provider_transaction_id) {
                throw new Error('No transaction ID found for refund');
            }

            // Create Razorpay refund
            const razorpayRefund = await razorpay.payments.refund(payment.provider_transaction_id, {
                amount: Math.round(amount * 100), // Convert to paise
                notes: {
                    reason: reason,
                    payment_id: paymentId
                }
            });

            // Create refund record
            const refundResult = await pgClient.query(`
        INSERT INTO refunds (payment_id, amount, reason, status, provider_refund_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
                paymentId,
                amount,
                reason,
                'COMPLETED',
                razorpayRefund.id
            ]);

            logger.info('Refund created', {
                paymentId,
                refundId: razorpayRefund.id,
                amount
            });

            return this.mapRefundFromDB(refundResult.rows[0]);
        } catch (error) {
            logger.error('Create refund failed:', error);
            throw error;
        }
    }

    // Verify webhook signature
    static verifyWebhookSignature(body: string, signature: string): boolean {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
                .update(body)
                .digest('hex');

            return expectedSignature === signature;
        } catch (error) {
            logger.error('Webhook signature verification failed:', error);
            return false;
        }
    }

    // Handle webhook events
    static async handleWebhook(event: string, data: any): Promise<void> {
        try {
            switch (event) {
                case 'payment.captured':
                    await this.handlePaymentCaptured(data);
                    break;
                case 'payment.failed':
                    await this.handlePaymentFailed(data);
                    break;
                case 'refund.created':
                    await this.handleRefundCreated(data);
                    break;
                default:
                    logger.info('Unhandled webhook event', { event, data });
            }
        } catch (error) {
            logger.error('Handle webhook failed:', error);
            throw error;
        }
    }

    private static async handlePaymentCaptured(data: any): Promise<void> {
        const pgClient = await getPostgresClient();

        await pgClient.query(`
      UPDATE payments 
      SET status = 'COMPLETED', provider_transaction_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE provider_order_id = $2
    `, [data.entity.id, data.entity.order_id]);
    }

    private static async handlePaymentFailed(data: any): Promise<void> {
        const pgClient = await getPostgresClient();

        await pgClient.query(`
      UPDATE payments 
      SET status = 'FAILED', provider_transaction_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE provider_order_id = $2
    `, [data.entity.id, data.entity.order_id]);
    }

    private static async handleRefundCreated(data: any): Promise<void> {
        const pgClient = await getPostgresClient();

        await pgClient.query(`
      UPDATE refunds 
      SET status = 'COMPLETED', provider_refund_id = $1, processed_at = CURRENT_TIMESTAMP
      WHERE payment_id = (SELECT id FROM payments WHERE provider_transaction_id = $2)
    `, [data.entity.id, data.entity.payment_id]);
    }

    // Helper methods for mapping database rows to types
    private static mapPaymentFromDB(row: any): Payment {
        return {
            id: row.id,
            amount: parseFloat(row.amount),
            currency: row.currency,
            status: row.status,
            method: row.method,
            provider: row.provider,
            providerTransactionId: row.provider_transaction_id,
            providerOrderId: row.provider_order_id,
            description: row.description,
            metadata: row.metadata || {},
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    private static mapAppointmentPaymentFromDB(row: any): AppointmentPayment {
        return {
            id: row.id,
            paymentId: row.payment_id,
            appointmentId: row.appointment_id,
            patientId: row.patient_id,
            providerId: row.provider_id,
            consultationFee: parseFloat(row.consultation_fee),
            platformFee: parseFloat(row.platform_fee),
            providerFee: parseFloat(row.provider_fee),
            taxAmount: parseFloat(row.tax_amount),
            discountAmount: parseFloat(row.discount_amount),
            finalAmount: parseFloat(row.final_amount),
            createdAt: row.created_at,
        };
    }

    private static mapSubscriptionPaymentFromDB(row: any): SubscriptionPayment {
        return {
            id: row.id,
            paymentId: row.payment_id,
            subscriptionId: row.subscription_id,
            userId: row.user_id,
            planId: row.plan_id,
            planName: row.plan_name,
            billingPeriod: row.billing_period,
            amount: parseFloat(row.amount),
            nextBillingDate: row.next_billing_date,
            createdAt: row.created_at,
        };
    }

    private static mapRefundFromDB(row: any): Refund {
        return {
            id: row.id,
            paymentId: row.payment_id,
            amount: parseFloat(row.amount),
            reason: row.reason,
            status: row.status,
            providerRefundId: row.provider_refund_id,
            processedAt: row.processed_at,
            createdAt: row.created_at,
        };
    }
}
