import dotenv from "dotenv";
import { TConfigData } from "./types/config";

dotenv.config();

const config: TConfigData = {
    express: {
        port: Number(process.env.EXPRESS_PORT),
    },
    MongoDB: {
        url: String(process.env.MONGO_DB_URL),
    },
    mail: {
        service: String(process.env.MAIL_SERVICE),
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASS),
    },
    vapid: {
        public: String(process.env.VAPID_PUBLIC),
        private: String(process.env.VAPID_PRIVATE)
    },
    EntraID: {
        tenant: String(process.env.TENANT_ID),
        client: String(process.env.CLIENT_ID),
        secret: String(process.env.CLIENT_SECRET)
    },
    authTeams: {
        admins: String(process.env.ADMINISTRATORS_TEAM),
        teachers: String(process.env.TEACHERS_TEAM)
    },
    secrets: {
        refresh: String(process.env.REFRESH_SECRET),
        access: String(process.env.ACCESS_SECRET),
        longPeriod: String(process.env.LONG_PERIOD)
    }
};
export default config;
