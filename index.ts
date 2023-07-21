import express, { Express } from "express";
import cors from "cors";
import config from "./config";
import { getCategories } from "./db/helpers/category-request.helper";
import { getPlaces } from "./db/helpers/place-request.helper";
import {
    getSolvedProblems,
    getUnsolvedProblems,
    insertProblem,
    updateProblem,
} from "./db/helpers/problem-request.helper";
import { getAdmins, login } from "./db/helpers/administrator-request.helper";
import { deleteComment, getCommentsToProblem, insertCommentToProblem } from "./db/helpers/comment-request.helper";
import { sendNotifications, subscribe } from "./db/helpers/subscription-request.helper";

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

// UPDATE ROUTES

// DELETE ROUTES

/*
    PRIVATE ROUTES
*/

// GET ROUTES
app.get("/get-admins", getAdmins);
app.get("/get-unsolved-problems", getUnsolvedProblems);
app.get("/get-solved-problems", getSolvedProblems);
app.get("/get-comments", getCommentsToProblem);

// POST ROUTES
app.post("/login", login);
app.post("/create-comment", insertCommentToProblem);
app.post("/subscribe", subscribe)

// UPDATE ROUTES
app.put("/update-problem", updateProblem);

// DELETE ROUTES
app.delete("/delete-comment", deleteComment);

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
