
import { sign, verify } from "jsonwebtoken";
import config from "../../config";
import IUser from "../../types/user";
import { Request, Response } from "express";
import { JwksClient } from "jwks-rsa";
import { getGraphAccessToken, getUserGroups } from "./get-user-teams";
import checkUserRole from "./check-user-role";
import TokenService from "../../db/helpers/TokenService";

export const generateAccessToken = (user: IUser, expiresIn: string = "30m") => {
    const userToSign: IUser = { email: user.email, role: user.role, userId: user.userId, username: user.username }
    return sign(userToSign, config.secrets.access, { expiresIn });
};

export const generateRefreshToken = (user: IUser) => {
    return sign(user, config.secrets.refresh, { expiresIn: '7d' });
};

export const setTokens = async (req: Request, res: Response) => {
    const MSAL_TOKEN = req.query.MSAL_TOKEN as string | null;

    if (!MSAL_TOKEN) {
        return res.status(400).send({ message: "MSAL_TOKEN is required" });
    }

    const client = new JwksClient({
        jwksUri: `https://login.microsoftonline.com/${config.EntraID.tenant}/discovery/v2.0/keys`
    });


    const getKey = (header: any, callback: any) => {
        client.getSigningKey(header.kid, function (err, key) {
            if (err) {
                callback(err, null);
            } else {
                const signingKey = (key as any).getPublicKey();
                callback(null, signingKey);
            }
        });
    }

    const verifyToken = (token: string) => {
        return new Promise((resolve, reject) => {
            verify(token, getKey, {
                audience: `api://${config.EntraID.client}`,
                issuer: `https://sts.windows.net/${config.EntraID.tenant}/`
            }, (err: any, decoded: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    const decodedToken = await verifyToken(MSAL_TOKEN);

    const graphAccessToken = await getGraphAccessToken();

    const teams = await getUserGroups(graphAccessToken, (decodedToken as any).oid);
    const importantData: IUser = {
        userId: (decodedToken as any).oid,
        username: (decodedToken as any).name,
        email: (decodedToken as any).upn,
        role: checkUserRole(teams)
    }



    res.send({
        accessToken: generateAccessToken(importantData),
        refreshToken: generateRefreshToken(importantData),
        user: importantData
    })

}

export const createToken = async (req: Request, res: Response) => {
    try {
        console.log(req.body)

        const user = req.body.user;
        const days = req.body.daysToExpire;
        const name = req.body.name;

        if (!days) {
            throw new Error("Time is required");
        }

        const token = await TokenService.createToken(user, parseInt(days as string), name as string);


        res.send({
            longPeriodAccessToken: token
        });
    }
    catch (err) {
        console.log(err)
        res.status(400);
    }
}