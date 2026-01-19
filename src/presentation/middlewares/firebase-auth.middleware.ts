import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../../infrastructure/config/firebase.config';

export const firebaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Option A: Strict Mode - 401 Unauthorized
        res.status(401).json({ message: 'Missing or invalid token' });
        return;

        // Option B: Lazy Mode - Proceed without user info (for public/guest access?)
        // Recommended to use Strict Mode for "My Expenses" logic.
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        // Attach user info to request (Custom property, careful with Types)
        (req as any).user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture
        };

        next();
    } catch (error) {
        console.error('Firebase Token Verification Failed:', error);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
