import { IAddress, IPaymentMethod, IUser } from "@/types";
import mongoose, { Schema } from "mongoose";



const AddressSchema = new Schema<IAddress>({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    stateProvince: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "Pakistan" },
    // phoneNumber: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
}, { _id: false });


const PaymentMethodSchema = new Schema<IPaymentMethod>({
    type: { type: String, enum: ["card", "easypaisa", "jazzcash"], required: true },
    cardNumber: { type: String },
    expirationDate: { type: String },
    cvv: { type: String },
    phoneNumber: { type: String },
    transactionId: { type: String },
    isDefault: { type: Boolean, default: false },
}, { _id: false });


const UserSchema = new Schema<IUser>(
    {
        firstName: { type: String },
        lastName: { type: String },
        name: { type: String }, // Will be auto-filled
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        userType: {
            type: String,
            enum: ["buyer", "seller", "both", "admin"],
            default: "buyer",
        },
        avatar: {
            type: String,
            default: function (): string {
                // @ts-ignore
                return `https://avatar.iran.liara.run/username?username=${this.firstName}+${this.lastName}`;
            },
        },
        registerThrough: { type: String, enum: ["google", "email"], default: "email" },
        phone: { type: String },
        isAdmin: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        // 2FA
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorCode: { type: String },
        twoFactorExpiresAt: { type: Date },
        twoFactorAttempts: { type: Number, default: 0 },

        addresses: [AddressSchema],
        paymentMethods: [PaymentMethodSchema],
        wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    { timestamps: true }
);


// Auto-fill 'name' before saving
// review name on update
UserSchema.pre<IUser>("save", function (next) {
    // Auto-fill 'name' if not provided
    if (!this.name) {
        this.name = `${this.firstName} ${this.lastName}`;
    }
    // if admin => isAdmin true
    if (this.userType === "admin") {
        this.isAdmin = true;
    } else {
        this.isAdmin = false;
    }
    next();
});

// Auto-fill 'name' on update
UserSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate() as any;
    if (update) {
        if ((update.firstName || update.lastName) && !update.name) {
            // If firstName or lastName is being updated, update name as well
            const firstName = update.firstName ?? this.getQuery().firstName;
            const lastName = update.lastName ?? this.getQuery().lastName;
            update.name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
        }
        if (update.userType === "admin") {
            update.isAdmin = true;
        } else {
            update.isAdmin = false;
        }
    }
    next();
});


const UserModel = mongoose.models.User || mongoose.model("User", UserSchema, "users");

export default UserModel;