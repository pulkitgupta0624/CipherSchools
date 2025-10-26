const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Please provide file/folder name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true
  },
  extension: {
    type: String,
    required: function() {
      return this.type === 'file';
    }
  },
  path: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: '',
    // required: function() {
    //   return this.type === 'file' && !this.s3Key;
    // }
  },
  s3Key: {
    type: String,
    sparse: true
  },
  language: {
    type: String,
    enum: ['javascript', 'jsx', 'css', 'html', 'json', 'markdown'],
    // required: function() {
    //   return this.type === 'file';
    // }
  },
  sizeInBytes: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
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

// Update timestamps
fileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate size for file content
  if (this.type === 'file' && this.content) {
    this.sizeInBytes = Buffer.byteLength(this.content, 'utf8');
  }
  
  // Set language based on extension
  if (this.type === 'file' && !this.language) {
    const extMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown'
    };
    this.language = extMap[this.extension] || 'javascript';
  }
  
  next();
});

// Compound indexes for efficient queries
fileSchema.index({ projectId: 1, parentId: 1 });
fileSchema.index({ projectId: 1, path: 1 });
fileSchema.index({ projectId: 1, isDeleted: 1 });

module.exports = mongoose.model('File', fileSchema);