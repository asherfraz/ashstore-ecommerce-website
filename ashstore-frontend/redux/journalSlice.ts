import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IJournalEntry {
    _id: string;
    title: string;
    content: string;
    type: 'system' | 'user' | 'admin';
    category: 'order' | 'product' | 'user' | 'system' | 'other';
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'archived';
    tags?: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

interface JournalState {
    entries: IJournalEntry[];
    currentEntry: IJournalEntry | null;
    loading: boolean;
    error: string | null;
    filters: {
        type?: string;
        category?: string;
        priority?: string;
        status?: string;
    };
}

const initialState: JournalState = {
    entries: [],
    currentEntry: null,
    loading: false,
    error: null,
    filters: {}
}

const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        setEntries: (state, action: PayloadAction<IJournalEntry[]>) => {
            state.entries = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentEntry: (state, action: PayloadAction<IJournalEntry>) => {
            state.currentEntry = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateEntry: (state, action: PayloadAction<Partial<IJournalEntry>>) => {
            if (state.currentEntry) {
                state.currentEntry = { ...state.currentEntry, ...action.payload };
            }
        },
        addEntry: (state, action: PayloadAction<IJournalEntry>) => {
            state.entries.push(action.payload);
        },
        setFilters: (state, action: PayloadAction<JournalState['filters']>) => {
            state.filters = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {};
        },
    },
})

export const {
    setLoading,
    setError,
    setEntries,
    setCurrentEntry,
    updateEntry,
    addEntry,
    setFilters,
    clearFilters
} = journalSlice.actions

export default journalSlice.reducer
