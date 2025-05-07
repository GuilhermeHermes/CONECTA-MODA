import api from './api';

export const userService = {
  async getCurrentUser() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateUser(data: any) {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
}; 