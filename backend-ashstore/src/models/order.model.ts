import { Schema, model } from "mongoose";
import { IOrder, IOrderItem, IShippingInformation, IPaymentInformation } from "../types/order.types";

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    title: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String, required: true }
});

const ShippingInformationSchema = new Schema<IShippingInformation>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
});

const PaymentInformationSchema = new Schema<IPaymentInformation>({
    method: { type: String, enum: ["credit_card", "paypal", "other"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], required: true },
    transactionId: { type: String }
});

const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingInfo: ShippingInformationSchema,
    paymentInfo: PaymentInformationSchema,
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date }
}, {
    timestamps: true
});

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
