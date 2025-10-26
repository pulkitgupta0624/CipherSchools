module.exports = {
  FILE_TYPES: {
    FILE: 'file',
    FOLDER: 'folder'
  },
  
  FRAMEWORKS: {
    REACT: 'react',
    VUE: 'vue',
    VANILLA: 'vanilla'
  },
  
  LANGUAGES: {
    JAVASCRIPT: 'javascript',
    JSX: 'jsx',
    CSS: 'css',
    HTML: 'html',
    JSON: 'json',
    MARKDOWN: 'markdown'
  },
  
  FILE_EXTENSIONS: {
    js: 'javascript',
    jsx: 'jsx',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown'
  },
  
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  DEFAULT_DEPENDENCIES: {
    react: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    },
    vue: {
      'vue': '^3.3.0'
    },
    vanilla: {}
  }
};