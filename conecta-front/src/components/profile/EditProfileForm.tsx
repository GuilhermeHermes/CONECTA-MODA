'use client';

import { useState } from 'react';
import { Stack, Title, Text, Button, Group, Tabs, Loader, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { RegistrationForm } from '../auth/RegistrationForm';
import { ProfessionalForm } from '../auth/ProfessionalForm';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

interface RegistrationFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cnpj: string;
  documentType: 'cpf' | 'cnpj';
  dataNascimento: Date | null;
  genero: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  pais: string;
  estado: string;
  password: string;
  confirmPassword: string;
  role?: 'profissional' | 'marca' | 'fornecedor';
}

interface ProfessionalFormData {
  professionalName: string;
  emailProfissional: string;
  telefoneProfissional: string;
  miniBio: string;
  localizacaoProfissional: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  segmentos: string[];
  habilidades: string[];
  produtos: string[];
  possuiLojaTisica: boolean;
  possuiEcommerce: boolean;
  profileImage?: File | null;
  profileImageUrl?: string | null;
}

export function EditProfileForm() {
  const { user, loading, error, updateUser } = useUser();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>('personal');
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) {
    return (
      <Alert color="red" title="Acesso Negado">
        Você precisa estar logado para acessar esta página.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando informações do usuário...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Erro">
        {error}
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert color="yellow" title="Aviso">
        Nenhuma informação do usuário encontrada.
      </Alert>
    );
  }

  const handlePersonalInfoSubmit = async (values: Partial<RegistrationFormData>) => {
    try {
      setSaving(true);
      await updateUser({
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        genero: values.genero,
        dataNascimento: values.dataNascimento,
      });

      notifications.show({
        title: 'Sucesso',
        message: 'Informações pessoais atualizadas com sucesso!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao atualizar informações pessoais. Tente novamente.',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfessionalInfoSubmit = async (values: Partial<ProfessionalFormData>) => {
    try {
      setSaving(true);
      await updateUser({
        professionalName: values.professionalName,
        emailProfissional: values.emailProfissional,
        telefoneProfissional: values.telefoneProfissional,
        miniBio: values.miniBio,
        localizacaoProfissional: values.localizacaoProfissional,
        website: values.website,
        instagram: values.instagram,
        facebook: values.facebook,
        linkedin: values.linkedin,
        segmentos: values.segmentos,
        habilidades: values.habilidades,
        produtos: values.produtos,
        possuiLojaTisica: values.possuiLojaTisica,
        possuiEcommerce: values.possuiEcommerce,
      });

      notifications.show({
        title: 'Sucesso',
        message: 'Informações profissionais atualizadas com sucesso!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao atualizar informações profissionais. Tente novamente.',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack>
      <Title order={2}>Editar Perfil</Title>
      <Text c="dimmed">Atualize suas informações pessoais e profissionais</Text>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="personal">Informações Pessoais</Tabs.Tab>
          <Tabs.Tab value="professional">Informações Profissionais</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal" pt="xl">
          <RegistrationForm
            onSubmit={handlePersonalInfoSubmit}
            initialValues={{
              nome: user.nome,
              email: user.email,
              telefone: user.telefone,
              genero: user.genero,
              dataNascimento: user.dataNascimento ? new Date(user.dataNascimento) : null,
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="professional" pt="xl">
          <ProfessionalForm
            onSubmit={handleProfessionalInfoSubmit}
            initialValues={{
              professionalName: user.professionalName,
              emailProfissional: user.emailProfissional,
              telefoneProfissional: user.telefoneProfissional,
              miniBio: user.miniBio,
              localizacaoProfissional: user.localizacaoProfissional,
              website: user.website,
              instagram: user.instagram,
              facebook: user.facebook,
              linkedin: user.linkedin,
              segmentos: user.segmentos,
              habilidades: user.habilidades,
              produtos: user.produtos,
              possuiLojaTisica: user.possuiLojaTisica,
              possuiEcommerce: user.possuiEcommerce,
              profileImageUrl: user.profileImageUrl,
            }}
          />
        </Tabs.Panel>
      </Tabs>

      {saving && (
        <Group justify="center" mt="md">
          <Loader size="sm" />
          <Text size="sm">Salvando alterações...</Text>
        </Group>
      )}
    </Stack>
  );
} 