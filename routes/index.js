const express = require('express');
const router = express.Router();
const User = require('../models/User')

// @desc  home/landing page
//@route GET /
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).limit(10).sort({date: 'desc'}).lean();
    console.log(users)
    res.render('home', {
      layout: 'main',
      users,

    })
  } catch (err) {
      console.log(err)
  }
})


// @desc  Login
//@route GET /login
router.get('/login', (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// @desc  Register
//@route GET /register
router.get('/register', (req, res) => {
  res.render('register', {
    layout: 'login', // use same layout as login
  });
});



module.exports = router;
