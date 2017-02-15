const passport = require('passport'),
      User = require('../models/User'),
      JWTStrategy = require('passport-jwt').Strategy,
      ExtractJWT = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local')

const localOptions = {
  usernameField: 'email'
}

const JWTOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeader(),
  secretOrKey: 'process.env.SECRET'
}
console.log(process.env.SECRET)

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if(err) return done(err)

    if(!user) {
      return done(null, false, { error: 'Your login details could not be verified' })
    }

    user.comparePassword(password, (err, isMatch) => {
      if(err) return done(err)

      if(!user) {
        return done(null, false, { error: 'Your login details could not be verified' })
      }

      return done(null, user)
    })
  })
})

const JWTLogin = new JWTStrategy(JWTOptions, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if(err) return done(err)

    if(user) return done(null, user)
    else return done(null, false)
  })
})

passport.use(JWTLogin)
passport.use(localLogin)

exports.isAuthenticated = passport.authenticate('jwt', {session: false})
