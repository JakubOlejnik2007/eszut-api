
import { sign } from "jsonwebtoken";
import config from "../../config";
import IUser from "../../types/user";
export const generateAccessToken = (user: IUser, expiresIn: string = "30m") => {
    return sign(user, config.secrets.access, { expiresIn });
};