import { Request, Response } from "express"
import Comment from "../models/comment.helper";
import { IComment } from "../../types/db-types";

export const getCommentsToProblem = async (req: Request, res: Response) => {
    try {
        const comments: any = await Comment.find({ProblemID: req.query.ProblemID})
            .populate("AdministratorID", "name").sort({date: 1})
            console.log(comments)
        const commentsWithFixedForeigns = comments.map((comment: any) => ({
            ...comment._doc,
            administratorName: comment.AdministratorID.name
        }))
        console.log(commentsWithFixedForeigns)
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
        if(!req.body.ProblemID || !req.body.content || !req.body.AdministratorID) throw new Error;


        const comment: IComment = {
            ...req.body, date: Date.now()
        };
        await Comment.create(comment);
        res.sendStatus(201)

    } catch (error) {
        console.log(error)
        res.sendStatus(503)
    }
}
