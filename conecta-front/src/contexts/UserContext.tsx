'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from './AuthContext';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  genero: string;
  dataNascimento: Date | null;
  cpf: string;
  cnpj: string;
  professionalName: string;
  emailProfissional: string;
  telefoneProfissional: string;
  miniBio: string;
  localizacaoProfissional: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  segmentos: string[];
  habilidades: string[];
  produtos: string[];
  possuiLojaTisica: boolean;
  possuiEcommerce: boolean;
  profileImageUrl: string | null;
  roles: string[];
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
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
        nome: userData.nome || '',
        email: userData.email || '',
        telefone: userData.telefone || '',
        genero: userData.genero || '',
        dataNascimento: userData.dataNascimento ? new Date(userData.dataNascimento) : null,
        cpf: userData.cpf || '',
        cnpj: userData.cnpj || '',
        professionalName: userData.professionalName || '',
        emailProfissional: userData.emailProfissional || '',
        telefoneProfissional: userData.telefoneProfissional || '',
        miniBio: userData.miniBio || '',
        localizacaoProfissional: userData.localizacaoProfissional || '',
        website: userData.website || '',
        instagram: userData.instagram || '',
        facebook: userData.facebook || '',
        linkedin: userData.linkedin || '',
        segmentos: userData.segmentos || [],
        habilidades: userData.habilidades || [],
        produtos: userData.produtos || [],
        possuiLojaTisica: userData.possuiLojaTisica || false,
        possuiEcommerce: userData.possuiEcommerce || false,
        profileImageUrl: userData.profilePicture || null,
        roles: userData.roles || [],
        endereco: userData.endereco || '',
        numero: userData.numero || '',
        bairro: userData.bairro || '',
        cidade: userData.cidade || '',
        estado: userData.estado || '',
        pais: userData.pais || 'Brasil',
        cep: userData.cep || '',
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
  
      // Mapear os dados para o formato esperado pelo backend
      const mappedData = {
        ...data,
        profilePicture: data.profileImageUrl,
      };
      
      console.log('Dados sendo enviados para o backend:', mappedData);
      const updatedUser = await userService.updateUser(mappedData);
      console.log('Dados retornados do backend após atualização:', updatedUser);
      
      // Atualizar o estado com os dados retornados
      setUser(prevUser => {
        if (!prevUser) return null;
        const newUser = {
          ...prevUser,
          ...updatedUser,
          // Campos pessoais
          nome: updatedUser.nome || prevUser.nome,
          email: updatedUser.email || prevUser.email,
          telefone: updatedUser.telefone || prevUser.telefone,
          genero: updatedUser.genero || prevUser.genero,
          dataNascimento: updatedUser.dataNascimento ? new Date(updatedUser.dataNascimento) : prevUser.dataNascimento,
          cpf: updatedUser.cpf || prevUser.cpf,
          cnpj: updatedUser.cnpj || prevUser.cnpj,
          
          // Campos profissionais
          professionalName: updatedUser.professionalName || prevUser.professionalName,
          emailProfissional: updatedUser.emailProfissional || prevUser.emailProfissional,
          telefoneProfissional: updatedUser.telefoneProfissional || prevUser.telefoneProfissional,
          miniBio: updatedUser.miniBio || prevUser.miniBio,
          localizacaoProfissional: updatedUser.localizacaoProfissional || prevUser.localizacaoProfissional,
          website: updatedUser.website || prevUser.website,
          instagram: updatedUser.instagram || prevUser.instagram,
          facebook: updatedUser.facebook || prevUser.facebook,
          linkedin: updatedUser.linkedin || prevUser.linkedin,
          segmentos: updatedUser.segmentos || prevUser.segmentos,
          habilidades: updatedUser.habilidades || prevUser.habilidades,
          produtos: updatedUser.produtos || prevUser.produtos,
          possuiLojaTisica: updatedUser.possuiLojaTisica || prevUser.possuiLojaTisica,
          possuiEcommerce: updatedUser.possuiEcommerce || prevUser.possuiEcommerce,
          profileImageUrl: updatedUser.profilePicture || prevUser.profileImageUrl,
          
          // Campos de endereço
          endereco: updatedUser.endereco || prevUser.endereco,
          numero: updatedUser.numero || prevUser.numero,
          bairro: updatedUser.bairro || prevUser.bairro,
          cidade: updatedUser.cidade || prevUser.cidade,
          estado: updatedUser.estado || prevUser.estado,
          pais: updatedUser.pais || prevUser.pais,
          cep: updatedUser.cep || prevUser.cep,
        };
        console.log('Novo estado do usuário após atualização:', newUser);
        return newUser;
      });
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user data');
      throw err;
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