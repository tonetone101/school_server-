const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const eventsSchema = new mongoose.Schema({
    notifications: [{type: ObjectId, ref: "Upload"}],
})

module.exports = mongoose.model("Events", eventsSchema);