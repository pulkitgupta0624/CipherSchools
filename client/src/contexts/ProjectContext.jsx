import React, { createContext, useContext, useState, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { fileService } from '../services/fileService';
import { storageService } from '../services/storageService';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';

const ProjectContext = createContext({});

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadProject = async (projectSlug) => {
    setLoading(true);
    try {
      // Try to load from API first (for authenticated users)
      try {
        const data = await projectService.getProject(projectSlug);
        console.log('Loaded from API:', data); // Debug log
        setProject(data.project);
        setFiles(data.files || []);
        return data;
      } catch (apiError) {
        console.log('API load failed, trying localStorage:', apiError);

        // If API fails, try localStorage (for non-authenticated users)
        const localData = storageService.loadProject(projectSlug);
        if (localData) {
          console.log('Loaded from localStorage:', localData); // Debug log
          setProject(localData.project);
          setFiles(localData.files || []);
          return localData;
        } else {
          throw new Error('Project not found');
        }
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load project');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const newProject = await projectService.createProject(projectData);
      toast.success('Project created successfully');
      return newProject;
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  };

  const saveProject = async () => { // <-- Made async
    if (!project) return;

    setIsSaving(true);
    try {
      // 1. Always save full project state to localStorage
      storageService.saveProject(project.projectSlug, {
        project,
        files, // Save the current state of all files
        timestamp: Date.now()
      });

      // 2. Save ACTIVE file content to backend (if applicable)
      const token = localStorage.getItem('token');
      // Check if there's an active file, user is logged in, and it's not a local project
      if (activeFile && token && project?._id && !project._id.startsWith('local_')) {
        // Find the most recent version of the active file in the state
        const currentFileState = files.find(f => f._id === activeFile._id);
        if (currentFileState) {
          try {
            // Call the API to update only the content of the active file
            await fileService.updateFile(activeFile._id, { content: currentFileState.content });
            toast.success('Project saved!'); // Show success only after backend save (if attempted)
          } catch (apiError) {
            console.error('Failed to save active file to backend:', apiError);
            toast.error('Failed to save file changes to server.');
            // Note: We don't roll back the localStorage save here,
            // as it might contain other valid changes.
          }
        }
      } else if (!token || !project?._id || project._id.startsWith('local_')) {
         // If it's a local project or user isn't logged in, just confirm local save
         toast.success('Project saved locally!');
      }

    } catch (error) {
      toast.error('Failed to save project');
      console.error('Error during saveProject:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const createFile = async (fileData) => {
    // This is an "optimistic update".
    // We create a temporary file with a temp ID to make the UI feel fast.
    const newFile = {
      _id: nanoid(), // Temporary ID
      ...fileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update the UI immediately
    setFiles(prev => [...prev, newFile]);

    // Now, try to save to the backend if we're logged in
    // and this isn't a local-only project
    const token = localStorage.getItem('token');
    if (token && project?._id && !project._id.startsWith('local_')) {
      try {
        // Send the new file (with temp ID) to the server
        const savedFile = await fileService.createFile(newFile);

        // Once saved, the server returns the REAL file (with a database _id).
        // We update our state again, replacing the temp file with the real one.
        setFiles(prev =>
          prev.map(f => (f._id === newFile._id ? savedFile : f))
        );

        return savedFile; // Return the saved file
      } catch (error) {
        console.error('Failed to save file to backend:', error);
        toast.error('Failed to create file on server');

        // !! ROLLBACK !!
        // If the API call fails, remove the temporary file we added.
        setFiles(prev => prev.filter(f => f._id !== newFile._id));
      }
    }

    return newFile; // Return the temp file (for local projects)
  };

  // This function is now async to handle the API call
  const updateFile = (fileId, updates) => {
    setFiles(prev =>
      prev.map(file =>
        file._id === fileId
          ? { ...file, ...updates, updatedAt: new Date().toISOString() }
          : file
      )
    );
  };

  const deleteFile = (fileId) => {
    const fileToDelete = files.find(f => f._id === fileId);
    if (!fileToDelete) return;

    setOpenFiles(prev => prev.filter(f => f._id !== fileId));
    if (activeFile?._id === fileId) {
      setActiveFile(null);
    }

    const idsToDelete = [fileId];
    if (fileToDelete.type === 'folder') {
      const getChildrenIds = (parentId) => {
        const children = files.filter(f => f.parentId === parentId);
        children.forEach(child => {
          idsToDelete.push(child._id);
          if (child.type === 'folder') {
            getChildrenIds(child._id);
          }
        });
      };
      getChildrenIds(fileId);
    }

    setFiles(prev => prev.filter(f => !idsToDelete.includes(f._id)));
  };

  const openFile = (file) => {
    if (file.type !== 'file') return;

    if (!openFiles.find(f => f._id === file._id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFile(file);
  };

  const closeFile = (fileId) => {
    setOpenFiles(prev => {
      const newOpenFiles = prev.filter(f => f._id !== fileId);
      if (activeFile?._id === fileId && newOpenFiles.length > 0) {
        setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
      } else if (newOpenFiles.length === 0) {
        setActiveFile(null);
      }
      return newOpenFiles;
    });
  };

  const value = {
    project,
    files,
    activeFile,
    openFiles,
    loading,
    isSaving,
    loadProject,
    createProject,
    saveProject,
    createFile,
    updateFile,
    deleteFile,
    openFile,
    closeFile,
    setActiveFile
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};