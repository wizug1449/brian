const express = require('express');
const { body, validationResult } = require('express-validator');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/groups
// @desc    Get all groups (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, course, faculty } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (course) {
      query.courseCode = new RegExp(course, 'i');
    }
    if (faculty) {
      query.faculty = new RegExp(faculty, 'i');
    }

    const groups = await Group.find(query)
      .populate('leader', 'name email program')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: groups.length, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching groups.' });
  }
});

// @route   GET /api/groups/:id
// @desc    Get single group
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('leader', 'name email program yearOfStudy')
      .populate('members.user', 'name email program yearOfStudy');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    res.json({ success: true, group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching group.' });
  }
});

// @route   POST /api/groups
// @desc    Create a new study group
router.post('/', protect, [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  body('courseCode').trim().notEmpty().withMessage('Course code is required'),
  body('courseName').trim().notEmpty().withMessage('Course name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, courseCode, courseName, description, location, isOnline, faculty } = req.body;

    const group = await Group.create({
      name,
      courseCode,
      courseName,
      description,
      location,
      isOnline: isOnline || false,
      faculty: faculty || 'General',
      leader: req.user._id,
      members: [{
        user: req.user._id,
        role: 'leader'
      }],
      memberCount: 1
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('leader', 'name email')
      .populate('members.user', 'name email');

    res.status(201).json({ success: true, group: populatedGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating group.' });
  }
});

// @route   POST /api/groups/:id/join
// @desc    Join a study group
router.post('/:id/join', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    // Check if already a member
    const alreadyMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group.' });
    }

    group.members.push({
      user: req.user._id,
      role: 'member'
    });
    group.memberCount = group.members.length;
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('leader', 'name email')
      .populate('members.user', 'name email');

    res.json({ success: true, message: 'Successfully joined the group.', group: updatedGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error joining group.' });
  }
});

// @route   PUT /api/groups/:id
// @desc    Update group (leader only)
router.put('/:id', protect, async (req, res) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    // Only leader can update
    if (group.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the group leader can update this group.' });
    }

    const { name, description, location, isOnline, faculty } = req.body;

    group = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description, location, isOnline, faculty },
      { new: true, runValidators: true }
    ).populate('leader', 'name email').populate('members.user', 'name email');

    res.json({ success: true, group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating group.' });
  }
});

// @route   GET /api/groups/my/groups
// @desc    Get groups the current user belongs to
router.get('/my/groups', protect, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id })
      .populate('leader', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: groups.length, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching your groups.' });
  }
});

module.exports = router;
