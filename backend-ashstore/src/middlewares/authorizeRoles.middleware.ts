import { AuthenticatedRequest } from '@/types/express';
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req?.user) {
            return next({
                success: false,
                status: 401,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req?.user?.userType)) {
            return next({
                success: false,
                status: 403,
                // message: `Access denied. Required roles: ${roles.join(', ')}`
                message: `Access denied. You are not a Seller!`
            });
        }

        next();
    };
};