import { IProblem } from "../../types/db-types";
import Category from "../models/category.helper";
import Problem from "../models/problem.helper";
import { Request, Response } from "express";
import { sendNotifications } from "./subscription-request.helper";

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
            whoDealsID: problem.whoDealsID ? problem.whoDealsID._id : "",
        }));
        res.status(200);
        res.send(problemsWithCategoryName);
    } catch (error) {
        res.sendStatus(503);
    }
};

export const getSolvedProblems = async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const perPage = 15;
    const skip = (page - 1) * perPage;

    try {
        const totalCount = await Problem.countDocuments({ isSolved: true });
        const problems = await Problem.find({ isSolved: true })
            .sort("priority")
            .populate("CategoryID", "name")
            .populate("PlaceID", "name")
            .populate("whoSolvedID", "name")
            .skip(skip)
            .limit(perPage);
        const problemsWithCategoryName = problems.map((problem: any) => ({
            ...problem._doc,
            categoryName: problem.CategoryID.name,
            placeName: problem.PlaceID.name,
            whoSolved: problem.whoSolvedID ? problem.whoSolvedID.name : ""
        }));

        res.status(200).json({
            totalCount,
            currentPage: page,
            items: problemsWithCategoryName,
        });
    } catch (error) {
        res.sendStatus(503);
    }
};

export const insertProblem = async (req: Request, res: Response) => {
    try {
        const problem = req.body as IProblem;

        console.log(problem);
        await Problem.create(problem);
        res.sendStatus(200);
        sendNotifications();
    } catch (error) {
        res.status(503);
        res.send({
            text: error,
        });
    }
};

export const updateProblem = async (req: Request, res: Response) => {
    try {
        await Problem.findByIdAndUpdate(req.body.ProblemID, {
            priority: req.body.priority,
            CategoryID: req.body.CategoryID,
        });
        res.sendStatus(200);
    } catch (error) {
        res.status(503);
        res.send({
            text: error,
        });
    }
};

export const takeOnProblem = async (req: Request, res: Response) => {
    try {
        if (!req.body.AdministratorID || !req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (problem.isUnderRealization) throw new Error();
        problem.isUnderRealization = true;
        problem.whoDealsID = req.body.AdministratorID;
        await problem.save();
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const rejectProblem = async (req: Request, res: Response) => {
    try {
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (!problem.isUnderRealization) throw new Error();
        problem.isUnderRealization = false;
        await problem.save();
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const markProblemAsSolved = async (req: Request, res: Response) => {
    try {
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (!problem.isUnderRealization) throw new Error();
        problem.isUnderRealization = false;
        problem.isSolved = true;
        problem.whoSolvedID = req.body.AdministratorID;
        problem.dateOfSolved = Date.now();
        await problem.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(503);
    }
};
