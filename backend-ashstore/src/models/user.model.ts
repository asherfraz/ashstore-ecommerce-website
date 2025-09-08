import { IAddress, IPaymentMethod, IUser } from "../types";
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
}, { _id: true });


// AddressSchema.pre("save", async function (this: IAddress, next) {
//     try {
//         // Only set as default if this is the first address
//         const user = this.$parent() as IUser;

//         if (user && user.addresses) {
//             // If this is the first address, set it as default
//             if (user.addresses.length === 0) {
//                 this.isDefault = true;
//             } else if (this.isDefault) {
//                 // If this address is being set as default, 
//                 // remove default status from all other addresses
//                 user.addresses.forEach((address: IAddress) => {
//                     if (address._id && this._id && address._id.toString() !== this._id.toString()) {
//                         address.isDefault = false;
//                     }
//                 });
//             }
//         }
//         next();
//     } catch (error) {
//         next(error as Error);
//     }
// });


const PaymentMethodSchema = new Schema<IPaymentMethod>({
    type: { type: String, enum: ["card", "easypaisa", "jazzcash"], required: true },
    cardNumber: { type: String },
    expirationDate: { type: String },
    cvv: { type: String },
    transactionId: { type: String },
    phoneNumber: { type: String },
    isDefault: { type: Boolean, default: false },
}, { _id: true });

PaymentMethodSchema.pre("save", function (next) {
    // If payment method type is "card", clear transactionId and phoneNumber
    if (this.type === "card") {
        this.transactionId = undefined;
        this.phoneNumber = undefined;
    }

    // If type is not card, clear card-related fields
    if (this.type !== "card") {
        this.cardNumber = undefined;
        this.expirationDate = undefined;
        this.cvv = undefined;
    }

    next();
});



// Define the schema without the generic type first, then cast it
// const AddressSchema = new Schema({
//     addressLine1: { type: String, required: true },
//     addressLine2: { type: String },
//     city: { type: String, required: true },
//     stateProvince: { type: String },
//     postalCode: { type: String },
//     country: { type: String, default: "Pakistan" },
//     isDefault: { type: Boolean, default: false },
// }, { _id: true });

// // Same approach for PaymentMethodSchema
// const PaymentMethodSchema = new Schema({
//     type: { type: String, enum: ["card", "easypaisa", "jazzcash"], required: true },
//     cardNumber: { type: String },
//     expirationDate: { type: String },
//     cvv: { type: String },
//     transactionId: { type: String },
//     isDefault: { type: Boolean, default: false },
// }, { _id: true });


// @ts-ignore
const UserSchema = new Schema(
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
        avatar: { type: String },
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


// Auto-fill 'name' and Auto-generate avatar and set admin status before saving
UserSchema.pre("save", function (next) {
    // Auto-fill 'name' if not provided
    if (!this.name && this.firstName && this.lastName) {
        this.name = `${this.firstName} ${this.lastName}`;
    }

    // Auto-generate avatar if not provided
    if (!this.avatar && this.firstName && this.lastName) {
        this.avatar = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(this.firstName + "+" + this.lastName)}`;
    }

    // Set admin status based on userType
    this.isAdmin = this.userType === "admin";

    next();
});

// Auto-fill 'name' and set admin status on update
UserSchema.pre("findOneAndUpdate", function (this: any, next) {
    const update = this.getUpdate() as any;

    if (update) {
        // Update name if firstName or lastName is being updated
        if ((update.$set?.firstName || update.$set?.lastName) && !update.$set?.name) {
            const firstName = update.$set?.firstName;
            const lastName = update.$set?.lastName;
            update.$set.name = `${firstName || ""} ${lastName || ""}`.trim();
        }

        // Set admin status based on userType
        if (update.$set?.userType) {
            update.$set.isAdmin = update.$set.userType === "admin";
        }
    }

    next();
});


const UserModel = mongoose.models.User || mongoose.model("User", UserSchema, "users");

export default UserModel;