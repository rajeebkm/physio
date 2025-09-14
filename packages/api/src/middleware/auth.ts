import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { getPostgresClient } from '../config/database';
import { BaseUser, UserRole } from '@physiotherapy/shared';
import logger from '../config/logger';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: BaseUser;
        }
    }
}

interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Get user from database to ensure they still exist and are active
        const pgClient = await getPostgresClient();
        const userResult = await pgClient.query(
            'SELECT id, email, phone, first_name, last_name, date_of_birth, gender, profile_image, role, status, is_email_verified, is_phone_verified, created_at, updated_at FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = userResult.rows[0];

        if (user.status !== 'ACTIVE') {
            return res.status(401).json({
                success: false,
                error: 'Account is not active'
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.first_name,
            lastName: user.last_name,
            dateOfBirth: user.date_of_birth,
            gender: user.gender,
            profileImage: user.profile_image,
            role: user.role,
            status: user.status,
            isEmailVerified: user.is_email_verified,
            isPhoneVerified: user.is_phone_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        next();
    } catch (error) {
        logger.error('Authentication error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }

        next();
    };
};

export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    if (!req.user.isEmailVerified) {
        return res.status(403).json({
            success: false,
            error: 'Email verification required'
        });
    }

    next();
};

export const requirePhoneVerification = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    if (!req.user.isPhoneVerified) {
        return res.status(403).json({
            success: false,
            error: 'Phone verification required'
        });
    }

    next();
};

// Rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
