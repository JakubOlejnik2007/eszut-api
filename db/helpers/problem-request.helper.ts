import { IProblem } from "../../types/db-types";
import Problem from "../models/problem.helper";
import { Request, Response } from "express";
import { getCategoryDefaultPriority, getCategoryName } from "./category-request.helper";
import { TProblemToSendEmail } from "../../types/email";
import { getPlaceName } from "./place-request.helper";
import { sendEmailsAboutNewProblem } from "../../utils/send-emails";
import checkUserRole from "../../utils/auth/check-user-role";
import EUserRole from "../../types/userroles.enum";
import { writeLog } from "./log-request.helper";
import LOGTYPES from "../../types/logtypes.enum";

export const getUnsolvedProblems = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }


        const problems: any = await Problem.find({ isSolved: false })
            .sort({ priority: 1, when: 1 })
            .populate("CategoryID", "name")
            .populate("PlaceID", "name")
        const problemsWithCategoryName = problems.map((problem: any) => ({
            ...problem._doc,
            categoryName: problem.CategoryID.name,
            categoryId: problem.CategoryID._id,
            placeName: problem.PlaceID.name,
            placeId: problem.PlaceID._id,
        }));
        res.status(200);
        res.send(problemsWithCategoryName);
    } catch (e) {
        const error = e as Error;
        writeLog({
            type: LOGTYPES.ERROR,
            userEmail: req.body.user.email ? req.body.user.email : "Unknown",
            date: Date.now(),
            content: `Unexpected error in getUnsolvedProblem: ${error.message}`
        });
        res.sendStatus(503);
    }
};

export const getSolvedProblems = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        const page = parseInt(String(req.query.page)) || 1;
        const perPage = 15;
        const skip = (page - 1) * perPage;
        const totalCount = await Problem.countDocuments({ isSolved: true });
        const problems = await Problem.find({ isSolved: true })
            .sort({ dateOfSolved: -1 })
            .populate("CategoryID", "name")
            .populate("PlaceID", "name")
            .skip(skip)
            .limit(perPage);
        console.log(problems[1])
        const problemsWithCategoryName = problems.map((problem: any) => ({
            ...problem._doc,
            categoryName: problem.CategoryID.name,
            placeName: problem.PlaceID.name,

        }));

        console.log(problemsWithCategoryName[1]);

        res.status(200).json({
            totalCount,
            currentPage: page,
            items: problemsWithCategoryName,
        });
    } catch (e) {
        const error = e as Error;
        writeLog({
            type: LOGTYPES.ERROR,
            userEmail: "Unknown",
            date: Date.now(),
            content: `Unexpected error in getSolvedProblem: ${error.message}`
        });
        res.sendStatus(503);
    }
};

export const insertProblem = async (req: Request, res: Response) => {
    if (req.body.user.role < EUserRole.USER) {
        return res.sendStatus(403);
    }
    try {
        const defaultPriorityForCategory = await getCategoryDefaultPriority(req.body.CategoryID);
        const problem: IProblem = {
            ...req.body,
            whoName: req.body.user.username,
            whoEmail: req.body.user.email,
            priority: defaultPriorityForCategory,
            when: Date.now(),
        };

        const createdProblem = await Problem.create(problem);

        //const emails = await getAdministratorsEmails();
        const categoryName = await getCategoryName(createdProblem.CategoryID.toString());
        const problemName = await getPlaceName(createdProblem.PlaceID.toString());
        const problemToSend: TProblemToSendEmail = {
            _id: createdProblem._id.toString(),
            priority: createdProblem.priority,
            what: createdProblem.what,
            when: createdProblem.when,
            whoName: createdProblem.whoName,
            whoEmail: createdProblem.whoEmail,
            where: problemName,
            categoryName,
        };

        //sendEmailsAboutNewProblem(problemToSend, emails);

        writeLog({
            date: Date.now(),
            content: `Problem ${createdProblem._id} added by ${req.body.user.username}`,
            userEmail: req.body.user.email,
            type: LOGTYPES.INFO,
        })

        res.sendStatus(200);
    } catch (e) {
        const error = e as Error;
        writeLog({
            type: LOGTYPES.ERROR,
            userEmail: "Unknown",
            date: Date.now(),
            content: `Unexpected error in insertProblem: ${error.message}`
        });
        res.sendStatus(503);
    }
};

export const updateProblem = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        await Problem.findByIdAndUpdate(req.body.ProblemID, {
            priority: req.body.priority,
            CategoryID: req.body.CategoryID,
            PlaceID: req.body.PlaceID
        });
        writeLog({
            date: Date.now(),
            content: `Problem ${req.body.ProblemID} updated by ${req.body.user.username}`,
            userEmail: req.body.user.email,
            type: LOGTYPES.INFO,
        })
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const takeOnProblem = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (problem.isUnderRealization) throw new Error();
        problem.isUnderRealization = true;
        problem.whoDealsEmail = req.body.user.email;
        problem.whoDealsName = req.body.user.username;
        await problem.save();
        writeLog({
            date: Date.now(),
            content: `Problem ${req.body.ProblemID} was taken by ${req.body.user.username}`,
            userEmail: req.body.user.email,
            type: LOGTYPES.INFO,
        })
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const rejectProblem = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (!problem.isUnderRealization) throw new Error();
        problem.isUnderRealization = false;
        await problem.save();
        writeLog({
            date: Date.now(),
            content: `Problem ${req.body.ProblemID} was rejected by ${req.body.user.username}`,
            userEmail: req.body.user.email,
            type: LOGTYPES.INFO,
        })
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const markProblemAsSolved = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (!problem.isUnderRealization) throw new Error();
        problem.isUnderRealization = false;
        problem.isSolved = true;
        problem.whoSolvedEmail = req.body.user.email;
        problem.whoSolvedName = req.body.user.username;
        problem.dateOfSolved = Date.now();
        await problem.save();
        writeLog({
            date: Date.now(),
            content: `Problem ${req.body.ProblemID} was marked as solved by ${req.body.user.username}`,
            userEmail: req.body.user.email,
            type: LOGTYPES.INFO,
        })
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(503);
    }
};

export const markProblemAsUnsolved = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        if (!req.body.ProblemID) throw new Error();
        const problem = await Problem.findById(req.body.ProblemID);
        if (!problem) throw new Error();
        if (!problem.isSolved) throw new Error();
        problem.isUnderRealization = true;
        problem.isSolved = false;
        problem.whoDealsName = req.body.user.username;
        problem.whoDealsEmail = req.body.user.email;
        await problem.save();
        res.sendStatus(200);
        writeLog({
            date: Date.now(),
            content: `Problem ${req.body.ProblemID} was marked as unsolved by ${req.body.user.username}`,
            userEmail: req.body.user.email,
            type: LOGTYPES.INFO,
        })
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
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.sendStatus(403);
        }
        req.body.problems.forEach(async (item: FormDataEntryValue) => {
            await Problem.findByIdAndDelete(item);
        });
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};
