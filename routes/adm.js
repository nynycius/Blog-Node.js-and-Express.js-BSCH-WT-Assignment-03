//Adm route will handle the adm pages

const express = require('express');
const router = express.Router();
const { ensureAdm } = require('../middleware/auth');

// models
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');


// TODO: dashboard with posts and users for edit and delete

// @desc  adm/dashboard
//@route GET /admTest
router.get('/dashboard', ensureAdm, async (req, res) => {
    try {
      const blogPost = await BlogPost.find({}).limit(10).sort({date: 'desc'}).populate('user').lean();
      const users = await User.find({}).limit(10).sort({date: 'desc'}).lean();
      res.render('admTest', {
        layout: 'main',
        name: req.user.name,
        user: req.user.id,
        blogPost,
        users,
  
      })
    } catch (err) {
        console.log(err)
        res.send('error happened, admTest')
    }
  });

// admins controls for BlogPost

// @desc  Add story 
//@route GET /add
router.get('/add', ensureAdm, async (req, res) => {
    try {
      res.render('blogPost/add', {
       name: req.user.name,  
      })
    } catch (err) {
        console.log(err)
    }
  });

// @desc    Process add form
// @route   POST adm/add
router.post('/add', ensureAdm, async (req, res) => {
    try {
      req.body.user = req.user.id  // this line add user id in the post
      await BlogPost.create(req.body)
      res.redirect('/adm/dashboard')
    } catch (err) {
      console.error(err)
      res.send('error/500')
    }
  });


// @desc    Process edit form
// @route   POST adm/edit/:id
  router.get('/edit/:id', ensureAdm, async (req, res) => {
    try {
       const blogPost = await BlogPost.findOne({
        _id: req.params.id,
       }).lean()

       if(!blogPost){
        return res.send('story do not exist')
       }   
       else{
        res.render('blogPost/edit', {
           blogPost,
           })
       }
    } catch (err) {
        console.log(err)
        res.send('something else happen')
    }
  });

  // @desc    Update edit form
// @route   PUT adm/edit/:id
router.put('/:id', ensureAdm, async (req, res) => {
    try {
       let blogPost = await BlogPost.findById(req.params.id).lean()

       if(!blogPost){
        return res.send('story do not exist')
       }   
       else{
        blogPost = await BlogPost.findOneAndUpdate({
            _id: req.params.id},
            req.body,{
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


// saving line to check user ownership
//   if (blogPost.user != req.user.id){
//     return res.send(' not your post')
//    }