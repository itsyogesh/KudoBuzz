const JWT = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      User = require('../models').user,
      userUtils = require('../lib/utils/user')


function generateToken(user) {
  return JWT.sign(user, 'process.env.SECRET', {
    expiresIn: 604800 // in seconds
  })
}

exports.login = (req, res, next) => {
  const userInfo = userUtils.setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`
  })
}

exports.register = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  if(!email && !validator.isEmail(email)) {
    return res.status(422).send({
      error: 'You must enter a valid email'
    })
  }

  if(!firstName || !lastName || !validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    return res.status(422).send({
      error: 'You must enter a valid name'
    })
  }

  if(!password) {
    return res.status(422).send({
      error: 'You must provide a password'
    })
  }

  User.findOne({ email }, (err, existingUser) => {
    if(err) {
      return next(err)
    }
    if(existingUser) {
      return res.status(422).send({
        error: 'The email address is already in use'
      })
    }

    const user = new User({
      email,
      password,
      profile: {
        first_name: firstName,
        last_name: lastName
      }
    })

    console.log(user)

    user.save((err, user) => {
      if (err) {
        return next(err)
      }

      // Add queue for newletter signup
      // Add queue for sending welcome email

      const userInfo = userUtils.setUserInfo(user)

      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`
      })
    })
  })
}
