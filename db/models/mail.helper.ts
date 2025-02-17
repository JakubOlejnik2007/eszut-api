import mongoose from "mongoose";

const Mail = mongoose.model('Mail', new mongoose.Schema({
    outlookMail: {
        type: String,
        required: true
    },
    mappedTo: {
        type: String,
        required: true,
    }
}))
export default Mail;  