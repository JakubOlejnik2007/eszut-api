import mongoose from 'mongoose';
import Token, { IToken } from '../models/token.model';
import IUser from '../../types/user';
import { generateAccessToken } from '../../utils/auth/generate-token';

class TokenService {
    async createToken(user: IUser, expiresInDays: number, name: string): Promise<string> {

        const token = generateAccessToken(user, `${expiresInDays}d`);

        const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
        await Token.create({ userEmail: user.email, token, expiresAt, tokenName: name })
        return token;
    }

    async deleteToken(tokenID: string): Promise<boolean> {
        const result = await Token.findByIdAndDelete(tokenID);
        return result !== null;
    }

    async getActiveTokens(userEmail: string): Promise<IToken[]> {
        return await Token.find({ userEmail, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    }

    async isValidToken(token: string): Promise<boolean> {
        const tokenDoc = await Token.findOne({ token, expiresAt: { $gt: new Date() } });
        return !!tokenDoc;
    }
}

export default new TokenService();