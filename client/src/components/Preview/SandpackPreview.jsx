import React, { useMemo } from 'react';
import { SandpackProvider, SandpackPreview as Preview, SandpackLayout } from '@codesandbox/sandpack-react';
import { useProject } from '../../contexts/ProjectContext';

export default function SandpackPreview() {
    const { files } = useProject();

    // Convert files to Sandpack format with proper error handling
    const sandpackFiles = useMemo(() => {
        const filesObj = {};

        files.forEach(file => {
            if (file.type === 'file' && file.path) {
                filesObj[file.path] = {
                    code: file.content || ''
                };
            }
        });

        // Ensure we have the essential files for React to work
        // FIXED: Proper React imports and exports
        if (!filesObj['/src/index.js'] && !filesObj['/src/index.jsx']) {
            filesObj['/src/index.js'] = {
                // ✅ CRITICAL FIX HERE - Use named import
                code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
            };
        }

        if (!filesObj['/src/App.js'] && !filesObj['/src/App.jsx']) {
            filesObj['/src/App.js'] = {
                code: `import React from 'react';
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
            };
        }

        if (!filesObj['/src/App.css']) {
            filesObj['/src/App.css'] = {
                code: `.App {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.App-header {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  color: white;
}

.App-header h1 {
  margin: 0 0 20px 0;
  font-size: 2.5rem;
}

.App-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.2rem;
}`
            };
        }

        if (!filesObj['/src/index.css']) {
            filesObj['/src/index.css'] = {
                code: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`
            };
        }

        if (!filesObj['/public/index.html']) {
            filesObj['/public/index.html'] = {
                code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="CipherStudio Project" />
    <title>CipherStudio Project</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
            };
        }

        console.log('Sandpack Files:', filesObj); // Debug log
        return filesObj;
    }, [files]);

    return (
        <div className="h-full bg-white overflow-hidden">
            <SandpackProvider
                template="react"
                files={sandpackFiles}
                theme="light"
                options={{
                    showNavigator: true,
                    showTabs: false,
                    showLineNumbers: true,
                    showInlineErrors: true,
                    wrapContent: true,
                    editorHeight: '100%',
                    autorun: true,
                    autoReload: true,
                    recompileMode: 'immediate',
                }}
                customSetup={{
                    dependencies: {
                        'react': '^18.2.0',
                        'react-dom': '^18.2.0'
                    },
                    entry: '/src/index.js'
                }}
            >
                <SandpackLayout>
                    <Preview
                        showNavigator={true}
                        showRefreshButton={true}
                        showOpenInCodeSandbox={false}
                        style={{
                            height: '100%',
                            width: '100%',
                            border: 'none'
                        }}
                    />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
}