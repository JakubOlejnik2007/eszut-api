import * as webPush from "web-push";
import config from "../../config";
import Subscription from "../models/subscription.helper";
import { Request, Response } from "express";
import { ISubscription } from "../../types/db-types";

webPush.setVapidDetails("mailto:jacobole2000@gmail.com", config.vapid.public, config.vapid.private);

export const subscribe = async (req: Request, res: Response) => {
    const raw_subscription = req.body;
    try {
        const subscription: any = new Subscription(raw_subscription);
        let a = await Subscription.find({
            endpoint: subscription.endpoint,
        });
        console.log(a, subscription);
        if (a.length < 1) subscription.save().catch(()=>{});
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.status(201).json();
};

const getSubscriptions = async (): Promise<ISubscription[]> => {
    try {
        return await Subscription.find({});
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const sendNotifications = async () => {
    try {
        console.log(`Subscriptions: ${await getSubscriptions()}`);
        const subscriptions = (await getSubscriptions()) satisfies ISubscription[];
        const payload = {
            title: "test notif",
            body: "Temporary body",
        };
        for (const subscription of subscriptions) {
            webPush.sendNotification(subscription, JSON.stringify(payload)).catch(() => {});
        }
    } catch (error) {
        console.log(error);
    }
};
