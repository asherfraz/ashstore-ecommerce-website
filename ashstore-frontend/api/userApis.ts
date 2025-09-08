import { ForgotPasswordValues } from "@/app/auth/forgot-password/page";
import axiosApi from "./axiosInstance";
import { LoginValues } from "@/app/auth/login/page";
import { RegisterValues } from "@/app/auth/register/page";
import { ResetPasswordValues } from "@/app/auth/reset-password/[token]/page";
import { PersonalInfoValues } from "@/components/user-account-management/UserPersonalInfo";
import { AddressFormValues } from "@/components/user-account-management/UserAddressInfo";
import { PaymentMethodFormValues } from "@/components/user-account-management/UserPaymentsMethods";
import { ChangePasswordFormValues } from "@/components/user-account-management/UserPasswordChange";


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

//*** Two Factor Auth Apis
export const enableTwoFactorAuth = async (userId: string) => {
    try {
        const response = await axiosApi.post(`/user/2fa/${userId}`);
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


// Change Password Api's
export const userHasNoPass = async (userId: string) => {
    try {
        const response = await axiosApi.get(`/user/hasnopassword/${userId}`);
        return response;
    } catch (error) {
        return error;
    }
}
export const changeUserPassword = async (userId: string, data: ChangePasswordFormValues) => {
    try {
        const response = await axiosApi.put(`/user/change-password/${userId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const updateUserById = async (userId: string, data: PersonalInfoValues) => {
    try {
        const response = await axiosApi.patch(`/user/update/${userId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

// Api's for User Address Handling
export const addUserAddress = async (userId: string, data: AddressFormValues) => {
    try {
        const response = await axiosApi.post(`/user/address/${userId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}
export const updateUserAddress = async (userId: string, addressId: string, data: AddressFormValues) => {
    try {
        const response = await axiosApi.patch(`/user/update/${userId}/address/${addressId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}
export const deleteUserAddress = async (userId: string, addressToDeleteId: string) => {
    try {
        const response = await axiosApi.delete(`/user/${userId}/address/${addressToDeleteId}`);
        return response;
    } catch (error) {
        return error;
    }
}

// Api's for User Payment Methods Handling
export const addUserPaymentMethod = async (userId: string, data: PaymentMethodFormValues) => {
    try {
        const response = await axiosApi.post(`/user/payment/${userId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}
export const updateUserPaymentMethod = async (userId: string, paymentMethodId: string, data: PaymentMethodFormValues) => {
    try {
        const response = await axiosApi.patch(`/user/update/${userId}/payment/${paymentMethodId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}
export const deleteUserPaymentMethod = async (userId: string, paymentMethodIdToDelete: string) => {
    try {
        const response = await axiosApi.delete(`/user/${userId}/payment/${paymentMethodIdToDelete}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteUserAccount = async (userId: string) => {
    try {
        const response = await axiosApi.delete(`/user/delete/${userId}`);
        return response;
    } catch (error) {
        return error;
    }
}


