import { verify, sign } from "jsonwebtoken";
import { Request, Response } from "express";
import config from "../../config";

const refreshToken = (req: Request, res: Response) => {
    const refreshToken = req.query.REFRESH_TOKEN as string;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    verify(refreshToken, config.secrets.refresh, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = sign(
            {
                userId: user.userId,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            config.secrets.access,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    });
};

export default refreshToken;