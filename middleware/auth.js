// import User model for adm verification
const User = require('../models/User');

module.exports = {
    
    //middleware for adm
    ensureAdm: function (req, res, next) {
      if (req.isAuthenticated() && req.user.adm === true) {
        return next()
      } else {
        req.flash('error_msg', 'acess denied');
        res.redirect('/')
      }
  },

    //middleware for users
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/users/login')
      }
    },

    //middleware for guests
    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/dashboard');
      }
    },
  }