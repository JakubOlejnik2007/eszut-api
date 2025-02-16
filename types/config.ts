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
    EntraID: {
        tenant: string;
        client: string;
        secret: string;
    };
    authTeams: {
        admins: string;
        adminsId: string;
        teachers: string;
    };
    secrets: {
        refresh: string;
        access: string;
        longPeriod: string;
    }
};
