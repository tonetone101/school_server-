const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const groupSchema = new mongoose.Schema({
  groupname: {
      type: String,
      required: true
  },
  missionstatement: {
      type: String,
      require: true
  },

})

module.exports = mongoose.model("Group", groupSchema);