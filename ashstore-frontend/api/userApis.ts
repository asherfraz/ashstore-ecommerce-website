import { ForgotPasswordValues } from "@/app/auth/forgot-password/page";
import axiosApi from "./axiosInstance";
import { LoginValues } from "@/app/auth/login/page";
import { RegisterValues } from "@/app/auth/register/page";
import { ResetPasswordValues } from "@/app/auth/reset-password/[token]/page";


export const register = async (data: RegisterValues) => {
    try {
        const response = await axiosApi.post("/user/register", data);
        return response;
    } catch (error) {
        return error;
    }
};
export const loginWithGoogle = async (data: { code: string }) => {
    try {
        const response = await axiosApi.post("/user/auth/google", data);
        return response;
    } catch (error) {
        return error;
    }
}

export const login = async (data: LoginValues) => {
    try {
        const response = await axiosApi.post("/user/login", data);
        return response;
    } catch (error) {
        return error;
    }
}
export const logout = async () => {
    try {
        const response = await axiosApi.post("/user/logout");
        return response;
    } catch (error) {
        return error;
    }
}

export const refresh = async () => {
    try {
        const response = await axiosApi.get("/user/refresh");
        return response;
    } catch (error) {
        return error;
    }
}

export const resetPasswordEmail = async (data: ForgotPasswordValues) => {
    try {
        const response = await axiosApi.post("/user/reset-password-email", data);
        return response;
    } catch (error) {
        return error;
    }
}

export const ResetPassword = async (token: string, data: ResetPasswordValues) => {
    try {
        const response = await axiosApi.post(`/user/reset-password/${token}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

///*** Two Factor Auth Apis

export const enableTwoFactorAuth = async () => {
    try {
        const response = await axiosApi.post(`/user/2fa/enable`);
        return response;
    } catch (error) {
        return error;
    }
}
export const generateTwoFactorAuthOTP = async (userId: string) => {
    try {
        const response = await axiosApi.post(`/user/2fa/generate/${userId}`);
        return response;
    } catch (error) {
        return error;
    }
}
export const verifyTwoFactorAuthOTP = async (userId: string, otp: string) => {
    try {
        const response = await axiosApi.post(`/user/2fa/verify/${userId}`, { otp });
        return response;
    } catch (error) {
        return error;
    }
}

export const verifyAccount = async (token: string) => {
    try {
        const response = await axiosApi.post(`/user/account/verify/${token}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const resendAccountVerificationEmail = async (userId: string, token: string) => {
    try {
        const response = await axiosApi.post(`/user/account/reverify/${userId}/${token}`);
        return response;
    } catch (error) {
        throw error;
    }
};


// export const userHasNoPass = async (userId) => {
//     try {
//         const response = await axiosApi.get(`/ user / hasnopassword / ${ userId }`);
//         return response;
//     } catch (error) {
//         return error;
//     }
// }

// export const changeUserPassword = async (userId, data) => {
//     try {
//         const response = await axiosApi.put(`/ user / change - password / ${ userId }`, data);
//         return response;
//     } catch (error) {
//         return error;
//     }
// }

// export const updateUserById = async (userId, data) => {
//     try {
//         const response = await axiosApi.patch(`/ user / update / ${ userId }`, data);
//         return response;
//     } catch (error) {
//         return error;
//     }
// }

// export const deleteUserAccount = async (userId) => {
//     try {
//         const response = await axiosApi.delete(`/ user / delete/${userId}`);
//         return response;
//     } catch (error) {
//         return error;
//     }
// }


