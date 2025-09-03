import { Document } from "mongoose";

export interface IJournalEntry {
    title: string;
    content: string;
    author: string; // Reference to User
    category: string;
    tags: string[];
    images: string[];
    isPublished: boolean;
    publishDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IJournal extends Document {
    entries: IJournalEntry[];
    slug: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
