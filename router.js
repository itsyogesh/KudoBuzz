const express = require('express')
const authController = require('./controllers').authentication
const messageController = require('./controllers').message
const passport = require('passport')
const passportAuth = require('./config/passport')

const requireLogin = passport.authenticate('local', {session: false})

module.exports = (app) => {
  const APIRoutes = express.Router()
  const authRoutes = express.Router()
  const messageRoutes = express.Router()

  APIRoutes.use('/', authRoutes)

  authRoutes.post('/register', authController.register)
  authRoutes.post('/login', requireLogin, authController.login)

  APIRoutes.use('/messages', messageRoutes)

  messageRoutes.post('/', messageController.postMessage)

  app.use('/api', APIRoutes)
}
