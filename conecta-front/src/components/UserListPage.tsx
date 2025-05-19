import { useEffect, useState, useCallback } from 'react';
import { Container, Title, Text, Button, Group, Paper, Card, Avatar, SimpleGrid, Loader, Badge, TextInput, Stack, Pagination } from '@mantine/core';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/config';
import { IconSearch, IconFilter, IconWorld, IconBrandInstagram, IconBrandFacebook, IconBrandLinkedin } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  professionalName: string;
  miniBio: string;
  profilePicture: string | null;
  roles: string[];
  professionalLocation: string;
  professionalPhone: string;
  professionalEmail: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  skills: string[];
  products: string[];
  segments: string[];
}

interface FilterState {
  search: string;
  location: string;
  specialty: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UserListPageProps {
  title: string;
  endpoint: string;
  userType: 'professional' | 'supplier';
  badgeColor: string;
  buttonColor: string;
  specialtyLabel: string;
  specialtyField: 'skills' | 'products';
}

export default function UserListPage({
  title,
  endpoint,
  userType,
  badgeColor,
  buttonColor,
  specialtyLabel,
  specialtyField
}: UserListPageProps) {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
  const [debouncedLocation] = useDebouncedValue(locationInput, 300);
  const [debouncedSpecialty] = useDebouncedValue(specialtyInput, 300);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    specialty: ''
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchUsers = async () => {
    if (!token || !isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await axios.get<PaginatedResponse<User>>(
        `${config.api.baseURL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: filters.search,
            location: filters.location,
            [specialtyField]: filters.specialty ? [filters.specialty] : undefined
          }
        }
      );
      setUsers(response.data.data);
      setTotalPages(response.data.meta.totalPages);
      setTotalItems(response.data.meta.total);
    } catch (error) {
      console.error(`Erro ao buscar ${userType}s:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUsers();
    }
  }, [user, isAuthenticated, token, currentPage, filters]);

  const handleSearch = useCallback(() => {
    setIsFiltering(true);
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      location: debouncedLocation,
      specialty: debouncedSpecialty
    }));
    setCurrentPage(1);
    setIsFiltering(false);
  }, [debouncedSearch, debouncedLocation, debouncedSpecialty]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value) {
      setFilters(prev => ({ ...prev, search: '' }));
      setCurrentPage(1);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    if (!value) {
      setFilters(prev => ({ ...prev, location: '' }));
      setCurrentPage(1);
    }
  };

  const handleSpecialtyChange = (value: string) => {
    setSpecialtyInput(value);
    if (!value) {
      setFilters(prev => ({ ...prev, specialty: '' }));
      setCurrentPage(1);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">{title}</Title>

      <Paper p="md" withBorder mb="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <Stack>
            <Group grow>
              <TextInput
                placeholder="Buscar por nome ou descrição..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                leftSection={<IconSearch size={16} />}
              />
              <TextInput
                placeholder="Filtrar por localização..."
                value={locationInput}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              <TextInput
                placeholder={`Filtrar por ${specialtyLabel}...`}
                value={specialtyInput}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
              />
            </Group>
            <Group justify="flex-end">
              <Button
                type="submit"
                variant="filled"
                color="blue"
                loading={isFiltering}
                leftSection={<IconFilter size={16} />}
              >
                Filtrar
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size="lg" />
          </div>
        ) : users.length > 0 ? (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {users.map((user) => (
                <Card
                  key={user.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    height: 360,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Card.Section>
                    <Group px="md" pt="md">
                      <Avatar 
                        src={user.profilePicture} 
                        size="lg" 
                        radius="xl"
                      />
                      <div>
                        <Text fw={500} size="lg">{user.professionalName || user.name}</Text>
                        <Badge color={badgeColor}>{userType === 'professional' ? 'Profissional' : 'Fornecedor'}</Badge>
                      </div>
                    </Group>
                  </Card.Section>

                  <Text c="dimmed" size="sm" mt="md" lineClamp={3}>
                    {user.miniBio || "Sem descrição"}
                  </Text>
                  <Text c="dimmed" size="xs" mt="xs">
                    {user.professionalLocation || "Localização não informada"}
                  </Text>

                  <Group mt="md" gap="xs" wrap="wrap">
                    {(user[specialtyField] || []).map((item, index) => (
                      <Badge key={`${item}-${index}`} size="sm">
                        {item}
                      </Badge>
                    ))}
                  </Group>

                  <div style={{ flex: 1 }} /> 

                  <Group mt="md" gap="xs" wrap="wrap">
                    {user.website && (
                      <Button
                        component="a"
                        href={user.website}
                        target="_blank"
                        leftSection={<IconWorld size={16} />}
                        variant="subtle"
                        size="xs"
                      >
                        Website
                      </Button>
                    )}
                    {user.instagram && (
                      <Button
                        component="a"
                        href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                        target="_blank"
                        leftSection={<IconBrandInstagram size={16} />}
                        variant="subtle"
                        size="xs"
                        color="pink"
                      >
                        Instagram
                      </Button>
                    )}
                    {user.facebook && (
                      <Button
                        component="a"
                        href={`https://facebook.com/${user.facebook}`}
                        target="_blank"
                        leftSection={<IconBrandFacebook size={16} />}
                        variant="subtle"
                        size="xs"
                        color="blue"
                      >
                        Facebook
                      </Button>
                    )}
                    {user.linkedin && (
                      <Button
                        component="a"
                        href={`https://linkedin.com/in/${user.linkedin}`}
                        target="_blank"
                        leftSection={<IconBrandLinkedin size={16} />}
                        variant="subtle"
                        size="xs"
                        color="indigo"
                      >
                        LinkedIn
                      </Button>
                    )}
                  </Group>

                  <Button 
                    variant="light" 
                    color={buttonColor}
                    fullWidth 
                    mt="md" 
                    radius="md"
                    style={{ marginTop: 12 }}
                    onClick={() => router.push(`/profile/${user.id}`)}
                  >
                    Ver perfil
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
            <Group justify="center" mt="xl">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
                size="sm"
              />
            </Group>
          </>
        ) : (
          <Text c="dimmed" ta="center">Nenhum {userType} encontrado</Text>
        )}
      </div>
    </Container>
  );
} 