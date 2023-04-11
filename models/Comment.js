const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({

 user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  blogPost:{
    type: String, 
    require: true,    
  },

  comment:{
    type: String, 
    require: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

});


module.exports = mongoose.model('Comment', CommentSchema);
