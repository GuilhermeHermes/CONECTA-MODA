'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface RegistrationData {
  role?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  dataNascimento?: Date | null;
  genero?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  pais?: string;
  estado?: string;
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  clearRegistrationData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const clearRegistrationData = () => {
    setRegistrationData({});
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateRegistrationData,
        clearRegistrationData,
      }}
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