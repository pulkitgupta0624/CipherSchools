const express = require('express');
const router = express.Router();
const {
  createFile,
  getFile,
  updateFile,
  deleteFile,
  moveFile
} = require('../controllers/fileController');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  validateCreateFile,
  handleValidationErrors
} = require('../middleware/validation');
const { uploadLimiter } = require('../middleware/rateLimiter');

router
  .route('/')
  .post(
    optionalAuth,
    uploadLimiter,
    validateCreateFile,
    handleValidationErrors,
    createFile
  );

router
  .route('/:id')
  .get(optionalAuth, getFile)
  .put(optionalAuth, updateFile)
  .delete(optionalAuth, deleteFile);

router.put('/:id/move', optionalAuth, moveFile);

module.exports = router;