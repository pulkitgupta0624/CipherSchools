import api from './api';

export const projectService = {
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  getProjects: async (page = 1, limit = 10) => {
    const response = await api.get(`/projects?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProject: async (projectSlug) => {
    const response = await api.get(`/projects/${projectSlug}`);
    return response.data;
  },

  updateProject: async (projectId, updates) => {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  forkProject: async (projectId) => {
    const response = await api.post(`/projects/${projectId}/fork`);
    return response.data;
  }
};