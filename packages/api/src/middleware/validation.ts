import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import logger from '../config/logger';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.warn('Validation errors:', { errors: errors.array(), body: req.body });

        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(error => ({
                field: error.type === 'field' ? error.path : 'unknown',
                message: error.msg,
                value: error.type === 'field' ? error.value : undefined
            }))
        });
    }

    next();
};

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        handleValidationErrors(req, res, next);
    };
};

// Common validation rules
export const commonValidations = {
    email: (field = 'email') => [
        (req: Request, res: Response, next: NextFunction) => {
            const value = req.body[field];
            if (value && typeof value === 'string') {
                req.body[field] = value.toLowerCase().trim();
            }
            next();
        }
    ],

    phone: (field = 'phone') => [
        (req: Request, res: Response, next: NextFunction) => {
            const value = req.body[field];
            if (value && typeof value === 'string') {
                // Remove all non-digit characters
                req.body[field] = value.replace(/\D/g, '');
            }
            next();
        }
    ],

    trim: (field: string) => [
        (req: Request, res: Response, next: NextFunction) => {
            const value = req.body[field];
            if (value && typeof value === 'string') {
                req.body[field] = value.trim();
            }
            next();
        }
    ]
};
