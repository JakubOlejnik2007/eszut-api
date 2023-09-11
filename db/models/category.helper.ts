import mongoose from "mongoose";

const Category = mongoose.model('Category', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        default: "3"
    }
}))
export default Category;  