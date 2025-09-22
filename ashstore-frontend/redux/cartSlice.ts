// redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "@/types/types";

interface CartItem {
    product: IProduct;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IProduct>) => {
            const existing = state.items.find(item => item.product._id === action.payload._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.product._id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
