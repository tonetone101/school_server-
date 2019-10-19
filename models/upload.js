const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const uploadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    uploadedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Upload", uploadSchema);