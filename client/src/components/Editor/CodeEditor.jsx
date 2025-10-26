// client/src/components/Editor/CodeEditor.jsx

import React, { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useProject } from '../../contexts/ProjectContext';
// import { useDebounce } from '../../hooks/useDebounce'; // <-- REMOVED

export default function CodeEditor() {
  const { activeFile, updateFile } = useProject();
  const [value, setValue] = useState('');
  // const debouncedValue = useDebounce(value, 500); // <-- REMOVED

  // EFFECT 1: Load file content into editor when activeFile changes (Keep this)
  useEffect(() => {
    if (activeFile) {
      setValue(activeFile.content || '');
    }
  }, [activeFile]);

  // EFFECT 2: Save debounced content changes back to the context <-- REMOVED THIS WHOLE BLOCK
  // useEffect(() => {
  //   if (activeFile && debouncedValue !== (activeFile.content || '')) {
  //     updateFile(activeFile._id, { content: debouncedValue });
  //   }
  // }, [debouncedValue, activeFile, updateFile]);

  // The main change handler
  const handleChange = (newValue) => {
    setValue(newValue); // Update local state immediately
    // Call updateFile to update the ProjectContext state, but it won't save automatically anymore
    if (activeFile) {
      updateFile(activeFile._id, { content: newValue });
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
        <p>Select a file to edit</p>
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100%"
      language={activeFile.language || 'javascript'}
      value={value}
      onChange={handleChange}
      theme={'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
}