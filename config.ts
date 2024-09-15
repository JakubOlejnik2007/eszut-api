import dotenv from "dotenv";
import { TConfigData } from "./types/config";

dotenv.config();

const { EXPRESS_PORT, MONGO_DB_URL, MAIL_SERVICE, MAIL_USER, MAIL_PASS, VAPID_PUBLIC, VAPID_PRIVATE, JWT_SECRET_KEY, JWT_EXPIRES_IN, TENANT_ID, CLIENT_ID, CLIENT_SECRET } = process.env;

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
    authentication: {
        secret: String(JWT_SECRET_KEY),
        expiresIn: String(JWT_EXPIRES_IN)
    },
    EntraID: {
        tenant: String(TENANT_ID),
        client: String(CLIENT_ID),
        secret: String(CLIENT_SECRET)
    }
};
export default config;
