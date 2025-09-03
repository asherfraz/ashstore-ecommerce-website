import { Schema, model } from "mongoose";
import { IProduct, IProductVariant, IProductReview } from "@/types/product.types";

const ProductVariantSchema = new Schema<IProductVariant>({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true } // sku means Stock Keeping Unit
});

const ProductReviewSchema = new Schema<IProductReview>({
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    replies: [{
        userId: { type: String, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

const ProductSchema = new Schema<IProduct>({
    // product main details
    psr: { type: String, required: true, unique: true }, // product serial number
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // slug means URL-friendly version of the title
    images: [{ type: String, required: true }],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    keyFeatures: [{ type: String }],
    // pricing details
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    discount: { type: Number },
    onSale: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    // other details
    variants: [ProductVariantSchema],
    reviews: [ProductReviewSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // user details
    seller: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    status: {
        type: String,
        enum: ["active", "draft", "outOfStock"],
        default: "draft"
    }
}, {
    timestamps: true
});

// Indexes
ProductSchema.index({ title: "text", brand: "text", category: "text" });
ProductSchema.index({ "variants.sku": 1 });
ProductSchema.index({ isActive: 1 });

const Product = model<IProduct>("Product", ProductSchema);
export default Product;
