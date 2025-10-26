import api from './api';

export const fileService = {
  createFile: async (fileData) => {
    const response = await api.post('/files', fileData);
    return response.data;
  },

  getFile: async (fileId) => {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  updateFile: async (fileId, updates) => {
    const response = await api.put(`/files/${fileId}`, updates);
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  moveFile: async (fileId, newParentId) => {
    const response = await api.put(`/files/${fileId}/move`, { newParentId });
    return response.data;
  }
};