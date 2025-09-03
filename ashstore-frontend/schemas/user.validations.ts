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

export const userType = z.enum(["buyer", "seller", "both", "admin"], {
    required_error: "Select a user type",
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