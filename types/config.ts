export type TConfigData = {
    express: {
        port: number;
    };
    MongoDB: {
        host: string;
        port: number;
        name: string;
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
    }
};
