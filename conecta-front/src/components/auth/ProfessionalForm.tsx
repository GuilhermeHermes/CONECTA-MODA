'use client';

import { Stack, Button, Group, TextInput, Textarea, MultiSelect, Switch, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';
import { ProfilePictureUpload } from './ProfilePictureUpload';

const SEGMENTOS_DATA = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'praia', label: 'Moda Praia' },
  { value: 'plus-size', label: 'Plus Size' },
  { value: 'outros', label: 'Outros' },
];

const HABILIDADES_DATA = [
  { value: 'modelagem', label: 'Modelagem' },
  { value: 'costura', label: 'Costura' },
  { value: 'design', label: 'Design' },
  { value: 'estilismo', label: 'Estilismo' },
  { value: 'outros', label: 'Outros' },
];

const PRODUTOS_DATA = [
  { value: 'tecidos', label: 'Tecidos' },
  { value: 'aviamentos', label: 'Aviamentos' },
  { value: 'estamparia', label: 'Estamparia' },
  { value: 'embalagens', label: 'Embalagens' },
  { value: 'etiquetas', label: 'Etiquetas' },
  { value: 'outros', label: 'Outros' },
];

interface ProfessionalFormProps {
  onSubmit: (values: any) => void;
  initialValues?: {
    professionalName: string;
    professionalEmail: string;
    professionalPhone: string;
    miniBio: string;
    professionalLocation: string;
    socialLinks?: {
      website?: string;
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
    skills: string[];
    products: string[];
    segments: string[];
    profilePicture: string | null;
    hasPhysicalStore: boolean;
    hasEcommerce: boolean;
  };
}

interface FormValues {
  professionalName: string;
  professionalEmail: string;
  professionalPhone: string;
  miniBio: string;
  professionalLocation: string;
  socialLinks: {
    website: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  skills: string[];
  products: string[];
  segments: string[];
  profilePicture: string | null;
  hasPhysicalStore: boolean;
  hasEcommerce: boolean;
}

export function ProfessionalForm({ onSubmit, initialValues }: ProfessionalFormProps) {
  const { user } = useUser();
  const [showEcommerce, setShowEcommerce] = useState(initialValues?.hasEcommerce || false);
  const [showLoja, setShowLoja] = useState(initialValues?.hasPhysicalStore || false);
  
  const role = user?.roles?.[0]?.toLowerCase() || '';
  
  let professionalNameLabel = 'Nome Profissional';
  let professionalNamePlaceholder = 'Digite seu nome profissional';
  let miniBioPlaceholder = 'Descreva suas principais características profissionais';
  
  const form = useForm<FormValues>({
    initialValues: {
      professionalName: initialValues?.professionalName || '',
      professionalEmail: initialValues?.professionalEmail || '',
      professionalPhone: initialValues?.professionalPhone || '',
      miniBio: initialValues?.miniBio || '',
      professionalLocation: initialValues?.professionalLocation || '',
      socialLinks: {
        website: initialValues?.socialLinks?.website || '',
        instagram: initialValues?.socialLinks?.instagram || '',
        facebook: initialValues?.socialLinks?.facebook || '',
        linkedin: initialValues?.socialLinks?.linkedin || '',
      },
      skills: initialValues?.skills || [],
      products: initialValues?.products || [],
      segments: initialValues?.segments || [],
      profilePicture: initialValues?.profilePicture || null,
      hasPhysicalStore: initialValues?.hasPhysicalStore || false,
      hasEcommerce: initialValues?.hasEcommerce || false,
    },
    validate: {
      professionalName: (value: string) => (!value ? 'Nome profissional é obrigatório' : null),
      professionalEmail: (value: string) => (!value ? 'Email profissional é obrigatório' : null),
      professionalPhone: (value: string) => (!value ? 'Telefone profissional é obrigatório' : null),
      miniBio: (value: string) => (!value ? 'Mini bio é obrigatória' : null),
      socialLinks: {
        website: (value: string) => (!value ? null : /^https?:\/\/.+/.test(value) ? null : 'URL inválida'),
        instagram: (value: string) => (!value ? null : /^@?[a-zA-Z0-9._]{1,30}$/.test(value) ? null : 'Nome de usuário do Instagram inválido'),
        facebook: (value: string) => (!value ? null : /^[a-zA-Z0-9.]{5,50}$/.test(value) ? null : 'Nome de usuário do Facebook inválido'),
        linkedin: (value: string) => (!value ? null : /^[a-zA-Z0-9-]{5,100}$/.test(value) ? null : 'Nome de usuário do LinkedIn inválido'),
      },
    },
  });

  // Ajustar labels e placeholders baseado no tipo de usuário
  if (role === 'SUPPLIER') {
    professionalNameLabel = 'Nome da Empresa';
    professionalNamePlaceholder = 'Nome da empresa que representa';
    miniBioPlaceholder = 'Descreva os produtos que oferece: tecidos, aviamentos, estamparia, embalagens, etiquetas, etc.';
  } else if (role === 'PROFESSIONAL') {
    professionalNameLabel = 'Nome Profissional';
    professionalNamePlaceholder = 'Seu nome profissional ou do ateliê';
    miniBioPlaceholder = 'Descreva suas principais habilidades e especialidades';
  } else {
    professionalNameLabel = 'Nome da Marca';
    professionalNamePlaceholder = 'Nome da sua marca de moda';
    miniBioPlaceholder = 'Descreva os segmentos que sua marca atua: feminino, masculino, moda praia, infantil, plus size, etc.';
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };


  const handleSubmit = (values: FormValues) => {
    const { socialLinks, ...rest } = values;
    
    onSubmit({
      ...rest,
      hasPhysicalStore: showLoja,
      hasEcommerce: showEcommerce,
      website: socialLinks.website || null,
      instagram: socialLinks.instagram || null,
      facebook: socialLinks.facebook || null,
      linkedin: socialLinks.linkedin || null,
    });
  };

  // Função para renderizar o componente específico de dados por perfil
  const renderDataComponent = () => {
    if (role === 'SUPPLIER') {
      return (
        <MultiSelect
          label="Produtos"
          placeholder="Selecione os produtos que oferece"
          data={PRODUTOS_DATA}
          {...form.getInputProps('products')}
        />
      );
    } else if (role === 'PROFESSIONAL') {
      return (
        <MultiSelect
          label="Habilidades"
          placeholder="Selecione suas habilidades"
          data={HABILIDADES_DATA}
          {...form.getInputProps('skills')}
        />
      );
    } else {
      return (
        <MultiSelect
          label="Segmentos"
          placeholder="Selecione os segmentos que sua marca atua"
          data={SEGMENTOS_DATA}
          {...form.getInputProps('segments')}
        />
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Title order={4}>Dados Profissionais</Title>
        <Text c="dimmed" size="sm">Preencha os dados do seu perfil profissional</Text>
        
        <ProfilePictureUpload 
          onUploadComplete={(url) => form.setFieldValue('profilePicture', url)}
        />

        <TextInput
          label={professionalNameLabel}
          placeholder={professionalNamePlaceholder}
          {...form.getInputProps('professionalName')}
          required
        />

        <TextInput
          label="Email Profissional"
          placeholder="Seu email profissional"
          {...form.getInputProps('professionalEmail')}
          required
        />

        <TextInput
          label="Telefone Profissional"
          placeholder="Seu telefone profissional"
          {...form.getInputProps('professionalPhone')}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            form.setFieldValue('professionalPhone', formatted);
          }}
          required
        />

        <TextInput
          label="Localização Profissional"
          placeholder="Sua localização profissional"
          {...form.getInputProps('professionalLocation')}
        />
        
        <Textarea
          label="Mini Bio"
          placeholder={miniBioPlaceholder}
          {...form.getInputProps('miniBio')}
          required
        />
        
        {renderDataComponent()}
        
        <Title order={5} mt="sm">Redes Sociais</Title>

        <TextInput
          label="Website"
          placeholder="https://seu-site.com"
          {...form.getInputProps('socialLinks.website', { type: 'input' })}
        />

        <TextInput
          label="Instagram"
          placeholder="@seu_usuario"
          {...form.getInputProps('socialLinks.instagram', { type: 'input' })}
        />

        <TextInput
          label="Facebook"
          placeholder="seu.usuario"
          {...form.getInputProps('socialLinks.facebook', { type: 'input' })}
        />

        <TextInput
          label="LinkedIn"
          placeholder="seu-usuario"
          {...form.getInputProps('socialLinks.linkedin', { type: 'input' })}
        />

        <Switch
          label="Possui loja física"
          checked={showLoja}
          onChange={(event) => {
            setShowLoja(event.currentTarget.checked);
            form.setFieldValue('hasPhysicalStore', event.currentTarget.checked);
          }}
        />

        <Switch
          label="Possui e-commerce"
          checked={showEcommerce}
          onChange={(event) => {
            setShowEcommerce(event.currentTarget.checked);
            form.setFieldValue('hasEcommerce', event.currentTarget.checked);
          }}
        />

        <Group justify="space-between" mt="xl">
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
          <Button type="submit" color="blue">
            Salvar Alterações
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 