const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectSlug: {
    type: String,
    unique: true,
    // required: true,
    // index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.visibility === 'private';
    }
  },
  name: {
    type: String,
    required: [true, 'Please provide project name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  rootFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  framework: {
    type: String,
    default: 'react',
    enum: ['react', 'vue', 'vanilla']
  },
  visibility: {
    type: String,
    default: 'private',
    enum: ['public', 'private']
  },
  settings: {
    autoSave: {
      type: Boolean,
      default: true
    },
    autoRefresh: {
      type: Boolean,
      default: true
    }
  },
  lastOpenedFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  dependencies: {
    type: Map,
    of: String,
    default: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique project slug
projectSchema.pre('save', async function(next) {
  if (this.isNew) {
    const randomString = Math.random().toString(36).substring(2, 10);
    this.projectSlug = `${this.name.toLowerCase().replace(/\s+/g, '-')}-${randomString}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });
// projectSchema.index({ projectSlug: 1 });

module.exports = mongoose.model('Project', projectSchema);