const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts/group/:groupId
// @desc    Get all posts for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.groupId })
      .populate('author', 'name email program')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching posts.' });
  }
});

// @route   POST /api/posts
// @desc    Create a post in a group
router.post('/', protect, [
  body('groupId').notEmpty().withMessage('Group ID is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { groupId, content, type } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    // Check if user is a member
    const isMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You must be a member to post in this group.' });
    }

    const post = await Post.create({
      group: groupId,
      author: req.user._id,
      content,
      type: type || 'general'
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email program');

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating post.' });
  }
});

module.exports = router;
