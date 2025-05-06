'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Loader, Paper } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalForm } from '@/components/auth/ProfessionalForm';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    if (!user?.id || !token) return;

    setSaving(true);
    try {
      // Determinar se a imagem precisa ser processada
      let updatedData = { ...formData };
      
      // Se houver uma nova imagem, envie como Base64
      if (formData.profileImage instanceof File) {
        const base64Image = await fileToBase64(formData.profileImage);
        updatedData.profileImageUrl = base64Image;
        delete updatedData.profileImage;
      } else {
        // Remover o campo profileImage se não for um arquivo para evitar enviar undefined
        delete updatedData.profileImage;
      }

      // Enviar a atualização para o backend
      await axios.put(`${API_URL}/users/${user.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  // Função auxiliar para converter um arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Preparar valores iniciais com base no tipo de usuário
  const getInitialValues = () => {
    const isEnterprise = user?.roles?.includes('enterprise');
    const isSupplier = user?.roles?.includes('supplier');
    const isProfessional = user?.roles?.includes('professional');
    
    // Valores comuns para todos os tipos
    const commonValues = {
      professionalName: user?.professionalName || '',
      emailProfissional: user?.emailProfissional || '',
      telefoneProfissional: user?.telefoneProfissional || '',
      miniBio: user?.miniBio || '',
      localizacaoProfissional: user?.localizacaoProfissional || '',
      website: user?.website || '',
      instagram: user?.instagram || '',
      facebook: user?.facebook || '',
      linkedin: user?.linkedin || '',
      profileImageUrl: user?.profileImageUrl || null,
    };
    
    // Adicionar valores específicos por tipo
    if (isEnterprise) {
      return {
        ...commonValues,
        segmentos: user?.segmentos || [],
        possuiLojaTisica: user?.possuiLojaTisica || false,
        possuiEcommerce: user?.possuiEcommerce || false,
      };
    } else if (isSupplier) {
      return {
        ...commonValues,
        produtos: user?.produtos || [],
      };
    } else if (isProfessional) {
      return {
        ...commonValues,
        habilidades: user?.habilidades || [],
      };
    }
    
    return commonValues;
  };

  return (
    <Container size="md" py="xl">
      <Paper p="lg" radius="md" shadow="sm" withBorder mb="xl">
        <Title order={2} mb="lg" ta="center">Editar Perfil</Title>
        
        {user && (
          <ProfessionalForm 
            onSubmit={handleSubmit} 
            initialValues={getInitialValues()}
          />
        )}
        
        {saving && (
          <div className="text-center mt-4">
            <Loader size="sm" />
            <Text size="sm" mt={5}>Salvando alterações...</Text>
          </div>
        )}
      </Paper>
    </Container>
  );
} 