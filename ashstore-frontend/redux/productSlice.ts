import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IProduct } from '@/types/types'
import toast from 'react-hot-toast';
import { RootState } from './store';
import { fetchProducts, fetchSellerProducts } from './productThunks';

export interface ProductsFilters {
    page?: number;
    limit?: number | undefined;
    sortBy?: string;
    sortOrder?: string;
    category?: string | string[];
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    onSale?: boolean;
    onFeatured?: boolean;
    search?: string;
    status?: string;
    isActive?: boolean;
    color?: string;
    size?: string;
    minRating?: number;
    maxRating?: number;
    seller?: string; // Add seller filter for marketplace
};

// Interface for pagination data
interface PaginationData {
    products: IProduct[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
}

interface ProductState {
    products: IProduct[]; // Marketplace products
    marketplacePagination: PaginationData; // Marketplace pagination data
    sellerProducts: IProduct[]; // Seller's own products
    sellerPagination: PaginationData; // Seller pagination data
    currentProduct: IProduct | null;
    filters: ProductsFilters;
}

// Helper functions for localStorage
const loadState = (): Partial<ProductState> => {
    try {
        const serializedState = localStorage.getItem('product');
        if (serializedState === null) {
            return {};
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn('Failed to load state from localStorage:', e);
        return {};
    }
};

const saveState = (state: Partial<ProductState>) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('product', serializedState);
    } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
    }
};

// Load persisted state from localStorage
const persistedState = loadState();

const initialState: ProductState = {
    products: [],
    marketplacePagination: {
        products: [],
        totalDocs: 0,
        limit: 10,
        totalPages: 0,
        page: 1,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
    },
    sellerProducts: [],
    sellerPagination: {
        products: [],
        totalDocs: 0,
        limit: 10,
        totalPages: 0,
        page: 1,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
    },
    currentProduct: null,
    filters: {},
    ...persistedState, // Override with persisted values
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.products = action.payload;
            state.marketplacePagination.products = action.payload;
            // Persist relevant state
            saveState({
                products: state.products,
                marketplacePagination: state.marketplacePagination,
                sellerProducts: state.sellerProducts,
                sellerPagination: state.sellerPagination,
                currentProduct: state.currentProduct,
                ...state.filters,
            });
        },
        setSellerProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.sellerProducts = action.payload;
            state.sellerPagination.products = action.payload;
            // Persist relevant state
            saveState({
                products: state.products,
                marketplacePagination: state.marketplacePagination,
                sellerProducts: state.sellerProducts,
                sellerPagination: state.sellerPagination,
                currentProduct: state.currentProduct,
                ...state.filters,
            });
        },
        setCurrentProduct: (state, action: PayloadAction<IProduct>) => {
            state.currentProduct = action.payload;
        },
        updateProduct: (state, action: PayloadAction<Partial<IProduct>>) => {
            if (state.currentProduct) {
                state.currentProduct = { ...state.currentProduct, ...action.payload };
            }
            // Also update in marketplace products array if exists
            const productIndex = state.products.findIndex(p => p._id === state.currentProduct?._id);
            if (productIndex !== -1) {
                state.products[productIndex] = { ...state.products[productIndex], ...action.payload };
                state.marketplacePagination.products[productIndex] = { ...state.marketplacePagination.products[productIndex], ...action.payload };
            }
            // Also update in sellerProducts array if exists
            const sellerProductIndex = state.sellerProducts.findIndex(p => p._id === state.currentProduct?._id);
            if (sellerProductIndex !== -1) {
                state.sellerProducts[sellerProductIndex] = { ...state.sellerProducts[sellerProductIndex], ...action.payload };
                state.sellerPagination.products[sellerProductIndex] = { ...state.sellerPagination.products[sellerProductIndex], ...action.payload };
            }
        },
        setFilters: (state, action: PayloadAction<ProductState['filters']>) => {
            state.filters = { ...state.filters, ...action.payload };
            saveState({
                products: state.products,
                marketplacePagination: state.marketplacePagination,
                sellerProducts: state.sellerProducts,
                sellerPagination: state.sellerPagination,
                currentProduct: state.currentProduct,
                ...state.filters,
            });
        },
        clearFilters: (state) => {
            state.filters = {};
            saveState({
                products: state.products,
                marketplacePagination: state.marketplacePagination,
                sellerProducts: state.sellerProducts,
                sellerPagination: state.sellerPagination,
                currentProduct: state.currentProduct,
                ...state.filters,
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Marketplace products
            .addCase(fetchProducts.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    const responseData = action.payload.data;
                    state.products = responseData.docs || [];
                    state.marketplacePagination = {
                        products: responseData.docs || [],
                        totalDocs: responseData.totalDocs || 0,
                        limit: responseData.limit || 10,
                        totalPages: responseData.totalPages || 0,
                        page: responseData.page || 1,
                        pagingCounter: responseData.pagingCounter || 0,
                        hasPrevPage: responseData.hasPrevPage || false,
                        hasNextPage: responseData.hasNextPage || false,
                    };
                }
                // Persist after fetching products
                saveState({
                    products: state.products,
                    marketplacePagination: state.marketplacePagination,
                    sellerProducts: state.sellerProducts,
                    sellerPagination: state.sellerPagination,
                    currentProduct: state.currentProduct,
                    ...state.filters,
                });
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                toast.error(action.payload as string);
            })
            // Seller products
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    const responseData = action.payload.data;
                    state.sellerProducts = responseData.docs || [];
                    state.sellerPagination = {
                        products: responseData.docs || [],
                        totalDocs: responseData.totalDocs || 0,
                        limit: responseData.limit || 10,
                        totalPages: responseData.totalPages || 0,
                        page: responseData.page || 1,
                        pagingCounter: responseData.pagingCounter || 0,
                        hasPrevPage: responseData.hasPrevPage || false,
                        hasNextPage: responseData.hasNextPage || false,
                    };
                }
                // Persist after fetching seller products
                saveState({
                    products: state.products,
                    marketplacePagination: state.marketplacePagination,
                    sellerProducts: state.sellerProducts,
                    sellerPagination: state.sellerPagination,
                    currentProduct: state.currentProduct,
                    ...state.filters,
                });
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                toast.error(action.payload as string);
            });
    }
})

export const {
    setProducts,
    setSellerProducts,
    setCurrentProduct,
    updateProduct,
    setFilters,
    clearFilters,
} = productSlice.actions

export default productSlice.reducer

// Selectors
export const selectSellerProducts = (state: RootState) => state.product.sellerProducts;
export const selectSellerPagination = (state: RootState) => state.product.sellerPagination;
export const selectMarketplacePagination = (state: RootState) => state.product.marketplacePagination;