const express = require('express');
const router = express.Router();
const { ensureAuth, ensureAdm } = require('../middleware/auth');

// models
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');



// @desc  blogPost/index  display all posts 
//@route GET blogPost/idex
router.get('/index', async (req, res) => {
  try {
    const blogPost = await BlogPost.find({}).sort({date: 'desc'}).populate('user').lean();
    res.render('blogPost/index', {
      layout: 'main',
      blogPost,

    })
  } catch (err) {
      console.log(err)
      res.send('error happened, blogPost/index')
  }
});


// @desc    Show single blogPost
// @route   GET /stories/:id
router.get('/show/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('user').lean()
    const related = await BlogPost.find({tag: blogPost.tag }).limit(3).sort().populate('user').lean(); //Find 3 posts with same tag 
    const comment = await Comment.find({ blogPost: req.params.id }).populate('user').lean(); // find comment based on current post 
  
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


// @desc    Process comment form, always from blogPost/show/:id page
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

// @desc  Edit comment  
//@route GET blogPost/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('user').lean(); // find comment based on current
    const blogPost = await BlogPost.findById(comment.blogPost).populate('user').lean()
    res.render('blogPost/commentEdit', {
      comment,
      blogPost,
    })
  } catch (err) {
    console.log(err)
  }
});

// @desc    Update comment form
// @route   PUT blogPost/edit/:id
router.put('/edit/:id', ensureAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).lean()

    if (!comment) {
      return res.send('comment do not exist')
    }
    console.log(req.user.adm)
    if (comment.user != req.user.id ) {
      return res.send(' not your comment, you can only edit your own comments')
    }
    else {
      comment = await Comment.findOneAndUpdate({
        _id: req.params.id
      },
        req.body, {
        new: true,
        runValidators: true
      }
      )

      res.redirect('/blogPost/show/'+comment.blogPost)
    }
  } catch (err) {
    console.log(err)
    res.send('something else happen')
  }
});


// @desc    Delete comment
// @route   Delete blogPost/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).lean()

    if (!comment) {
      return res.send('story do not exist')
    }

    if (comment.user != req.user.id || req.user.adm === 'false') {
      return res.send(' not your comment, you can only Delete your own comments')
    }
    else {
      comment = await Comment.findOneAndRemove({
        _id: req.params.id
      },
        req.body, {
        new: true,
        runValidators: true
      }
      )
      res.redirect(req.get('referer'))
    }

  } catch (err) {
    console.log(err)
    res.send('something else happen')
  }
});


module.exports = router;
