'use client';

import { Container } from '@mantine/core';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { user } = useAuth();

//PROBLEMA: NA PRIMEIRA VEZ QUE A PAGINA É CARREGADA, CASO NÃO SEJA ATUALIZADA, VEM APENAS COM AS INFOS DO LOGIN, Q NÃO É O USER COMPLETO, MAS SE ATUALIZAR AI CHAMA O AUTH/PROFILE.

  const router = useRouter();

  console.log(user)
  


  const handleSubmit = async (data: any) => {
    // Handle form submission
    console.log('Form submitted:', data);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container size="lg" py="xl">
      <EditProfileForm 
        user={user}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
} 