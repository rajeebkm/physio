import { getPostgresClient } from '../config/database';
import {
    SubscriptionPlan,
    UserSubscription,
    CreateSubscription,
    SubscriptionStatus,
    BillingPeriod
} from '@physiotherapy/shared';
import logger from '../config/logger';

export class SubscriptionService {
    // Get all subscription plans
    static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        SELECT * FROM subscription_plans 
        WHERE is_active = true 
        ORDER BY price ASC
      `);

            return result.rows.map(row => this.mapSubscriptionPlanFromDB(row));
        } catch (error) {
            logger.error('Get subscription plans failed:', error);
            throw error;
        }
    }

    // Get subscription plan by ID
    static async getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(
                'SELECT * FROM subscription_plans WHERE id = $1 AND is_active = true',
                [planId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapSubscriptionPlanFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Get subscription plan by ID failed:', error);
            throw error;
        }
    }

    // Create user subscription
    static async createSubscription(data: CreateSubscription): Promise<UserSubscription> {
        try {
            const pgClient = await getPostgresClient();

            // Get plan details
            const planResult = await pgClient.query(
                'SELECT * FROM subscription_plans WHERE id = $1 AND is_active = true',
                [data.planId]
            );

            if (planResult.rows.length === 0) {
                throw new Error('Subscription plan not found');
            }

            const plan = planResult.rows[0];

            // Check if user already has an active subscription
            const existingSubscriptionResult = await pgClient.query(`
        SELECT * FROM user_subscriptions 
        WHERE user_id = $1 AND status IN ('ACTIVE', 'PAUSED')
      `, [data.userId]);

            if (existingSubscriptionResult.rows.length > 0) {
                throw new Error('User already has an active subscription');
            }

            // Calculate subscription dates
            const startDate = new Date();
            const endDate = this.calculateEndDate(startDate, plan.billing_period);

            // Create subscription
            const subscriptionResult = await pgClient.query(`
        INSERT INTO user_subscriptions (
          user_id, plan_id, status, start_date, end_date, auto_renew,
          remaining_consultations, remaining_therapy_sessions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
                data.userId,
                data.planId,
                'ACTIVE',
                startDate,
                endDate,
                data.autoRenew !== false,
                plan.max_consultations === -1 ? -1 : plan.max_consultations,
                plan.max_therapy_sessions === -1 ? -1 : plan.max_therapy_sessions
            ]);

            logger.info('Subscription created', {
                subscriptionId: subscriptionResult.rows[0].id,
                userId: data.userId,
                planId: data.planId
            });

            return this.mapUserSubscriptionFromDB(subscriptionResult.rows[0]);
        } catch (error) {
            logger.error('Create subscription failed:', error);
            throw error;
        }
    }

    // Get user's current subscription
    static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        SELECT us.*, sp.name as plan_name, sp.features, sp.price
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE us.user_id = $1 AND us.status = 'ACTIVE'
        ORDER BY us.created_at DESC
        LIMIT 1
      `, [userId]);

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapUserSubscriptionFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Get user subscription failed:', error);
            throw error;
        }
    }

    // Update subscription status
    static async updateSubscriptionStatus(
        subscriptionId: string,
        status: SubscriptionStatus
    ): Promise<UserSubscription> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        UPDATE user_subscriptions 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [status, subscriptionId]);

            if (result.rows.length === 0) {
                throw new Error('Subscription not found');
            }

            logger.info('Subscription status updated', {
                subscriptionId,
                status
            });

            return this.mapUserSubscriptionFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Update subscription status failed:', error);
            throw error;
        }
    }

    // Cancel subscription
    static async cancelSubscription(subscriptionId: string, userId: string): Promise<UserSubscription> {
        try {
            const pgClient = await getPostgresClient();

            // Verify subscription belongs to user
            const subscriptionResult = await pgClient.query(`
        SELECT * FROM user_subscriptions 
        WHERE id = $1 AND user_id = $2
      `, [subscriptionId, userId]);

            if (subscriptionResult.rows.length === 0) {
                throw new Error('Subscription not found or access denied');
            }

            const subscription = subscriptionResult.rows[0];

            if (subscription.status !== 'ACTIVE') {
                throw new Error('Subscription is not active');
            }

            // Cancel subscription
            const result = await pgClient.query(`
        UPDATE user_subscriptions 
        SET status = 'CANCELLED', auto_renew = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [subscriptionId]);

            logger.info('Subscription cancelled', {
                subscriptionId,
                userId
            });

            return this.mapUserSubscriptionFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Cancel subscription failed:', error);
            throw error;
        }
    }

    // Pause subscription
    static async pauseSubscription(subscriptionId: string, userId: string): Promise<UserSubscription> {
        try {
            const pgClient = await getPostgresClient();

            // Verify subscription belongs to user
            const subscriptionResult = await pgClient.query(`
        SELECT * FROM user_subscriptions 
        WHERE id = $1 AND user_id = $2
      `, [subscriptionId, userId]);

            if (subscriptionResult.rows.length === 0) {
                throw new Error('Subscription not found or access denied');
            }

            const subscription = subscriptionResult.rows[0];

            if (subscription.status !== 'ACTIVE') {
                throw new Error('Subscription is not active');
            }

            // Pause subscription
            const result = await pgClient.query(`
        UPDATE user_subscriptions 
        SET status = 'PAUSED', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [subscriptionId]);

            logger.info('Subscription paused', {
                subscriptionId,
                userId
            });

            return this.mapUserSubscriptionFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Pause subscription failed:', error);
            throw error;
        }
    }

    // Resume subscription
    static async resumeSubscription(subscriptionId: string, userId: string): Promise<UserSubscription> {
        try {
            const pgClient = await getPostgresClient();

            // Verify subscription belongs to user
            const subscriptionResult = await pgClient.query(`
        SELECT * FROM user_subscriptions 
        WHERE id = $1 AND user_id = $2
      `, [subscriptionId, userId]);

            if (subscriptionResult.rows.length === 0) {
                throw new Error('Subscription not found or access denied');
            }

            const subscription = subscriptionResult.rows[0];

            if (subscription.status !== 'PAUSED') {
                throw new Error('Subscription is not paused');
            }

            // Resume subscription
            const result = await pgClient.query(`
        UPDATE user_subscriptions 
        SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [subscriptionId]);

            logger.info('Subscription resumed', {
                subscriptionId,
                userId
            });

            return this.mapUserSubscriptionFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Resume subscription failed:', error);
            throw error;
        }
    }

    // Check if user can book consultation
    static async canBookConsultation(userId: string): Promise<{ canBook: boolean; reason?: string }> {
        try {
            const subscription = await this.getUserSubscription(userId);

            if (!subscription) {
                return { canBook: false, reason: 'No active subscription' };
            }

            // Check if subscription is expired
            if (new Date() > new Date(subscription.endDate)) {
                return { canBook: false, reason: 'Subscription expired' };
            }

            // Check consultation limit
            if (subscription.remainingConsultations === 0) {
                return { canBook: false, reason: 'Consultation limit reached' };
            }

            return { canBook: true };
        } catch (error) {
            logger.error('Check consultation booking failed:', error);
            throw error;
        }
    }

    // Check if user can book therapy session
    static async canBookTherapySession(userId: string): Promise<{ canBook: boolean; reason?: string }> {
        try {
            const subscription = await this.getUserSubscription(userId);

            if (!subscription) {
                return { canBook: false, reason: 'No active subscription' };
            }

            // Check if subscription is expired
            if (new Date() > new Date(subscription.endDate)) {
                return { canBook: false, reason: 'Subscription expired' };
            }

            // Check therapy session limit
            if (subscription.remainingTherapySessions === 0) {
                return { canBook: false, reason: 'Therapy session limit reached' };
            }

            return { canBook: true };
        } catch (error) {
            logger.error('Check therapy session booking failed:', error);
            throw error;
        }
    }

    // Consume consultation from subscription
    static async consumeConsultation(userId: string): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            await pgClient.query(`
        UPDATE user_subscriptions 
        SET remaining_consultations = remaining_consultations - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND status = 'ACTIVE' AND remaining_consultations > 0
      `, [userId]);

            logger.info('Consultation consumed', { userId });
        } catch (error) {
            logger.error('Consume consultation failed:', error);
            throw error;
        }
    }

    // Consume therapy session from subscription
    static async consumeTherapySession(userId: string): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            await pgClient.query(`
        UPDATE user_subscriptions 
        SET remaining_therapy_sessions = remaining_therapy_sessions - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND status = 'ACTIVE' AND remaining_therapy_sessions > 0
      `, [userId]);

            logger.info('Therapy session consumed', { userId });
        } catch (error) {
            logger.error('Consume therapy session failed:', error);
            throw error;
        }
    }

    // Process subscription renewal
    static async processRenewal(subscriptionId: string): Promise<UserSubscription> {
        try {
            const pgClient = await getPostgresClient();

            // Get subscription details
            const subscriptionResult = await pgClient.query(`
        SELECT us.*, sp.billing_period, sp.price
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE us.id = $1
      `, [subscriptionId]);

            if (subscriptionResult.rows.length === 0) {
                throw new Error('Subscription not found');
            }

            const subscription = subscriptionResult.rows[0];

            if (!subscription.auto_renew) {
                throw new Error('Auto-renewal is disabled');
            }

            // Calculate new dates
            const startDate = new Date(subscription.end_date);
            const endDate = this.calculateEndDate(startDate, subscription.billing_period);

            // Update subscription
            const result = await pgClient.query(`
        UPDATE user_subscriptions 
        SET start_date = $1, end_date = $2, status = 'ACTIVE',
            remaining_consultations = $3, remaining_therapy_sessions = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `, [
                startDate,
                endDate,
                subscription.max_consultations === -1 ? -1 : subscription.max_consultations,
                subscription.max_therapy_sessions === -1 ? -1 : subscription.max_therapy_sessions,
                subscriptionId
            ]);

            logger.info('Subscription renewed', {
                subscriptionId,
                newEndDate: endDate
            });

            return this.mapUserSubscriptionFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Process renewal failed:', error);
            throw error;
        }
    }

    // Get expired subscriptions
    static async getExpiredSubscriptions(): Promise<UserSubscription[]> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        SELECT * FROM user_subscriptions 
        WHERE status = 'ACTIVE' AND end_date < NOW()
      `);

            return result.rows.map(row => this.mapUserSubscriptionFromDB(row));
        } catch (error) {
            logger.error('Get expired subscriptions failed:', error);
            throw error;
        }
    }

    // Helper methods
    private static calculateEndDate(startDate: Date, billingPeriod: string): Date {
        const endDate = new Date(startDate);

        switch (billingPeriod) {
            case 'MONTHLY':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'QUARTERLY':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case 'YEARLY':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 1);
        }

        return endDate;
    }

    private static mapSubscriptionPlanFromDB(row: any): SubscriptionPlan {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
            currency: row.currency,
            billingPeriod: row.billing_period,
            features: row.features || [],
            maxConsultations: row.max_consultations,
            maxTherapySessions: row.max_therapy_sessions,
            homeVisitIncluded: row.home_visit_included,
            prioritySupport: row.priority_support,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    private static mapUserSubscriptionFromDB(row: any): UserSubscription {
        return {
            id: row.id,
            userId: row.user_id,
            planId: row.plan_id,
            status: row.status,
            startDate: row.start_date,
            endDate: row.end_date,
            autoRenew: row.auto_renew,
            remainingConsultations: row.remaining_consultations,
            remainingTherapySessions: row.remaining_therapy_sessions,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
