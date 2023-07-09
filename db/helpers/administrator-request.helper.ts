require("../db_config");
import { Request, Response } from "express"
import { compare } from "bcrypt"
import Administrator from "../models/administrator.helper";


export const getAdmins = async (req: Request, res: Response) => {
    try {
        const administrators:any = await Administrator.find({});
        
        res.send(administrators);

    } catch (error) {
        res.send({
            text: error
        });
    }
};

export const login = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const admin: any = await Administrator.findOne({
            email: req.body.email
        })
        if(await compare(req.body.password, admin.password)) {
            res.send({
                status: "OK",
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            })
        } else {
            throw new Error("Invalid user data!")
        }
    } catch (error) {
        res.send({
            status: "ERROR",
            text: error
        })
    }
}
