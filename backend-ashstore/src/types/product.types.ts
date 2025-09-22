import { Document, Types } from "mongoose";

export interface IProductVariant {
    _id?: Types.ObjectId;
    size: string;
    color: string;
    stock: number;
    sku: string; // Serial number for this specific variant
}

export interface IProductReview {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    likes: number;
    dislikes: number;
    replies: Array<{
        userId: Types.ObjectId;
        comment: string;
        createdAt: Date;
    }>;
}

export interface IProduct extends Document {
    _id: Types.ObjectId;
    // product main details
    psr: string;
    title: string;
    slug: string; // slug means URL-friendly version of the title
    images: string[]; // Array of image URLs
    brand: string;
    category: string[];
    description: string;
    keyFeatures: string[];
    // pricing details
    basePrice: number;
    salePrice: number;
    onSale: boolean;
    discount: number;
    saleTax: number;
    totalStock: number;
    // other details
    variants: IProductVariant[];
    reviews: IProductReview[];
    totalReviews: number;
    relatedProducts: Types.ObjectId[];
    averageRating: number;
    onFeatured: boolean;
    isActive: boolean;
    // user details
    seller: Types.ObjectId;
    status: string;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}
