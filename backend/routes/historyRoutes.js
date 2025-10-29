const express = require('express');
const router = express.Router();
const PredictionHistory = require('../models/PredictionHistory');
const { protect } = require('../middleware/authMiddleware');

// @desc    Save a new prediction
// @route   POST /api/history
router.post('/', protect, async (req, res) => {
  try {
    const {
      age, gender, occupation, sleepDuration, activityLevel, stressLevel,
      bmiCategory, heartRate, dailySteps, bloodPressure, sleepDisorder, predicted_quality
    } = req.body;

    const history = new PredictionHistory({
      user: req.user._id, // Get user from 'protect' middleware
      age, gender, occupation, sleepDuration, activityLevel, stressLevel,
      bmiCategory, heartRate, dailySteps, bloodPressure, sleepDisorder, predicted_quality
    });

    const createdHistory = await history.save();
    res.status(201).json(createdHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error saving history', error: error.message });
  }
});

// @desc    Get logged in user's history
// @route   GET /api/history
router.get('/', protect, async (req, res) => {
  try {
    const history = await PredictionHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;

