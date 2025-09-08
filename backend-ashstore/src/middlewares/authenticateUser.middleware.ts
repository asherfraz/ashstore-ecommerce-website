import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import JWTService from "../services/JWT.service";
import { IUser } from "../types/user.types";

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    try {
        if (!accessToken && !refreshToken) {
            return next({ status: 401, message: 'Authentication required' });
        }

        let user: IUser | null = null;

        // First, try to verify the access token
        if (accessToken) {
            const decoded = JWTService.verifyAccessToken(accessToken);
            user = await User.findById<IUser>(decoded.userId);

            if (user) {
                // @ts-ignore - We'll extend the Request type to include user
                req.user = user;
                return next();
            }
        }

        // If access token is invalid/expired, try to refresh using the refresh token
        if (refreshToken) {
            const decodedRefresh = JWTService.verifyRefreshToken(refreshToken);
            user = await User.findById<IUser>(decodedRefresh.userId);

            if (user) {
                // @ts-ignore - We'll extend the Request type to include user
                req.user = user;
                return next();
            }
        }


        if (!user) {
            // Clear invalid tokens
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return next({ status: 401, message: 'User not found' });
        }

        // If we reach here, no valid tokens were provided
        return next({ status: 401, message: 'Authentication required' });

    } catch (error: any) {
        console.error(`[Auth Error] ${error.message}`);
        return next({ status: 401, message: 'Unauthorized access!' });
    }
};

export default authenticateUser;
