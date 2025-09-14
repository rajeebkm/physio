import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../config/logger';

// General API rate limiting
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path
        });
        res.status(429).json({
            success: false,
            error: 'Too many requests from this IP, please try again later'
        });
    }
});

// Authentication rate limiting (stricter)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        logger.warn('Auth rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
            body: req.body
        });
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts, please try again later'
        });
    }
});

// Password reset rate limiting (very strict)
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 password reset requests per hour
    message: {
        success: false,
        error: 'Too many password reset attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        logger.warn('Password reset rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            email: req.body.email
        });
        res.status(429).json({
            success: false,
            error: 'Too many password reset attempts, please try again later'
        });
    }
});

// File upload rate limiting
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 uploads per hour
    message: {
        success: false,
        error: 'Too many file uploads, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        logger.warn('Upload rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path
        });
        res.status(429).json({
            success: false,
            error: 'Too many file uploads, please try again later'
        });
    }
});

// Appointment booking rate limiting
export const appointmentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 appointment bookings per hour
    message: {
        success: false,
        error: 'Too many appointment bookings, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        logger.warn('Appointment rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id,
            path: req.path
        });
        res.status(429).json({
            success: false,
            error: 'Too many appointment bookings, please try again later'
        });
    }
});
