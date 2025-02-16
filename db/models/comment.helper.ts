import mongoose from "mongoose";

const Comment = mongoose.model('Comment', new mongoose.Schema({
    authorEmail: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    ProblemID : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Problem"
    },
    date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    content: {
        type: String,
        required: true,
    }
}))
export default Comment;   