const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        maxLength: 32
    },
    profileImageUrl: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: 32
    },
    hashed_password: {
        type: String,
        require: true,
    },
    about: {
        type: String,
        trim: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true})
