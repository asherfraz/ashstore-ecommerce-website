import { Schema, model } from "mongoose";
import { IJournal, IJournalEntry } from "../types/journal.types";

const JournalEntrySchema = new Schema<IJournalEntry>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const JournalSchema = new Schema<IJournal>({
    entries: [JournalEntrySchema],
    slug: { type: String, required: true, unique: true }, // slug means URL-friendly version of the title
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

// Indexes
JournalSchema.index({ "entries.title": "text", "entries.content": "text" });
JournalSchema.index({ slug: 1 });
JournalSchema.index({ "entries.publishDate": -1 });

const Journal = model<IJournal>("Journal", JournalSchema);
export default Journal;
