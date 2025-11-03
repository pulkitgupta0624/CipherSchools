const Project = require('../models/Project');
const File = require('../models/File');
// const { s3 } = require('../config/aws');
const { createDefaultFiles } = require('../utils/projectHelpers');

// @desc    Create new project
// @route   POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, framework, visibility } = req.body;
    const userId = req.user?.id || null;

    // Create project
    const project = await Project.create({
      userId,
      name,
      description,
      framework: framework || 'react',
      visibility: visibility || (userId ? 'private' : 'public')
    });

    // Create root folder
    const rootFolder = await File.create({
      projectId: project._id,
      parentId: null,
      name: project.name,
      type: 'folder',
      path: '/'
    });

    // Update project with root folder
    project.rootFolderId = rootFolder._id;
    await project.save();

    // Create default files
    await createDefaultFiles(project._id, rootFolder._id);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for user
// @route   GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const query = { userId };

    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalProjects: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:projectSlug
const getProject = async (req, res, next) => {
  try {
    const { projectSlug } = req.params;
    
    const project = await Project.findOne({ projectSlug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization for private projects
    if (project.visibility === 'private' && 
        (!req.user || project.userId.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Get project files
    const files = await File.find({ 
      projectId: project._id, 
      isDeleted: false 
    });

    res.status(200).json({
      success: true,
      data: {
        project,
        files
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization
    if (project.userId && project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update project
    Object.assign(project, updates);
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization
    if (project.userId && project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Delete all files from S3
    const files = await File.find({ projectId: id, type: 'file' });
    // for (const file of files) {
    //   if (file.s3Key) {
    //     await s3.deleteObject({
    //       Bucket: process.env.AWS_S3_BUCKET,
    //       Key: file.s3Key
    //     }).promise();
    //   }
    // }

    // Delete all files from database
    await File.deleteMany({ projectId: id });

    // Delete project
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fork project
// @route   POST /api/projects/:id/fork
const forkProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalProject = await Project.findById(id);
    if (!originalProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Create new project
    const forkedProject = await Project.create({
      userId: req.user.id,
      name: `${originalProject.name} (forked)`,
      description: originalProject.description,
      framework: originalProject.framework,
      dependencies: originalProject.dependencies,
      visibility: 'private'
    });

    // Copy files
    const originalFiles = await File.find({ 
      projectId: id, 
      isDeleted: false 
    });

    const fileMapping = new Map();

    // First pass: Create all files/folders
    for (const file of originalFiles) {
      const newFile = await File.create({
        projectId: forkedProject._id,
        parentId: file.parentId ? fileMapping.get(file.parentId.toString()) : null,
        name: file.name,
        type: file.type,
        extension: file.extension,
        path: file.path,
        content: file.content,
        language: file.language
      });

      fileMapping.set(file._id.toString(), newFile._id);

      if (file.parentId === null) {
        forkedProject.rootFolderId = newFile._id;
        await forkedProject.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Project forked successfully',
      data: forkedProject
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  forkProject
};