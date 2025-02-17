import { Request, Response } from "express"
import EUserRole from "../../types/userroles.enum"
import Mail from "../models/mail.helper"

export const getUserMail = async (req: Request, res: Response) => {
    try {
        const mail: any = await Mail.find({ outlookMail: req.body.user.email })
        res.send(mail)
    } catch (error) {
        res.send({
            status: "ERROR",
            text: error
        })
    }
}

export const insertUserMail = async (req: Request, res: Response) => {
    try {
        if (!req.body.newMail || req.body.user.role !== EUserRole.ADMIN) throw new Error;

        await Mail.findOneAndDelete({ outlookMail: req.body.user.email })
        await Mail.create({ outlookMail: req.body.user.email, mappedTo: req.body.newMail })
        res.sendStatus(201)

    } catch (e) {
        console.log(e)
        res.sendStatus(503)
    }
}

export const getAllMappedMails = async () => {
    return await Mail.find();
}