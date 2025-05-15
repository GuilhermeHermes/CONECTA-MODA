import api from './api';

export const userService = {
  async register(userData: any) {
    // Role mapping from Portuguese to English
    const roleMapping: { [key: string]: string } = {
      'MARCA': 'BRAND',
      'PROFISSIONAL': 'PROFESSIONAL',
      'FORNECEDOR': 'SUPPLIER',
      'PADRAO': 'DEFAULT'
    };

    // Map frontend fields to backend format
    const mappedData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      documentType: userData.documentType.toLowerCase(),
      documentNumber: userData.documentNumber,
      birthDate: new Date(userData.birthDate), // Send as Date object
      gender: userData.gender || 'prefer_not_to_say', // Default value if empty
      roles: [roleMapping[userData.role?.toUpperCase()] || 'DEFAULT'], // Map role to English
      address: userData.address ? {
        street: userData.address.street,
        number: userData.address.number,
        neighborhood: userData.address.neighborhood,
        city: userData.address.city,
        state: userData.address.state,
        country: userData.address.country || 'Brasil',
        zipCode: userData.address.zipCode,
        complement: userData.address.complement || ''
      } : undefined,
      professionalName: userData.professionalName,
      professionalEmail: userData.professionalEmail,
      professionalPhone: userData.professionalPhone,
      miniBio: userData.miniBio,
      professionalLocation: userData.professionalLocation || '',
      socialLinks: {
        website: userData.website || null,
        instagram: userData.instagram || null,
        facebook: userData.facebook || null,
        linkedin: userData.linkedin || null
      },
      segments: userData.segments || [],
      skills: userData.skills || [],
      products: userData.products || [],
      hasPhysicalStore: userData.hasPhysicalStore || false,
      hasEcommerce: userData.hasEcommerce || false,
      profilePicture: userData.profileImageUrl || null
    };

    // Ensure roles is one of the valid values
    if (!['DEFAULT', 'PROFESSIONAL', 'SUPPLIER', 'BRAND'].includes(mappedData.roles[0])) {
      throw new Error('Invalid role value');
    }

    // Ensure gender is one of the valid values
    if (!['male', 'female', 'other', 'prefer_not_to_say'].includes(mappedData.gender)) {
      mappedData.gender = 'prefer_not_to_say';
    }

    const response = await api.post('/users/register', mappedData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/profile');
    const userData = response.data;
    
    // Map backend fields to frontend format
    return {
      ...userData,
      name: userData.name,
      phone: userData.phone,
      gender: userData.gender,
      birthDate: userData.birthDate,
      documentType: userData.documentType,
      documentNumber: userData.documentNumber,
      professionalEmail: userData.professionalEmail,
      professionalPhone: userData.professionalPhone,
      professionalLocation: userData.professionalLocation,
      segments: userData.segments,
      skills: userData.skills,
      products: userData.products,
      hasPhysicalStore: userData.hasPhysicalStore,
      hasEcommerce: userData.hasEcommerce,
      address: userData.address ? {
        street: userData.address.street,
        number: userData.address.number,
        neighborhood: userData.address.neighborhood,
        city: userData.address.city,
        state: userData.address.state,
        country: userData.address.country,
        zipCode: userData.address.zipCode,
        complement: userData.address.complement,
      } : undefined,
    };
  },

  async updateUser(data: any) {
    // Map frontend fields to backend format
    const mappedData = {
      ...data,
      profilePicture: data.profileImageUrl,
    };
    
    const response = await api.patch('/users/me', mappedData);
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
  },

  mapUserData: (userData: any) => ({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    professionalName: userData.professionalName,
    miniBio: userData.miniBio,
    profilePicture: userData.profilePicture,
    roles: userData.roles,
    professionalLocation: userData.professionalLocation,
    professionalPhone: userData.professionalPhone,
    professionalEmail: userData.professionalEmail,
    website: userData.website,
    instagram: userData.instagram,
    facebook: userData.facebook,
    linkedin: userData.linkedin,
    skills: userData.skills,
    products: userData.products,
    segments: userData.segments,
    address: userData.address
  }),

  updateUserProfile: async (data: any) => {
    const response = await api.put(`/users/${data.id}`, {
      name: data.name,
      professionalName: data.professionalName,
      miniBio: data.miniBio,
      profilePicture: data.profilePicture,
      professionalLocation: data.professionalLocation,
      professionalPhone: data.professionalPhone,
      professionalEmail: data.professionalEmail,
      website: data.website,
      instagram: data.instagram,
      facebook: data.facebook,
      linkedin: data.linkedin,
      skills: data.skills,
      products: data.products,
      segments: data.segments,
      address: data.address
    });
    return response.data;
  }
}; 