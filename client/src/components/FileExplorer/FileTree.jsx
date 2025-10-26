import React from 'react';
import { useProject } from '../../contexts/ProjectContext';
import FileTreeNode from './FileTreeNode';

export default function FileTree() {
  const { files } = useProject();
  
  // Get root level files/folders (parentId = null)
  const rootItems = files.filter(file => !file.parentId);
  
  // Sort folders first, then files
  const sortedItems = rootItems.sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="select-none">
      {sortedItems.map(item => (
        <FileTreeNode key={item._id} node={item} level={0} />
      ))}
      {sortedItems.length === 0 && (
        <div className="text-dark-400 text-sm italic p-2">
          No files yet. Create a new file or folder.
        </div>
      )}
    </div>
  );
}