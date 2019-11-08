const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const groupSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  mission: {
      type: String,
      require: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  members: [{type: ObjectId, ref: "User"}],
  createdBy: {
    type: ObjectId,
    ref: 'User'
  }

})

module.exports = mongoose.model("Group", groupSchema);