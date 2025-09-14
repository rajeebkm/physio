import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth';
import { authenticateToken, authLimiter } from '../middleware/auth';
import { validate, commonValidations } from '../middleware/validation';
import logger from '../config/logger';

const router = Router();

// Register new user
router.post('/register',
    authLimiter,
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('firstName')
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('First name is required and must be less than 50 characters'),
        body('lastName')
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Last name is required and must be less than 50 characters'),
        body('phone')
            .isMobilePhone('en-IN')
            .withMessage('Valid Indian phone number is required'),
        body('role')
            .isIn(['PATIENT', 'DOCTOR', 'PHYSIOTHERAPIST'])
            .withMessage('Valid role is required'),
        body('dateOfBirth')
            .optional()
            .isISO8601()
            .withMessage('Valid date of birth is required'),
        body('gender')
            .optional()
            .isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
            .withMessage('Valid gender is required'),
        ...commonValidations.email(),
        ...commonValidations.phone(),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const result = await AuthService.register(req.body);

            logger.info('User registered successfully', { userId: result.user.id, email: result.user.email });

            res.status(201).json({
                success: true,
                data: result,
                message: 'User registered successfully'
            });
        } catch (error) {
            logger.error('Registration failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('already exists')) {
                    return res.status(409).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Registration failed'
            });
        }
    }
);

// Login user
router.post('/login',
    authLimiter,
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Valid email is required'),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
        ...commonValidations.email(),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const result = await AuthService.login(req.body);

            logger.info('User logged in successfully', { userId: result.user.id, email: result.user.email });

            res.json({
                success: true,
                data: result,
                message: 'Login successful'
            });
        } catch (error) {
            logger.error('Login failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('Invalid') || error.message.includes('not active')) {
                    return res.status(401).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Login failed'
            });
        }
    }
);

// Refresh access token
router.post('/refresh',
    [
        body('refreshToken')
            .notEmpty()
            .withMessage('Refresh token is required'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.refreshToken(refreshToken);

            res.json({
                success: true,
                data: result,
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            logger.error('Token refresh failed:', error);

            res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }
    }
);

// Logout user
router.post('/logout',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            await AuthService.logout(req.user!.id);

            logger.info('User logged out successfully', { userId: req.user!.id });

            res.json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            logger.error('Logout failed:', error);

            res.status(500).json({
                success: false,
                error: 'Logout failed'
            });
        }
    }
);

// Change password
router.post('/change-password',
    authenticateToken,
    [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const { currentPassword, newPassword } = req.body;
            await AuthService.changePassword(req.user!.id, currentPassword, newPassword);

            logger.info('Password changed successfully', { userId: req.user!.id });

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            logger.error('Password change failed:', error);

            if (error instanceof Error) {
                if (error.message.includes('incorrect') || error.message.includes('not found')) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            }

            res.status(500).json({
                success: false,
                error: 'Password change failed'
            });
        }
    }
);

// Get current user profile
router.get('/me',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            res.json({
                success: true,
                data: req.user,
                message: 'User profile retrieved successfully'
            });
        } catch (error) {
            logger.error('Get profile failed:', error);

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve user profile'
            });
        }
    }
);

export default router;
