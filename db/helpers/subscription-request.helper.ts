import { setVapidDetails, sendNotification } from "web-push";
import config from "../../config";
import Subscription from "../models/subscription.helper";
import { Request, Response } from "express";

setVapidDetails("mailto:jacobole2000@gmail.com", config.vapid.public, config.vapid.private);

export const subscribe = async (req: Request, res: Response) => {
    // Get pushSubscription object
    console.log("Executed");
    const raw_subscription = req.body;
    try {
        const subscription: any = new Subscription(raw_subscription);
        let a = await Subscription.find({
            endpoint: subscription.endpoint,
        });
        console.log(a, subscription);
        if (a.length < 1) subscription.save();
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.status(201).json();
};

export const sendNotifications = async () => {
    try {
        const subscriptions = await Subscription.find({});
        const payload = JSON.stringify({
            title: "Nowe zgłoszenie w bazie danych",
            description: "Warto się tym zająć!",
        });
        subscriptions.forEach(async (subscription: any) => {
            try {
                sendNotification(subscription, payload);
            } catch (error) {
                console.log(`Sending notification failed: ${error}.`);
            }
        });
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};
