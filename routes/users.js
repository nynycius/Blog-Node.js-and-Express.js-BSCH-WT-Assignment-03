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

//@Desc Register, pass simple validation
//@route POST /register
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
router.get('/logout', (req, res, next) => {
  // with passport, after login we get a logout method 
  req.logout((err) => {
    if (err) { return next(err) }
    req.flash('success_msg', 'You are logged out'),
      res.redirect('/users/login')
  });
});


// @desc    Process edit form
// @route   get user/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    }).lean()

    if (!user) {
      return res.send('user do not exist')
    }
    else {
      res.render('userUpdate', {
        user,
      })
    }
  } catch (err) {
    console.log(err)
    res.send('something else happen')
  }
});

// @desc    Update user 
// @route   PUT user/edit/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id).lean()
    
    // TODO: fix, must encrypte password when updating database, not working properly <<
    // guarantee only adm and owner change user
    if ( req.user.adm != 'true' || user.user != req.user.id  ) {
      console.log('adm check', req.user.adm )
      return res.send(' Not allowed to update others users profile')
    }

    if (!user) {
      return res.send('user do not exist')
    }
    else {
      user = await User.findOneAndUpdate({
        _id: req.params.id
      },
        req.body, {
        new: true,
        runValidators: true
      }
      )

      res.redirect('/')
    }
  } catch (err) {
    console.log(err)
    console.log('and parameter >>>>>', req.params.id),
      res.send('something else happen')
  }

});


// @desc    Delete user 
// @route   Delete user/edit/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id).lean()

    if (!user) {
      return res.send('user do not exist')
    }
    else {
      user = await User.findOneAndRemove({
        _id: req.params.id
      },
        req.body, {
        new: true,
        runValidators: true
      }
      )
      res.redirect('/')
    }

  } catch (err) {
    console.log(err)
    res.send('something else happen')
  }
});

module.exports = router;
