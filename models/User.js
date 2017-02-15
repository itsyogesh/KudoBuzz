const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowecase: true,
    unique: true
  }
  profile: {
    first_name: {
      type: String
      required: true
    },
    last_name: {
      type: String,
      required: true
    }
  }
  settings: {
    interval: {type: Number},
    peak_hour: {type: String}
  }
})

module.exports = mongoose.model('User', UserSchema)
