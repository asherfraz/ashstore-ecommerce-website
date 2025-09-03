import { Document, Types } from "mongoose";

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

export interface IProduct extends Document {
    // product main details
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
    seller: Types.ObjectId[];
    status: string;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}
