import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
    tokenName: string;
    userEmail: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

const TokenSchema: Schema = new Schema<IToken>({
    tokenName: { type: String, required: true },
    userEmail: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IToken>('Token', TokenSchema);