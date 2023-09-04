import { ILOG } from "../../types/db-types";
import LOG from "../models/log.helper";
import { Request, Response } from "express";

export const writeLog = async (data: ILOG) => {
    try{
        await LOG.create(data);
    } catch {
    }
}

export const getLogData = async (req: Request, res: Response) => {
    try {
        const page = parseInt(String(req.query.page)) || 1;
        const perPage = 50;
        const skip = (page - 1) * perPage;

        const totalCount = await LOG.countDocuments({});
        const logs = await LOG.find({}).sort("date").skip(skip).limit(perPage);

        res.status(200).json({
            totalCount,
            currentPage:page,
            items: logs
        })
    } catch  {
        res.sendStatus(503);
    }
}
