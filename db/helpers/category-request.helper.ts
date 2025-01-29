import { Request, Response } from "express";
import Category from "../models/category.helper";
import { isCategoryUsed } from "./problem-request.helper";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories: any = await Category.find({});
        res.status(200);
        res.send(categories);
    } catch (e) {
        console.log(e)
        res.sendStatus(503);
    }
};

export const insertCategory = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.priority) throw new Error();
        Category.create(req.body);
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        if (!req.body.CategoryID) throw new Error();

        if (await isCategoryUsed(req.body.CategoryID)) throw new Error();

        await Category.findByIdAndDelete(req.body.CategoryID);
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const getCategoryName = async (id: string) => {
    try {
        const category = await Category.findById(id);
        return (category ? category.name : "");
    } catch (error) {
        return "";
    }
}

export const getCategoryDefaultPriority = async (id: string) => {
    try {
        const category = await Category.findById(id);
        return (category ? category.priority : "");
    } catch (error) {
        return "";
    }
}