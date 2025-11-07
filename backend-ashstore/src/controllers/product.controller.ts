import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import Product from "../models/product.model";
import { IProduct, IProductReview, IProductVariant } from "../types/product.types";
import { validateCreateProduct, validateProductReview, validateUpdateProduct } from "../validators/product.validator";
import { Types } from "mongoose";
import ProductEmails from "./email.controller";
import { CloudinaryService } from "../services/cloudinary.service";
import UserProductReview from "../models/userProductReview.model";
import { User } from "../models";

const ProductController = {
    // Create a new product
    createProduct: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const productData: IProduct = req.body;


        // Upload images to cloudinary and then validate 
        if (!productData.images || !Array.isArray(productData.images) || productData.images.length === 0) {
            return res.status(400).json({ message: "Images are required" });
        }

        // Upload images to Cloudinary
        const uploadedImageUrls = await CloudinaryService.uploadBase64Images(productData.images);

        // assign cloudinary images url to productData to save in DB
        productData.images = uploadedImageUrls;


        const publicIds = CloudinaryService.extractPublicIdsFromUrls(uploadedImageUrls);

        console.debug(`\n>>>:DEBUG	: Product Public Ids Debugging!\n`);
        console.debug(publicIds);
        // console.debug(`\n>>>:DEBUG	: Product Debugging!\n`);
        // console.debug(productData);


        // validate data
        const { error } = validateCreateProduct(productData);
        if (error) return next(error);


        // Set the seller to the current user
        productData.seller = new Types.ObjectId(req?.user?._id);



        // Generate Product Serial Number (PSR)
        const totalProducts = await Product.countDocuments();
        productData.psr = `PSR-${(totalProducts + 1).toString().padStart(7, '0')}`;

        // Generate SKUs for each variant
        if (productData.variants && productData.variants.length > 0) {
            productData.variants.forEach(variant => {
                // const brandPart = productData.brand.substring(0, 3).toUpperCase();
                const brandPart = productData.brand.trim().toUpperCase();
                const categoryPart = productData.category[0].substring(0, 3).toUpperCase();
                const colorPart = variant.color.substring(0, 2).toUpperCase();
                const sizePart = variant.size.substring(0, 2).toUpperCase();
                variant.sku = `${brandPart}-${categoryPart}-${colorPart}-${sizePart}`;
            });
        }

        // Find and add top 5 related products based on average rating
        const topProducts: IProduct[] = await Product.find({ isActive: true, status: 'approved' })
            .sort({ averageRating: -1 })
            .limit(5)
            .select('_id');
        productData.relatedProducts = topProducts.map(p => p._id);

        const newProduct = new Product(productData);
        await newProduct.save();

        // Email Sender
        ProductEmails.addProductEmail((req?.user?.name) as string, (req?.user?.email) as string, newProduct);



        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    }),

    // Get all products with filtering, sorting, and pagination
    getProducts: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const {
            page = 1,
            limit = 6,
            sortBy = "createdAt",
            // sortBy,
            sortOrder = "desc",
            category,
            brand,
            minPrice,
            maxPrice,
            onSale,
            onFeatured,
            search,
            status = "approved",
            isActive = "true",
            color,
            size,
            minRating,
            maxRating
        } = req.query;



        // Build filter object
        const filter: any = {
            status: status === 'all' ? { $in: ["approved", "pending", "draft"] } : status
        };

        // Active products filter
        if (isActive !== 'all') {
            filter.isActive = isActive === 'true';
        }

        // Category filter (can be array or string)
        if (category) {
            if (Array.isArray(category)) {
                filter.category = { $in: category };
            } else if (typeof category === 'string' && category.includes(',')) {
                filter.category = { $in: category.split(',') };
            } else {
                filter.category = category;
            }
        }

        // Brand filter (can be array or string)

        if (brand) {
            console.log(" Brand : ", brand)
            if (Array.isArray(brand)) {
                console.log("Brand Tag 1: ")
                filter.brand = { $in: brand };
            } else if (typeof brand === 'string' && brand.includes(',')) {
                console.log("Brand Tag 2: ")
                filter.brand = { $in: brand.split(',') };
                console.log("Filter Brand : ", filter.brand)
            } else {
                console.log("Brand Tag 3: ")
                filter.brand = brand
                console.log("Filter Brand : ", filter.brand)
                console.log("Type Of Brand : ", typeof filter.brand)
            }
        }

        // On sale filter
        if (onSale) filter.onSale = onSale === 'true';

        // Featured filter
        if (onFeatured) filter.onFeatured = onFeatured === 'true';

        // Price range filter
        if (minPrice || maxPrice) {
            filter.salePrice = {};
            if (minPrice) filter.salePrice.$gte = Number(minPrice);
            if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
        }

        // Rating range filter
        if (minRating || maxRating) {
            filter.averageRating = {};
            if (minRating) filter.averageRating.$gte = Number(minRating);
            if (maxRating) filter.averageRating.$lte = Number(maxRating);
        }

        // Variant filters (color and size)
        if (color || size) {
            filter['variants'] = { $elemMatch: {} };

            if (color) {
                if (typeof color === 'string' && color.includes(',')) {
                    filter['variants'].$elemMatch.color = { $in: color.split(',') };
                } else {
                    filter['variants'].$elemMatch.color = color;
                }
            }

            if (size) {
                if (typeof size === 'string' && size.includes(',')) {
                    filter['variants'].$elemMatch.size = { $in: size.split(',') };
                } else {
                    filter['variants'].$elemMatch.size = size;
                }
            }
        }

        // Text search using text index
        if (search) {
            filter.$text = { $search: search as string };
        }

        // Build sort object
        const sort: any = {};
        if (search) {
            // If searching, sort by text score first
            sort.score = { $meta: "textScore" };
        }

        // Handle special sort cases
        if (sortBy === 'popularity') {
            sort.totalReviews = sortOrder === 'desc' ? -1 : 1;
            sort.averageRating = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy === 'price') {
            if (onSale === 'true') {
                sort.salePrice = sortOrder === 'desc' ? -1 : 1;
            } else {
                sort.basePrice = sortOrder === 'desc' ? -1 : 1;
            }
            // } else if (sortBy === 'discount') {
            //     sort.discount = sortOrder === 'desc' ? -1 : 1;

        } else if (sortBy === 'averageRating') {
            sort.averageRating = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
        }

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort,
            populate: [
                {
                    path: 'seller',
                    select: 'name username avatar'
                },
                {
                    path: 'reviews.userId',
                    select: 'name username avatar'
                },
                {
                    path: 'reviews.replies.userId',
                    select: 'name username avatar'
                },
                {
                    path: 'relatedProducts',
                }
            ]
        };

        // Use paginate method from mongoose-paginate-v2
        const products = await Product.paginate(filter, options);

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products
        });
    }),

    // Add this function in your existing ProductController object
    getSellerProducts: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?._id;
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            category,
            brand,
            minPrice,
            maxPrice,
            onSale,
            onFeatured,
            search,
            // status = "all", // Changed to 'all' to show all products by seller
            // isActive = "all",
            color,
            size,
            minRating,
            maxRating
        } = req.query;

        // Build filter object - only for current seller
        const filter: any = {
            seller: userId // This ensures only current user's products are returned
        };

        // Status filter (can be all or specific)
        // if (status !== 'all') {
        //     filter.status = status;
        // }

        // Active products filter
        // if (isActive !== 'all') {
        //     filter.isActive = isActive === 'true';
        // }

        // Category filter (can be array or string)
        if (category) {
            if (Array.isArray(category)) {
                filter.category = { $in: category };
            } else if (typeof category === 'string' && category.includes(',')) {
                filter.category = { $in: category.split(',') };
            } else {
                filter.category = category;
            }
        }

        // Brand filter (can be array or string)
        if (brand) {
            if (Array.isArray(brand)) {
                filter.brand = { $in: brand };
            } else if (typeof brand === 'string' && brand.includes(',')) {
                filter.brand = { $in: brand.split(',') };
            } else {
                filter.brand = brand;
            }
        }

        // On sale filter
        if (onSale !== undefined) {
            filter.onSale = onSale === 'true';
        }

        // Featured filter
        if (onFeatured !== undefined) {
            filter.onFeatured = onFeatured === 'true';
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = Number(minPrice);
            if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
        }

        // Rating range filter
        if (minRating || maxRating) {
            filter.averageRating = {};
            if (minRating) filter.averageRating.$gte = Number(minRating);
            if (maxRating) filter.averageRating.$lte = Number(maxRating);
        }

        // Variant filters (color and size)
        if (color || size) {
            filter['variants'] = { $elemMatch: {} };

            if (color) {
                if (typeof color === 'string' && color.includes(',')) {
                    filter['variants'].$elemMatch.color = { $in: color.split(',') };
                } else {
                    filter['variants'].$elemMatch.color = color;
                }
            }

            if (size) {
                if (typeof size === 'string' && size.includes(',')) {
                    filter['variants'].$elemMatch.size = { $in: size.split(',') };
                } else {
                    filter['variants'].$elemMatch.size = size;
                }
            }
        }

        // Text search using text index
        if (search) {
            filter.$text = { $search: search as string };
        }

        // Build sort object
        const sort: any = {};
        if (sortBy === 'popularity') {
            sort.totalReviews = sortOrder === 'desc' ? -1 : 1;
            sort.averageRating = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy === 'price') {
            if (onSale === 'true') {
                sort.salePrice = sortOrder === 'desc' ? -1 : 1;
            } else {
                sort.basePrice = sortOrder === 'desc' ? -1 : 1;
            }
        } else if (sortBy === 'averageRating') {
            sort.averageRating = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
        }

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort,
            populate: [
                {
                    path: 'seller',
                    select: 'name username avatar'
                },
                {
                    path: 'reviews.userId',
                    select: 'name username avatar'
                },
                {
                    path: 'reviews.replies.userId',
                    select: 'name username avatar'
                },
                {
                    path: 'relatedProducts',
                }
            ]
        };

        // Use paginate method from mongoose-paginate-v2
        const products = await Product.paginate(filter, options);

        res.status(200).json({
            success: true,
            message: 'Seller products fetched successfully',
            data: products
        });
    }),

    // Get a single product by ID or slug
    getProductById: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if ID is a valid ObjectId or a slug
        const isObjectId = Types.ObjectId.isValid(id);
        const query = isObjectId ? { _id: id } : { slug: id };

        const product = await Product.findOne(query)
            .populate('seller', 'name username avatar')
            .populate('reviews.userId', 'name username avatar')
            .populate('reviews.replies.userId', 'name username avatar')
            // .populate('relatedProducts', 'title images salePrice');
            .populate('relatedProducts');

        if (!product || !product.isActive) {
            return next({ status: 404, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            product
        });
    }),

    // Update a product
    updateProduct: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updateData = req.body;

        // Check if product exists
        const product = await Product.findById<IProduct>(id);
        if (!product) {
            return next({ status: 404, message: 'Product not found' });
        }

        // Check if user is the seller, both or admin
        if (!product.seller.equals(req?.user?._id) && req?.user?.userType !== 'admin') {
            return next({
                status: 403,
                message: 'Not authorized to update this product'
            });
        }

        // Handle images update if new images are provided
        if (updateData.images && Array.isArray(updateData.images) && updateData.images.length > 0) {
            // Upload new images to Cloudinary
            const uploadedImageUrls = await CloudinaryService.uploadBase64Images(updateData.images);

            const imageValidateDomain = product.images[0].split('/')[2]
            // console.log("imageValidateDomain: ", imageValidateDomain)
            // Extract old public IDs for deletion
            if (imageValidateDomain === "res.cloudinary.com") {
                const oldPublicIds = CloudinaryService.extractPublicIdsFromUrls(product.images);

                // Delete old images from Cloudinary
                if (oldPublicIds.length > 0) {
                    await CloudinaryService.deleteImages(oldPublicIds);
                }
            }

            // Assign new image URLs to update data
            updateData.images = uploadedImageUrls;
        }

        // Validate update data if provided
        if (Object.keys(updateData).length > 0) {
            const { error } = validateUpdateProduct(updateData);
            if (error) return next(error);
        }

        // If variants are updated, regenerate SKUs
        if (updateData.variants && updateData.variants.length > 0) {
            updateData.variants.forEach((variant: IProductVariant, index: number) => {
                if (!variant.sku) {
                    const brandPart = updateData.brand || product.brand;
                    const categoryPart = Array.isArray(updateData.category || product.category)
                        ? (updateData.category || product.category)[0].substring(0, 3).toUpperCase()
                        : (updateData.category || product.category).substring(0, 3).toUpperCase();
                    const colorPart = variant.color.substring(0, 2).toUpperCase();
                    const sizePart = variant.size.substring(0, 2).toUpperCase();
                    const uniquePart = (index + 1).toString().padStart(2, '0');
                    variant.sku = `${product.psr}-${brandPart}-${categoryPart}-${colorPart}-${sizePart}-${uniquePart}`;
                }
            });
        }

        // Update the product with new data
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('seller', 'name username avatar');

        // Email Sender
        ProductEmails.updateProductEmail((req?.user?.name) as string, (req?.user?.email) as string, updatedProduct as IProduct);

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    }),

    // Archive a product
    archiveProduct: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Validate ObjectId
        if (!Types.ObjectId.isValid(id)) {
            return next({
                status: 400,
                message: 'Invalid product ID'
            });
        }

        // Find product
        const product = await Product.findById<IProduct>(id);
        if (!product) {
            return next({
                status: 404,
                message: 'Product not found'
            });
        }

        // Optional: Prevent re-archiving
        if (product.isActive === false) {
            // return next({
            //     status: 400,
            //     message: 'Product is already archived'
            // });
            product.isActive = true;
        } else {
            // Soft delete: Set isActive to false
            product.isActive = false;
        }
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product archived successfully'
        });
    }),

    // Delete a Product
    deleteProduct: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Validate ObjectId
        if (!Types.ObjectId.isValid(id)) {
            return next({
                status: 400,
                message: 'Invalid product ID'
            });
        }

        // Find product
        const product = await Product.findById<IProduct>(id);
        if (!product) {
            return next({
                status: 404,
                message: 'Product not found'
            });
        }

        // Check Images Array then delete
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {

            const imageValidateDomain = product.images[0].split('/')[2]
            if (imageValidateDomain === "res.cloudinary.com") {
                // Extract public IDs from existing images for deletion
                const publicIds = CloudinaryService.extractPublicIdsFromUrls(product.images);

                // Delete images from Cloudinary after product deletion
                if (publicIds.length > 0) {
                    await CloudinaryService.deleteImages(publicIds);
                }
            }
        }

        // Delete product first
        await Product.findByIdAndDelete(id);



        // Email Sender
        ProductEmails.deleteProductEmail((req?.user?.name) as string, (req?.user?.email) as string, product);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    }),

    // Add a product review
    addProductReview: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req?.user?._id;

        // Validate review data
        const { error } = validateProductReview(req.body);
        if (error) return next(error);

        // Check if product exists and is active
        const product = await Product.findById<IProduct>(id);
        if (!product || !product.isActive || product.status !== 'approved') {
            return next({ status: 404, message: 'Product not found or not available for review' });
        }

        // Check if user has already reviewed this product
        const existingReview = product.reviews.find(
            (review: IProductReview) => review.userId.toString() === userId?.toString()
        );

        if (existingReview) {
            return next({ status: 400, message: 'You have already reviewed this product' });
        }

        // Add the review
        const newReview: IProductReview = {
            userId: new Types.ObjectId(userId),
            rating,
            comment,
            likes: 0,
            dislikes: 0,
            replies: []
        };

        product.reviews.push(newReview);

        // Update average rating and total reviews
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.averageRating = totalRating / product.reviews.length;
        product.totalReviews = product.reviews.length;

        await product.save();

        // Populate  response
        await product.populate([
            {
                path: 'seller',
                select: 'name username avatar',
            },
            {
                path: 'reviews.userId',
                select: 'name username avatar',
            },
            {
                path: 'reviews.replies.userId',
                select: 'name username avatar',
            },
        ]);


        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            product
        });
    }),

    // Update Product Review likes and Dislikes
    updateProductReviewLikeDislike: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id, reviewId } = req.params;
        const { action } = req.body; // 'like' or 'dislike'
        const userId = req?.user?._id;

        // Validate action
        if (!action || !['like', 'dislike', 'removeLike', 'removeDislike'].includes(action)) {
            return next({ status: 400, message: 'Invalid action. Use: like, dislike, removeLike, removeDislike' });
        }

        // Check if product exists and is active
        const product = await Product.findById<IProduct>(id);
        if (!product || !product.isActive || product.status !== 'approved') {
            return next({ status: 404, message: 'Product not found or not available for review' });
        }

        // Find the review
        const review = product.reviews.find(
            (r: IProductReview) => r._id?.toString() === reviewId
        );

        if (!review) {
            return next({ status: 404, message: 'Review not found' });
        }

        // Check if the user is trying to like/dislike their own review
        if (review.userId.toString() === userId?.toString()) {
            return next({ status: 400, message: 'You cannot like or dislike your own review' });
        }

        // Find or create user's reaction record
        let userProductReview = await UserProductReview.findOne({
            userId: new Types.ObjectId(userId),
            reviewId: new Types.ObjectId(reviewId)
        });

        let previousReaction: "like" | "dislike" | null = null;

        if (userProductReview) {
            previousReaction = userProductReview.reaction;
            // Update existing reaction
            if (action === 'like') {
                userProductReview.reaction = 'like';
            } else if (action === 'dislike') {
                userProductReview.reaction = 'dislike';
            } else if (action === 'removeLike' || action === 'removeDislike') {
                userProductReview.reaction = null;
            }
            await userProductReview.save();
        } else {
            // Create new reaction record
            if (action === 'like') {
                userProductReview = await UserProductReview.create({
                    userId: new Types.ObjectId(userId),
                    productId: new Types.ObjectId(id),
                    reviewId: new Types.ObjectId(reviewId),
                    reaction: 'like'
                });
            } else if (action === 'dislike') {
                userProductReview = await UserProductReview.create({
                    userId: new Types.ObjectId(userId),
                    productId: new Types.ObjectId(id),
                    reviewId: new Types.ObjectId(reviewId),
                    reaction: 'dislike'
                });
            } else if (action === 'removeLike' || action === 'removeDislike') {
                // If removing and no record exists, do nothing
                userProductReview = null;
            }
        }

        // Find user and update their productReactions array
        const user = await User.findById(userId);
        if (!user) {
            return next({ status: 404, message: 'User not found' });
        }

        // Check if reaction exists in user's productReactions array
        const existingReactionIndex = user.productReactions.findIndex(
            (reactionId: any) => reactionId.toString() === (userProductReview?._id?.toString() || '')
        );

        if (userProductReview) {
            if (existingReactionIndex === -1) {
                // Add new reaction if not exists
                user.productReactions.push(userProductReview._id);
            }
        } else if (existingReactionIndex !== -1 && (action === 'removeLike' || action === 'removeDislike')) {
            // Remove reaction if removing
            user.productReactions.splice(existingReactionIndex, 1);
        }

        await user.save();

        // Update the product review's like/dislike counts based on the action
        switch (action) {
            case 'like':
                // If user previously disliked, remove that dislike
                if (previousReaction === 'dislike') {
                    review.dislikes = Math.max(0, review.dislikes - 1);
                }
                // Add like
                review.likes = (review.likes || 0) + 1;
                break;

            case 'dislike':
                // If user previously liked, remove that like
                if (previousReaction === 'like') {
                    review.likes = Math.max(0, review.likes - 1);
                }
                // Add dislike
                review.dislikes = (review.dislikes || 0) + 1;
                break;

            case 'removeLike':
                // Remove like
                review.likes = Math.max(0, (review.likes || 0) - 1);
                break;

            case 'removeDislike':
                // Remove dislike
                review.dislikes = Math.max(0, (review.dislikes || 0) - 1);
                break;

            default:
                return next({ status: 400, message: 'Invalid action' });
        }

        await product.save();

        // Populate response
        await product.populate([
            {
                path: 'seller',
                select: 'name username avatar',
            },
            {
                path: 'reviews.userId',
                select: 'name username avatar',
            },
            {
                path: 'reviews.replies.userId',
                select: 'name username avatar',
            },
        ]);

        res.status(200).json({
            success: true,
            message: `Review ${action} updated successfully`,
            data: product
        });
    }),

    // Get product reviews with pagination
    getProductReviews: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query;

        // Find product
        const product = await Product.findById<IProduct>(id)
            .select('reviews')
            .populate({
                path: 'reviews.userId',
                select: 'name avatar'
            })
            .populate({
                path: 'reviews.replies.userId',
                select: 'name avatar'
            });

        if (!product) {
            return next({ status: 404, message: 'Product not found' });
        }

        // Sort reviews
        const sortedReviews = product.reviews.sort((a, b) => {
            const aValue = a[sortBy as keyof IProductReview];
            const bValue = b[sortBy as keyof IProductReview];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
            } else if (aValue instanceof Date && bValue instanceof Date) {
                return sortOrder === 'desc'
                    ? bValue.getTime() - aValue.getTime()
                    : aValue.getTime() - bValue.getTime();
            }
            return 0;
        });

        // Paginate reviews
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: {
                reviews: paginatedReviews,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(product.reviews.length / Number(limit)),
                    totalReviews: product.reviews.length,
                    hasNextPage: endIndex < product.reviews.length,
                    hasPrevPage: startIndex > 0
                }
            }
        });
    }),

    // Add reply to a review
    addReviewReply: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id, reviewId } = req.params;
        const { comment } = req.body;
        const userId = req?.user?._id;

        if (!comment || comment.trim().length === 0) {
            return next({ status: 400, message: 'Reply comment is required' });
        }

        const product = await Product.findById(id);
        if (!product || !product.isActive) {
            return next({ status: 404, message: 'Product not found' });
        }

        // Find the review
        const review = product.reviews.find(r => r._id?.toString() === reviewId);
        if (!review) {
            return next({ status: 404, message: 'Review not found' });
        }

        // Add the reply
        review.replies.push({
            userId: new Types.ObjectId(userId),
            comment: comment,
            createdAt: new Date()
        });

        await product.save();

        // Populate  response
        await product.populate([
            {
                path: 'seller',
                select: 'name username avatar',
            },
            {
                path: 'reviews.userId',
                select: 'name username avatar',
            },
            {
                path: 'reviews.replies.userId',
                select: 'name username avatar',
            },
        ]);

        res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            // data: review.replies[review.replies.length - 1]
            product
        });
    }),

    // Update product stock
    updateProductStock: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { variantId, stock, operation } = req.body; // operation: 'set' or 'increment'

        // Validate `variantId`
        if (!variantId || !Types.ObjectId.isValid(variantId)) {
            return next({ status: 400, message: 'Invalid or missing Variant ID' });
        }

        // (Optional) Validate `id` if you're also using it
        if (!Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid Product ID' });
        }

        if (!stock && stock !== 0) {
            return next({ status: 400, message: 'Stock value is required' });
        }

        const product = await Product.findById<IProduct>(id);
        if (!product) {
            return next({ status: 404, message: 'Product not found' });
        }

        // Check if user is the seller or admin
        if (!product.seller.equals(req?.user?._id) && req?.user?.userType !== 'admin') {
            return next({ status: 403, message: 'Not authorized to update this product' });
        }

        // Update specific variant stock if variantId provided
        if (variantId) {
            const variant = product.variants.find(v => v._id?.toString() === variantId);
            if (!variant) {
                return next({ status: 404, message: 'Variant not found' });
            }

            if (operation === 'increment') {
                variant.stock += Number(stock);
            } else {
                variant.stock = Number(stock);
            }
        } else {
            // Update all variants with the same stock
            product.variants.forEach(variant => {
                if (operation === 'increment') {
                    variant.stock += Number(stock);
                } else {
                    variant.stock = Number(stock);
                }
            });
        }

        // Recalculate total stock
        product.totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product stock updated successfully',
            data: product
        });
    }),

    // Update product status
    updateProductStatus: tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["approved", "rejected", "pending", "draft", "outOfStock"].includes(status)) {
            return next({ status: 400, message: 'Valid status is required' });
        }

        const product = await Product.findById<IProduct>(id);
        if (!product) {
            return next({ status: 404, message: 'Product not found' });
        }

        // Check if user is admin (only admin can change status to approved/rejected)
        if (["approved", "rejected"].includes(status) && req?.user?.userType !== 'admin') {
            return next({ status: 403, message: 'Only admin can approve or reject products' });
        }

        // Check if user is the seller or admin for other status changes
        if (!product.seller.equals(req?.user?._id) && req?.user?.userType !== 'admin') {
            return next({ status: 403, message: 'Not authorized to update this product' });
        }

        product.status = status;

        // If status is outOfStock, set all variants stock to 0
        if (status === 'outOfStock') {
            product.variants.forEach(variant => {
                variant.stock = 0;
            });
            product.totalStock = 0;
        }

        // If status matches, archive this product by setting isActive false
        if (['rejected', 'draft', 'outOfStock', 'pending'].includes(status)) {
            product.isActive = false
        } else {
            product.isActive = true
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product status updated successfully',
            data: product
        });
    })
};

export default ProductController;