require("../db_config");
import { Request, Response } from "express";
import { compare } from "bcrypt";
import Administrator from "../models/administrator.helper";
import generateToken from "../../helpers/token-generator.helper";

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const administrators: any = await Administrator.find({});
        res.status(200);
        res.send(administrators);
    } catch (error) {
        res.send({
            text: error,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const admin: any = await Administrator.findOne({
            email: req.body.email,
        });
        if (await compare(req.body.password, admin.password)) {
            res.status(200).send({
                id: admin._id,
                name: admin.name,
                email: admin.email,
                AuthToken: generateToken(admin)
            });
        } else {
            throw new Error("Invalid user data!");
        }
    } catch (error) {
        res.status(503);
        res.send({
            text: error,
        });
    }
};
