const express = require('express');
const router = express.Router();

// @desc  home/landing page
//@route GET /
router.get('/', (req, res) => {
  res.render('home', {
    layout: 'main',
  });
});

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
