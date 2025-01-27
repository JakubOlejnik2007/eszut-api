
import { sign } from "jsonwebtoken";
import config from "../../config";
import IUser from "../../types/user";
export const generateAccessToken = (user: IUser, expiresIn: string = "30m") => {
    const userToSign: IUser = { email: user.email, role: user.role, userId: user.userId, username: user.username }
    console.log(user)
    return sign(userToSign, config.secrets.longPeriod, { expiresIn });
};