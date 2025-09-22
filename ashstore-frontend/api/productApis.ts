import { CreateProductFormData } from "@/components/Seller/sell-product/PostProductComponent";
import axiosApi from "./axiosInstance";
import { IProduct, IProductReview } from "@/types/types";


export interface PostReview {
    rating: number;
    comment: string;
}

// Create a new product
export const createProduct = async (data: CreateProductFormData) => {
    try {
        const response = await axiosApi.post("/product/", data);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get all products
export const getAllProducts = async (query: string) => {
    try {
        // Pass the query string directly to the URL
        const response = await axiosApi.get(`/product?${query}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get a single product by ID
export const getProductById = async (productId: string) => {
    try {
        const response = await axiosApi.get(`/product/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Add a Product Review
export const addProductReview = async (productId: string, reviewData: PostReview) => {
    try {
        const response = await axiosApi.post(`/product/${productId}/reviews`, reviewData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Add a Product Reply
export const addReviewReply = async (productId: string, reviewId: string, replyData: string) => {
    try {
        const response = await axiosApi.post(`/product/${productId}/reviews/${reviewId}/reply`, { comment: replyData });
        return response;
    } catch (error) {
        throw error;
    }
};


// // Update a product
// export const updateProduct = async (productId: string, data: Partial<IProduct>) => {
//     try {
//         const response = await axiosApi.patch(`/ products / ${ productId }`, data);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

// // Delete a product
// export const deleteProduct = async (productId: string) => {
//     try {
//         const response = await axiosApi.delete(`/ products / ${ productId }`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

// // Get products by category
// export const getProductsByCategory = async (category: string) => {
//     try {
//         const response = await axiosApi.get(`/ products / category / ${ category }`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

// // Search products
// export const searchProducts = async (query: string) => {
//     try {
//         const response = await axiosApi.get(`/ products / search ? q = ${ query }`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };
