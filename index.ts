import express, { Express } from "express";
import cors from "cors";
import config from "./config";
import { getCategories } from "./db/helpers/category-request.helper";
import { getPlaces } from "./db/helpers/place-request.helper";
import {
    getSolvedProblems,
    getUnsolvedProblems,
    insertProblem,
    markProblemAsSolved,
    rejectProblem,
    takeOnProblem,
    updateProblem,
} from "./db/helpers/problem-request.helper";
import { getAdmins, login } from "./db/helpers/administrator-request.helper";
import { deleteComment, getCommentsToProblem, insertCommentToProblem } from "./db/helpers/comment-request.helper";
import { sendNotifications, subscribe } from "./db/helpers/subscription-request.helper";
import authenticateToken from "./helpers/token-authentication.helper";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/*
    PUBLIC ROUTES
*/
// GET ROUTES
app.get("/get-categories", getCategories);
app.get("/get-places", getPlaces);
app.get("/send-notification", sendNotifications)

// POST ROUTES
app.post("/report-problem", insertProblem);
app.post("/login", login);
app.post("/subscribe", subscribe);

// UPDATE ROUTES

// DELETE ROUTES

/*
    PRIVATE ROUTES
*/


// GET ROUTES
app.get("/get-admins", authenticateToken, getAdmins);
app.get("/get-unsolved-problems", authenticateToken, getUnsolvedProblems);
app.get("/get-solved-problems"/*, authenticateToken*/, getSolvedProblems);
app.get("/get-comments", authenticateToken, getCommentsToProblem);


//sadasdas

// POST ROUTES
app.post("/create-comment", insertCommentToProblem);

// UPDATE ROUTES
app.put("/update-problem", authenticateToken, updateProblem);
app.put("/take-on-problem", authenticateToken, takeOnProblem);
app.put("/reject-problem", authenticateToken, rejectProblem);
app.put("/mark-problem-as-solved", authenticateToken, markProblemAsSolved);
app.put("/mark-problem-as-unsolved", authenticateToken);

// DELETE ROUTES
app.delete("/delete-comment", authenticateToken, deleteComment);

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
