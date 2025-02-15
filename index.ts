import express, { Express } from "express";
import cors from "cors";
import config from "./config";
import { deleteCategory, getCategories, insertCategory } from "./db/helpers/category-request.helper";
import { deletePlace, getPlaces, insertPlace } from "./db/helpers/place-request.helper";
import {
    deleteProblems,
    getSolvedProblems,
    getUnsolvedProblems,
    getUnsolvedProblemsFromEmail,
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
import { TEmailMapped } from "./types/email";
import sendEmails from "./utils/send-emails";
import getTeamMembers from "./utils/getUsersFromTeam";
import { IProblem } from "./types/db-types";
import mongoose from "mongoose";

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

const testProblem = {
    priority: 2,
    PlaceID: new mongoose.Schema.Types.ObjectId("649879769b8d119d39347bb2"),
    whoName: 'Olejnik Jakub',
    whoEmail: 'olejnik.jakub@zstz-radzymin.pl',
    what: 'asdasdasd',
    when: 1739482240212,
    isSolved: false,
    isUnderRealization: false,
    CategoryID: new mongoose.Schema.Types.ObjectId("64ebb5340791e4fcf0c2937e"),
    _id: new mongoose.Schema.Types.ObjectId("67ae6480632529b266a5af80"),
    __v: 0
}

const htmlForEmail = (problem: IProblem) => {

    const priorityColor = problem.priority === 1 ? "rgba(255, 0, 34, 0.5)" : problem.priority === 2 ? "rgba(255, 0, 132, 0.5)" : "rgba(144, 0, 255, 0.5)";

    return `
    <div style="width: 100%; display: flex; justify-content: center; background-color: #f0f0f0;">
    <div style="font-family: Arial, sans-serif; background-color: #222; color: white; padding: 20px; border: 1px solid #444; border-radius: 5px; max-width: 500px;">
      <h2 style="border-bottom: 5px solid ${priorityColor}; padding-bottom: 5px;">Problem z internetem</h2>
      <p><strong>Data zgłoszenia:</strong> 10.02.2025, 20:58:08</p>
      <p><strong>Sala:</strong> 10</p>
      <p><strong>Zgłaszający:</strong> Olejnik Jakub (olejnik.jakub@zstz-radzymin.pl)</p>
      <p><strong>Opis:</strong> asdasd</p>
    </div></div>
  `;
}

app.get("/mail", (req, res) => {
    res.send(htmlForEmail(testProblem));
    return;
    //const emailList: (string | TEmailMapped)[] = [
    //    { email: 'olejnik.jakub@zstz-radzymin.pl', otherEmails: ['jacobole2000@gmail.com'] },
    //    'jacobole@wp.pl'
    //];

    const emailSubject = "Welcome to Our Service";
    const emailContent = htmlForEmail(testProblem);

    //sendEmails(["jacobole2000@gmail.com"], emailSubject, emailContent);
    res.sendStatus(200);
})

app.get("/members", async (req, res) => {
    const teamId = "d0287945-f693-4323-a88f-ac0e118cee55";

    const result = await getTeamMembers(teamId);

    console.log(result);

    const emails: string[] = [];

    result.forEach((member: any) => {
        emails.push(member.email);
    })

    console.log(emails);

    res.send(emails);
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
app.get("/get-unsolved-problems-from-email", authenticateToken, getUnsolvedProblemsFromEmail)
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
