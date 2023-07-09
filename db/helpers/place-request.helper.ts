import { Request, Response } from "express"
import Place from "../models/place.helper";


export const getPlaces = async (req: Request, res: Response) => {
    try {
        const places:any = await Place.find({}).sort('name');
        res.send(places);

    } catch (error) {
        res.send({
            text: error
        });
    }
};