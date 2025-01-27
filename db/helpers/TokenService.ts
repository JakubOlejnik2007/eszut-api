import mongoose from 'mongoose';
import Token, { IToken } from '../models/token.model';
import IUser from '../../types/user';
import { generateAccessToken } from '../../utils/auth/generate-token';

class TokenService {
  async createToken(user: IUser, expiresInDays: number): Promise<IToken> {



    const token = generateAccessToken(user, `${expiresInDays}d`);

    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    return await Token.create({ userEmail: user.email, token, expiresAt });
  }

  async deleteToken(token: string): Promise<boolean> {
    const result = await Token.deleteOne({ token });
    return result.deletedCount === 1;
  }

  async getActiveTokens(userId: mongoose.Types.ObjectId): Promise<IToken[]> {
    return await Token.find({ userId, expiresAt: { $gt: new Date() } });
  }

  async isValidToken(token: string): Promise<boolean> {
    const tokenDoc = await Token.findOne({ token, expiresAt: { $gt: new Date() } });
    return !!tokenDoc;
  }
}

export default new TokenService();