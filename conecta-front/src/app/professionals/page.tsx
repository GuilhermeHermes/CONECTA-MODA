'use client';

import UserListPage from '@/components/UserListPage';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

export default function ProfessionalsPage() {
  return (
    <AuthenticatedLayout>
      <UserListPage
        title="Profissionais de Moda"
        endpoint="/users/professionals"
        userType="professional"
        badgeColor="blue"
        buttonColor="blue"
        specialtyLabel="especialidade"
        specialtyField="skills"
      />
    </AuthenticatedLayout>
  );
} 