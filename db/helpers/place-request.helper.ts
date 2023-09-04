import { Request, Response } from "express"
import Place from "../models/place.helper";
import { isPlaceUsed } from "./problem-request.helper";


export const getPlaces = async (req: Request, res: Response) => {
    try {
        const places:any = await Place.find({}).sort('name');
        res.status(200)
        res.send(places);

    } catch {
        res.sendStatus(503);
    }
};

export const insertPlace = async (req: Request, res: Response) => {
    try {
        if (!req.body.name) throw new Error();
        Place.create(req.body);
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const deletePlace = async (req: Request, res: Response) => {
    try {
        if (!req.body.PlaceID) throw new Error();

        if (await isPlaceUsed(req.body.PlaceID)) throw new Error();
        
        await Place.findByIdAndDelete(req.body.PlaceID);
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const getPlaceName = async(id: string) => {
    try {
        const place = await Place.findById(id);
        return (place ? place.name : "");
    } catch {
        return ""
    }
}