const { body, param, query, validationResult } = require('express-validator');

// Auth validation
const validateRegister = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Project validation
const validateCreateProject = [
  body('name')
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 50 })
    .withMessage('Project name must be less than 50 characters'),
  body('framework')
    .optional()
    .isIn(['react', 'vue', 'vanilla'])
    .withMessage('Invalid framework')
];

// File validation
const validateCreateFile = [
  body('projectId').isMongoId().withMessage('Invalid project ID'),
  body('name').notEmpty().withMessage('File/folder name is required'),
  body('type')
    .isIn(['file', 'folder'])
    .withMessage('Type must be either file or folder')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateProject,
  validateCreateFile,
  handleValidationErrors
};