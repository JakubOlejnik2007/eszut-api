import mongoose from "mongoose";

const Problem = mongoose.model('Problem', new mongoose.Schema({
    priority: {
        type: Number,
        required: true
    },
    PlaceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true
    },
    whoName: {
        type: String,
        required: true
    },
    whoEmail: {
        type: String,
        required: true
    },
    what: {
        type: String,
        required: true
    },
    when: {
        type: Number,
        required: true,
        default: Date.now()
    },
    isSolved: {
        type: Boolean,
        required: true,
        default: false
    },
    dateOfSolved: {
        type: Number,
        required: false,
    },
    whoSolvedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Administrator",
        required: false
    },
    isUnderRealization: {
        type: Boolean,
        required: true,
        default: false
    },
    whoDealsID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Administrator",
        required: false
    },
    CategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}))
export default Problem;   