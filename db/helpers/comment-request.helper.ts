import { Request, Response } from "express"
import Comment from "../models/comment.helper";
import { IComment } from "../../types/db-types";

export const getCommentsToProblem = async (req: Request, res: Response) => {
    try {
        const comments: any = await Comment.find({ProblemID: req.query.ProblemID})
            .populate("AdministratorID", "name").sort({date: 1})
        const commentsWithFixedForeigns = comments.map((comment: any) => ({
            ...comment._doc,
            administratorName: comment.AdministratorID.name
        }))
        res.send(commentsWithFixedForeigns)
    } catch (error) {
        res.send({
            status: "ERROR",
            text: error
        })
    }
}

export const insertCommentToProblem = async (req: Request, res: Response) => {
    try {
        const comment = req.body as IComment;
        await Comment.create(comment);
        res.sendStatus(201)

    } catch (error) {
        console.log(error)
        res.status(503)
        res.send({
            text: error
        })
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    console.log(req.body.id)
    try {
        await Comment.findByIdAndDelete(req.body.id);
        res.sendStatus(200)
    } catch (error) {
        res.status(503)
        res.send({
            text: error
        })
    }
}