import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import journalReducer from "./journalSlice";
import cartReducer from "./cartSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
	reducer: {
		// User Management
		user: userReducer,
		// Product Management
		product: productReducer,
		// Cart Management
		cart: cartReducer,
		// Order Management
		order: orderReducer,
		// Journal Management
		journal: journalReducer,
	},
});

export default store;
