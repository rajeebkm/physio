import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { PaymentService } from '../services/payment';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import logger from '../config/logger';

const router = Router();

// Create payment order
router.post('/',
    authenticateToken,
    [
        body('amount')
            .isFloat({ min: 1 })
            .withMessage('Amount must be at least 1'),
        body('currency')
            .optional()
            .isIn(['INR', 'USD', 'EUR'])
            .withMessage('Valid currency is required'),
        body('method')
            .isIn(['CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH', 'INSURANCE'])
            .withMessage('Valid payment method is required'),
        body('provider')
            .isIn(['RAZORPAY', 'STRIPE', 'PAYPAL', 'CASHFREE', 'PHONEPE', 'GOOGLE_PAY'])
            .withMessage('Valid payment provider is required'),
        body('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        body('appointmentId')
            .optional()
            .isUUID()
            .withMessage('Valid appointment ID is required'),
        body('subscriptionId')
            .optional()
            .isUUID()
            .withMessage('Valid subscription ID is required'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const result = await PaymentService.createPayment(req.body);

            logger.info('Payment order created', {
                paymentId: result.payment.id,
                userId: req.user!.id,
                amount: req.body.amount
            });

            res.status(201).json({
                success: true,
                data: {
                    payment: result.payment,
                    order: result.order
                },
                message: 'Payment order created successfully'
            });
        } catch (error) {
            logger.error('Create payment failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to create payment order'
            });
        }
    }
);

// Process payment (verify and update status)
router.post('/:id/process',
    authenticateToken,
    [
        body('razorpayPaymentId')
            .notEmpty()
            .withMessage('Razorpay payment ID is required'),
        body('razorpaySignature')
            .notEmpty()
            .withMessage('Razorpay signature is required'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const payment = await PaymentService.processPayment(
                req.params.id,
                req.body.razorpayPaymentId,
                req.body.razorpaySignature
            );

            logger.info('Payment processed', {
                paymentId: req.params.id,
                userId: req.user!.id,
                status: payment.status
            });

            res.json({
                success: true,
                data: payment,
                message: 'Payment processed successfully'
            });
        } catch (error) {
            logger.error('Process payment failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('Invalid')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to process payment'
            });
        }
    }
);

// Get payment by ID
router.get('/:id',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const payment = await PaymentService.getPaymentById(req.params.id);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    error: 'Payment not found'
                });
            }

            res.json({
                success: true,
                data: payment,
                message: 'Payment retrieved successfully'
            });
        } catch (error) {
            logger.error('Get payment by ID failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve payment'
            });
        }
    }
);

// Get payments with filters
router.get('/',
    authenticateToken,
    [
        query('status')
            .optional()
            .isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'])
            .withMessage('Valid status is required'),
        query('method')
            .optional()
            .isIn(['CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH', 'INSURANCE'])
            .withMessage('Valid method is required'),
        query('provider')
            .optional()
            .isIn(['RAZORPAY', 'STRIPE', 'PAYPAL', 'CASHFREE', 'PHONEPE', 'GOOGLE_PAY'])
            .withMessage('Valid provider is required'),
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Valid start date is required'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('Valid end date is required'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('offset')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Offset must be a non-negative integer'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const filters = {
                ...req.query,
                userId: req.user!.id, // Only show user's own payments
            };

            const result = await PaymentService.getPayments(filters);

            res.json({
                success: true,
                data: result.payments,
                pagination: {
                    total: result.total,
                    limit: parseInt(req.query.limit as string) || 20,
                    offset: parseInt(req.query.offset as string) || 0,
                    totalPages: Math.ceil(result.total / (parseInt(req.query.limit as string) || 20))
                },
                message: 'Payments retrieved successfully'
            });
        } catch (error) {
            logger.error('Get payments failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve payments'
            });
        }
    }
);

// Create refund
router.post('/:id/refund',
    authenticateToken,
    [
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Refund amount must be greater than 0'),
        body('reason')
            .notEmpty()
            .isLength({ max: 500 })
            .withMessage('Refund reason is required and must be less than 500 characters'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const refund = await PaymentService.createRefund(
                req.params.id,
                req.body.amount,
                req.body.reason
            );

            logger.info('Refund created', {
                paymentId: req.params.id,
                refundId: refund.id,
                amount: req.body.amount,
                userId: req.user!.id
            });

            res.status(201).json({
                success: true,
                data: refund,
                message: 'Refund created successfully'
            });
        } catch (error) {
            logger.error('Create refund failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not completed')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to create refund'
            });
        }
    }
);

// Razorpay webhook endpoint
router.post('/webhook',
    async (req: Request, res: Response) => {
        try {
            const signature = req.headers['x-razorpay-signature'] as string;
            const body = JSON.stringify(req.body);

            if (!PaymentService.verifyWebhookSignature(body, signature)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid webhook signature'
                });
            }

            const { event, contains } = req.body;

            if (contains && contains.includes('payment')) {
                await PaymentService.handleWebhook(event, req.body);
            }

            res.json({ success: true });
        } catch (error) {
            logger.error('Webhook processing failed:', error);

            res.status(500).json({
                success: false,
                error: 'Webhook processing failed'
            });
        }
    }
);

// Get payment methods
router.get('/methods',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const methods = [
                {
                    id: 'UPI',
                    name: 'UPI',
                    description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
                    icon: 'upi',
                    enabled: true
                },
                {
                    id: 'CARD',
                    name: 'Credit/Debit Card',
                    description: 'Pay using Visa, Mastercard, RuPay cards',
                    icon: 'card',
                    enabled: true
                },
                {
                    id: 'NET_BANKING',
                    name: 'Net Banking',
                    description: 'Pay using your bank account',
                    icon: 'bank',
                    enabled: true
                },
                {
                    id: 'WALLET',
                    name: 'Digital Wallet',
                    description: 'Pay using Paytm, Mobikwik, Freecharge',
                    icon: 'wallet',
                    enabled: true
                }
            ];

            res.json({
                success: true,
                data: methods,
                message: 'Payment methods retrieved successfully'
            });
        } catch (error) {
            logger.error('Get payment methods failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve payment methods'
            });
        }
    }
);

export default router;
