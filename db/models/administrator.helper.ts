import mongoose from "mongoose";

const Administrator = mongoose.model('Administrator', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
}))
export default Administrator;   