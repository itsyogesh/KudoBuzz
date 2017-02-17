const express = require('express')
const authController = require('./controllers').authentication
const messageController = require('./controllers').message
const userController = require('./controllers').user
const passport = require('passport')
const passportAuth = require('./config/passport')

module.exports = (app) => {
  const APIRoutes = express.Router()
  const authRoutes = express.Router()
  const userRoutes = express.Router()
  const messageRoutes = express.Router()

  APIRoutes.use('/', authRoutes)
  authRoutes.post('/register', authController.register)
  authRoutes.post('/login', passportAuth.requireLogin, authController.login)

  APIRoutes.use('/', userRoutes)

  userRoutes.get('/profile', passportAuth.isAuthenticated, userController.getCurrentUser)
  userRoutes.put('/profile', passportAuth.isAuthenticated, userController.updateUser)
  userRoutes.get('/:userId', passportAuth.isAuthenticated, userController.getUser)

  APIRoutes.use('/messages', messageRoutes)
  messageRoutes.post('/', passportAuth.isAuthenticated, messageController.postMessage)

  app.use('/api', APIRoutes)
}
