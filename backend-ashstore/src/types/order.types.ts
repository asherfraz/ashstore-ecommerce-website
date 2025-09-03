import { Document } from "mongoose";

export interface IOrderItem {
    productId: string;
    variantId: string;
    title: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
}

export interface IShippingInformation {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface IPaymentInformation {
    method: "credit_card" | "easypaisa" | "jazzcash" | "other";
    status: "pending" | "completed" | "failed";
    transactionId?: string;
}

export interface IOrder extends Document {
    userId: string;
    orderNumber: string;
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    shippingInfo: IShippingInformation;
    paymentInfo: IPaymentInformation;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
