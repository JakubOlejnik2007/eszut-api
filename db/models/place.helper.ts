import mongoose from "mongoose";

const Place = mongoose.model('Place', new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}))
export default Place