const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const fileRoutes = require('./fileRoutes');
const userRoutes = require('./userRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/files', fileRoutes);
router.use('/users', userRoutes);

module.exports = router;