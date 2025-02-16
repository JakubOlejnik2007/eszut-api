import dotenv from "dotenv";
import { TConfigData } from "./types/config";

dotenv.config();

const {
    EXPRESS_PORT,
    MONGO_DB_URL,
    MAIL_SERVICE, MAIL_USER, MAIL_PASS,
    VAPID_PUBLIC, VAPID_PRIVATE,
    TENANT_ID, CLIENT_ID, CLIENT_SECRET,
    ADMINISTRATORS_TEAM, ADMINISTRATORS_TEAM_ID, TEACHERS_TEAM,
    REFRESH_SECRET, ACCESS_SECRET, LONG_PERIOD
} = process.env;

const config: TConfigData = {
    express: {
        port: Number(EXPRESS_PORT),
    },
    MongoDB: {
        url: String(MONGO_DB_URL),
    },
    mail: {
        service: String(MAIL_SERVICE),
        user: String(MAIL_USER),
        pass: String(MAIL_PASS),
    },
    vapid: {
        public: String(VAPID_PUBLIC),
        private: String(VAPID_PRIVATE)
    },
    EntraID: {
        tenant: String(TENANT_ID),
        client: String(CLIENT_ID),
        secret: String(CLIENT_SECRET)
    },
    authTeams: {
        admins: String(ADMINISTRATORS_TEAM),
        adminsId: String(ADMINISTRATORS_TEAM_ID),
        teachers: String(TEACHERS_TEAM)
    },
    secrets: {
        refresh: String(REFRESH_SECRET),
        access: String(ACCESS_SECRET),
        longPeriod: String(LONG_PERIOD)
    }
};
export default config;
