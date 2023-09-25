import PIN from "../models/pin";
import { Request, Response } from "express";
export const getPIN = async (): Promise<string> => {
    try {
        const pin: any = await PIN.findOne({});
        if (!pin) throw new Error();
        return pin.pin;
    } catch (e) {
        console.log(e);
    }
    return "";
};

export const setNewPIN = async (req: Request, res: Response) => {
    try {
        if (!req.body.newPIN) throw new Error();
        await PIN.findOneAndDelete({});
        const pin = {
            pin: req.body.newPIN
        }
        PIN.create(pin);
        res.sendStatus(200)
    } catch(e) {
        console.log(e)
        res.sendStatus(503)
    }
};
