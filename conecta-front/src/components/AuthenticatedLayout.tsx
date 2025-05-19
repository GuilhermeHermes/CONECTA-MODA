'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Text,
  rem,
  useMantineTheme,
  Avatar,
  Menu,
  Transition,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconLogout, IconUser, IconUsers, IconTruck } from '@tabler/icons-react';
import Link from 'next/link';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const navButtonStyle = {
    display: 'block',
    width: '100%',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const NavButton = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <UnstyledButton style={navButtonStyle}>
        <Group>
          <Icon style={{ width: rem(16), height: rem(16) }} />
          <Box style={{ overflow: 'hidden', width: isHovered ? 'auto' : 0 }}>
            <Text size="sm" style={{ whiteSpace: 'nowrap' }}>
              {label}
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Link>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: isHovered ? 300 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      transitionDuration={300}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="xl" fw={700}>Conecta Moda</Text>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">
                    {user?.nome?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <Text size="sm" fw={500}>
                    {user?.nome || 'Usuário'}
                  </Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => router.push('/profile/edit')}
              >
                Meu Perfil
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                onClick={logout}
              >
                Sair
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar 
        p="md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ backgroundColor: '#0E4B82' }}
      >
        <NavButton href="/dashboard" icon={IconDashboard} label="Dashboard" />
        <NavButton href="/professionals" icon={IconUsers} label="Profissionais" />
        <NavButton href="/suppliers" icon={IconTruck} label="Fornecedores" />
        <NavButton href="/profile/edit" icon={IconUser} label="Meu perfil" />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 