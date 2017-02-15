const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowecase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    }
  },
  settings: {
    interval: {type: Number},
    peak_hour: {type: String}
  }
})

UserSchema.pre('save', function (next) {
  const user = this
  const SALT_FACTOR = 5

  if(!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if(err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if(err) return cb(err)

      cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
