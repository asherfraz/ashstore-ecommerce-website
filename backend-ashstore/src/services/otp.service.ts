import crypto from "crypto";
import { IUser } from "../types/user.types";
import { sendTwoFactorAuthOTPEmail } from "../controllers/email.controller";


interface OTPResult {
    status: number;
    success: boolean;
    message: string;
    expiresAt: Date | null;
}

export async function generateTwoFactorOTP(user: IUser): Promise<OTPResult> {
    if (!user.twoFactorEnabled) {
        return {
            status: 400,
            success: false,
            message: 'Two-factor authentication is not enabled for this user.',
            expiresAt: null,
        };
    }

    // Generate a secure 6-digit OTP
    const buffer = crypto.randomBytes(4);
    const otp = (parseInt(buffer.toString("hex"), 16) % 900000 + 100000).toString();

    const expiryMinutes = 30;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Update user model
    user.twoFactorCode = otp;
    user.twoFactorExpiresAt = expiresAt;
    user.twoFactorAttempts = 0;

    await user.save();

    // Send OTP via email
    try {
        sendTwoFactorAuthOTPEmail(user, otp, expiryMinutes, expiresAt);
        return {
            status: 200,
            success: true,
            message: "OTP sent to your email.",
            expiresAt,
        };
    } catch (err) {
        console.error("Failed to send OTP email:", err);
        return {
            status: 400,
            success: false,
            message: "Failed to send OTP email.",
            expiresAt: null,
        };
    }
}
