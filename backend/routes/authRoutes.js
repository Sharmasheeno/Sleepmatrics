const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// VVV Import the protect middleware VVV
const { protect } = require('../middleware/authMiddleware');

// Helper to generate token
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, adminKey } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  let role = 'user'; // Default role
// Check if admin key is provided and correct
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    role = 'admin';
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
 res.status(400).json({ message: 'Invalid user data' });
 }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // --- ADDED TRY...CATCH ---
  try {
    // 1. Find user by email
    console.log(`Login attempt for email: ${email}`); // Log attempt
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login failed: User not found for email ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Check password using the method from User model
    console.log(`Found user: ${user.name}. Checking password...`);
    const isMatch = await user.matchPassword(password); // Assumes this method exists

    if (isMatch) {
      console.log(`Password match for user: ${user.name}. Generating token...`);
      // 3. Generate token and send response
      // Make sure generateToken function exists and JWT_SECRET is set in .env
      const token = generateToken(user._id);
      console.log(`Token generated successfully for user: ${user.name}`);

      res.json({
        token: token,
        user: { // Send user details needed by frontend
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      console.log(`Login failed: Password mismatch for user ${user.name}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // --- THIS WILL CATCH AND LOG ANY CRASH ---
    console.error('!!! LOGIN ROUTE CRASHED !!!');
    console.error('Error Time:', new Date().toISOString());
    console.error('Error Details:', error); // Print the full error object
    res.status(500).json({
       message: 'Server error during login process. Please check backend logs.',
       // Optionally send error details ONLY in development, not production
       error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// VVVVVV ADDED PROFILE ROUTES VVVVVV

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
    // req.user is set by the 'protect' middleware after token verification
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Update fields only if they were sent in the request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If you were handling password update here, you would need to check req.body.password
        
        const updatedUser = await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: { // Send back the updated user object
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// VVVVVV END ADDED PROFILE ROUTES VVVVVV

// ... rest of authRoutes.js (forgotPassword routes, etc.) ...

module.exports = router;