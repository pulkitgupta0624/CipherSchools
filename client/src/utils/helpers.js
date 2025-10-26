import { nanoid } from 'nanoid';
import { fileTemplates } from './fileTemplates';

export const generateId = () => nanoid();

export const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
};

export const getFileLanguage = (extension) => {
    const languageMap = {
        js: 'javascript',
        jsx: 'jsx',
        ts: 'typescript',
        tsx: 'typescript',
        css: 'css',
        html: 'html',
        json: 'json',
        md: 'markdown'
    };
    return languageMap[extension] || 'javascript';
};

// NEW FUNCTION: Create default project file structure
export const createDefaultProjectFiles = (projectId, projectName) => {
    const rootId = generateId();
    const srcId = generateId();
    const publicId = generateId();

    const defaultFiles = [
        // Root folder
        {
            _id: rootId,
            projectId,
            parentId: null,
            name: projectName,
            type: 'folder',
            path: '/',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // src folder
        {
            _id: srcId,
            projectId,
            parentId: rootId,
            name: 'src',
            type: 'folder',
            path: '/src',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // public folder
        {
            _id: publicId,
            projectId,
            parentId: rootId,
            name: 'public',
            type: 'folder',
            path: '/public',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // App.js
        {
            _id: generateId(),
            projectId,
            parentId: srcId,
            name: 'App.js',
            type: 'file',
            extension: 'js',
            path: '/src/App.js',
            language: 'javascript',
            content: fileTemplates['App.js'] || `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CipherStudio!</h1>
        <p>Start editing to see changes in real-time.</p>
      </header>
    </div>
  );
}

export default App;`,
            sizeInBytes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // App.css
        {
            _id: generateId(),
            projectId,
            parentId: srcId,
            name: 'App.css',
            type: 'file',
            extension: 'css',
            path: '/src/App.css',
            language: 'css',
            content: fileTemplates['App.css'] || `.App {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  border-radius: 10px;
  color: white;
}

.App-header h1 {
  margin: 0 0 10px 0;
}

.App-header p {
  margin: 0;
  opacity: 0.8;
}`,
            sizeInBytes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // index.js
        {
            _id: generateId(),
            projectId,
            parentId: srcId,
            name: 'index.js',
            type: 'file',
            extension: 'js',
            path: '/src/index.js',
            language: 'javascript',
            // ✅ CRITICAL FIX HERE - Use named import
            content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
            sizeInBytes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // index.css
        {
            _id: generateId(),
            projectId,
            parentId: srcId,
            name: 'index.css',
            type: 'file',
            extension: 'css',
            path: '/src/index.css',
            language: 'css',
            content: fileTemplates['index.css'] || `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}`,
            sizeInBytes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // index.html
        {
            _id: generateId(),
            projectId,
            parentId: publicId,
            name: 'index.html',
            type: 'file',
            extension: 'html',
            path: '/public/index.html',
            language: 'html',
            content: fileTemplates['index.html'] || `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="CipherStudio - Browser-based React IDE" />
    <title>CipherStudio</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
            sizeInBytes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // package.json
        {
            _id: generateId(),
            projectId,
            parentId: rootId,
            name: 'package.json',
            type: 'file',
            extension: 'json',
            path: '/package.json',
            language: 'json',
            content: fileTemplates['package.json'] || JSON.stringify({
                name: projectName.toLowerCase().replace(/\s+/g, '-'),
                version: '0.1.0',
                private: true,
                dependencies: {
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0'
                }
            }, null, 2),
            sizeInBytes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    return defaultFiles;
};