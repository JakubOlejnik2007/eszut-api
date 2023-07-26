import { sign } from "jsonwebtoken";
import { IUser } from "../types/db-types";
import config from "../config";

const generateToken = (user: IUser): string => {
    const token = sign({
        name: user.name,
        email: user.email,
    }, config.authentication.secret, { expiresIn: config.authentication.expiresIn });
    return token;
};

export default generateToken;
