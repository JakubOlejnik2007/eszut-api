import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "../../config";
import IUser from "../../types/user";
import TokenService from "../../db/helpers/TokenService";



const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    let isAuthenticated = false;

    await verify(token, config.secrets.longPeriod, async (err, user: any) => {

        if (err) return;

        const result = await TokenService.isValidToken(token)

        if (!result) return;

        req.body.user = user as IUser;
        isAuthenticated = true;
    });

    if (isAuthenticated) return next();


    verify(token, config.secrets.access, (err, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized access: Invalid or expired token' });
        }


        req.body.user = user as IUser;
        next();
    });
};

export default authenticateToken;
