'use client';

import { useEffect } from 'react';
import { Container, Title, Text, Button, Group, Paper, SimpleGrid, Loader } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { IconUsers, IconTruck, IconChartBar, IconSettings } from '@tabler/icons-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  console.log('user no dashboard: ' + user)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const isBrand = user?.roles?.includes('BRAND');
  const isSupplier = user?.roles?.includes('SUPPLIER');
  const isProfessional = user?.roles?.includes('PROFESSIONAL');

  const renderUserContent = () => {
    if (isBrand) {
      return (
        <>
          <Paper p="md" withBorder mb="xl">
            <Group justify="space-between">
              <div>
                <Text fw={500} size="lg">Bem-vindo, {user?.name || user?.email}</Text>
                <Text c="dimmed" size="sm">Marca/Empresa</Text>
              </div>
            </Group>
          </Paper>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }} spacing="lg">
            <Paper p="xl" radius="md" withBorder>
              <Group mb="md">
                <IconUsers size={32} color="var(--mantine-color-blue-6)" />
                <div>
                  <Text fw={500} size="lg">Profissionais</Text>
                  <Text c="dimmed" size="sm">Encontre profissionais qualificados para sua empresa</Text>
                </div>
              </Group>
              <Button 
                variant="light" 
                color="blue" 
                fullWidth 
                onClick={() => router.push('/professionals')}
              >
                Ver profissionais
              </Button>
            </Paper>

            <Paper p="xl" radius="md" withBorder>
              <Group mb="md">
                <IconTruck size={32} color="var(--mantine-color-grape-6)" />
                <div>
                  <Text fw={500} size="lg">Fornecedores</Text>
                  <Text c="dimmed" size="sm">Encontre fornecedores para sua empresa</Text>
                </div>
              </Group>
              <Button 
                variant="light" 
                color="grape" 
                fullWidth 
                onClick={() => router.push('/suppliers')}
              >
                Ver fornecedores
              </Button>
            </Paper>

            <Paper p="xl" radius="md" withBorder>
              <Group mb="md">
                <IconChartBar size={32} color="var(--mantine-color-green-6)" />
                <div>
                  <Text fw={500} size="lg">Análises</Text>
                  <Text c="dimmed" size="sm">Visualize métricas e estatísticas</Text>
                </div>
              </Group>
              <Button 
                variant="light" 
                color="green" 
                fullWidth 
                onClick={() => router.push('/analytics')}
              >
                Ver análises
              </Button>
            </Paper>

            <Paper p="xl" radius="md" withBorder>
              <Group mb="md">
                <IconSettings size={32} color="var(--mantine-color-gray-6)" />
                <div>
                  <Text fw={500} size="lg">Configurações</Text>
                  <Text c="dimmed" size="sm">Gerencie suas configurações</Text>
                </div>
              </Group>
              <Button 
                variant="light" 
                color="gray" 
                fullWidth 
                onClick={() => router.push('/settings')}
              >
                Configurações
              </Button>
            </Paper>
          </SimpleGrid>
        </>
      );
    } else if (isSupplier || isProfessional) {
      return (
        <Paper p="xl" radius="md" shadow="xs" withBorder>
          <Title order={3} ta="center" mb="md">
            Cadastro Realizado com Sucesso!
          </Title>
          <Text ta="center" mb="lg">
            Seu perfil foi criado e está pronto para ser visualizado por empresas do setor.
          </Text>
          <Button 
            variant="filled" 
            color="blue" 
            mx="auto" 
            display="block"
            onClick={() => router.push('/profile/edit')}
          >
            Editar meu perfil
          </Button>
        </Paper>
      );
    }
    
    return <Text>Tipo de perfil não reconhecido</Text>;
  };

  return (
    <Container size="lg" py="xl">
      {renderUserContent()}
    </Container>
  );
} 