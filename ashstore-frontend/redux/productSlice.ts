import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IProduct } from '@/types/types'

interface ProductState {
    products: IProduct[];
    currentProduct: IProduct | null;
    loading: boolean;
    error: string | null;
    filters: {
        category?: string;
        brand?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
    };
}

const initialState: ProductState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: {}
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        setProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.products = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentProduct: (state, action: PayloadAction<IProduct>) => {
            state.currentProduct = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateProduct: (state, action: PayloadAction<Partial<IProduct>>) => {
            if (state.currentProduct) {
                state.currentProduct = { ...state.currentProduct, ...action.payload };
            }
        },
        setFilters: (state, action: PayloadAction<ProductState['filters']>) => {
            state.filters = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {};
        }
    },
})

export const {
    setLoading,
    setError,
    setProducts,
    setCurrentProduct,
    updateProduct,
    setFilters,
    clearFilters
} = productSlice.actions

export default productSlice.reducer
