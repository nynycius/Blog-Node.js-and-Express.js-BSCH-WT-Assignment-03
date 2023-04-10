const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  subtitle: {
    type: String,
    require: true,
    trim: true,
  },

  content: {
    type: String,
    require: true,
  },

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  image:{
    type: String, 
    require: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },

});

//const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = mongoose.model('BlogPost', BlogPostSchema);
