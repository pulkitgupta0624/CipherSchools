// Storage service for managing localStorage operations

export const storageService = {
  // Save project to localStorage
  saveProject: (projectSlug, projectData) => {
    try {
      localStorage.setItem(`project_${projectSlug}`, JSON.stringify(projectData));
      
      // Also save to projects list
      const projectsList = storageService.getAllProjects();
      const existingIndex = projectsList.findIndex(p => p.projectSlug === projectSlug);
      
      if (existingIndex >= 0) {
        projectsList[existingIndex] = projectData.project;
      } else {
        projectsList.push(projectData.project);
      }
      
      localStorage.setItem('projects_list', JSON.stringify(projectsList));
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      return false;
    }
  },

  // Load project from localStorage
  loadProject: (projectSlug) => {
    try {
      const data = localStorage.getItem(`project_${projectSlug}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  },

  // Get all projects
  getAllProjects: () => {
    try {
      const data = localStorage.getItem('projects_list');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get projects:', error);
      return [];
    }
  },

  // Delete project
  deleteProject: (projectSlug) => {
    try {
      localStorage.removeItem(`project_${projectSlug}`);
      
      const projectsList = storageService.getAllProjects();
      const filtered = projectsList.filter(p => p.projectSlug !== projectSlug);
      localStorage.setItem('projects_list', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  },

  // Save user settings
  saveSettings: (settings) => {
    try {
      localStorage.setItem('user_settings', JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  },

  // Load user settings
  loadSettings: () => {
    try {
      const data = localStorage.getItem('user_settings');
      return data ? JSON.parse(data) : {
        theme: 'light',
        autoSave: true,
        fontSize: 14
      };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {
        theme: 'light',
        autoSave: true,
        fontSize: 14
      };
    }
  },

  // Clear all storage (useful for logout)
  clearAll: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }
};