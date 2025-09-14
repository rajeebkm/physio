import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { SubscriptionService } from '../services/subscription';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import logger from '../config/logger';

const router = Router();

// Get subscription plans
router.get('/plans',
    async (req: Request, res: Response) => {
        try {
            const plans = await SubscriptionService.getSubscriptionPlans();

            res.json({
                success: true,
                data: plans,
                message: 'Subscription plans retrieved successfully'
            });
        } catch (error) {
            logger.error('Get subscription plans failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve subscription plans'
            });
        }
    }
);

// Get subscription plan by ID
router.get('/plans/:id',
    async (req: Request, res: Response) => {
        try {
            const plan = await SubscriptionService.getSubscriptionPlanById(req.params.id);

            if (!plan) {
                return res.status(404).json({
                    success: false,
                    error: 'Subscription plan not found'
                });
            }

            res.json({
                success: true,
                data: plan,
                message: 'Subscription plan retrieved successfully'
            });
        } catch (error) {
            logger.error('Get subscription plan by ID failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve subscription plan'
            });
        }
    }
);

// Create subscription
router.post('/',
    authenticateToken,
    [
        body('planId')
            .isUUID()
            .withMessage('Valid plan ID is required'),
        body('autoRenew')
            .optional()
            .isBoolean()
            .withMessage('Auto-renew must be a boolean'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.createSubscription({
                ...req.body,
                userId: req.user!.id
            });

            logger.info('Subscription created', {
                subscriptionId: subscription.id,
                userId: req.user!.id,
                planId: req.body.planId
            });

            res.status(201).json({
                success: true,
                data: subscription,
                message: 'Subscription created successfully'
            });
        } catch (error) {
            logger.error('Create subscription failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('already has')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to create subscription'
            });
        }
    }
);

// Get user's current subscription
router.get('/current',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.getUserSubscription(req.user!.id);

            if (!subscription) {
                return res.status(404).json({
                    success: false,
                    error: 'No active subscription found'
                });
            }

            res.json({
                success: true,
                data: subscription,
                message: 'Current subscription retrieved successfully'
            });
        } catch (error) {
            logger.error('Get current subscription failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve current subscription'
            });
        }
    }
);

// Cancel subscription
router.post('/:id/cancel',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.cancelSubscription(
                req.params.id,
                req.user!.id
            );

            logger.info('Subscription cancelled', {
                subscriptionId: req.params.id,
                userId: req.user!.id
            });

            res.json({
                success: true,
                data: subscription,
                message: 'Subscription cancelled successfully'
            });
        } catch (error) {
            logger.error('Cancel subscription failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('access denied')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
                if (error.message.includes('not active')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to cancel subscription'
            });
        }
    }
);

// Pause subscription
router.post('/:id/pause',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.pauseSubscription(
                req.params.id,
                req.user!.id
            );

            logger.info('Subscription paused', {
                subscriptionId: req.params.id,
                userId: req.user!.id
            });

            res.json({
                success: true,
                data: subscription,
                message: 'Subscription paused successfully'
            });
        } catch (error) {
            logger.error('Pause subscription failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('access denied')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
                if (error.message.includes('not active')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to pause subscription'
            });
        }
    }
);

// Resume subscription
router.post('/:id/resume',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.resumeSubscription(
                req.params.id,
                req.user!.id
            );

            logger.info('Subscription resumed', {
                subscriptionId: req.params.id,
                userId: req.user!.id
            });

            res.json({
                success: true,
                data: subscription,
                message: 'Subscription resumed successfully'
            });
        } catch (error) {
            logger.error('Resume subscription failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('access denied')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
                if (error.message.includes('not paused')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to resume subscription'
            });
        }
    }
);

// Check if user can book consultation
router.get('/check/consultation',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const result = await SubscriptionService.canBookConsultation(req.user!.id);

            res.json({
                success: true,
                data: result,
                message: 'Consultation booking check completed'
            });
        } catch (error) {
            logger.error('Check consultation booking failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to check consultation booking'
            });
        }
    }
);

// Check if user can book therapy session
router.get('/check/therapy',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const result = await SubscriptionService.canBookTherapySession(req.user!.id);

            res.json({
                success: true,
                data: result,
                message: 'Therapy session booking check completed'
            });
        } catch (error) {
            logger.error('Check therapy session booking failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to check therapy session booking'
            });
        }
    }
);

// Get subscription usage
router.get('/usage',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const subscription = await SubscriptionService.getUserSubscription(req.user!.id);

            if (!subscription) {
                return res.status(404).json({
                    success: false,
                    error: 'No active subscription found'
                });
            }

            const usage = {
                consultations: {
                    remaining: subscription.remainingConsultations,
                    unlimited: subscription.remainingConsultations === -1
                },
                therapySessions: {
                    remaining: subscription.remainingTherapySessions,
                    unlimited: subscription.remainingTherapySessions === -1
                },
                subscription: {
                    status: subscription.status,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    autoRenew: subscription.autoRenew
                }
            };

            res.json({
                success: true,
                data: usage,
                message: 'Subscription usage retrieved successfully'
            });
        } catch (error) {
            logger.error('Get subscription usage failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve subscription usage'
            });
        }
    }
);

export default router;
