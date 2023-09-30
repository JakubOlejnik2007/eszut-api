import { IProblem } from "../../types/db-types";
import Problem from "../models/problem.helper";
import { Request, Response } from "express";
import { sendNotifications } from "./subscription-request.helper";
import { getCategoryDefaultPriority, getCategoryName } from "./category-request.helper";
import { TProblemToSendEmail } from "../../types/email";
import { getPlaceName } from "./place-request.helper";
import { getAdministratorsEmails } from "./administrator-request.helper";
import { sendEmailsAboutNewProblem } from "../../utils/send-emails";

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
    try {
        const page = parseInt(String(req.query.page)) || 1;
        const perPage = 15;
        const skip = (page - 1) * perPage;
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
            whoSolved: problem.whoSolvedID ? problem.whoSolvedID.name : "",
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
        const defaultPriorityForCategory = await getCategoryDefaultPriority(req.body.CategoryID);

        const problem: IProblem = {
            ...req.body,
            priority: defaultPriorityForCategory,
            when: Date.now(),
        };

        const createdProblem = await Problem.create(problem);

        const emails = await getAdministratorsEmails();
        const categoryName = await getCategoryName(createdProblem.CategoryID.toString());
        const problemName = await getPlaceName(createdProblem.PlaceID.toString());
        const problemToSend: TProblemToSendEmail = {
            _id: createdProblem._id.toString(),
            priority: createdProblem.priority,
            what: createdProblem.what,
            when: createdProblem.when,
            who: createdProblem.who,
            where: problemName,
            categoryName,
        };

        sendEmailsAboutNewProblem(problemToSend, emails);

        sendNotifications();

        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const updateProblem = async (req: Request, res: Response) => {
    try {
        await Problem.findByIdAndUpdate(req.body.ProblemID, {
            priority: req.body.priority,
            CategoryID: req.body.CategoryID,
        });
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
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
        res.sendStatus(503);
    }
};

export const markProblemAsUnsolved = async (req: Request, res: Response) => {
    try {
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (!problem.isSolved) throw new Error();
        problem.isUnderRealization = true;
        problem.isSolved = false;
        problem.whoDealsID = req.body.AdministratorID;
        await problem.save();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(503);
    }
};

export const isCategoryUsed = async (CategoryID: string): Promise<boolean> =>
    Boolean(await Problem.findOne({ CategoryID }));
export const isPlaceUsed = async (PlaceID: string): Promise<boolean> => Boolean(await Problem.findOne({ PlaceID }));

export const isAdministratorAssignedToProblem = async (AdministratorID: string): Promise<boolean | Error> => {
    const problems = await Problem.find({
        $or: [
            {
                whoDealsID: AdministratorID,
                isUnderRealization: true,
            },
            {
                whoSolvedID: AdministratorID,
                isSolved: true,
            },
        ],
    });

    return problems.length > 0 ? true : false;
};

export const deleteProblems = async (req: Request, res: Response) => {
    try {
        req.body.problems.forEach(async (item: FormDataEntryValue) => {
            await Problem.findByIdAndDelete(item);
        });
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};
