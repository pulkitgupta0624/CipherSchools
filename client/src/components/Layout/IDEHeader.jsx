import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
// Removed useTheme import
import { FaCode, FaSave, FaPlay, FaDownload, FaShare, FaHome } from 'react-icons/fa'; // Removed FaSun, FaMoon
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-toastify';

export default function IDEHeader() {
  const { project, saveProject, isSaving } = useProject();
  const { user } = useAuth();
  // Removed theme context logic
  const [autoSave, setAutoSave] = useState(true);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSave) return;
    
    const interval = setInterval(() => {
      saveProject();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSave, saveProject]);

  // Keyboard shortcut for save
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    handleSave();
  });

  const handleSave = async () => {
    await saveProject();
  };

  const handleExport = () => {
    // Export project as ZIP
    toast.info('Export feature coming soon!');
  };

  const handleShare = () => {
    // Copy shareable link
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    // Set to light theme: white background, light grey border
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <FaCode className="text-xl text-primary-600" />
            {/* Set to dark text */}
            <span className="text-sm font-bold text-gray-900">CipherStudio</span>
          </Link>
          
          {project && (
            <div className="flex items-center gap-2">
              {/* Set to light theme text colors */}
              <span className="text-gray-400">/</span>
              <h1 className="text-gray-900 font-medium">{project.name}</h1>
              {isSaving && (
                <span className="text-xs text-gray-500">Saving...</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            // Light theme button: light grey bg, dark text
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-800"
            disabled={isSaving}
          >
            <FaSave />
            Save
          </button>
          
          <button
            className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
          >
            <FaPlay />
            Run
          </button>
          
          <button
            onClick={handleShare}
            // Light theme icon button: grey icon, darkens on hover with a light bg
            className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <FaShare />
          </button>
          
          <button
            onClick={handleExport}
            className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <FaDownload />
          </button>
          
          {/* --- Theme Toggle Button Removed --- */}
          
          <Link
            to="/dashboard"
            className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <FaHome />
          </Link>
        </div>
      </div>
    </header>
  );
}