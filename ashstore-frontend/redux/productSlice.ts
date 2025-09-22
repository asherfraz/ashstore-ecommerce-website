import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BackendResponse, IProduct } from '@/types/types'
import { getAllProducts } from '@/api/productApis'
import toast from 'react-hot-toast';
import { RootState } from './store';

interface ProductsFilters {
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
};



// Get products createAsyncThunk()
export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async (filters: ProductsFilters, { rejectWithValue }) => {
        try {

            // assign filters parameter to state.filters

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
            // console.log("Query Params: ", queryParams.toString())

            const response = await getAllProducts(queryParams.toString());
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch products";
            console.error("Error fetching products:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    });

interface ProductState {
    products: IProduct[];
    currentProduct: IProduct | null;
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
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
    currentProduct: null,
    totalDocs: 0,
    limit: 10,
    totalPages: 0,
    page: 1,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    filters: {},
    ...persistedState, // Override with persisted values
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.products = action.payload;
            // Persist relevant state
            saveState({
                products: state.products,
                currentProduct: state.currentProduct,
                ...state.filters,
                totalDocs: state.totalDocs,
                limit: state.limit,
                totalPages: state.totalPages,
                page: state.page,
                hasPrevPage: state.hasPrevPage,
                hasNextPage: state.hasNextPage,
            });
        },
        setCurrentProduct: (state, action: PayloadAction<IProduct>) => {
            state.currentProduct = action.payload;
        },
        updateProduct: (state, action: PayloadAction<Partial<IProduct>>) => {
            if (state.currentProduct) {
                state.currentProduct = { ...state.currentProduct, ...action.payload };
            }
        },
        setFilters: (state, action: PayloadAction<ProductState['filters']>) => {
            state.filters = { ...state.filters, ...action.payload };
            saveState({
                products: state.products,
                currentProduct: state.currentProduct,
                ...state.filters,
                totalDocs: state.totalDocs,
                limit: state.limit,
                totalPages: state.totalPages,
                page: state.page,
                hasPrevPage: state.hasPrevPage,
                hasNextPage: state.hasNextPage,
            });
        },
        clearFilters: (state) => {
            state.filters = {};
            saveState({
                products: state.products,
                currentProduct: state.currentProduct,
                ...state.filters,
                totalDocs: state.totalDocs,
                limit: state.limit,
                totalPages: state.totalPages,
                page: state.page,
                hasPrevPage: state.hasPrevPage,
                hasNextPage: state.hasNextPage,
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    const responseData = action.payload.data;
                    state.products = responseData.docs || [];
                    state.totalDocs = responseData.totalDocs || 0;
                    state.limit = responseData.limit || 10;
                    state.totalPages = responseData.totalPages || 0;
                    state.page = responseData.page || 1;
                    state.pagingCounter = responseData.pagingCounter || 0;
                    state.hasPrevPage = responseData.hasPrevPage || false;
                    state.hasNextPage = responseData.hasNextPage || false;
                }
                // Persist after fetching products
                saveState({
                    products: state.products,
                    currentProduct: state.currentProduct,
                    ...state.filters,
                    totalDocs: state.totalDocs,
                    limit: state.limit,
                    totalPages: state.totalPages,
                    page: state.page,
                    hasPrevPage: state.hasPrevPage,
                    hasNextPage: state.hasNextPage,
                });
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                toast.error(action.payload as string);
            });
    }
})

export const {
    setProducts,
    setCurrentProduct,
    updateProduct,
    setFilters,
    clearFilters,
} = productSlice.actions

export default productSlice.reducer