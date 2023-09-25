import mongoose from "mongoose";

const PIN = mongoose.model('PIN', new mongoose.Schema({
    pin: {
        type: String,
        required: true
    }
}))
export default PIN;   