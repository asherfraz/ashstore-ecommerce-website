import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import JWTService from "../services/JWT.service";
import { IUser } from "../types/user.types";

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    try {
        if (!accessToken && !refreshToken) {
            return next({ status: 401, message: 'No tokens provided' });
        }

        const decoded = JWTService.verifyAccessToken(accessToken);
        const user = await User.findById<IUser>(decoded.userId);

        if (!user) {
            return next({ status: 401, message: 'User not found!' });
        }

        // @ts-ignore
        req.user = user;
        next();

    } catch (error: any) {
        console.error(`[Auth Error] ${error.message}`);
        next({ status: 401, message: 'Unauthorized access!' });
    }
};

export default authenticateUser;
