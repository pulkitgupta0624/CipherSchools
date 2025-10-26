import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import { ProjectProvider, useProject } from '../contexts/ProjectContext';
import FileExplorer from '../components/FileExplorer/FileExplorer';
import CodeEditor from '../components/Editor/CodeEditor';
import SandpackPreview from '../components/Preview/SandpackPreview';
import IDEHeader from '../components/Layout/IDEHeader';
import EditorTabs from '../components/Editor/EditorTabs';

// Separate component that uses ProjectContext
function IDEContent() {
  const { projectSlug } = useParams();
  const { loadProject, loading, project } = useProject();

  useEffect(() => {
    if (projectSlug) {
      loadProject(projectSlug);
    }
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <a href="/dashboard" className="text-primary-600 hover:underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-50">
      <IDEHeader />
      <div className="flex-1 overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[20, 80]}
          minSize={200}
          gutterSize={6}
        >
          <FileExplorer />
          <Split
            className="flex h-full"
            sizes={[50, 50]}
            minSize={300}
            gutterSize={6}
          >
            <div className="h-full flex flex-col bg-dark-100">
              <EditorTabs />
              <CodeEditor />
            </div>
            <SandpackPreview />
          </Split>
        </Split>
      </div>
    </div>
  );
}

// Main IDE component with ProjectProvider wrapper
export default function IDE() {
  return (
    <ProjectProvider>
      <IDEContent />
    </ProjectProvider>
  );
}