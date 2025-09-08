import { CreditCard } from 'lucide-react';
import { z } from "zod";

// Separate field validators
export const firstName = z.string().min(3, "First name is required").max(20, "First name must be at most 20 characters").trim();

export const lastName = z.string().min(3, "Last name is required").max(20, "Last name must be at most 20 characters").trim();

export const username = z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").trim();

export const email = z.string().email("Invalid email address").trim();

export const password = z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    .min(8, "Password must be at least 8 characters")
    .max(24, "Password must be at most 24 characters")
    .trim();


export const userType = z
    .enum(["buyer", "seller", "both", "admin"])
    .refine((val) => val, {
        message: "Select a user type",
    });



export const phone = z.string().trim().regex(/^[0-9+\-() ]{7,20}$/, {
    message: 'Invalid phone number format',
});

export const addressSchema = z.object({
    addressLine1: z.string().min(1, "Address line 1 is required").max(100),
    addressLine2: z.string().max(100).optional().or(z.literal('')),
    city: z.string().min(1, "City is required").max(50),
    stateProvince: z.string().min(1, "State/Province is required").max(50).optional().or(z.literal('')),
    postalCode: z.string().min(1, "Postal Code is required").max(20).optional().or(z.literal('')),
    country: z.string().min(1, "Country is required").max(50).default("PK"),
    // Uncomment if you want phone validation
    // phoneNumber: z.string().regex(/^[0-9+\-() ]{7,20}$/, {
    //   message: 'Invalid phone number',
    // }),
    isDefault: z.boolean().default(false),
});


export const paymentMethodSchema = z.object({
    type: z.enum(['card', 'easypaisa', 'jazzcash']),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    cvv: z.string().optional().or(z.literal('')),
    phoneNumber: z.string().optional(),
    transactionId: z.string().optional().or(z.literal('')),
    isDefault: z.boolean().default(false),
}).superRefine((data, ctx) => {
    if (data.type === 'card') {
        if (!data.cardNumber) {
            ctx.addIssue({
                path: ['cardNumber'],
                code: z.ZodIssueCode.custom,
                message: 'Card number is required for card payments',
            });
        } else if (!/^\d{13,19}$/.test(data.cardNumber.replace(/\s+/g, ''))) {
            ctx.addIssue({
                path: ['cardNumber'],
                code: z.ZodIssueCode.custom,
                message: 'Invalid card number format',
            });
        }

        if (!data.expirationDate) {
            ctx.addIssue({
                path: ['expirationDate'],
                code: z.ZodIssueCode.custom,
                message: 'Expiration date is required for card payments',
            });
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expirationDate)) {
            ctx.addIssue({
                path: ['expirationDate'],
                code: z.ZodIssueCode.custom,
                message: 'Expiration date must be in MM/YY format',
            });
        }

        if (!data.cvv) {
            ctx.addIssue({
                path: ['cvv'],
                code: z.ZodIssueCode.custom,
                message: 'CVV is required for card payments',
            });
        } else if (!/^\d{3,4}$/.test(data.cvv)) {
            ctx.addIssue({
                path: ['cvv'],
                code: z.ZodIssueCode.custom,
                message: 'CVV must be 3 or 4 digits',
            });
        }
    }

    if (data.type === 'easypaisa' || data.type === 'jazzcash') {
        if (!data.phoneNumber) {
            ctx.addIssue({
                path: ['phoneNumber'],
                code: z.ZodIssueCode.custom,
                message: 'Phone number is required for Easypaisa or JazzCash',
            });
        } else if (!/^03\d{9}$/.test(data.phoneNumber)) {
            ctx.addIssue({
                path: ['phoneNumber'],
                code: z.ZodIssueCode.custom,
                message: 'Phone number must start with 03 and be 11 digits long',
            });
        }
    }
});


export const identifier = z
    .string()
    .min(1, "Email or Username is required")
    .refine(
        (val) =>
            // Check if it's a valid email
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
            // Check if it's a valid username
            /^[a-zA-Z0-9_]{3,}$/.test(val),
        "Enter a valid email or username"
    ).trim();


// User validation schema objects

export const registerSchema = z.object({
    firstName, lastName, username, email, password, userType
});
export const loginSchema = z.object({
    identifier, password
});
export const forgotPasswordSchema = z.object({
    identifier
});

export const resetPasswordSchema = z.object({
    newPassword: password,
    confirmPassword: z.string() // Start with string validation
})
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            message: "Confirm Password must match!",
            path: ["confirmPassword"], // Path where error appears
        }
    );

export const profileUpdateSchema = z.object({
    firstName, lastName, phone,
});