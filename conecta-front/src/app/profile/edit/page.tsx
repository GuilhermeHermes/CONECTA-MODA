'use client';

import { Container } from '@mantine/core';
import { EditProfileForm } from '@/components/profile/EditProfileForm';

export default function EditProfilePage() {
  return (
    <Container size="lg" py="xl">
      <EditProfileForm />
    </Container>
  );
} 