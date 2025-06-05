'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Address {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

export interface RegistrationData {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  documentType?: 'cpf' | 'cnpj';
  documentNumber?: string;
  birthDate?: Date | null;
  phone?: string;
  role?: string;
  gender: string;
  address?: Address;
  professionalName?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  miniBio?: string;
  professionalLocation?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  segments?: string[];
  skills?: string[];
  products?: string[];
  hasPhysicalStore?: boolean;
  hasEcommerce?: boolean;
  profilePicture?: string | null;
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  clearRegistrationData: () => void;
}

const STORAGE_KEY = 'registration_data';

const initialData: RegistrationData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  documentType: 'cpf',
  documentNumber: '',
  gender: '',
  birthDate: null,
  phone: '',
  address: {
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: '',
  },
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  // Inicializa o estado com dados do localStorage ou dados iniciais
  const [registrationData, setRegistrationData] = useState<RegistrationData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Converte a string de data de volta para objeto Date
          if (parsedData.birthDate) {
            parsedData.birthDate = new Date(parsedData.birthDate);
          }
          return parsedData;
        } catch (error) {
          console.error('Erro ao carregar dados do localStorage:', error);
          return initialData;
        }
      }
    }
    return initialData;
  });

  // Salva no localStorage sempre que os dados mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrationData));
    }
  }, [registrationData]);

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => {
      const newData = { ...prev, ...data };
      
      // Ensure role is not 'user' if it's being set
      if (data.role === 'user') {
        delete newData.role;
      }
      
      // Ensure address is properly structured
      if (data.address) {
        newData.address = {
          ...prev.address,
          ...data.address
        };
      }
      
      return newData;
    });
  };

  const clearRegistrationData = () => {
    setRegistrationData(initialData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{ registrationData, updateRegistrationData, clearRegistrationData }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
} 