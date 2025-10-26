export const FILE_EXTENSIONS = {
  JAVASCRIPT: ['js', 'mjs'],
  JSX: ['jsx'],
  TYPESCRIPT: ['ts'],
  TSX: ['tsx'],
  CSS: ['css'],
  SCSS: ['scss', 'sass'],
  HTML: ['html', 'htm'],
  JSON: ['json'],
  MARKDOWN: ['md', 'markdown'],
  TEXT: ['txt'],
  XML: ['xml'],
  YAML: ['yml', 'yaml'],
};

export const LANGUAGE_MAP = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  css: 'css',
  scss: 'scss',
  html: 'html',
  json: 'json',
  md: 'markdown',
  txt: 'plaintext',
  xml: 'xml',
  yml: 'yaml',
  yaml: 'yaml',
};

export const DEFAULT_PROJECT_STRUCTURE = {
  framework: 'react',
  dependencies: {
    'react': '^18.2.0',
    'react-dom': '^18.2.0'
  }
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds