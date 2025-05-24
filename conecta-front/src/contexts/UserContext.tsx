'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from './AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  professionalName: string;
  miniBio: string;
  profilePicture: string | null;
  roles: string[];
  professionalLocation: string;
  professionalPhone: string;
  professionalEmail: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  skills: string[];
  products: string[];
  segments: string[];
  address?: {
    neighborhood: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    city: string;
    state: string;
    country: string;
  };
}

interface UserContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user: authUser, token } = useAuth();

  const refreshUser = async () => {
    if (!isAuthenticated || !token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();
      console.log('Dados brutos do backend:', userData);
      
      // Mapear os dados do usuário para o formato esperado
      const mappedUserData: User = {
        id: userData.id,
        name: userData.name || '',
        email: userData.email || '',
        professionalName: userData.professionalName || '',
        miniBio: userData.miniBio || '',
        roles: userData.roles || [],
        professionalLocation: userData.professionalLocation || '',
        professionalPhone: userData.professionalPhone || '',
        professionalEmail: userData.professionalEmail || '',
        website: userData.website || null,
        instagram: userData.instagram || null,
        facebook: userData.facebook || null,
        linkedin: userData.linkedin || null,
        skills: userData.skills || [],
        products: userData.products || [],
        segments: userData.segments || [],
        address: userData.address,
        profilePicture: userData.profilePicture || null,
      };
      
      console.log('Dados mapeados para o frontend:', mappedUserData);
      setUser(mappedUserData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
      if (authUser) {
        console.log('Usando dados do authUser como fallback:', authUser);
        setUser(authUser as User);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      setLoading(true);
      setError(null);
  
      const response = await userService.updateUserProfile({
        ...user,
        ...data,
      });

      const updatedUser = response;
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          ...updatedUser,
          profilePicture: updatedUser.profilePicture || prevUser.profilePicture,
        };
      });

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError('Failed to update user data');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 