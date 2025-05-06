'use client';

import { TextInput, Button, Group, Stack, Textarea, MultiSelect, Switch, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { useRegistration } from '@/contexts/RegistrationContext';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';

interface SocialLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  [key: string]: string | undefined;
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

interface ProfessionalFormProps {
  onSubmit: (values: ProfessionalFormData) => void;
  initialValues?: Partial<ProfessionalFormData>;
}

const SEGMENTOS_DATA = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'plus-size', label: 'Plus Size' },
  { value: 'moda-praia', label: 'Moda Praia' },
  { value: 'fitness', label: 'Fitness/Esportivo' },
  { value: 'jeans', label: 'Jeanswear' },
  { value: 'underwear', label: 'Underwear/Lingerie' },
  { value: 'pet', label: 'Pet' },
  { value: 'outros', label: 'Outros' }
];

const HABILIDADES_DATA = [
  { value: 'costura', label: 'Costura' },
  { value: 'modelagem', label: 'Modelagem' },
  { value: 'pilotagem', label: 'Pilotagem' },
  { value: 'estilismo', label: 'Estilismo' },
  { value: 'desenho', label: 'Desenho de Moda' },
  { value: 'estamparia', label: 'Estamparia' },
  { value: 'bordado', label: 'Bordado' },
  { value: 'crochet', label: 'Crochê' },
  { value: 'tricot', label: 'Tricô' },
  { value: 'gestao', label: 'Gestão de Produção' },
  { value: 'corte', label: 'Corte e Enfesto' },
  { value: 'acabamento', label: 'Acabamento' },
  { value: 'outros', label: 'Outros' }
];

const PRODUTOS_DATA = [
  { value: 'tecidos', label: 'Tecidos' },
  { value: 'aviamentos', label: 'Aviamentos' },
  { value: 'estamparia', label: 'Serviços de Estamparia' },
  { value: 'bordado', label: 'Serviços de Bordado' },
  { value: 'embalagens', label: 'Embalagens' },
  { value: 'etiquetas', label: 'Etiquetas' },
  { value: 'maquinas', label: 'Máquinas e Equipamentos' },
  { value: 'manequins', label: 'Manequins' },
  { value: 'acabamento', label: 'Materiais de Acabamento' },
  { value: 'outros', label: 'Outros' }
];

export function ProfessionalForm({ onSubmit, initialValues }: ProfessionalFormProps) {
  const { registrationData } = useRegistration();
  const [showEcommerce, setShowEcommerce] = useState(initialValues?.possuiEcommerce || false);
  const [showLoja, setShowLoja] = useState(initialValues?.possuiLojaTisica || false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(initialValues?.profileImageUrl || null);
  
  const role = registrationData.role || '';
  
  let professionalNameLabel = 'Nome Profissional';
  let professionalNamePlaceholder = 'Digite seu nome profissional';
  let miniBioPlaceholder = 'Descreva suas principais características profissionais';
  
  const form = useForm<ProfessionalFormData>({
    initialValues: {
      professionalName: '',
      emailProfissional: '',
      telefoneProfissional: '',
      miniBio: '',
      localizacaoProfissional: '',
      website: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      segmentos: [],
      habilidades: [],
      produtos: [],
      possuiLojaTisica: false,
      possuiEcommerce: false,
      profileImage,
      profileImageUrl,
      ...initialValues,
    },
    validate: {
      professionalName: (value) => (value.length < 3 ? 'Nome profissional deve ter pelo menos 3 caracteres' : null),
      emailProfissional: (value) => (!value ? null : /^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      miniBio: (value) => (value.length < 10 ? 'Descrição muito curta. Mínimo de 10 caracteres.' : null),
      website: (value) => (!value ? null : /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(value) ? null : 'URL inválida'),
      instagram: (value) => (!value ? null : /^@?[a-zA-Z0-9._]{1,30}$/.test(value) ? null : 'Nome de usuário do Instagram inválido'),
      facebook: (value) => (!value ? null : /^[a-zA-Z0-9.]{5,50}$/.test(value) ? null : 'Nome de usuário do Facebook inválido'),
      linkedin: (value) => (!value ? null : /^[a-zA-Z0-9-]{5,100}$/.test(value) ? null : 'Nome de usuário do LinkedIn inválido'),
    },
  });
  
  useEffect(() => {
    setShowEcommerce(form.values.possuiEcommerce);
    setShowLoja(form.values.possuiLojaTisica);
  }, [form.values.possuiEcommerce, form.values.possuiLojaTisica]);

  // Ajustar labels e placeholders baseado no tipo de usuário
  if (role === 'fornecedor') {
    professionalNameLabel = 'Nome da Empresa';
    professionalNamePlaceholder = 'Nome da empresa que representa';
    miniBioPlaceholder = 'Descreva os produtos que oferece: tecidos, aviamentos, estamparia, embalagens, etiquetas, etc.';
  } else if (role === 'profissional') {
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

  const handleImageChange = (file: File | null, imageUrl: string | null) => {
    setProfileImage(file);
    setProfileImageUrl(imageUrl);
  };

  const handleSubmit = (values: ProfessionalFormData) => {
    const socialLinks: SocialLinks = {};
    
    if (values.website) socialLinks.website = values.website;
    if (values.instagram) socialLinks.instagram = values.instagram;
    if (values.facebook) socialLinks.facebook = values.facebook;
    if (values.linkedin) socialLinks.linkedin = values.linkedin;
    
    const formattedValues = {
      ...values,
      socialLinks,
      profileImage,
      profileImageUrl
    };
    
    try {
      onSubmit(formattedValues as ProfessionalFormData);
    } catch (error) {
      notifications.show({
        title: 'Erro ao enviar formulário',
        message: 'Ocorreu um erro ao processar o formulário. Tente novamente.',
        color: 'red',
      });
    }
  };

  // Função para renderizar o componente específico de dados por perfil
  const renderDataComponent = () => {
    if (role === 'fornecedor') {
      return (
        <MultiSelect
          label="Produtos Oferecidos"
          placeholder="Selecione os produtos que você oferece"
          data={PRODUTOS_DATA}
          searchable
          clearable
          {...form.getInputProps('produtos')}
        />
      );
    } else if (role === 'profissional') {
      return (
        <MultiSelect
          label="Habilidades"
          placeholder="Selecione suas principais habilidades"
          data={HABILIDADES_DATA}
          searchable
          clearable
          {...form.getInputProps('habilidades')}
        />
      );
    } else {
      return (
        <MultiSelect
          label="Segmentos"
          placeholder="Selecione os segmentos que sua marca atua"
          data={SEGMENTOS_DATA}
          searchable
          clearable
          {...form.getInputProps('segmentos')}
        />
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Title order={4}>Dados Profissionais</Title>
        <Text c="dimmed" size="sm">Preencha os dados do seu perfil profissional</Text>
        
        <ProfileImageUpload 
          initialImage={profileImageUrl || undefined}
          onChange={handleImageChange}
        />
        
        <TextInput
          label={professionalNameLabel}
          placeholder={professionalNamePlaceholder}
          {...form.getInputProps('professionalName')}
          required
        />

        <TextInput
          label="Email Profissional"
          placeholder="email@profissional.com"
          {...form.getInputProps('emailProfissional')}
        />

        <TextInput
          label="Telefone Profissional/Comercial"
          placeholder="(00) 00000-0000"
          {...form.getInputProps('telefoneProfissional')}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            form.setFieldValue('telefoneProfissional', formatted);
          }}
        />
        
        <TextInput
          label="Localização Profissional"
          placeholder="Bairro, Cidade - Estado"
          {...form.getInputProps('localizacaoProfissional')}
        />
        
        <Textarea
          label="Mini Bio / Descrição"
          placeholder={miniBioPlaceholder}
          minRows={4}
          {...form.getInputProps('miniBio')}
          required
        />
        
        {renderDataComponent()}
        
        <Title order={5} mt="sm">Redes Sociais</Title>
        
        <TextInput
          label="Website"
          placeholder="https://www.seusite.com.br"
          {...form.getInputProps('website')}
        />
        
        <TextInput
          label="Instagram"
          placeholder="@seuusuario"
          {...form.getInputProps('instagram')}
        />
        
        <TextInput
          label="Facebook"
          placeholder="seuusuario"
          {...form.getInputProps('facebook')}
        />
        
        <TextInput
          label="LinkedIn"
          placeholder="seu-usuario"
          {...form.getInputProps('linkedin')}
        />
        
        {role === 'marca' && (
          <>
            <Switch
              label="Possui loja física"
              checked={showLoja}
              onChange={(event) => {
                setShowLoja(event.currentTarget.checked);
                form.setFieldValue('possuiLojaTisica', event.currentTarget.checked);
              }}
            />
            
            <Switch
              label="Possui e-commerce"
              checked={showEcommerce}
              onChange={(event) => {
                setShowEcommerce(event.currentTarget.checked);
                form.setFieldValue('possuiEcommerce', event.currentTarget.checked);
              }}
            />
          </>
        )}

        <Group justify="space-between" mt="xl">
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
          <Button type="submit" color="blue">
            Finalizar Cadastro
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 