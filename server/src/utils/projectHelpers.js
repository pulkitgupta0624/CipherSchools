const File = require('../models/File');

const createDefaultFiles = async (projectId, rootFolderId) => {
    // Create src folder
    const srcFolder = await File.create({
        projectId,
        parentId: rootFolderId,
        name: 'src',
        type: 'folder',
        path: '/src'
    });

    // Create public folder
    const publicFolder = await File.create({
        projectId,
        parentId: rootFolderId,
        name: 'public',
        type: 'folder',
        path: '/public'
    });

    // Create App.js
    await File.create({
        projectId,
        parentId: srcFolder._id,
        name: 'App.js',
        type: 'file',
        extension: 'js',
        path: '/src/App.js',
        language: 'javascript',
        content: `import React from 'react';
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

export default App;`
    });

    // Create App.css
    await File.create({
        projectId,
        parentId: srcFolder._id,
        name: 'App.css',
        type: 'file',
        extension: 'css',
        path: '/src/App.css',
        language: 'css',
        content: `.App {
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
}`
    });

    // Create index.js
    // Create index.js
    await File.create({
        projectId,
        parentId: srcFolder._id,
        name: 'index.js',
        type: 'file',
        extension: 'js',
        path: '/src/index.js',
        language: 'javascript',
        // ✅ CORRECTED CONTENT
        content: `import React from 'react';
import { createRoot } from 'react-dom/client'; // <--- CORRECTED
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root')); // <--- CORRECTED
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    });

    // Create index.css
    await File.create({
        projectId,
        parentId: srcFolder._id,
        name: 'index.css',
        type: 'file',
        extension: 'css',
        path: '/src/index.css',
        language: 'css',
        content: `body {
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
}`
    });

    // Create index.html
    await File.create({
        projectId,
        parentId: publicFolder._id,
        name: 'index.html',
        type: 'file',
        extension: 'html',
        path: '/public/index.html',
        language: 'html',
        content: `<!DOCTYPE html>
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
</html>`
    });

    // Create package.json
    await File.create({
        projectId,
        parentId: rootFolderId,
        name: 'package.json',
        type: 'file',
        extension: 'json',
        path: '/package.json',
        language: 'json',
        content: JSON.stringify({
            name: 'cipherstudio-project',
            version: '0.1.0',
            private: true,
            dependencies: {
                'react': '^18.2.0',
                'react-dom': '^18.2.0'
            }
        }, null, 2)
    });
};

module.exports = {
    createDefaultFiles
};