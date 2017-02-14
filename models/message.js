const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  sent_at: {
    type: Date,
    default: Date.now()
  }
})

modules.export = mongoose.model('Message', MessageSchema)
