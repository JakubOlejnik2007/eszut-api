import { Request, Response } from "express"
import Comment from "../models/comment.helper";
import { IComment } from "../../types/db-types";
import EUserRole from "../../types/userroles.enum";

export const getCommentsToProblem = async (req: Request, res: Response) => {
    try {
        const comments: any = await Comment.find({ ProblemID: req.query.ProblemID })
            .sort({ date: -1 })
        res.send(comments)
    } catch (error) {
        res.send({
            status: "ERROR",
            text: error
        })
    }
}

export const insertCommentToProblem = async (req: Request, res: Response) => {
    try {
        if (!req.body.ProblemID || !req.body.content || req.body.user.role !== EUserRole.ADMIN) throw new Error;

        const comment: IComment = {
            ...req.body, date: Date.now(), authorName: req.body.user.username, authorEmail: req.body.user.email
        };
        await Comment.create(comment);
        res.sendStatus(201)

    } catch {
        res.sendStatus(503)
    }
}
