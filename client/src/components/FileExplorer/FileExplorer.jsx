import React, { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import FileTree from './FileTree';
import { FaPlus, FaFolder, FaFile } from 'react-icons/fa';
import { getFileExtension, getFileLanguage } from '../../utils/helpers';

export default function FileExplorer() {
  const { project, files, createFile } = useProject();
  const [showNewItemMenu, setShowNewItemMenu] = useState(false);

  const buildPath = (parentId, name) => {
    if (!parentId) return `/${name}`;
    const parent = files.find(f => f._id === parentId);
    return parent ? `${parent.path}/${name}` : `/${name}`;
  };

  const handleNewFile = () => {
    const name = prompt('Enter file name:');
    if (name) {
      // ✅ BUILD THE FULL FILE OBJECT
      const extension = getFileExtension(name);
      const newFile = {
        projectId: project?._id || 'local',
        parentId: null, // This is a root file
        name,
        type: 'file',
        content: '',
        path: buildPath(null, name),
        extension: extension,
        language: getFileLanguage(extension)
      };
      createFile(newFile); // ✅ Pass the object
    }
    setShowNewItemMenu(false);
  };

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      // ✅ BUILD THE FULL FOLDER OBJECT
      const newFolder = {
        projectId: project?._id || 'local',
        parentId: null, // This is a root folder
        name,
        type: 'folder',
        path: buildPath(null, name)
      };
      createFile(newFolder); // ✅ Pass the object
    }
    setShowNewItemMenu(false);
  };

  return (
    // Light theme: white bg, dark text
    <div className="h-full bg-white text-gray-900 overflow-auto border-r border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Light theme: muted grey title */}
          <h3 className="text-sm font-semibold uppercase text-gray-500">Explorer</h3>
          <button
            onClick={() => setShowNewItemMenu(!showNewItemMenu)}
            // Light theme: light grey hover
            className="p-1 hover:bg-gray-100 rounded"
          >
            <FaPlus className="text-xs text-gray-600" />
          </button>
        </div>
        
        {showNewItemMenu && (
          // Light theme: light dropdown menu
          <div className="mt-2 bg-white border border-gray-200 rounded p-1 shadow-lg">
            <button
              onClick={handleNewFile}
              // Light theme: light hover
              className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-700"
            >
              <FaFile className="text-xs text-gray-500" />
              New File
            </button>
            <button
              onClick={handleNewFolder}
              className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-700"
            >
              <FaFolder className="text-xs text-gray-500" />
              New Folder
            </button>
          </div>
        )}
      </div>
      
      <div className="p-2">
        <FileTree />
      </div>
    </div>
  );
}
