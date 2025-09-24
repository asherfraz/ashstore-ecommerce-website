import { fetchSellerProductsApi, getAllProducts } from "@/api/productApis";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductsFilters } from "./productSlice";

// Get products createAsyncThunk() - for marketplace
export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async (filters: ProductsFilters, { rejectWithValue }) => {
        try {
            // Convert filters object to query string
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    // Handle array values (like category)
                    if (Array.isArray(value)) {
                        queryParams.set(key, value.join(','));
                    } else {
                        queryParams.set(key, value.toString());
                    }
                }
            });

            const response = await getAllProducts(queryParams.toString());
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch products";
            console.error("Error fetching products:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    });

// Get seller products createAsyncThunk() - for seller dashboard
export const fetchSellerProducts = createAsyncThunk(
    "product/fetchSellerProducts",
    async (filters: ProductsFilters = {}, { rejectWithValue }) => {
        try {
            // Convert filters object to query string
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    // Handle array values (like category)
                    if (Array.isArray(value)) {
                        queryParams.set(key, value.join(','));
                    } else {
                        queryParams.set(key, value.toString());
                    }
                }
            });

            const response = await fetchSellerProductsApi(queryParams.toString()); // Updated function name
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch seller products";
            console.error("Error fetching seller products:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    });
