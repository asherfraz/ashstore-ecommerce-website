
import mongoose, { Document, Schema, Model } from 'mongoose';


export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: { type: String, required: true }
}, {
    timestamps: true
});


const RefreshTokenModel: Model<IRefreshToken> = mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema, 'tokens');

export default RefreshTokenModel;