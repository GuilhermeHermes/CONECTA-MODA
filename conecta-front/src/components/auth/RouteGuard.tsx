'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
];

// Rotas que só podem ser acessadas quando NÃO está autenticado
const PUBLIC_ONLY_ROUTES = [
  '/',
  '/cadastro',
  '/cadastro/chooseRole',
  '/cadastro/aboutYou',
  '/cadastro/businessInfos',
];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some(route => pathname === route);

    if (isProtectedRoute && !isAuthenticated) {
      // Se tentar acessar rota protegida sem estar autenticado
      router.push('/');
    } else if (isPublicOnlyRoute && isAuthenticated) {
      // Se tentar acessar rota pública estando autenticado
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return null; // ou um componente de loading
  }

  return <>{children}</>;
} 