'use client';

import UserListPage from '@/components/UserListPage';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

export default function SuppliersPage() {
  return (
    <AuthenticatedLayout>
      <UserListPage
        title="Fornecedores"
        endpoint="/users/suppliers"
        userType="supplier"
        badgeColor="grape"
        buttonColor="grape"
        specialtyLabel="produto"
        specialtyField="products"
      />
    </AuthenticatedLayout>
  );
} 