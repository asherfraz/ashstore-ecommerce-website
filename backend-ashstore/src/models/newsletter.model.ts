import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscription extends Document {
    email: string;
    userId?: mongoose.Types.ObjectId;
    isSubscribed: boolean;
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isSubscribed: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const NewsletterSubscriptionModel = mongoose.model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema, 'newsletter_subscriptions');

export default NewsletterSubscriptionModel;

