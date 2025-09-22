import mongoose, { Schema } from "mongoose";
import { IProduct, IProductVariant, IProductReview } from "../types/product.types";
import slugify from "slugify";
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductVariantSchema = new Schema<IProductVariant>({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 1 },
    sku: { type: String, required: true } // sku means Stock Keeping Unit
}, { _id: true });

const ProductReviewSchema = new Schema<IProductReview>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: [{
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true, _id: true });

const ProductSchema = new Schema<IProduct>({
    // product main details
    psr: { type: String, unique: true }, // product serial number
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // slug means URL-friendly version of the title
    images: [{ type: String, required: true }],
    brand: { type: String, required: true },
    category: {
        type: [String],
        enum: ['Men', 'Women', 'Accessories', 'Men\'s Accessories', 'Women\'s Accessories'],
        required: true
    }, // array of categories ['men','women','accessories']
    description: { type: String, required: true },
    keyFeatures: [{ type: String }],  // can save upto 10
    // pricing details
    basePrice: { type: Number, default: 0, required: true },
    salePrice: { type: Number, default: 0 },
    discount: { type: Number, max: 100, min: 0, default: 0 },  // discount in percentage
    onSale: { type: Boolean, default: false },
    saleTax: { type: Number, default: 18 },
    totalStock: { type: Number, default: 0 },
    // other details
    variants: [ProductVariantSchema],
    reviews: [ProductReviewSchema],
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, max: 5, min: 0 },
    onFeatured: { type: Boolean, default: false }, // if this product is featured or not
    isActive: { type: Boolean, default: true },     // available to sale
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product", max: 5 }],
    // user details
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["approved", "rejected", "pending", "draft", "outOfStock"],
        // default: "draft"
        default: "approved"
    }
}, {
    timestamps: true
});


// Add this line after defining your ProductSchema
ProductSchema.plugin(mongoosePaginate);


// Pre-save hook to generate slug from title
ProductSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        let baseSlug = slugify(this.title, { lower: true, strict: true, trim: true });
        let slug = baseSlug;
        let count = 1;
        // Check if a document with the same slug already exists using the model
        while (await (this.constructor as typeof Product).findOne<IProduct>({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        this.slug = slug;
    }
    next();
});


// Pre-save hook to calculate total stock, discount, and onSale status
ProductSchema.pre('save', function (next) {
    // Calculate total stock from variants.stock
    if (this.isModified('variants')) {
        this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
    }

    // Calculate discount and onSale status
    if (this.isModified('basePrice') || this.isModified('salePrice') || this.isModified('discount')) {
        if (this.basePrice > 0 && this.salePrice > 0 && this.salePrice < this.basePrice) {
            // Calculate discount from sale price
            this.discount = Math.round(((this.basePrice - this.salePrice) / this.basePrice) * 100);
            this.onSale = true;
        }
        else if (this.discount > 0 && this.discount < 100 && this.basePrice > 0) {
            // Calculate sale price from discount
            this.salePrice = Math.round(this.basePrice - (this.basePrice * this.discount) / 100);
            this.onSale = true;
        } else {
            // Reset if conditions not met
            this.salePrice = 0;
            this.discount = 0;
            this.onSale = false;
        }
    }
    next();
});


// Indexes
ProductSchema.index({ title: "text", brand: "text", category: "text", description: "text" });
ProductSchema.index({ "variants.sku": 1 }, { unique: true, sparse: true });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ seller: 1 });

// Define the model with TypeScript interface
interface ProductPaginateModel<T> extends mongoose.PaginateModel<T> { }

// const Product: ProductPaginateModel<IProduct> = 
// mongoose.models.Product ||
// mongoose.model<IProduct>("Product", ProductSchema, "products") as ProductPaginateModel<IProduct>;

// Create or get the model
const Product = (
    mongoose.models.Product as unknown as ProductPaginateModel<IProduct> ||
    mongoose.model<IProduct, ProductPaginateModel<IProduct>>(
        "Product",
        ProductSchema,
        "products"
    )
);

export default Product;