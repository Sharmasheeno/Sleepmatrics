const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); 
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit feedback
// @route   POST /api/feedback
router.post('/', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const newFeedback = new Feedback({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      rating,
      feedback,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

module.exports = router;

