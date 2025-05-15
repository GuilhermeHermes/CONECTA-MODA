'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Loader, Paper, Group, Avatar, Badge, Divider, List, ThemeIcon, SimpleGrid } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { IconMapPin, IconPhone, IconAt, IconWorld, IconBrandInstagram, IconBrandFacebook, IconBrandLinkedin, IconListCheck } from '@tabler/icons-react';
import { config } from '@/config';

interface UserProfile {
  id: string;
  name: string;
  email: string;
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
  address?: {
    neighborhood: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    city: string;
    state: string;
    country: string;
  };
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }>}) {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${config.api.baseURL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchProfile();
    }
  }, [isLoading, isAuthenticated, token, id, router]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Container size="md" py="xl">
        <Paper p="lg" withBorder>
          <Text ta="center">Perfil não encontrado</Text>
        </Paper>
      </Container>
    );
  }

  const isProfessional = profile.roles?.includes('PROFESSIONAL');
  const isSupplier = profile.roles?.includes('SUPPLIER');
  const isBrand = profile.roles?.includes('BRAND');

  // Obtendo o tipo de perfil
  const getProfileType = () => {
    if (isProfessional) return { label: 'Profissional', color: 'blue' };
    if (isSupplier) return { label: 'Fornecedor', color: 'grape' };
    if (isBrand) return { label: 'Marca/Empresa', color: 'teal' };
    return { label: 'Usuário', color: 'gray' };
  };

  const profileType = getProfileType();

  // Renderizar lista de habilidades, produtos ou segmentos
  const renderSpecialties = () => {
    let items: string[] = [];
    let title = '';

    if (isProfessional && profile.skills?.length) {
      items = profile.skills;
      title = 'Habilidades';
    } else if (isSupplier && profile.products?.length) {
      items = profile.products;
      title = 'Produtos';
    } else if (isBrand && profile.segments?.length) {
      items = profile.segments;
      title = 'Segmentos';
    }

    if (!items.length) return null;

    return (
      <>
        <Divider my="md" />
        <Title order={4} mb="xs">{title}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {items.map(item => (
            <Group key={item} gap="xs">
              <ThemeIcon size="sm" variant="light" color={profileType.color}>
                <IconListCheck size={16} />
              </ThemeIcon>
              <Text size="sm">{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
            </Group>
          ))}
        </SimpleGrid>
      </>
    );
  };

  return (
    <Container size="md" py="xl">
      <Paper p="lg" radius="md" shadow="sm" withBorder>
        <Group mb="md" style={{ alignItems: 'flex-start' }}>
          <Avatar src={profile.profilePicture} size={120} radius="md" />
          <div style={{ flex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={3}>{profile.professionalName || profile.name}</Title>
                <Badge color={profileType.color} my="xs">{profileType.label}</Badge>
              </div>
              <Button variant="outline" color={profileType.color} onClick={() => router.push('/dashboard')}>
                Voltar
              </Button>
            </Group>
            <Text size="sm">{profile.miniBio}</Text>
          </div>
        </Group>

        <Divider my="md" />

        <Title order={4} mb="xs">Contato</Title>
        <List spacing="xs">
          {profile.professionalLocation && (
            <List.Item icon={<IconMapPin size={16} color="gray" />}>
              <Text size="sm">{profile.professionalLocation}</Text>
            </List.Item>
          )}
          {profile.professionalPhone && (
            <List.Item icon={<IconPhone size={16} color="gray" />}>
              <Text size="sm">{profile.professionalPhone}</Text>
            </List.Item>
          )}
          {profile.professionalEmail && (
            <List.Item icon={<IconAt size={16} color="gray" />}>
              <Text size="sm">{profile.professionalEmail}</Text>
            </List.Item>
          )}
        </List>

        {(profile.website || profile.instagram || profile.facebook || profile.linkedin) && (
          <>
            <Divider my="md" />
            <Title order={4} mb="xs">Redes Sociais</Title>
            <Group gap="md">
              {profile.website && (
                <Button 
                  component="a" 
                  href={profile.website} 
                  target="_blank" 
                  leftSection={<IconWorld size={16} />}
                  variant="subtle"
                  size="xs"
                >
                  Website
                </Button>
              )}
              {profile.instagram && (
                <Button 
                  component="a" 
                  href={`https://instagram.com/${profile.instagram.replace('@', '')}`} 
                  target="_blank" 
                  leftSection={<IconBrandInstagram size={16} />}
                  variant="subtle"
                  size="xs"
                  color="pink"
                >
                  Instagram
                </Button>
              )}
              {profile.facebook && (
                <Button 
                  component="a" 
                  href={`https://facebook.com/${profile.facebook}`} 
                  target="_blank" 
                  leftSection={<IconBrandFacebook size={16} />}
                  variant="subtle"
                  size="xs"
                  color="blue"
                >
                  Facebook
                </Button>
              )}
              {profile.linkedin && (
                <Button 
                  component="a" 
                  href={`https://linkedin.com/in/${profile.linkedin}`} 
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
          </>
        )}

        {renderSpecialties()}
      </Paper>
    </Container>
  );
} 