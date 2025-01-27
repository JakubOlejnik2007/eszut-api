import express, { Express } from "express";
import cors from "cors";
import config from "./config";
import { deleteCategory, getCategories, insertCategory } from "./db/helpers/category-request.helper";
import { deletePlace, getPlaces, insertPlace } from "./db/helpers/place-request.helper";
import {
    deleteProblems,
    getSolvedProblems,
    getUnsolvedProblems,
    insertProblem,
    markProblemAsSolved,
    markProblemAsUnsolved,
    rejectProblem,
    takeOnProblem,
    updateProblem,
} from "./db/helpers/problem-request.helper";
import { getCommentsToProblem, insertCommentToProblem } from "./db/helpers/comment-request.helper";
import authenticateToken from "./utils/auth/token-authentication.helper";
import { getLogData } from "./db/helpers/log-request.helper";
import { sign, verify } from "jsonwebtoken";
import { getGraphAccessToken, getUserGroups } from "./utils/auth/get-user-teams";
import * as admin from "firebase-admin";
import { JwksClient } from "jwks-rsa";
import IUser from "./types/user";
import EUserRole from "./types/userroles.enum";
import checkUserRole from "./utils/auth/check-user-role";
import refreshToken from "./utils/auth/refresh-token";
import { generateAccessToken } from "./utils/auth/generate-token";
import TokenService from "./db/helpers/TokenService";

require("./db/db_config");

//var serviceAccount = require("./serviceAccountKey.json");



// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });


const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/*
    PUBLIC ROUTES
*/
// GET ROUTES

app.post("/token", (req, res) => {

    console.log(req.body);

    res.sendStatus(200);

})

app.get("/get-categories", getCategories);
app.get("/get-places", getPlaces);
app.get("/get-user-teams", async (req, res) => {
    console.log(req.query.id);

    const graphAccessToken = await getGraphAccessToken();
    res.send(await getUserGroups(graphAccessToken, req.query.id as string));
})
// POST ROUTES
app.post("/report-problem", authenticateToken, insertProblem);

// UPDATE ROUTES

// DELETE ROUTES

/*
    PRIVATE ROUTES
*/

// GET ROUTES
app.get("/get-unsolved-problems", authenticateToken, getUnsolvedProblems);
app.get("/get-solved-problems", authenticateToken, getSolvedProblems);
app.get("/get-comments", authenticateToken, getCommentsToProblem);
app.get("/get-logs", authenticateToken, getLogData);
app.get("/get-user-role", authenticateToken, (req, res) => {
    res.send({ role: req.body.user.role });
})

// POST ROUTES
app.post("/insert-comment", authenticateToken, insertCommentToProblem);
app.post("/insert-category", authenticateToken, insertCategory);
app.post("/insert-place", authenticateToken, insertPlace);
// UPDATE ROUTES
app.put("/update-problem", authenticateToken, updateProblem);
app.put("/take-on-problem", authenticateToken, takeOnProblem);
app.put("/reject-problem", authenticateToken, rejectProblem);
app.put("/mark-problem-as-solved", authenticateToken, markProblemAsSolved);
app.put("/mark-problem-as-unsolved", authenticateToken, markProblemAsUnsolved);

// DELETE ROUTES
app.delete("/delete-category", authenticateToken, deleteCategory);
app.delete("/delete-place", authenticateToken, deletePlace);
app.delete("/delete-problems", authenticateToken, deleteProblems)

app.get("/set-tokens", async (req, res) => {
    const MSAL_TOKEN = req.query.MSAL_TOKEN as string | null;
    const TIME_FOR_TOKEN = req.query.TIME_FOR_TOKEN as string | null;
    console.log(MSAL_TOKEN);

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


    const generateRefreshToken = (user: IUser) => {
        return sign(user, config.secrets.refresh, { expiresIn: '7d' });
    };

    res.send({
        accessToken: generateAccessToken(importantData),
        refreshToken: generateRefreshToken(importantData),
        user: importantData
    })

})

app.post("/create-token", authenticateToken, async (req, res) => {
    try {

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
});

app.get("/get-tokens", authenticateToken, async (req, res) => {
    const tokens = await TokenService.getActiveTokens(req.body.user.userEmail);
    console.log(tokens);
    res.send(tokens);
})

app.get("/refresh-token", refreshToken)

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
