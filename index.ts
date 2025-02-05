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
import { createToken, generateAccessToken, generateRefreshToken, setTokens } from "./utils/auth/generate-token";
import TokenService from "./db/helpers/TokenService";

require("./db/db_config");

//var serviceAccount = require("./serviceAccountKey.json");



// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });


const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ["http://localhost:5173", "https://eszut-api.tenco.waw.pl", "https://eszut.tenco.waw.pl"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        exposedHeaders: ["Authorization"],
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


/*
    PUBLIC ROUTES
*/
// GET ROUTES
app.get("/get-categories", getCategories);
app.get("/get-places", getPlaces);
app.get("/get-user-teams", async (req, res) => {

    const graphAccessToken = await getGraphAccessToken();
    res.send(await getUserGroups(graphAccessToken, req.query.id as string));
})

app.get("/set-tokens", setTokens)
app.get("/refresh-token", refreshToken)
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
app.get("/get-tokens", authenticateToken, async (req, res) => {
    const tokens = await TokenService.getActiveTokens(req.body.user.email);
    res.send(tokens);
})

// POST ROUTES
app.post("/insert-comment", authenticateToken, insertCommentToProblem);
app.post("/insert-category", authenticateToken, insertCategory);
app.post("/insert-place", authenticateToken, insertPlace);
app.post("/create-token", authenticateToken, createToken);
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
app.delete("/delete-token", authenticateToken, async (req, res) => {
    const tokenID = req.body.TokenID;
    const result = await TokenService.deleteToken(tokenID)
    res.sendStatus(result ? 200 : 401);
})

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
