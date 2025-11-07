import { IUserProductReview } from "../types/product.types";
import mongoose, { Schema } from "mongoose";


const UserProductReviewSchema = new Schema<IUserProductReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        reviewId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // This refers to the review's ID within the product
        reaction: {
            type: String,
            enum: ["like", "dislike", null],
            default: null
        },
    },
    {
        timestamps: true,
    }
);

// Create a unique index to ensure one user can only have one reaction per review
UserProductReviewSchema.index({ userId: 1, reviewId: 1 }, { unique: true });

const UserProductReview =
    mongoose.models.UserProductReview ||
    mongoose.model<IUserProductReview>("UserProductReview", UserProductReviewSchema, "user_product_reviews");

export default UserProductReview;