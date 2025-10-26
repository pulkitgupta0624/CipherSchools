import React from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { FaTimes } from 'react-icons/fa';
import { getFileIcon } from '../FileExplorer/FileIcons';

export default function EditorTabs() {
  const { openFiles, activeFile, setActiveFile, closeFile } = useProject();

  if (openFiles.length === 0) {
    return null;
  }

  return (
    // Light theme: light bg, grey border
    <div className="bg-gray-100 border-b border-gray-200 flex overflow-x-auto">
      {openFiles.map(file => (
        <div
          key={file._id}
          className={`
            flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-gray-200
            ${activeFile?._id === file._id 
              // Active tab: white bg, dark text
              ? 'bg-white text-gray-900' 
              // Inactive tab: grey text, light hover
              : 'text-gray-500 hover:bg-gray-200'}
          `}
          onClick={() => setActiveFile(file)}
        >
          <span className="text-sm">{getFileIcon(file.extension)}</span>
          <span className="text-sm">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file._id);
            }}
            // Light theme: close button hover
            className="ml-2 p-1 hover:bg-gray-300 rounded"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      ))}
    </div>
  );
}
