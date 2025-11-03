const File = require('../models/File');
const Project = require('../models/Project');
// const { s3 } = require('../config/aws');

// @desc    Create file or folder
// @route   POST /api/files
const createFile = async (req, res, next) => {
  try {
    const { 
      projectId, 
      parentId, 
      name, 
      type, 
      content = '' 
    } = req.body;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Build path
    let path = '/';
    if (parentId) {
      const parent = await File.findById(parentId);
      if (!parent || parent.type !== 'folder') {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent folder'
        });
      }
      path = parent.path === '/' ? `/${name}` : `${parent.path}/${name}`;
    } else {
      path = `/${name}`;
    }

    // Extract extension for files
    let extension = '';
    if (type === 'file') {
      const parts = name.split('.');
      extension = parts.length > 1 ? parts.pop() : 'txt';
    }

    // Create file
    const file = await File.create({
      projectId,
      parentId,
      name,
      type,
      extension,
      path,
      content: type === 'file' ? content : undefined
    });

    // Update project timestamp
    project.updatedAt = Date.now();
    await project.save();

    res.status(201).json({
      success: true,
      message: `${type === 'folder' ? 'Folder' : 'File'} created successfully`,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get file content
// @route   GET /api/files/:id
const getFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // If file is stored in S3, get it from there
    // if (file.s3Key) {
    //   const params = {
    //     Bucket: process.env.AWS_S3_BUCKET,
    //     Key: file.s3Key
    //   };

    //   const data = await s3.getObject(params).promise();
    //   file.content = data.Body.toString('utf-8');
    // }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update file
// @route   PUT /api/files/:id
const updateFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Update fields
    if (name) {
      file.name = name;
      
      // Update extension if file
      if (file.type === 'file') {
        const parts = name.split('.');
        file.extension = parts.length > 1 ? parts.pop() : file.extension;
      }

      // Update path
      const pathParts = file.path.split('/');
      pathParts[pathParts.length - 1] = name;
      file.path = pathParts.join('/');
    }

    if (content !== undefined && file.type === 'file') {
      file.content = content;
      
      // If file is in S3, update it
      // if (file.s3Key) {
      //   await s3.putObject({
      //     Bucket: process.env.AWS_S3_BUCKET,
      //     Key: file.s3Key,
      //     Body: content
      //   }).promise();
      // }
    }

    await file.save();

    // Update project timestamp
    await Project.findByIdAndUpdate(file.projectId, {
      updatedAt: Date.now()
    });

    res.status(200).json({
      success: true,
      message: 'File updated successfully',
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file or folder
// @route   DELETE /api/files/:id
const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // If it's a folder, delete all children
    if (file.type === 'folder') {
      await deleteChildrenRecursively(id);
    }

    // If file is in S3, delete it
    // if (file.s3Key) {
    //   await s3.deleteObject({
    //     Bucket: process.env.AWS_S3_BUCKET,
    //     Key: file.s3Key
    //   }).promise();
    // }

    // Soft delete
    file.isDeleted = true;
    await file.save();

    // Update project timestamp
    await Project.findByIdAndUpdate(file.projectId, {
      updatedAt: Date.now()
    });

    res.status(200).json({
      success: true,
      message: `${file.type === 'folder' ? 'Folder' : 'File'} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move file or folder
// @route   PUT /api/files/:id/move
const moveFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newParentId } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify new parent
    let newPath = '/';
    if (newParentId) {
      const newParent = await File.findById(newParentId);
      if (!newParent || newParent.type !== 'folder') {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination folder'
        });
      }
      newPath = newParent.path === '/' 
        ? `/${file.name}` 
        : `${newParent.path}/${file.name}`;
    } else {
      newPath = `/${file.name}`;
    }

    // Update file
    file.parentId = newParentId;
    file.path = newPath;
    await file.save();

    // If it's a folder, update all children paths
    if (file.type === 'folder') {
      await updateChildrenPaths(id, newPath);
    }

    res.status(200).json({
      success: true,
      message: 'File moved successfully',
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to delete children recursively
async function deleteChildrenRecursively(parentId) {
  const children = await File.find({ parentId, isDeleted: false });
  
  for (const child of children) {
    if (child.type === 'folder') {
      await deleteChildrenRecursively(child._id);
    }
    
    // if (child.s3Key) {
    //   await s3.deleteObject({
    //     Bucket: process.env.AWS_S3_BUCKET,
    //     Key: child.s3Key
    //   }).promise();
    // }
    
    child.isDeleted = true;
    await child.save();
  }
}

// Helper function to update children paths
async function updateChildrenPaths(parentId, parentPath) {
  const children = await File.find({ parentId, isDeleted: false });
  
  for (const child of children) {
    child.path = parentPath === '/' 
      ? `/${child.name}` 
      : `${parentPath}/${child.name}`;
    await child.save();
    
    if (child.type === 'folder') {
      await updateChildrenPaths(child._id, child.path);
    }
  }
}

module.exports = {
  createFile,
  getFile,
  updateFile,
  deleteFile,
  moveFile
};