import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { AppointmentService } from '../services/appointments';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validate, commonValidations } from '../middleware/validation';
import { appointmentLimiter } from '../middleware/rateLimiting';
import logger from '../config/logger';

const router = Router();

// Create new appointment
router.post('/',
    authenticateToken,
    appointmentLimiter,
    [
        body('providerId')
            .isUUID()
            .withMessage('Valid provider ID is required'),
        body('type')
            .isIn(['CONSULTATION', 'THERAPY_SESSION', 'FOLLOW_UP', 'EMERGENCY'])
            .withMessage('Valid appointment type is required'),
        body('mode')
            .isIn(['VIDEO', 'AUDIO', 'IN_PERSON', 'HOME_VISIT'])
            .withMessage('Valid consultation mode is required'),
        body('scheduledAt')
            .isISO8601()
            .withMessage('Valid scheduled time is required'),
        body('duration')
            .isInt({ min: 15, max: 180 })
            .withMessage('Duration must be between 15 and 180 minutes'),
        body('notes')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Notes must be less than 1000 characters'),
        body('symptoms')
            .optional()
            .isArray()
            .withMessage('Symptoms must be an array'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.createAppointment(req.body, req.user!.id);

            logger.info('Appointment created successfully', {
                appointmentId: appointment.id,
                patientId: req.user!.id,
                providerId: req.body.providerId
            });

            res.status(201).json({
                success: true,
                data: appointment,
                message: 'Appointment created successfully'
            });
        } catch (error) {
            logger.error('Create appointment failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not available')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
                if (error.message.includes('conflict') || error.message.includes('not available')) {
                    return res.status(409).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to create appointment'
            });
        }
    }
);

// Get appointments with filters
router.get('/',
    authenticateToken,
    [
        query('patientId')
            .optional()
            .isUUID()
            .withMessage('Valid patient ID is required'),
        query('providerId')
            .optional()
            .isUUID()
            .withMessage('Valid provider ID is required'),
        query('status')
            .optional()
            .isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'])
            .withMessage('Valid status is required'),
        query('type')
            .optional()
            .isIn(['CONSULTATION', 'THERAPY_SESSION', 'FOLLOW_UP', 'EMERGENCY'])
            .withMessage('Valid type is required'),
        query('mode')
            .optional()
            .isIn(['VIDEO', 'AUDIO', 'IN_PERSON', 'HOME_VISIT'])
            .withMessage('Valid mode is required'),
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
            // Add user-based filtering for security
            const query = {
                limit: parseInt(req.query.limit as string) || 10,
                offset: parseInt(req.query.offset as string) || 0,
                ...req.query,
                // Patients can only see their own appointments
                // Providers can see their own appointments
                ...(req.user!.role === 'PATIENT' ? { patientId: req.user!.id } : {}),
                ...(req.user!.role === 'DOCTOR' || req.user!.role === 'PHYSIOTHERAPIST' ? { providerId: req.user!.id } : {}),
            };

            const result = await AppointmentService.getAppointments(query);

            res.json({
                success: true,
                data: result.appointments,
                pagination: {
                    total: result.total,
                    limit: parseInt(req.query.limit as string) || 20,
                    offset: parseInt(req.query.offset as string) || 0,
                    totalPages: Math.ceil(result.total / (parseInt(req.query.limit as string) || 20))
                },
                message: 'Appointments retrieved successfully'
            });
        } catch (error) {
            logger.error('Get appointments failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve appointments'
            });
        }
    }
);

// Get appointment by ID
router.get('/:id',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.getAppointmentById(req.params.id, req.user!.id);

            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    error: 'Appointment not found'
                });
            }

            res.json({
                success: true,
                data: appointment,
                message: 'Appointment retrieved successfully'
            });
        } catch (error) {
            logger.error('Get appointment by ID failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve appointment'
            });
        }
    }
);

// Update appointment status
router.patch('/:id/status',
    authenticateToken,
    requireRole(['DOCTOR', 'PHYSIOTHERAPIST', 'ADMIN']),
    [
        body('status')
            .isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'])
            .withMessage('Valid status is required'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.updateAppointmentStatus(
                req.params.id,
                req.body.status,
                req.user!.id
            );

            logger.info('Appointment status updated', {
                appointmentId: req.params.id,
                status: req.body.status,
                userId: req.user!.id
            });

            res.json({
                success: true,
                data: appointment,
                message: 'Appointment status updated successfully'
            });
        } catch (error) {
            logger.error('Update appointment status failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('access denied')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to update appointment status'
            });
        }
    }
);

// Cancel appointment
router.post('/:id/cancel',
    authenticateToken,
    [
        body('reason')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Reason must be less than 500 characters'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            await AppointmentService.cancelAppointment(
                req.params.id,
                req.body.reason || 'No reason provided',
                req.user!.id
            );

            logger.info('Appointment cancelled', {
                appointmentId: req.params.id,
                userId: req.user!.id
            });

            res.json({
                success: true,
                message: 'Appointment cancelled successfully'
            });
        } catch (error) {
            logger.error('Cancel appointment failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('access denied')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
                if (error.message.includes('cannot be cancelled')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to cancel appointment'
            });
        }
    }
);

// Reschedule appointment
router.post('/:id/reschedule',
    authenticateToken,
    [
        body('newScheduledAt')
            .isISO8601()
            .withMessage('Valid new scheduled time is required'),
        body('reason')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Reason must be less than 500 characters'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.rescheduleAppointment(
                req.params.id,
                req.body.newScheduledAt,
                req.body.reason || 'No reason provided',
                req.user!.id
            );

            logger.info('Appointment rescheduled', {
                appointmentId: req.params.id,
                newScheduledAt: req.body.newScheduledAt,
                userId: req.user!.id
            });

            res.json({
                success: true,
                data: appointment,
                message: 'Appointment rescheduled successfully'
            });
        } catch (error) {
            logger.error('Reschedule appointment failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('access denied')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
                if (error.message.includes('cannot be rescheduled') || error.message.includes('not available')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to reschedule appointment'
            });
        }
    }
);

export default router;
