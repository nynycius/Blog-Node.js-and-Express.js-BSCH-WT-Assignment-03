const express = require('express');
const router = express.Router();

// @desc  Login/landing page
//@route GET /
router.get('/', (req, res) => {
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

// @desc  Dashboard
//@route GET /dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    layout: 'main',
  });
});

module.exports = router;
