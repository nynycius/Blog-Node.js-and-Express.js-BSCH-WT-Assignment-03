const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('req-flash');

//User moder
const User = require('../models/User');

//login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

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
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });

    res.send('hello');

    console.log(newUser);

    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client  << check error
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          })
          .catch((err) => console.log('this error >>>' + err));
      });
    });

    res.send('Added');

    // validation passed
    // User.findOne({ email: email }).then((user) => {
    //   if (user) {
    //     // Warning if user exists already
    //     errors.push({ msg: 'Email already exists' });
    //     res.render('register', {
    //       errors,
    //       name,
    //       email,
    //       password,
    //       passwordConf,
    //     });
    //   } else {
    //     const newUser = new User({
    //       name,
    //       email,
    //       password,
    //     });

    //     console.log(newUser);
    //     res.send('hello');
    //   }
    // });
  }
});

module.exports = router;
