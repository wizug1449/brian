const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    uppercase: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  faculty: {
    type: String,
    trim: true,
    default: 'General'
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  memberCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for search
groupSchema.index({ name: 'text', courseCode: 'text', courseName: 'text', description: 'text' });

module.exports = mongoose.model('Group', groupSchema);
