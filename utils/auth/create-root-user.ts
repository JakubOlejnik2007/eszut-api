import mongoose from "mongoose";
import Administrator from "../db/models/administrator.helper";
import config from "../../config";
import { hash } from "bcrypt";




const createUser = async () => {
    mongoose.connect(config.MongoDB.url);

    try {
        const rootAdmin = new Administrator({
            name: "root",
            password: await hash("admin", 10),
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