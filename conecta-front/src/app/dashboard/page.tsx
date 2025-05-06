'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Group, Paper, Card, Avatar, SimpleGrid, Loader, Badge } from '@mantine/core';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UserCard {
  id: string;
  nome: string;
  email: string;
  professionalName: string;
  miniBio: string;
  profileImageUrl: string;
  roles: string[];
  localizacaoProfissional: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const router = useRouter();
  const [professionals, setProfessionals] = useState<UserCard[]>([]);
  const [suppliers, setSuppliers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchUsers = async () => {
    if (!token || !isAuthenticated) return;
    
    setLoading(true);
    try {
      if (user?.roles?.includes('enterprise')) {
        // Buscar profissionais
        const professionalRes = await axios.get(`${API_URL}/users/professionals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfessionals(professionalRes.data);
        
        // Buscar fornecedores
        const supplierRes = await axios.get(`${API_URL}/users/suppliers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuppliers(supplierRes.data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUsers();
    }
  }, [user, isAuthenticated, token]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const isEnterprise = user?.roles?.includes('enterprise');
  const isSupplier = user?.roles?.includes('supplier');
  const isProfessional = user?.roles?.includes('professional');

  const renderUserContent = () => {
    if (isEnterprise) {
      return (
        <>
          <Title order={3} mt="xl" mb="md">Profissionais de Moda</Title>
          {professionals.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {professionals.map((prof) => (
                <Card key={prof.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Group px="md" pt="md">
                      <Avatar 
                        src={prof.profileImageUrl} 
                        size="lg" 
                        radius="xl"
                      />
                      <div>
                        <Text fw={500} size="lg">{prof.professionalName || prof.nome}</Text>
                        <Badge color="blue">Profissional</Badge>
                      </div>
                    </Group>
                  </Card.Section>
                  <Text c="dimmed" size="sm" mt="md" lineClamp={3}>
                    {prof.miniBio || "Sem descrição"}
                  </Text>
                  <Text c="dimmed" size="xs" mt="xs">
                    {prof.localizacaoProfissional || "Localização não informada"}
                  </Text>
                  <Button 
                    variant="light" 
                    color="blue" 
                    fullWidth 
                    mt="md" 
                    radius="md"
                    onClick={() => router.push(`/profile/${prof.id}`)}
                  >
                    Ver perfil
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text c="dimmed" ta="center">Nenhum profissional encontrado</Text>
          )}

          <Title order={3} mt="xl" mb="md">Fornecedores</Title>
          {suppliers.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Group px="md" pt="md">
                      <Avatar 
                        src={supplier.profileImageUrl} 
                        size="lg" 
                        radius="xl"
                      />
                      <div>
                        <Text fw={500} size="lg">{supplier.professionalName || supplier.nome}</Text>
                        <Badge color="grape">Fornecedor</Badge>
                      </div>
                    </Group>
                  </Card.Section>
                  <Text c="dimmed" size="sm" mt="md" lineClamp={3}>
                    {supplier.miniBio || "Sem descrição"}
                  </Text>
                  <Text c="dimmed" size="xs" mt="xs">
                    {supplier.localizacaoProfissional || "Localização não informada"}
                  </Text>
                  <Button 
                    variant="light" 
                    color="grape" 
                    fullWidth 
                    mt="md" 
                    radius="md"
                    onClick={() => router.push(`/profile/${supplier.id}`)}
                  >
                    Ver perfil
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text c="dimmed" ta="center">Nenhum fornecedor encontrado</Text>
          )}
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
      <Paper p="md" withBorder mb="xl">
        <Group justify="space-between">
          <div>
            <Text fw={500} size="lg">Bem-vindo, {user?.nome || user?.email}</Text>
            <Text c="dimmed" size="sm">
              Seu perfil: {
                isEnterprise ? 'Marca/Empresa' : 
                isSupplier ? 'Fornecedor' : 
                isProfessional ? 'Profissional' : 
                'Usuário'
              }
            </Text>
          </div>
          <Group>
            <Button variant="outline" onClick={() => router.push('/profile/edit')}>Meu Perfil</Button>
            <Button color="red" onClick={logout}>Sair</Button>
          </Group>
        </Group>
      </Paper>
      
      {renderUserContent()}
    </Container>
  );
} 