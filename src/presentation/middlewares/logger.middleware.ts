import { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/logging/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url, body } = req;
    
    // Sanitize body or log only specific fields if necessary
    // For now, logging the entire body as requested, excluding potentially huge fields if needed later
    
    logger.info(`${method} ${url} - Body: ${JSON.stringify(body)}`);
    
    next();
};
