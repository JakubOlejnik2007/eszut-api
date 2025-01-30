import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "../../config";
import IUser from "../../types/user";



const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    verify(token, config.secrets.access, (err, user: any) => {
        console.log(token, err)
        if (err) {
            return res.status(403).json({ message: 'Unauthorized access: Invalid or expired token' });
        }


        req.body.user = user as IUser;
        next();
    });
};

export default authenticateToken;
