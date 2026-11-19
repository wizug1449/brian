const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['announcement', 'question', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
