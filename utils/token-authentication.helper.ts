import { Request, Response, NextFunction } from "express";
import { Secret, verify } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import config from "../config";
import { getGraphAccessToken, getUserGroups } from "./get-user-teams";
import checkUserRole from "./check-user-role";

const client = new JwksClient({
    jwksUri: `https://login.microsoftonline.com/${config.EntraID.tenant}/discovery/v2.0/keys`
});

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            callback(err, null);
        } else {
            const signingKey = (key as any).getPublicKey();
            callback(null, signingKey);
        }
    });
}

function verifyToken(token: string) {
    return new Promise((resolve, reject) => {
        verify(token, getKey, {
            audience: `api://${config.EntraID.client}`, // ID aplikacji (client ID) twojego backendu
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



const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    try {
        const decodedToken: any = await verifyToken(token)
        const userId = decodedToken.oid;
        const graphAccessToken = await getGraphAccessToken(token);

        const userGroups = await getUserGroups(graphAccessToken, userId);
        console.log("User belongs to groups: ", userGroups);
        req.body.userrole = checkUserRole(userGroups)
        if (req.body.userrole === 0) {
            res.sendStatus(403);
            return;
        }
        req.body.userGroups = userGroups

        next();
    } catch (err) {
        console.error(err);
        res.sendStatus(401);
    }
};

export default authenticateToken;
