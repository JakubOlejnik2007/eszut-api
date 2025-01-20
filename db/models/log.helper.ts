import mongoose from "mongoose";
import LOGTYPES from "../../types/logtypes.enum";

const LOG = mongoose.model('Log', new mongoose.Schema({
    date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    content: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
        default: LOGTYPES.INFO
    }
}))
export default LOG;   