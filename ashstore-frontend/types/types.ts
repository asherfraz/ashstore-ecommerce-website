

export interface BackendResponse {
    data: {
        success: boolean;
        message: string;
        user: IUser;
        auth: boolean,
        // if 2fa enabled
        userId?: string
    };
    response?: {
        data: {
            success: boolean;
            message: string;
        }
    }
}

export interface IUser {
    _id: string;
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
    wishlist: [IProduct],
    orders: [IOrder],
    createdAt: Date;
    updatedAt: Date;
}

// Address Schema & Type
export interface IAddress {
    _id: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
}

// Payment Method Schema & Type
export interface IPaymentMethod {
    _id: string;
    type: "card" | "easypaisa" | "jazzcash";
    cardNumber?: string;
    expirationDate?: string;
    cvv?: string;
    transactionId?: string;
    phoneNumber?: string;
    isDefault?: boolean;
}

////////////////** Product **//////////////////
export interface IProductVariant {
    size: string;
    color: string;
    stock: number;
    sku: string; // Serial number for this specific variant
}

export interface IProductReview {
    userId: string;
    rating: number;
    comment: string;
    likes: number;
    dislikes: number;
    createdAt: Date;
    replies: Array<{
        userId: string;
        comment: string;
        createdAt: Date;
    }>;
}

export interface IProduct {
    // product main details
    _id: string;
    psr: string;
    title: string;
    slug: string; // slug means URL-friendly version of the title
    images: string[]; // Array of image URLs
    brand: string;
    category: string;
    description: string;
    keyFeatures: string[];
    // pricing details
    basePrice: number;
    salePrice: number;
    onSale: boolean;
    discount: number;
    tax: number;
    totalStock: number;
    // other details
    variants: IProductVariant[];
    reviews: IProductReview[];
    averageRating: number;
    totalReviews: number;
    isActive: boolean;
    // user details
    seller: string;
    status: string;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}


////////////////** Order **//////////////////

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

export interface IOrder {
    _id: string;
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

////////////////** Journal **//////////////////

export interface IJournalEntry {
    title: string;
    content: string;
    author: string; // Reference to User
    category: string;
    tags: string[];
    images: string[];
    isPublished: boolean;
    publishDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IJournal {
    entries: IJournalEntry[];
    slug: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
