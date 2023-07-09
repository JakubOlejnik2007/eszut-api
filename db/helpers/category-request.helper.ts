require("../db_config");
import { Request, Response } from "express"
import Category from "../models/category.helper";


export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories:any = await Category.find({});
        
        res.send(categories);

    } catch (error) {
        res.send({
            text: error
        });
    }
};