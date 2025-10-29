const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PredictionHistory = require('../models/PredictionHistory');
const Feedback = require('../models/Feedback');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne(); // Replaced remove() with deleteOne()
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Get all prediction history (for charts)
// @route   GET /api/admin/history
router.get('/history', protect, admin, async (req, res) => {
  const history = await PredictionHistory.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(history);
});

// @desc    Get all feedback
// @route   GET /api/admin/feedback
router.get('/feedback', protect, admin, async (req, res) => {
  const feedback = await Feedback.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(feedback);
});

module.exports = router;

