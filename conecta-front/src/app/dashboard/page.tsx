'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Group, Paper, Card, Avatar, SimpleGrid, Loader, Badge, TextInput, Select, Stack, ActionIcon } from '@mantine/core';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/config';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

interface UserCard {
  id: string;
  nome: string;
  email: string;
  professionalName: string;
  miniBio: string;
  profileImageUrl: string;
  roles: string[];
  localizacaoProfissional: string;
  habilidades?: string[];
  segmentos?: string[];
}

interface FilterState {
  search: string;
  location: string;
  role: string;
  specialty: string;
}

interface FilterBarProps {
  searchInput: string;
  locationInput: string;
  specialtyInput: string;
  role: string;
  isFiltering: boolean;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onRoleChange: (value: string | null) => void;
  onSearch: () => void;
}

const FilterBar = memo(({ 
  searchInput, 
  locationInput,
  specialtyInput,
  role, 
  isFiltering,
  onSearchChange,
  onLocationChange,
  onSpecialtyChange,
  onRoleChange,
  onSearch 
}: FilterBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Paper p="md" withBorder mb="xl">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Group grow>
            <TextInput
              placeholder="Buscar por nome ou descrição..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              leftSection={<IconSearch size={16} />}
            />
            <TextInput
              placeholder="Filtrar por localização..."
              value={locationInput}
              onChange={(e) => onLocationChange(e.target.value)}
            />
            <TextInput
              placeholder="Filtrar por especialidade..."
              value={specialtyInput}
              onChange={(e) => onSpecialtyChange(e.target.value)}
            />
          </Group>
          <Group grow>
            <Select
              placeholder="Tipo de perfil"
              value={role}
              onChange={onRoleChange}
              data={[
                { value: 'all', label: 'Todos' },
                { value: 'professional', label: 'Profissionais' },
                { value: 'supplier', label: 'Fornecedores' }
              ]}
            />
            <Button
              type="submit"
              variant="filled"
              color="blue"
              loading={isFiltering}
              leftSection={<IconFilter size={16} />}
              style={{ flexGrow: 0 }}
            >
              Filtrar
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
});

FilterBar.displayName = 'FilterBar';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [professionals, setProfessionals] = useState<UserCard[]>([]);
  const [suppliers, setSuppliers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 300);
  const [debouncedLocation] = useDebouncedValue(locationInput, 300);
  const [debouncedSpecialty] = useDebouncedValue(specialtyInput, 300);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    role: 'all',
    specialty: ''
  });
  const [isFiltering, setIsFiltering] = useState(false);

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
        const professionalRes = await axios.get(`${config.api.baseURL}/users/professionals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfessionals(professionalRes.data);
        
        // Buscar fornecedores
        const supplierRes = await axios.get(`${config.api.baseURL}/users/suppliers`, {
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

  const handleSearch = useCallback(() => {
    setIsFiltering(true);
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      location: debouncedLocation,
      specialty: debouncedSpecialty
    }));
    setIsFiltering(false);
  }, [debouncedSearch, debouncedLocation, debouncedSpecialty]);

  const handleRoleChange = useCallback((value: string | null) => {
    setIsFiltering(true);
    setFilters(prev => ({ ...prev, role: value || 'all' }));
    setIsFiltering(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setLocationInput(value);
  }, []);

  const handleSpecialtyChange = useCallback((value: string) => {
    setSpecialtyInput(value);
  }, []);

  const filterUsers = useCallback((users: UserCard[]) => {
    return users.filter(user => {
      const matchesSearch = 
        !filters.search ||
        user.professionalName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.miniBio?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLocation = 
        !filters.location || 
        user.localizacaoProfissional?.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesRole = 
        filters.role === 'all' ||
        (filters.role === 'professional' && user.roles.includes('professional')) ||
        (filters.role === 'supplier' && user.roles.includes('supplier'));

      const matchesSpecialty = 
        !filters.specialty ||
        user.habilidades?.some(h => h.toLowerCase().includes(filters.specialty.toLowerCase())) ||
        user.segmentos?.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()));

      return matchesSearch && matchesLocation && matchesRole && matchesSpecialty;
    });
  }, [filters]);

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
      const filteredProfessionals = filterUsers(professionals);
      const filteredSuppliers = filterUsers(suppliers);

      return (
        <>
          <FilterBar 
            searchInput={searchInput}
            locationInput={locationInput}
            specialtyInput={specialtyInput}
            role={filters.role}
            isFiltering={isFiltering}
            onSearchChange={handleSearchChange}
            onLocationChange={handleLocationChange}
            onSpecialtyChange={handleSpecialtyChange}
            onRoleChange={handleRoleChange}
            onSearch={handleSearch}
          />
          <Title order={3} mt="xl" mb="md">Profissionais de Moda</Title>
          {filteredProfessionals.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {filteredProfessionals.map((prof) => (
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
          {filteredSuppliers.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {filteredSuppliers.map((supplier) => (
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
        </Group>
      </Paper>
      
      {renderUserContent()}
    </Container>
  );
} 