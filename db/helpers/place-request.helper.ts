import { Request, Response } from "express"
import Place from "../models/place.helper";
import { isPlaceUsed } from "./problem-request.helper";
import EUserRole from "../../types/userroles.enum";


export const getPlaces = async (req: Request, res: Response) => {
    try {
        const places: any = await Place.find({}).sort('name');
        res.status(200)
        res.send(places);

    } catch {
        res.sendStatus(503);
    }
};

export const insertPlace = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) return res.sendStatus(403);
        if (!req.body.name) throw new Error();
        Place.create(req.body);
        res.sendStatus(200);
    } catch {
        res.sendStatus(503);
    }
};

export const deletePlace = async (req: Request, res: Response) => {
    try {
        if (req.body.user.role !== EUserRole.ADMIN) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!req.body.PlaceID) {
            return res.status(400).json({ message: "PlaceID is required" });
        }

        if (await isPlaceUsed(req.body.PlaceID)) {
            return res.status(423).json({ message: "Place is currently in use" });
        }

        await Place.findByIdAndDelete(req.body.PlaceID);
        return res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
        return res.status(503).json({ message: "Service unavailable" });
    }
};


export const getPlaceName = async (id: string) => {
    try {
        const place = await Place.findById(id);
        return (place ? place.name : "");
    } catch {
        return ""
    }
}