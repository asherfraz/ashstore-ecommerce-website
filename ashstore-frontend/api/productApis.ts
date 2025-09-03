import axiosApi from "./axiosInstance";
import { IProduct } from "@/next-env";

// Get all products
export const getAllProducts = async (params?: Record<string, string>) => {
    try {
        const response = await axiosApi.get("/products", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single product by ID
export const getProductById = async (productId: string) => {
    try {
        const response = await axiosApi.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new product
export const createProduct = async (data: Partial<IProduct>) => {
    try {
        const response = await axiosApi.post("/products", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update a product
export const updateProduct = async (productId: string, data: Partial<IProduct>) => {
    try {
        const response = await axiosApi.patch(`/products/${productId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a product
export const deleteProduct = async (productId: string) => {
    try {
        const response = await axiosApi.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (category: string) => {
    try {
        const response = await axiosApi.get(`/products/category/${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Search products
export const searchProducts = async (query: string) => {
    try {
        const response = await axiosApi.get(`/products/search?q=${query}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
