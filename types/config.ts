export type TConfigData = {
    express: {
        port: number;
    };
    MongoDB: {
        url: string;
    };
    mail: {
        service: string;
        user: string;
        pass: string;
    };
    vapid: {
        public: string;
        private: string;
    };
    authentication: {
        secret: string,
        expiresIn: string
    };
    EntraID: {
        tenant: string;
        client: string;
        secret: string;
    };
    authTeams: {
        admins: string;
        teachers: string;
    };
};
