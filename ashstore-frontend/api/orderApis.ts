import axiosApi from "./axiosInstance";
import { IOrder } from "@/redux/orderSlice";

// Get all orders for a user
export const getUserOrders = async () => {
    try {
        const response = await axiosApi.get("/orders/user");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all orders (admin only)
export const getAllOrders = async () => {
    try {
        const response = await axiosApi.get("/orders");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single order by ID
export const getOrderById = async (orderId: string) => {
    try {
        const response = await axiosApi.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new order
export const createOrder = async (data: Partial<IOrder>) => {
    try {
        const response = await axiosApi.post("/orders", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an order status
export const updateOrderStatus = async (orderId: string, status: IOrder['orderStatus']) => {
    try {
        const response = await axiosApi.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update payment status
export const updatePaymentStatus = async (orderId: string, status: IOrder['paymentStatus']) => {
    try {
        const response = await axiosApi.patch(`/orders/${orderId}/payment`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cancel an order
export const cancelOrder = async (orderId: string) => {
    try {
        const response = await axiosApi.post(`/orders/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
