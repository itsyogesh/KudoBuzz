const User = require('../models').user
const userUtils = require('../lib/utils/user')

const fetchUser = (userId) => {
  let UserPromise = new Promise((resolve, reject) => {
    User.findById(userId, function(err, user){
      if(err) reject(err)
      resolve(user)
    })
  })
  return UserPromise
}

exports.getCurrentUser = (req, res, next) => {
  fetchUser(req.user._id)
    .then((user) => {
      return res.status(200).json(userUtils.getUserInfo(user))
    })
    .catch((err) => {
      return next(err)
    })
}

exports.getUser = (req, res, next) => {
  fetchUser(req.params.userId)
    .then((user) => {
      return res.status(200).json(userUtils.getUserInfo(user))
    })
    .catch((err) => {
      return next(err)
    })
}

exports.updateUser = (req, res, next) => {
  const password = req.body.password || null
  const firstName = req.body.firstName || null
  const lastName = req.body.lastName || null
  const interval = req.body.interval || null
  const peakHour = req.body.peakHour || null

  fetchUser(req.user._id)
    .then((user) => {
      if(password) user['password'] = password
      if(firstName) user['profile']['first_name'] = firstName
      if(lastName) user['profile']['last_name'] = lastName
      if(interval) user['settings']['interval'] = interval
      if(peakHour) user['settings']['peak_hour'] = peakHour

      user.save()
        .then((user) => {
          return res.status(200).json({
            message: 'User successfully updated',
            user: userUtils.getUserInfo(user)
          })
        })
        .catch((err) => {
          return next(err)
        })
    })
    .catch((err) => {
      return next(err)
    })
}
