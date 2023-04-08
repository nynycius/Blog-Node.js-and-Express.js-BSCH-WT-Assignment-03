const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// for password decription
const bcrypt = require('bcryptjs');

// load user model
const User = require('../models/User');

module.exports = async function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, 
    async (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
       User.findById(id)
      .then(user => done (null, user))
      console.log(id)
  });
};
