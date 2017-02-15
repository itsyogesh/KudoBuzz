const validator = require('validator')
const moment = require('moment')
const messageUtils = require('../lib/messageUtils')

const Message = require('../models').message
const User = require('../models').user

exports.postMessage = (req, res, next) => {
  const from = req.user._id
  const to = req.body.to
  const send_at = req.body.send_at,
  const message = req.body.message,
  const interval = req.body.interval,
  const peak_hour = req.body.peak_hour

  if(!to || !validator.isMongoId(to)) {
    let err = new Error({
      statusCode: 400,
      message: 'Invalid User'
    })
    return next(err)
  }

  if(!message || !validator.isString(message)) {
    let err = new Error({
      statusCode: 400,
      message: 'Invalid Message'
    })
  }

  if(send_at && moment(send_at) > moment.now()) {
    let message = new Message()
    message = messageUtils.setMessage(from, to, message, send_at)
    message.save()
      .then((message) => {
        return res.status(200).json(message)
      })
      .catch((err) => {
        return next(err)
      })
  }

  else if(interval) {
    User.findById({_id: req.user._id}).exec()
    .then((user) => {
      const interval = user.settings.interval
      const send_at = moment().add(interval, 'milliseconds')
      let message = messageUtils.setMessage(from, to, message, send_at)
      message.save()
      .then((message) => {
        return res.status(200).json(message)
      })
      .catch((err) => {
        return next(err)
      })
    })
    .catch((err) => {
      return next(err)
    })
  }

  else if(peak_hour) {
    User.findById({_id: req.user._id}).exec()
    .then((user) => {
      const peak_hour = user.settings.peak_hour
      const send_at = (moment().startOf('day').add(peak_hour, 'hours') > moment().now())
                      ? moment().startOf('day').add(peak_hour, 'hours')
                      : moment().endOf('day').add(peak_hour, 'hours') 
      let message = messageUtils.setMessage(from, to, message, send_at)
      message.save()
      .then((message) => {
        return res.status(200).json(message)
      })
      .catch((err) => {
        return next(err)
      })
    })
    .catch((err) => {
      return next(err)
    })
  }
}
