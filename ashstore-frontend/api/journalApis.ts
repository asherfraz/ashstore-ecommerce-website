import axiosApi from "./axiosInstance";
import { IJournalEntry } from "@/redux/journalSlice";

// Get all journal entries
export const getAllEntries = async (params?: Record<string, string>) => {
    try {
        const response = await axiosApi.get("/journal", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single journal entry by ID
export const getEntryById = async (entryId: string) => {
    try {
        const response = await axiosApi.get(`/journal/${entryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new journal entry
export const createEntry = async (data: Partial<IJournalEntry>) => {
    try {
        const response = await axiosApi.post("/journal", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update a journal entry
export const updateEntry = async (entryId: string, data: Partial<IJournalEntry>) => {
    try {
        const response = await axiosApi.patch(`/journal/${entryId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a journal entry
export const deleteEntry = async (entryId: string) => {
    try {
        const response = await axiosApi.delete(`/journal/${entryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get entries by category
export const getEntriesByCategory = async (category: IJournalEntry['category']) => {
    try {
        const response = await axiosApi.get(`/journal/category/${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Archive a journal entry
export const archiveEntry = async (entryId: string) => {
    try {
        const response = await axiosApi.patch(`/journal/${entryId}/archive`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
