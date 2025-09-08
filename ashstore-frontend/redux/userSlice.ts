import { IUser } from '@/types/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface UserState {
    user: IUser | null;
    isAuthenticated: boolean;
    userRole: "buyer" | "seller" | "both" | "admin" | undefined;
}

// Safe localStorage check (works only in browser)
const getUserFromStorage = (): IUser | null => {
    if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
};

const initialState: UserState = {
    user: getUserFromStorage(),
    isAuthenticated: !!getUserFromStorage(),
    userRole: getUserFromStorage()?.userType
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.userRole = action.payload.userType;

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.userRole = undefined;

            // Remove user from localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('order');
            localStorage.removeItem('product');
            localStorage.removeItem('journal');
        },
        updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                if (action.payload.userType) {
                    state.userRole = action.payload.userType;
                }
                // Update user in localStorage
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        // logout if manually localstorage cleared
        syncAuth: (state) => {
            const userData = localStorage.getItem("user");
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    state.isAuthenticated = true;
                    state.user = parsedUser;
                    state.userRole = parsedUser.userType;
                } catch (error) {
                    // Handle JSON parsing error
                    console.error("Error parsing user data from localStorage:", error);
                    state.isAuthenticated = false;
                    state.user = null;
                    state.userRole = undefined;
                    localStorage.removeItem('user');
                }
            } else {
                state.isAuthenticated = false;
                state.user = null;
                state.userRole = undefined;
            }
        },
        // switch current role manually
        setUserRole: (state, action: PayloadAction<'buyer' | 'seller' | 'both' | 'admin'>) => {
            state.userRole = action.payload;
        },
    },
})

export const { setUser, clearUser, updateUser, syncAuth, setUserRole } = userSlice.actions
export default userSlice.reducer