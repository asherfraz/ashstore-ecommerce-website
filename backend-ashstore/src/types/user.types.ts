import { Document, Types } from "mongoose";

// Address Schema & Type
export interface IAddress extends Document {
    // _id?: Types.ObjectId;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country?: string;
    // phoneNumber: string;
    isDefault?: boolean;
}

// Payment Method Schema & Type
export interface IPaymentMethod extends Document {
    // _id?: Types.ObjectId;
    type: "card" | "easypaisa" | "jazzcash";
    cardNumber?: string;
    expirationDate?: string;
    cvv?: string;
    phoneNumber?: string;
    transactionId?: string;
    isDefault?: boolean;
}

// user schema
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    name?: string;
    username: string;
    email: string;
    password: string;
    userType: "buyer" | "seller" | "both" | "admin";
    avatar?: string;
    registerThrough: "google" | "email";
    phone?: string;
    isAdmin: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    twoFactorEnabled: boolean;
    twoFactorCode?: string;
    twoFactorExpiresAt?: Date;
    twoFactorAttempts: number;
    addresses: IAddress[];
    paymentMethods: IPaymentMethod[];
    wishlist: Types.ObjectId[];
    orders: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}