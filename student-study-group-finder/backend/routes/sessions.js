const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/sessions/group/:groupId
// @desc    Get all sessions for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const sessions = await Session.find({ group: req.params.groupId })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching sessions.' });
  }
});

// @route   GET /api/sessions/my
// @desc    Get upcoming sessions for groups the user belongs to
router.get('/my', protect, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id }).select('_id');
    const groupIds = groups.map(g => g._id);

    const sessions = await Session.find({
      group: { $in: groupIds },
      date: { $gte: new Date() }
    })
      .populate('group', 'name courseCode')
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .limit(10);

    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching your sessions.' });
  }
});

// @route   POST /api/sessions
// @desc    Create a study session (group members only)
router.post('/', protect, [
  body('groupId').notEmpty().withMessage('Group ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('locationOrLink').trim().notEmpty().withMessage('Location or link is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { groupId, title, description, date, time, locationOrLink } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    // Check if user is a member
    const isMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You must be a member of the group to create sessions.' });
    }

    const session = await Session.create({
      group: groupId,
      title,
      description,
      date,
      time,
      locationOrLink,
      createdBy: req.user._id
    });

    const populatedSession = await Session.findById(session._id)
      .populate('createdBy', 'name email')
      .populate('group', 'name courseCode');

    res.status(201).json({ success: true, session: populatedSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating session.' });
  }
});

module.exports = router;
