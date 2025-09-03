import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import journalReducer from "./journalSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
	reducer: {
		user: userReducer,
		product: productReducer,
		order: orderReducer,
		journal: journalReducer,
	},
});

export default store;
