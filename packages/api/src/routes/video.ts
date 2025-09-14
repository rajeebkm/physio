import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { VideoService } from '../services/video';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import logger from '../config/logger';

const router = Router();

// Create video session
router.post('/sessions',
    authenticateToken,
    [
        body('appointmentId')
            .isUUID()
            .withMessage('Valid appointment ID is required'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const result = await VideoService.createVideoSession(
                req.body.appointmentId,
                req.user!.id,
                req.body.providerId || req.user!.id
            );

            logger.info('Video session created', {
                sessionId: result.sessionId,
                appointmentId: req.body.appointmentId,
                userId: req.user!.id
            });

            res.status(201).json({
                success: true,
                data: result,
                message: 'Video session created successfully'
            });
        } catch (error) {
            logger.error('Create video session failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to create video session'
            });
        }
    }
);

// Join video call
router.post('/sessions/:sessionId/join',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const result = await VideoService.joinVideoCall(
                req.params.sessionId,
                req.user!.id
            );

            logger.info('User joined video call', {
                sessionId: req.params.sessionId,
                userId: req.user!.id,
                role: result.role
            });

            res.json({
                success: true,
                data: result,
                message: 'Joined video call successfully'
            });
        } catch (error) {
            logger.error('Join video call failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to join video call'
            });
        }
    }
);

// End video call
router.post('/sessions/:sessionId/end',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            await VideoService.endVideoCall(
                req.params.sessionId,
                req.user!.id
            );

            logger.info('User left video call', {
                sessionId: req.params.sessionId,
                userId: req.user!.id
            });

            res.json({
                success: true,
                message: 'Left video call successfully'
            });
        } catch (error) {
            logger.error('End video call failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to end video call'
            });
        }
    }
);

// Get video session details
router.get('/sessions/:sessionId',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const session = await VideoService.getVideoSession(
                req.params.sessionId,
                req.user!.id
            );

            res.json({
                success: true,
                data: session,
                message: 'Video session retrieved successfully'
            });
        } catch (error) {
            logger.error('Get video session failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve video session'
            });
        }
    }
);

// Start recording
router.post('/sessions/:sessionId/recording/start',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const result = await VideoService.startRecording(
                req.params.sessionId,
                req.user!.id
            );

            logger.info('Video recording started', {
                sessionId: req.params.sessionId,
                recordingId: result.recordingId,
                userId: req.user!.id
            });

            res.json({
                success: true,
                data: result,
                message: 'Recording started successfully'
            });
        } catch (error) {
            logger.error('Start recording failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to start recording'
            });
        }
    }
);

// Stop recording
router.post('/sessions/:sessionId/recording/stop',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            await VideoService.stopRecording(
                req.params.sessionId,
                req.user!.id
            );

            logger.info('Video recording stopped', {
                sessionId: req.params.sessionId,
                userId: req.user!.id
            });

            res.json({
                success: true,
                message: 'Recording stopped successfully'
            });
        } catch (error) {
            logger.error('Stop recording failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to stop recording'
            });
        }
    }
);

// Get call analytics
router.get('/sessions/:sessionId/analytics',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const analytics = await VideoService.getCallAnalytics(
                req.params.sessionId,
                req.user!.id
            );

            res.json({
                success: true,
                data: analytics,
                message: 'Call analytics retrieved successfully'
            });
        } catch (error) {
            logger.error('Get call analytics failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('not authorized')) {
                    return res.status(404).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve call analytics'
            });
        }
    }
);

// Generate Agora token
router.post('/token',
    authenticateToken,
    [
        body('channelName')
            .notEmpty()
            .withMessage('Channel name is required'),
        body('role')
            .optional()
            .isIn(['publisher', 'subscriber'])
            .withMessage('Valid role is required'),
        body('expirationTimeInSeconds')
            .optional()
            .isInt({ min: 1, max: 86400 })
            .withMessage('Expiration time must be between 1 and 86400 seconds'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const result = VideoService.generateToken(
                req.body.channelName,
                req.user!.id,
                req.body.role || 'publisher',
                req.body.expirationTimeInSeconds || 3600
            );

            res.json({
                success: true,
                data: result,
                message: 'Token generated successfully'
            });
        } catch (error) {
            logger.error('Generate token failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('not configured')) {
                    return res.status(500).json({
                        success: false,
                        error: 'Video service not configured'
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to generate token'
            });
        }
    }
);

// Get video call configuration
router.get('/config',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const config = {
                appId: process.env.AGORA_APP_ID,
                region: 'ap-south-1',
                codec: 'h264',
                mode: 'rtc',
                features: [
                    'video',
                    'audio',
                    'screen_share',
                    'recording',
                    'chat'
                ],
                supportedResolutions: [
                    { width: 320, height: 240 },
                    { width: 640, height: 480 },
                    { width: 1280, height: 720 }
                ],
                supportedFrameRates: [15, 24, 30],
                maxParticipants: 2
            };

            res.json({
                success: true,
                data: config,
                message: 'Video configuration retrieved successfully'
            });
        } catch (error) {
            logger.error('Get video config failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve video configuration'
            });
        }
    }
);

export default router;
