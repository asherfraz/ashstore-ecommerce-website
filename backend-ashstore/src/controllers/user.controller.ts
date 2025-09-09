import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { RefreshToken } from "../models";
import { IRefreshToken } from "../models/token.model";
import { BCRYPT_SALT_ROUNDS, FRONTEND_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV } from '../config/dotenvx';
import bcrypt from 'bcrypt';
import JWTService from '../services/JWT.service';
import hasBlankPassword from '../middlewares/hasBlankPassword';
import { validateAddressUpdateSchema, validateLogin, validateNewsletterSubscription, validatePassword, validatePaymentMethodSchema, validateRegistration, validateUpdateUser, validateUserOTP } from "../validators/user.validator";
import { tryCatch } from "../utils/tryCatch";
import { IUser } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { sendAccountVerificationEmail, sendAddressAddedEmail, sendLoginNotificationEmail, sendPasswordResetEmail, sendPaymentMethodAddedEmail, sendTwoFactorAuthOTPEmail, sendWelcomeEmail } from "./email.controller";
import { OAuth2Client } from "google-auth-library";
import { getCurrentReqLocation } from "../services/getCurrentReqLocation";
import { generateTwoFactorOTP } from "../services/otp.service";
import NewsletterSubscriptionModel from "../models/newsletter.model";



const oAuth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage' // Required for code exchange
);

const isProduction = NODE_ENV === 'production';

const UserController = {
    createUserUsingEmail: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        console.log(">>>:\tCreating User with Email!");

        const { firstName, lastName, username, email, password, userType } = req.body;

        // validate required fields
        const { error } = validateRegistration(req.body);
        if (error) {
            return next(error);
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            // 409 Conflict error
            return next({ status: 409, message: 'User already exists!' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, Number(BCRYPT_SALT_ROUNDS));

        // Create new user & Generate JWT token
        let accessToken, refreshToken;
        let newUser: IUser;

        try {
            newUser = new User({
                firstName, lastName, username, email,
                password: hashedPassword,
                userType
            });

            accessToken = JWTService.signAccessToken({ userId: newUser._id });
            refreshToken = JWTService.signRefreshToken({ userId: newUser._id });

            // Save the new user to the database
            await newUser.save();


            // Store the refresh token in the database
            await JWTService.storeRefreshToken((newUser._id).toString(), refreshToken);

        } catch (error) {
            console.error('Error creating user:', error);
            return next({ status: 500, message: 'Internal Server Error' });
        }

        // Set cookies for access and refresh tokens
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction, // Only send over HTTPS in production
            maxAge: 3600 * 1000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 3600 * 1000 * 24 * 7, // 7 days
        });


        // generate verification link
        const token = JWTService.signAccountVerificationToken({ newUser });
        const accountVerificationLink = `${FRONTEND_URL}/auth/verify-account/${newUser._id}/${token}`;
        const locationData = await getCurrentReqLocation(1, req);

        // Send welcome email
        sendWelcomeEmail(newUser);
        sendAccountVerificationEmail(newUser, accountVerificationLink, locationData);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            auth: true,
            user: newUser
        });
    }),

    // Updated Google authentication method
    authUserUsingGoogle: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        console.log(">>>:\tAuthenticating User with Google!");

        const { code } = req.body;

        if (!code) {
            return next({ status: 400, message: 'Authorization code is required' });
        }



        try {
            // Exchange code for tokens
            const { tokens } = await oAuth2Client.getToken(code);
            let accessToken = tokens.access_token;
            const idToken = tokens.id_token;

            if (!idToken) {
                return next({ status: 401, message: 'Google authentication failed' });
            }

            // Verify the ID token
            const ticket = await oAuth2Client.verifyIdToken({
                idToken: idToken,
                audience: GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();

            if (!payload) {
                return next({ status: 401, message: 'Invalid Google token' });
            }

            const { given_name, family_name, email, name, picture, email_verified } = payload;

            // console.log("Google User Info:", payload);

            // Check if user already exists
            const existingUser = await User.findOne<IUser>({ email });

            if (existingUser) {
                // User already exists, generate JWT tokens
                let accessToken = JWTService.signAccessToken({ userId: existingUser._id });
                const refreshToken = JWTService.signRefreshToken({ userId: existingUser._id });

                // Store the refresh token in the database
                try {
                    await RefreshToken.updateOne<IRefreshToken>(
                        { userId: existingUser._id },
                        { token: refreshToken },
                        { upsert: true }
                    );
                } catch (error) {
                    console.error('>>: GoogleAuth - Error storing refresh token:', error);
                    return next({ status: 500, message: 'Internal server error' });
                }

                // Set cookies for access and refresh tokens
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    sameSite: isProduction ? 'none' : 'lax',
                    secure: isProduction, // Only send over HTTPS in production
                    maxAge: 3600 * 1000, // 1 hour
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: isProduction ? 'none' : 'lax',
                    secure: isProduction,
                    maxAge: 3600 * 1000 * 24 * 7, // 7 days
                });

                // Send login notification email
                const location = await getCurrentReqLocation(1, req);
                sendLoginNotificationEmail(existingUser, location);

                return res.status(200).json({
                    success: true,
                    message: 'User authenticated successfully',
                    auth: true,
                    user: existingUser
                });
            }

            // Create new user if doesn't exist
            const username = email?.split('@')[0];
            const newUser = new User({
                firstName: given_name || '',
                lastName: family_name || '',
                name: name || '',
                username,
                email,
                avatar: picture,
                isVerified: email_verified,
                password: "",
                userType: "both",
                isAdmin: false,
                registerThrough: "google",
            });

            // Generate JWT tokens
            accessToken = JWTService.signAccessToken({ userId: newUser._id });
            const refreshToken = JWTService.signRefreshToken({ userId: newUser._id });

            // Save user to database
            await newUser.save();

            // Store the refresh token in the database
            await JWTService.storeRefreshToken(newUser._id, refreshToken);

            // Set cookies for access and refresh tokens
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction, // Only send over HTTPS in production
                maxAge: 3600 * 1000, // 1 hour
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction,
                maxAge: 3600 * 1000 * 24 * 7, // 7 days
            });

            // Send welcome email
            sendWelcomeEmail(newUser);

            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                auth: true,
                user: newUser
            });

        } catch (error) {
            console.error('Google authentication error:', error);
            return next({ status: 401, message: 'Google authentication failed' });
        }
    }),

    loginUser: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { username, email, password }:
            { username: string, email: string, password: string } = req.body;

        // Validate required fields
        const { error } = validateLogin(req.body);
        if (error) {
            return next(error);
        }

        // Check if user exists
        const user = await User.findOne({
            $or: [{ username }, { email }]
        }).select('+password'); // Include password in the query
        if (!user) {
            return next({ status: 401, message: 'Invalid credentials' });
        }

        // If user registered through Google, do not allow login with password
        if (user.registerThrough === 'google' && user.password === "") {
            return next({ status: 401, message: 'Please use Google Sign-In to access your account' });
        }

        if (!password || !user.password) {
            return next({ status: 400, message: 'Password is required' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            // 401 Unauthorized
            return next({ status: 401, message: 'Invalid password!' });
        }

        // Exclude password from user object
        // user.password = undefined;


        // Check if email is verified
        if (!user.isVerified) {
            // Optionally resend verification email
            return next({
                status: 403,
                message: 'Please verify your email address before logging in'
            });
        }

        // - if two factor auth is enabled
        if (user.twoFactorEnabled) {
            const otpResult = await generateTwoFactorOTP(user);

            if (!otpResult.success) {
                return next({ status: 400, message: otpResult.message });
            }

            return res.status(200).json({
                success: true,
                message: "OTP sent! Please verify to complete login.",
                userId: user._id,
            });

        }

        // Generate JWT tokens
        const accessToken: string = JWTService.signAccessToken({ userId: user._id });
        const refreshToken: string = JWTService.signRefreshToken({ userId: user._id });

        // Store the refresh token in the database
        try {
            await RefreshToken.updateOne<IRefreshToken>(
                { userId: user._id },
                { token: refreshToken },
                { upsert: true } // Create a new document if it doesn't exist
            )
        } catch (error) {
            console.error('Error storing refresh token:', error);
            return next();
        }


        // Set cookies for access and refresh tokens
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction, // Only send over HTTPS in production
            maxAge: 3600 * 1000, // 1 hour

        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 3600 * 1000 * 24 * 7, // 7 days
            priority: 'high',
        });



        // Exclude password from user object
        user.password = undefined;

        // - if 2fa is not enabled just login and send account verification email

        //*** Send login notification email
        const location = await getCurrentReqLocation(1, req);
        sendLoginNotificationEmail(user, location);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            auth: true,
            user
        });
    }),
    logoutUser: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return next({ status: 400, message: 'No User Logged In!' });
        }

        // Verify the refresh token and Delete it
        try {
            await RefreshToken.deleteOne({ token: refreshToken });
        } catch (error) {
            console.error('Error deleting refresh token:', error);
            return next();
        }

        // Clear cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'none', // Allow cross-site requests
            secure: true, // Uncomment this line if using HTTPS in production
            maxAge: 0
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none', // Allow cross-site requests
            secure: true, // Uncomment this line if using HTTPS in production
            maxAge: 0
        });


        return res.status(200).json({
            success: true,
            message: 'Logout successful',
            auth: false
        });
    }),
    refreshUser: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        // 1. get refreshToken from cookies
        // 2. verify refreshToken
        // 3. generate new tokens
        // 4. update db, return response
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return next({ status: 400, message: 'No User Logged In!' });
        }

        // Verify the refresh token
        const payload: JwtPayload = JWTService.verifyRefreshToken(refreshToken);
        if (!payload) {
            return next({ status: 401, message: 'Invalid refresh token!' });
        }

        // Generate new access and refresh tokens
        const newAccessToken: string = JWTService.signAccessToken({ userId: payload.userId });
        const newRefreshToken: string = JWTService.signRefreshToken({ userId: payload.userId });

        // Update the refresh token in the database
        await RefreshToken.updateOne<IRefreshToken>(
            { userId: payload.userId },
            { token: newRefreshToken },
            { upsert: true } // Create a new document if it doesn't exist
        );

        // Set cookies for new tokens
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction, // Only send over HTTPS in production
            maxAge: 3600 * 1000, // 1 hour
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 3600 * 1000 * 24 * 7, // 7 days
        });

        const user = await User.findById<IUser>(payload.userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        return res.status(200).json({
            success: true,
            message: 'Tokens refreshed successfully',
            auth: true,
            user
        });
    }),

    // *** User Management Functions ***
    getUserById: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const user = await User.findById<IUser>(userId);

        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }
        return res.status(200).json({ success: true, message: 'User fetched successfully', user });
    }),
    hasNoPassword: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const hasNoPassword = await hasBlankPassword(userId);

        if (hasNoPassword === null) {
            return next({ status: 404, message: 'User not found!' });
        }

        return res.status(200).json({ hasNoPassword });
    }),
    changePassword: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        // check if user has blank password
        const userId = req.params.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const hasNoPassword = await hasBlankPassword(userId);

        if (hasNoPassword === null) {
            return next({ status: 404, message: 'User not found!' });
        }
        // validate new password
        const { error } = validatePassword(req.body);
        if (error) {
            return next(error);
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, Number(BCRYPT_SALT_ROUNDS));
        const newPasswordsMatched = newPassword === confirmPassword;


        //** New Password for registerThrough Google User
        if (hasNoPassword && newPasswordsMatched) {
            // if user has blank password, update with new password
            // Update the user's password
            user.password = newHashedPassword;
            await user.save();
            return res.status(200).json({ success: true, message: 'Password changed successfully' });

        }
        // ** Existing User Password
        else if (!hasNoPassword && newPasswordsMatched) {
            // if user has no blank password, match with old password

            // if user old password and new password are same
            if (oldPassword === newPassword) {
                return next({ status: 400, message: 'New password must be different from old password!' });
            }

            // Check if old password matches
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return next({ status: 401, message: 'Invalid old password!' });
            }
            // Update the user's password
            user.password = newHashedPassword;
            await user.save();

            return res.status(200).json({ success: true, message: 'Password changed successfully' });
        }
        else if (!newPasswordsMatched) {
            return next({ status: 404, message: 'New password and confirm password do not match!' });
        }

        // TODO: Email Service - Send password changed notification email
        // sendPasswordChangedNotificationEmail(user);
    }),
    resetPasswordEmail: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { username, email } = req.body;
        const user = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // genereate reset password link
        const resetToken = JWTService.signResetToken({ userId: user._id });
        const resetLink = `${FRONTEND_URL}/auth/reset-password/${resetToken}`;

        // TODO: Email Service - Send password reset email
        sendPasswordResetEmail(user, resetLink);

        return res.status(200).json({ success: true, message: 'Reset password email sent successfully!' });
    }),
    resetPassword: tryCatch(async (req: Request, res: Response, next: NextFunction) => {

        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        // TODO: Add password validation
        const { error } = validatePassword(req.body);
        if (error) {
            return next(error);
        }

        const newPasswordsMatched = newPassword === confirmPassword;
        if (!newPasswordsMatched) {
            return next({ status: 404, message: 'New password and confirm password do not match!' });
        }

        // Verify the reset token
        const isValidToken = JWTService.verifyResetToken(token);
        if (!isValidToken) {
            return next({ status: 401, message: 'Invalid or expired reset token!' });
        }

        // Find the user by ID
        const user = await User.findById(isValidToken.userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, Number(BCRYPT_SALT_ROUNDS));
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ suc0cess: true, message: 'Password reset successfully' });
    }),
    updateUser: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const updates = req.body;

        // Validate required fields
        const { error } = validateUpdateUser(updates);
        if (error) {
            return next(error);
        }

        // Find user and update
        if (updates) {
            // remove sensitive fields from updates
            delete updates.username;
            delete updates.email;
            delete updates.userType;
            delete updates.registerThrough;
            delete updates.password;
            delete updates.isAdmin;
            delete updates.isVerified;
            delete updates.isBlocked;
            delete updates.twoFactorEnabled;
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Return updated user
        return res.status(200).json({ success: true, message: 'User updated successfully', user, auth: true });

    }),


    // User Address Management Api's
    addUserAddress: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const newAddress = req.body;

        // Validate address data using Joi
        const { error } = validateAddressUpdateSchema(req.body);
        if (error) {
            return next(error);
        }

        // Handle if Addresses Array is empty
        // Find user
        const user = await User.findById<IUser>(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Check if user already has 5 addresses
        if (user.addresses.length >= 5) {
            return next({
                status: 400,
                message: 'Maximum limit of 5 addresses reached. Please delete an existing address before adding a new one.'
            });
        }

        // Handle default address logic
        if (newAddress.isDefault) {
            // Set all other addresses to non-default
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Add the new address
        user.addresses.push(newAddress);

        // Save the user
        await user.save();

        // sending email for new address added
        const location = await getCurrentReqLocation(1, req);

        sendAddressAddedEmail(user.name as string, user.email as string, location, newAddress);

        // Return updated user
        return res.status(200).json({
            success: true,
            message: 'Address added successfully',
            user,
            auth: true
        });
    }),
    updateUserAddress: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const addressId = req.params.addressId;
        const updates = req.body;

        // Validate address data using Joi
        const { error } = validateAddressUpdateSchema(req.body);
        if (error) {
            return next(error);
        }

        // Find user
        const user = await User.findById<IUser>(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Check if user already has 5 addresses (for new address creation)
        // This check is more relevant for adding new addresses rather than updating existing ones
        // If you have a separate endpoint for adding addresses, you should add this check there
        if (req.method === 'POST' && user.addresses.length >= 5) {
            return next({
                status: 400,
                message: 'Maximum limit of 5 addresses reached. Please delete an existing address before adding a new one.'
            });
        }

        // Find the address to update
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return next({ status: 404, message: 'Address not found!' });
        }

        // Handle default address logic
        if (updates.isDefault) {
            // Set all other addresses to non-default
            user.addresses.forEach((addr, index) => {
                if (index !== addressIndex) {
                    addr.isDefault = false;
                }
            });
        }

        // Update the address
        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex].toObject(),
            ...updates
        };

        // Save the user
        await user.save();

        // Return updated user
        return res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            user,
            auth: true
        });
    }),
    deleteUserAddress: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const addressId = req.params.addressId;

        // Find user
        const user = await User.findById<IUser>(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Find the address to delete
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return next({ status: 404, message: 'Address not found!' });
        }

        const wasDefault = user.addresses[addressIndex].isDefault;

        // Remove the address
        user.addresses.splice(addressIndex, 1);

        // If we deleted the default address and there are other addresses,
        // set the first address as default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        // Save the user
        await user.save();

        // Return updated user
        return res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            user,
            auth: true
        });
    }),


    // User Address Management Api's
    addUserPaymentMethod: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const newPaymentMethod = req.body;

        // Validate payment method data
        const { error } = validatePaymentMethodSchema(req.body);
        if (error) {
            return next(error);
        }

        // Find user
        const user = await User.findById<IUser>(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Check if user already has 5 payment methods
        if (user.paymentMethods && user.paymentMethods.length >= 5) {
            return next({
                status: 400,
                message: 'Maximum limit of 5 payment methods reached. Please delete an existing payment method before adding a new one.'
            });
        }

        // Handle default payment method logic
        if (newPaymentMethod.isDefault) {
            // Set all other payment methods to non-default
            user.paymentMethods.forEach(pm => {
                pm.isDefault = false;
            });
        }

        // Add the new payment method
        user.paymentMethods.push(newPaymentMethod);

        // Save the user
        await user.save();


        // sending email for new address added
        const location = await getCurrentReqLocation(1, req);

        sendPaymentMethodAddedEmail(user.name as string, user.email as string, location, newPaymentMethod);


        // Return updated user
        return res.status(200).json({
            success: true,
            message: 'Payment method added successfully',
            user,
            auth: true
        });
    }),
    updateUserPaymentMethod: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const paymentId = req.params.paymentId;
        const updates = req.body;

        // Validate payment method data
        const { error } = validatePaymentMethodSchema(req.body);
        if (error) {
            return next(error);
        }

        // Find user
        const user = await User.findById<IUser>(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Find the payment method to update
        const paymentIndex = user.paymentMethods.findIndex(
            pm => pm._id.toString() === paymentId
        );

        if (paymentIndex === -1) {
            return next({ status: 404, message: 'Payment method not found!' });
        }

        // Handle default payment method logic
        if (updates.isDefault) {
            // Set all other payment methods to non-default
            user.paymentMethods.forEach((pm, index) => {
                if (index !== paymentIndex) {
                    pm.isDefault = false;
                }
            });
        }

        // Update the payment method
        user.paymentMethods[paymentIndex] = {
            ...user.paymentMethods[paymentIndex].toObject(),
            ...updates
        };

        // Save the user
        await user.save();

        // Return updated user
        return res.status(200).json({
            success: true,
            message: 'Payment method updated successfully',
            user,
            auth: true
        });
    }),
    deleteUserPaymentMethod: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const paymentId = req.params.paymentId;

        // Find user
        const user = await User.findById<IUser>(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Find the payment method to delete
        const paymentIndex = user.paymentMethods.findIndex(
            pm => pm._id.toString() === paymentId
        );

        if (paymentIndex === -1) {
            return next({ status: 404, message: 'Payment method not found!' });
        }

        const wasDefault = user.paymentMethods[paymentIndex].isDefault;

        // Remove the payment method
        user.paymentMethods.splice(paymentIndex, 1);

        // If we deleted the default payment method and there are other payment methods,
        // set the first payment method as default
        if (wasDefault && user.paymentMethods.length > 0) {
            user.paymentMethods[0].isDefault = true;
        }

        // Save the user
        await user.save();

        // Return updated user
        return res.status(200).json({
            success: true,
            message: 'Payment method deleted successfully',
            user,
            auth: true
        });
    }),

    deleteUser: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        // check if user exists and delete
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }
        // delete its refresh token
        await RefreshToken.deleteOne({ userId: user._id });
        // Clear cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'none', // Allow cross-site requests
            secure: true, // Uncomment this line if using HTTPS in production
            maxAge: 0
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none', // Allow cross-site requests
            secure: true, // Uncomment this line if using HTTPS in production
            maxAge: 0
        });
        // Return success response
        return res.status(200).json({ success: true, message: 'User deleted successfully', auth: false });
    }),

    // *** Advanced Methods for Ecommerce User ***
    enableTwoFactorAuth: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;

        if (!userId) {
            return next({ status: 404, message: 'User not found!' });
        }

        try {
            // Need to fetch the user from DB to save changes
            const dbUser = await User.findById<IUser>(userId);
            if (!dbUser) {
                return next({ status: 404, message: 'User not found!' });
            }

            // if (dbUser.twoFactorEnabled)
            //     dbUser.twoFactorEnabled = false;
            // dbUser.twoFactorEnabled = true;

            dbUser.twoFactorEnabled = !dbUser.twoFactorEnabled;

            await dbUser.save();

            return res.status(200).json({
                success: true,
                message: `Two-factor authentication ${dbUser.twoFactorEnabled ? 'enabled' : 'disabled'}`,
                twoFactorEnabled: dbUser.twoFactorEnabled
            });
        } catch (error) {
            return next({ status: 500, message: 'Internal Server Error' });
        }
    }),
    generateTwoFactorAuthOTP: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id: userId } = req.params;

        if (!userId) {
            return next({ status: 400, message: 'Missing user ID.' });
        }

        // Check if user exists
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return next({ status: 404, message: 'User not found.' });
        }


        const result = await generateTwoFactorOTP(dbUser);
        if (!result.success) {
            return next({ status: 400, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }),
    verifyTwoFactorAuth: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id: userId } = req.params;
        const { otp } = req.body;

        // Validate input
        const { error } = validateUserOTP(req.body);
        if (error) return next(error);

        const dbUser = await User.findById<IUser>(userId);
        if (!dbUser) {
            return next({ status: 404, message: 'User not found!' });
        }

        // OTP not set or missing expiry
        if (!dbUser.twoFactorCode || !dbUser.twoFactorExpiresAt) {
            return next({ status: 400, message: 'No OTP found! Please request a new one.' });
        }

        // Check if user has exceeded allowed attempts
        if (dbUser.twoFactorAttempts >= 4) {
            return next({ status: 429, message: 'Too many failed attempts. Please reset your OTP.' });
        }

        const isExpired = new Date() > dbUser.twoFactorExpiresAt;
        const isIncorrect = dbUser.twoFactorCode !== otp;

        if (isExpired || isIncorrect) {
            dbUser.twoFactorAttempts += 1;
            await dbUser.save();

            return next({
                status: 400,
                message: isExpired
                    ? 'OTP has expired! Please request a new one.'
                    : 'Invalid OTP! Please try again.'
            });
        }

        // Successful verification
        // dbUser.twoFactorAttempts = 0; // reset attempts
        dbUser.twoFactorEnabled = true;
        // dbUser.twoFactorCode = undefined;
        // dbUser.twoFactorExpiresAt = undefined;

        await dbUser.save();

        // Generate tokens
        const accessToken = JWTService.signAccessToken({ userId: dbUser._id });
        const refreshToken = JWTService.signRefreshToken({ userId: dbUser._id });

        try {
            await RefreshToken.updateOne<IRefreshToken>(
                { userId: dbUser._id },
                { token: refreshToken },
                { upsert: true }
            );
        } catch (err) {
            console.error('[ERROR] Storing refresh token:', err);
            return next({ status: 500, message: 'Failed to store refresh token.' });
        }

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction, // Only send over HTTPS in production
            maxAge: 3600 * 1000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 3600 * 1000 * 24 * 7, // 7 days
        });


        // //*** Send login notification email
        const location = await getCurrentReqLocation(1, req);
        sendLoginNotificationEmail(dbUser, location);

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            auth: true,
            user: dbUser
        });
    }),

    resendAccountVerificationEmail: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.params.token;
        const userId = req.params.userId;

        if (!userId) {
            return next({ status: 404, message: 'User token not found!' });
        }


        const expPayload = JWTService.verifyAccountVerificationToken(token);
        if (expPayload) {
            return res.status(200).json({
                success: true,
                message: 'Account verification token is valid!',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        // Generate a new verification token
        const newToken = JWTService.signAccountVerificationToken({ newUser: user });

        // generate verification link
        const locationData = await getCurrentReqLocation(1, req);
        const accountVerificationLink = `${FRONTEND_URL}/auth/verify-account/${user._id}/${newToken}`;

        // Send the verification email
        sendAccountVerificationEmail(user, accountVerificationLink, locationData);

        return res.status(200).json({
            success: true,
            message: 'Account verification email resent successfully!',
        });
    }),

    verifyAccountEmail: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.params.token;

        if (!token) {
            return next({ status: 404, message: 'Account Verification token not found!' });
        }

        // Verify the account verification token
        const verificationPayload = JWTService.verifyAccountVerificationToken(token);
        if (!verificationPayload) {
            return next({ status: 401, message: 'Invalid or expired account verification token!' });
        }

        // Find the user by ID
        const user = await User.findById(verificationPayload.newUser._id);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Account verified successfully!',
        });
    }),

    // Newsletter handling Api
    handleNewsletterSubscription: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { email, subscribedState } = req.body;

        // Validate required fields
        if (!email || typeof subscribedState !== 'boolean') {
            return next({
                status: 400,
                message: 'Email and subscribedState (boolean) are required'
            });
        }

        // Validate email format
        const { error } = validateNewsletterSubscription({ email });
        if (error) {
            return next(error);
        }

        // Check if user exists
        const user = await User.findOne({ email });
        const existingSubscription = await NewsletterSubscriptionModel.findOne({ email });

        if (subscribedState === true) {
            // Handle subscription
            if (existingSubscription) {
                if (existingSubscription.isSubscribed) {
                    return next({ status: 409, message: 'You are already subscribed to our newsletter.' });
                }

                existingSubscription.isSubscribed = true;
                existingSubscription.userId = user?._id || null;
                await existingSubscription.save();
            } else {
                await NewsletterSubscriptionModel.create({
                    email,
                    userId: user?._id || null,
                    isSubscribed: true
                });
            }

            // Update user preference if user exists
            if (user) {
                user.newsletterSubscribed = true;
                await user.save();
            }

            return res.status(200).json({
                success: true,
                message: 'Thank you for subscribing to our newsletter!',
                isSubscribed: true
            });
        } else {
            // Handle unsubscription
            if (!existingSubscription || !existingSubscription.isSubscribed) {
                return next({ status: 404, message: 'You are not subscribed to our newsletter.' });
            }

            existingSubscription.isSubscribed = false;
            await existingSubscription.save();

            // Update user preference if user exists
            if (user) {
                user.newsletterSubscribed = false;
                await user.save();
            }

            return res.status(200).json({
                success: true,
                message: 'You have been unsubscribed from our newsletter.',
                isSubscribed: false
            });
        }
    }),


};




export default UserController;