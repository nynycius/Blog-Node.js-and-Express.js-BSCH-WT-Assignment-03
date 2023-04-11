const express = require('express');
const router = express.Router();
const { ensureAuth, ensureAdm } = require('../middleware/auth');

// models
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');


// @desc    Show single blogPost
// @route   GET /stories/:id
router.get('/show/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('user').lean()
    const related = await BlogPost.find({}).limit(3).sort().populate('user').lean(); //TODO implement tags
    const comment = await Comment.find({blogPost: req.params.id}).populate('user').lean(); // find comment based on current post 

    if (!blogPost) {
      return res.send('Error 404, Post not find')
    } else {
      res.render('blogPost/show', {
        blogPost,
        related,
        comment,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})


// @desc  Add comment  
//@route GET /comment
router.get('/comment', ensureAuth, async (req, res) => {
  try {
    res.render('comment', {
     name: req.user.name,  
    })
  } catch (err) {
      console.log(err)
  }
});

// @desc    Process comment form
// @route   POST blogPost/add
router.post('/add', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id  // this line add user id in the post
    await Comment.create(req.body)
    res.redirect(req.get('referer')) // redirect to same page 
  } catch (err) {
    console.error(err)
    res.send('error/500')
  }
});



module.exports = router;


