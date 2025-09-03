import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import RefreshToken from '../models/token.model';
import {
    ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION,
    RESET_TOKEN_SECRET, RESET_TOKEN_EXPIRATION,
    AccountVerification_TOKEN_SECRET,
    AccountVerification_TOKEN_EXPIRATION
} from '../config/dotenvx';

class JWTService {

    //*** User Auth Tokens
    static signAccessToken(payload: object): string {
        return jwt.sign(payload, (ACCESS_TOKEN_SECRET as string), { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions);
    }

    static signRefreshToken(payload: object): string {
        return jwt.sign(payload, (REFRESH_TOKEN_SECRET as string), { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions);
    }

    static verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, (ACCESS_TOKEN_SECRET as string)) as JwtPayload;
    }

    static verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, (REFRESH_TOKEN_SECRET as string)) as JwtPayload;
    }

    //*** for password reset tokens
    static signResetToken(payload: object): string {
        return jwt.sign(payload, (RESET_TOKEN_SECRET as string), { expiresIn: RESET_TOKEN_EXPIRATION } as SignOptions);
    }

    static verifyResetToken(token: string): JwtPayload {
        return jwt.verify(token, (RESET_TOKEN_SECRET as string)) as JwtPayload;
    }

    //*** for Account Verification tokens
    static signAccountVerificationToken(payload: object): string {
        return jwt.sign(payload, (AccountVerification_TOKEN_SECRET as string), { expiresIn: AccountVerification_TOKEN_EXPIRATION } as SignOptions);
    }
    static verifyAccountVerificationToken(token: string): JwtPayload {
        return jwt.verify(token, (AccountVerification_TOKEN_SECRET as string)) as JwtPayload;
    }

    static async storeRefreshToken(userId: string, token: string): Promise<void> {
        try {
            const newRefreshToken = new RefreshToken({ userId, token });
            await newRefreshToken.save();
        } catch (error) {
            console.error('Error storing refresh token:', error);
        }
    }

}


export default JWTService;