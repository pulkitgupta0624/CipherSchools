const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');

router.post(
  '/register',
  authLimiter,
  validateRegister,
  handleValidationErrors,
  register
);

router.post(
  '/login',
  authLimiter,
  validateLogin,
  handleValidationErrors,
  login
);

router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;