import { logout } from '@/api/userApis';
import { BackendResponse, IUser } from '@/types/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

interface UserState {
    user: IUser | null;
    isAuthenticated: boolean;
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
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            // Remove user from localStorage
            localStorage.removeItem('user');
            // localStorage.removeItem('order');
            // localStorage.removeItem('product');
            // localStorage.removeItem('journal');
        },
        updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                // Update user in localStorage
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        syncAuth: (state) => {
            const userData = localStorage.getItem("user");
            // const handleLogOut = async () => {
            //     // Perform logout logic here
            //     try {
            //         const response = (await logout()) as BackendResponse;
            //         if (response.data.success) {
            //             // show success toast
            //             toast.success("Logged out successfully!");
            //         } else {
            //             toast.error(response?.response?.data?.message || "Logout failed");
            //         }
            //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //     } catch (error: any) {
            //         toast.error(error.response?.data?.message || "Error Logging out User!");
            //     }
            // };
            if (userData) {
                state.isAuthenticated = true;
                state.user = JSON.parse(userData);
            } else {
                state.isAuthenticated = false;
                state.user = null;
                // handleLogOut();
            }
        },
    },
})

export const { setUser, clearUser, updateUser, syncAuth } = userSlice.actions
export default userSlice.reducer