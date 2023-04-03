const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport){
  passport.use(
    new LocalStrategy({ clientID: process.env.

  }))
}


