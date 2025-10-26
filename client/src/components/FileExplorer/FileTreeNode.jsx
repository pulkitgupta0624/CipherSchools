// client/src/components/FileExplorer/FileTreeNode.jsx
import React, { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { FaFolder, FaFolderOpen, FaFile, FaHtml5, FaReact, FaTrash, FaPlus } from 'react-icons/fa';
import { getFileIcon } from './FileIcons';
import { getFileExtension, getFileLanguage } from '../../utils/helpers';

export default function FileTreeNode({ node, level }) {
  const { project, files, activeFile, openFile, deleteFile, createFile } = useProject(); const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);

  const children = files.filter(file => file.parentId === node._id);
  const sortedChildren = children.sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  const buildPath = (parentId, name) => {
    if (!parentId) return `/${name}`;
    const parent = files.find(f => f._id === parentId);
    return parent ? `${parent.path}/${name}` : `/${name}`;
  };

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      openFile(node);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
      deleteFile(node._id);
    }
  };

  const handleNewFile = (e) => {
    e.stopPropagation();
    const name = prompt('Enter file name:');
    if (name) {
      // ✅ BUILD THE FULL FILE OBJECT
      const extension = getFileExtension(name);
      const newFile = {
        projectId: project?._id || 'local',
        parentId: node._id, // ✅ Use this node as the parent
        name,
        type: 'file',
        content: '',
        path: buildPath(node._id, name),
        extension: extension,
        language: getFileLanguage(extension)
      };
      createFile(newFile); // ✅ Pass the object
    }
    setShowNewMenu(false);
  };

  const handleNewFolder = (e) => {
    e.stopPropagation();
    const name = prompt('Enter folder name:');
    if (name) {
      // ✅ BUILD THE FULL FOLDER OBJECT
      const newFolder = {
        projectId: project?._id || 'local',
        parentId: node._id, // ✅ Use this node as the parent
        name,
        type: 'folder',
        path: buildPath(node._id, name)
      };
      createFile(newFolder); // ✅ Pass the object
    }
    setShowNewMenu(false);
  };

  const isActive = activeFile?._id === node._id;

  return (
    <div> {/* [cite: 525] This is the original root div */}

      {/* ✅ ADDED THIS WRAPPER DIV */}
      <div
        onMouseLeave={() => {
          setShowActions(false);
          setShowNewMenu(false);
        }}
      >
        <div
          className={`
            flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-dark-200 rounded
            ${isActive ? 'bg-dark-300' : ''}
          `}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={handleClick}
          onMouseEnter={() => setShowActions(true)}
        // ❌ REMOVED onMouseLeave from here
        >
          <span className="text-sm">
            {node.type === 'folder' ? (
              isExpanded ? <FaFolderOpen className="text-yellow-600" /> : <FaFolder className="text-yellow-600" />
            ) : (
              getFileIcon(node.extension)
            )}
          </span>
          <span className="flex-1 text-sm truncate">{node.name}</span>

          {showActions && (
            <div className="flex items-center gap-1">
              {node.type === 'folder' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNewMenu(!showNewMenu);
                  }}
                  className="p-1 hover:bg-dark-300 rounded"
                >
                  <FaPlus className="text-xs" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-red-600 hover:bg-opacity-20 rounded text-red-400"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          )}
        </div>

        {/* ✅ This menu is now INSIDE the wrapper div */}
        {showNewMenu && (
          <div className="ml-8 mt-1 bg-dark-200 rounded p-1">
            <button
              onClick={handleNewFile}
              className="flex items-center gap-2 w-full px-2 py-1 hover:bg-dark-300 rounded text-sm"
            >
              <FaFile className="text-xs" />
              New File
            </button>
            <button
              onClick={handleNewFolder}
              className="flex items-center gap-2 w-full px-2 py-1 hover:bg-dark-300 rounded text-sm"
            >
              <FaFolder className="text-xs" />
              New Folder
            </button>
          </div>
        )}
      </div> {/* ✅ END OF WRAPPER DIV */}

      {node.type === 'folder' && isExpanded && (
        <div>
          {sortedChildren.map(child => (
            <FileTreeNode key={child._id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}