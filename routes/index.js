const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest, ensureAdm } = require('../middleware/auth');

// models
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

// @desc  home/landing page
//@route GET /
router.get('/', async (req, res) => {
  try {
    const blogPost = await BlogPost.find({}).limit(10).sort({date: 'desc'}).populate('user').lean();
    res.render('home', {
      layout: 'main',
      blogPost,
    })
  } catch (err) {
      console.log(err)
  }
})

// @desc  adm/dashboard
//@route GET /admTest
router.get('/admTest', ensureAdm, async (req, res) => {
  try {
    const users = await User.find({}).limit(10).sort({date: 'desc'}).lean();
    console.log(users)
    res.render('admTest', {
      layout: 'main',
      users,
      name: req.user.name,

    })
  } catch (err) {
      console.log(err)
  }
})

// @desc  Dashboard
//@route GET /login
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      res.render('dashboard', {
       name: req.user.name,  
      })
    } catch (err) {
        console.log(err)
    }
  });



module.exports = router;





// // @desc  Login
// //@route GET /login
// router.get('/login', ensureGuest, (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   });
// });

// // @desc  Register
// //@route GET /register
// router.get('/register', ensureGuest, (req, res) => {
//   res.render('register', {
//     layout: 'login', // use same layout as login
//   });
// });