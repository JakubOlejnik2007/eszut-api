import mongoose from "mongoose";

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
    error: {
        type: String,
        required: true
    }
}))
export default LOG;   