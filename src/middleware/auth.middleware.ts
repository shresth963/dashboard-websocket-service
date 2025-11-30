import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyMiddleware } from '../types';
import serverConfig from '../config/server.config';

const verifyInternalApiKey: ApiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.path === '/') {
        return next();
    }
    const incomingApiKey = req.headers['x-internal-api-key'];
    
    if (!incomingApiKey) {
        res.status(401).json({
            detail: 'Missing X-Internal-API-Key header'
        });
        return;
    }

    // Generate the expected key using the same method as Python
    const expectedKey = crypto.createHash('sha256')
        .update(serverConfig.INTERNAL_API_SECRET || '')
        .digest('hex');

    // Verify the key
    if (incomingApiKey !== expectedKey) {
        res.status(401).json({
            detail: 'Invalid internal API key'
        });
        return;
    }

    next();
};

export default verifyInternalApiKey; 