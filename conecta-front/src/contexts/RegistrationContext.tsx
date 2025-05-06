'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface SocialLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

interface RegistrationData {
  // Step 1 - Role selection
  role?: 'profissional' | 'marca' | 'fornecedor';
  
  // Step 2 - Personal info
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  documentType?: 'cpf' | 'cnpj';
  dataNascimento?: Date | null;
  genero?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  pais?: string;
  estado?: string;
  password?: string;
  confirmPassword?: string;
  
  // Step 3 - Professional info
  professionalName?: string;
  emailProfissional?: string;
  telefoneProfissional?: string;
  miniBio?: string;
  localizacaoProfissional?: string;
  socialLinks?: SocialLinks;
  segmentos?: string[];
  habilidades?: string[];
  produtos?: string[];
  possuiLojaTisica?: boolean;
  possuiEcommerce?: boolean;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  clearRegistrationData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const STORAGE_KEY = 'conecta_moda_registration';

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const router = useRouter();

  // Load registration data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setRegistrationData(parsedData);
        
        // Navigate to appropriate step based on saved data
        if (router) {
          if (!parsedData.role) {
            setCurrentStep(0);
            router.push('/cadastro/chooseRole');
          } else if (!parsedData.nome || !parsedData.email) {
            setCurrentStep(1);
            router.push('/cadastro/aboutYou');
          } else if (!parsedData.professionalName) {
            setCurrentStep(2);
            router.push('/cadastro/businessInfos');
          }
        }
      } catch (error) {
        console.error('Error parsing saved registration data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [router]);

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    const updatedData = { ...registrationData, ...data };
    setRegistrationData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };

  const clearRegistrationData = () => {
    setRegistrationData({});
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        currentStep,
        setCurrentStep,
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