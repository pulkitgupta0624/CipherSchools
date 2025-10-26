const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserSettings
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/settings', protect, updateUserSettings);

module.exports = router;