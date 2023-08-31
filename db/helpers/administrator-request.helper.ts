require("../db_config");
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import Administrator from "../models/administrator.helper";
import generateToken from "../../utils/token-generator.helper";
import { validate } from "email-validator";
import { isAdministratorAssignedToProblem } from "./problem-request.helper";
export const getAdmins = async (req: Request, res: Response) => {

    interface IAdministrator {
        _id: string;
        name: string;
        email: string;
        password: string;
    }

    try {
        const administrators: any = await Administrator.find({});
        res.status(200);
        res.send(administrators.map((admin: IAdministrator)  => {
            return {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            }
        }));
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
                AuthToken: generateToken(admin),
            });
        } else {
            throw new Error("Invalid user data!");
        }
    } catch (error) {
        res.sendStatus(503);
        console.log(error)
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        if (!req.body.AdministratorID) throw new Error();
        if (!req.body.newPassword) throw new Error();

        const admin = await Administrator.findById(req.body.AdministratorID);

        if (!admin) throw new Error();
        if (!(await compare(req.body.oldPassword, admin.password))) throw new Error();
        if (await compare(req.body.newPassword, admin.password)) throw new Error();

        admin.password = await hash(req.body.newPassword, 10);
        await admin.save();
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const changeEmail = async (req: Request, res: Response) => {
    try {
        if (!req.body.AdministratorID) throw new Error();
        if (!req.body.newEmail) throw new Error();

        const admin = await Administrator.findById(req.body.AdministratorID);

        if (!admin) throw new Error();
        if (req.body.newEmail === admin.email) throw new Error();
        if (!validate(req.body.newEmail)) throw new Error();
        admin.email = req.body.newEmail;
        await admin.save();
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const addNewAdministrator = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) throw new Error;

        console.log(req.body.password);

        const hashedPassword = await hash(req.body.password, 10);
        const admin = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }

        await Administrator.create(admin);
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const deleteAdministrator = async (req: Request, res: Response) => {
    try {
        if(!req.body.AdministratorID) throw new Error("No ID provided");

        if(await isAdministratorAssignedToProblem(req.body.AdministratorID)) throw new Error;

        await Administrator.findByIdAndDelete(req.body.AdministratorID);
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(503)
    }
}