import express, { Express } from "express";
import cors from "cors";
import config from "./config";
import { deleteCategory, getCategories, insertCategory } from "./db/helpers/category-request.helper";
import { deletePlace, getPlaces, insertPlace } from "./db/helpers/place-request.helper";
import {
    getSolvedProblems,
    getUnsolvedProblems,
    insertProblem,
    markProblemAsSolved,
    markProblemAsUnsolved,
    rejectProblem,
    takeOnProblem,
    updateProblem,
} from "./db/helpers/problem-request.helper";
import { addNewAdministrator, changeEmail, changePassword, deleteAdministrator, getAdmins, login } from "./db/helpers/administrator-request.helper";
import { getCommentsToProblem, insertCommentToProblem } from "./db/helpers/comment-request.helper";
import { sendNotifications, subscribe } from "./db/helpers/subscription-request.helper";
import authenticateToken from "./utils/token-authentication.helper";
import { getLogData } from "./db/helpers/log-request.helper";
import { setNewPIN } from "./db/helpers/pin-request";

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
app.get("/send-notification", sendNotifications);

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
app.get("/get-solved-problems", authenticateToken, getSolvedProblems);
app.get("/get-comments", authenticateToken, getCommentsToProblem);
app.get("/get-logs", authenticateToken, getLogData);

// POST ROUTES
app.post("/insert-comment", authenticateToken, insertCommentToProblem);
app.post("/insert-category", authenticateToken, insertCategory);
app.post("/insert-place", authenticateToken, insertPlace);
app.post("/add-new-administrator", authenticateToken, addNewAdministrator)
// UPDATE ROUTES
app.put("/update-problem", authenticateToken, updateProblem);
app.put("/take-on-problem", authenticateToken, takeOnProblem);
app.put("/reject-problem", authenticateToken, rejectProblem);
app.put("/mark-problem-as-solved", authenticateToken, markProblemAsSolved);
app.put("/mark-problem-as-unsolved", authenticateToken, markProblemAsUnsolved);
app.put("/change-password", authenticateToken, changePassword);
app.put("/change-email", authenticateToken, changeEmail);
app.put("/new-pin", authenticateToken, setNewPIN);

// DELETE ROUTES
app.delete("/delete-category", authenticateToken, deleteCategory);
app.delete("/delete-place", authenticateToken, deletePlace);
app.delete("/delete-administrator", authenticateToken, deleteAdministrator);

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
