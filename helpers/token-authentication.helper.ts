import { Request, Response, NextFunction } from "express";
import { Secret, verify } from "jsonwebtoken";
import config from "../config";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    verify(token, config.authentication.secret as Secret, (err) => {
        if (err) {
            return res.sendStatus(403);
        }

        next();
    });
};

export default authenticateToken;
