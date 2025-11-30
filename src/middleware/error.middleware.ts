import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logging';

// Custom error class for API errors
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
    ) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// Error handler middleware
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log the error
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Handle ApiError instances
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Handle validation errors (from Joi)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.message
        });
    }

    // Handle other errors
    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};
