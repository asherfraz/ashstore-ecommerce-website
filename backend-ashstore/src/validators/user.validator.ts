import Joi from "joi";

// Registration schema matches User model fields
const registrationSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).trim().required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required',
        'string.min': 'First name must be at least 3 characters long',
        'string.max': 'First name must not exceed 20 characters',
    }),
    lastName: Joi.string().min(3).max(20).trim().required().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required',
        'string.min': 'Last name must be at least 3 characters long',
        'string.max': 'Last name must not exceed 20 characters',
    }),
    username: Joi.string().alphanum().min(3).max(20).required().messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must not exceed 20 characters',
        'string.alphanum': 'Username must only contain letters and numbers',
    }),
    email: Joi.string().email().required().trim().messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).max(24).required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/)
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),
    userType: Joi.string().valid('buyer', 'seller', 'both', 'admin').default('buyer').messages({
        'string.empty': 'User type is required',
    }),
    // below are optional
    registerThrough: Joi.string().valid('google', 'email').default('email'),
    phone: Joi.string().pattern(/^[0-9+\-() ]{7,20}$/).allow('').messages({
        'string.pattern.base': 'Phone must be a valid phone number',
    }).optional(),
    addresses: Joi.array().items(
        Joi.object({
            fullName: Joi.string().min(3).max(50).required(),
            addressLine1: Joi.string().min(3).max(100).required(),
            addressLine2: Joi.string().max(100).allow(''),
            city: Joi.string().min(2).max(50).required(),
            stateProvince: Joi.string().min(2).max(50).required(),
            postalCode: Joi.string().min(3).max(20).required(),
            country: Joi.string().min(2).max(50).default('Pakistan'),
            phoneNumber: Joi.string().pattern(/^[0-9+\-() ]{7,20}$/).required(),
            isDefault: Joi.boolean().default(false),
        })
    ).optional(),
    paymentMethods: Joi.array().items(
        Joi.object({
            type: Joi.string().valid('card', 'easypaisa', 'jazzcash').required(),
            cardNumber: Joi.string().allow(''),
            expirationDate: Joi.string().allow(''),
            cvv: Joi.string().allow(''),
            phoneNumber: Joi.string().allow(''),
            transactionId: Joi.string().allow(''),
            isDefault: Joi.boolean().default(false),
        })
    ).optional(),
});

const loginSchema = Joi.object({

    username: Joi.string().alphanum().min(3).max(20).messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must not exceed 20 characters',
        'string.alphanum': 'Username must only contain letters and numbers',
    }).optional(),
    email: Joi.string().email().required().trim().messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }).optional(),
    password: Joi.string().min(8).max(24).required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/)
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),

});

const updateUserSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).trim(),
    lastName: Joi.string().min(3).max(20).trim(),
    username: Joi.string().alphanum().min(3).max(20),
    email: Joi.string().email().trim(),
    userType: Joi.string().valid('buyer', 'seller', 'both', 'admin'),
    registerThrough: Joi.string().valid('google', 'email'),
    phone: Joi.string().pattern(/^[0-9+\-() ]{7,20}$/).allow(''),
    addresses: Joi.array().items(
        Joi.object({
            addressLine1: Joi.string().min(3).max(100),
            addressLine2: Joi.string().max(100).allow(''),
            city: Joi.string().min(2).max(50),
            stateProvince: Joi.string().min(2).max(50),
            postalCode: Joi.string().min(3).max(20),
            country: Joi.string().min(2).max(50),
            // phoneNumber: Joi.string().pattern(/^[0-9+\-() ]{7,20}$/),
            isDefault: Joi.boolean(),
        })
    ),
    paymentMethods: Joi.array().items(
        Joi.object({
            type: Joi.string().valid('card', 'easypaisa', 'jazzcash'),
            cardNumber: Joi.string().allow(''),
            expirationDate: Joi.string().allow(''),
            cvv: Joi.string().allow(''),
            phoneNumber: Joi.string().allow(''),
            transactionId: Joi.string().allow(''),
            isDefault: Joi.boolean(),
        })
    ),
});

// Joi schema for address validation
const addressUpdateSchema = Joi.object({
    addressLine1: Joi.string().min(3).max(100),
    addressLine2: Joi.string().max(100).allow(''),
    city: Joi.string().min(2).max(50),
    stateProvince: Joi.string().max(50).allow(''),
    postalCode: Joi.string().max(20).allow(''),
    country: Joi.string().min(2).max(50),
    isDefault: Joi.boolean(),
});

// Joi validation schema for payment methods
const paymentMethodSchema = Joi.object({
    type: Joi.string().valid('card', 'easypaisa', 'jazzcash').required(),
    cardNumber: Joi.when('type', {
        is: 'card',
        then: Joi.string().creditCard().required(),
        otherwise: Joi.string().optional().allow('')
    }),
    expirationDate: Joi.when('type', {
        is: 'card',
        then: Joi.string().pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/).required(),
        otherwise: Joi.string().optional().allow('')
    }),
    cvv: Joi.when('type', {
        is: 'card',
        then: Joi.string().pattern(/^[0-9]{3,4}$/).required(),
        otherwise: Joi.string().optional().allow('')
    }),
    phoneNumber: Joi.when('type', {
        is: Joi.valid('easypaisa', 'jazzcash'),
        then: Joi.string().pattern(/^03[0-9]{9}$/).required(),
        otherwise: Joi.string().optional().allow('')
    }),
    transactionId: Joi.string().optional().allow(''),
    isDefault: Joi.boolean().default(false)
});

const passwordSchema = Joi.object({
    oldPassword: Joi.string().min(8).max(24)
        // can be empty if user has no password
        .allow('')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/)
        .messages({
            'string.pattern.base': 'Old password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),

    newPassword: Joi.string().min(8).max(24)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/)
        .messages({
            'string.pattern.base': 'New Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),
    confirmPassword: Joi.string().min(8).max(24)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/)
        .messages({
            'string.pattern.base': 'Confirm Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),
});

const otpSchema = Joi.object({
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
});

const newsletterSubscriptionSchema = Joi.object({
    email: Joi.string().email().required().trim().messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
});


////////////** Above Validation Schemas **////////////////// 

export function validateRegistration(data: Object) {
    return registrationSchema.validate(data, { abortEarly: false });
}

export function validateLogin(data: Object) {
    return loginSchema.validate(data, { abortEarly: false });
}

export function validatePassword(data: Object) {
    return passwordSchema.validate(data, { abortEarly: false });
}

export function validateUpdateUser(data: Object) {
    return updateUserSchema.validate(data, { abortEarly: false });
}
export function validateAddressUpdateSchema(data: Object) {
    return addressUpdateSchema.validate(data, { abortEarly: false });
}
export function validatePaymentMethodSchema(data: Object) {
    return paymentMethodSchema.validate(data, { abortEarly: false });
}
export function validateUserOTP(data: Object) {
    return otpSchema.validate(data, { abortEarly: false });
}

export function validateNewsletterSubscription(data: Object) {
    return newsletterSubscriptionSchema.validate(data, { abortEarly: false });
}