import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IProduct, IAddress } from '@/types/types'

export interface IOrder {
    _id: string;
    user: string;
    products: Array<{
        product: IProduct;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    shippingAddress: IAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    trackingNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderState {
    orders: IOrder[];
    currentOrder: IOrder | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        setOrders: (state, action: PayloadAction<IOrder[]>) => {
            state.orders = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentOrder: (state, action: PayloadAction<IOrder>) => {
            state.currentOrder = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateOrder: (state, action: PayloadAction<Partial<IOrder>>) => {
            if (state.currentOrder) {
                state.currentOrder = { ...state.currentOrder, ...action.payload };
            }
        },
        addOrder: (state, action: PayloadAction<IOrder>) => {
            state.orders.push(action.payload);
        },
    },
})

export const {
    setLoading,
    setError,
    setOrders,
    setCurrentOrder,
    updateOrder,
    addOrder
} = orderSlice.actions

export default orderSlice.reducer
