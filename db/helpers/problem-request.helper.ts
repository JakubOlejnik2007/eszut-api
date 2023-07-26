import { IProblem } from "../../types/db-types";
import Category from "../models/category.helper";
import Problem from "../models/problem.helper";
import { Request, Response } from "express";

export const getUnsolvedProblems = async (req: Request, res: Response) => {
    try {
        const problems: any = await Problem.find({ isSolved: false })
            .sort("priority")
            .populate("CategoryID", "name")
            .populate("PlaceID", "name")
            .populate("whoDealsID", "name");
        const problemsWithCategoryName = problems.map((problem: any) => ({
            ...problem._doc,
            categoryName: problem.CategoryID.name,
            placeName: problem.PlaceID.name,
            whoDeals: problem.whoDealsID ? problem.whoDealsID.name : "",
            whoDealsID: problem.whoDealsID ?  problem.whoDealsID._id : ""
        }));
        res.status(200)
        res.send(problemsWithCategoryName);
    } catch (error) {
        res.status(503)
        res.send({
            text: error,
        });
    }
};

export const getSolvedProblems = async (req: Request, res: Response) => {
    try {
        const problems: any = await Problem.find({
            isSolved: true,
        });
        res.status(200)
        res.send(problems);
    } catch (error) {
        res.status(503)
        res.send({
            text: error,
        });
    }
};

export const insertProblem = async (req: Request, res: Response) => {
    try {
        const problem = req.body as IProblem;
        
        console.log(problem);
        await Problem.create(problem);
        res.sendStatus(200)
    } catch (error) {
        res.status(503)
        res.send({
            text: error,
        });
    }
};

export const updateProblem = async (req: Request, res: Response) => {
    try {
        await Problem.findByIdAndUpdate(req.body.ProblemID, {
            priority: req.body.priority,
            CategoryID: req.body.CategoryID
        })
        res.sendStatus(200)
    } catch (error) {
        res.status(503)
        res.send({
            text: error,
        });
    }
}
