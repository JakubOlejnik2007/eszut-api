import mongoose from "mongoose";
import Administrator from "../db/models/administrator.helper";
import config from "../config";

const url: string = `mongodb://${config.MongoDB.host}:${config.MongoDB.port}/${config.MongoDB.name}`;

const createUser = async () => {
    mongoose.connect(url);

    try {
        const rootAdmin = new Administrator({
            name: "root",
            password: "$2y$10$A6s/cJJezaQLokO.KQMUp.A0PlRI1ZC5HVXUrn1SyUmaDJYT3rK4W",
            email: "admin@admin.pl",
        });
        rootAdmin.save();
        console.warn(`User created successfully! Account details: 
    name: root
    email: admin@admin.pl
    password: admin
    
    Please, remove this account after you create new user!`);
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

createUser();