const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('req-flash');

//User moder
const User = require('../models/User');
const { ensureGuest, ensureAuth } = require('../middleware/auth');

//@desc login Passport-local authetication
//@route GET /login
router.get('/login', ensureGuest, (req, res) => res.render('login'));

//@desc login Passport-local authetication
//@route POST /login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/register',
    failureFlash: true
  })(req, res, next);
});


//Register Page
router.get('/register', ensureGuest, (req, res) => res.render('register'));

// Register
// pass simple validation
router.post('/register', (req, res) => {
  const { email, name, password, passwordConf } = req.body;
  let errors = [];

  if (!email || !name || !password || !passwordConf) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != passwordConf) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      passwordConf,
    });
  } else {  // check if email already
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          passwordConf
        });
      } else {    // create and store user in the database
        const newUser = new User({
          name,
          email,
          password
        });
        // encrypt password 
        bcrypt.genSalt(10, (err, salt) => {    
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser   
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


//@desc Logout user
//@route GET
router.get('/logout', ( req, res, next) => {
  // with passport, after login we get a logout method 
  req.logout((err) =>{
    if(err) { return next(err)}
    req.flash('success_msg', 'You are logged out'),
    res.redirect('/users/login')
  }); 
});

module.exports = router;
