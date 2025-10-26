const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  forkProject
} = require('../controllers/projectController');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  validateCreateProject,
  handleValidationErrors
} = require('../middleware/validation');

router
  .route('/')
  .get(protect, getProjects) // <-- FIX: Use protect
  .post(
    protect, // <-- FIX: Also protect creation
    validateCreateProject,
    handleValidationErrors,
    createProject
  );

router
  .route('/:projectSlug')
  .get(optionalAuth, getProject);

router
  .route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/fork', protect, forkProject);

module.exports = router;