const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const projectCount = await Project.countDocuments({ userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          projectCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, mobile } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
const updateUserSettings = async (req, res, next) => {
  try {
    const { theme, autoSave, fontSize } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update settings
    if (theme) user.settings.theme = theme;
    if (autoSave !== undefined) user.settings.autoSave = autoSave;
    if (fontSize) user.settings.fontSize = fontSize;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: user.settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserSettings
};