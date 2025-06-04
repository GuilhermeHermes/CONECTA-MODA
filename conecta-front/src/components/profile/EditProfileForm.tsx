'use client';

import { Stack, Button, Group, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ProfilePictureUpload } from '../auth/ProfilePictureUpload';

interface EditProfileFormProps {
  user: {
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
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export function EditProfileForm({ user, onSubmit, onCancel }: EditProfileFormProps) {
  const form = useForm({
    initialValues: {
      name: user.name,
      professionalName: user.professionalName,
      miniBio: user.miniBio,
      profilePicture: user.profilePicture,
      professionalLocation: user.professionalLocation,
      professionalPhone: user.professionalPhone,
      professionalEmail: user.professionalEmail,
      website: user.website || '',
      instagram: user.instagram || '',
      facebook: user.facebook || '',
      linkedin: user.linkedin || '',
      skills: user.skills,
      products: user.products,
      segments: user.segments,
      address: user.address
    },
    validate: {
      name: (value) => (!value ? 'Nome é obrigatório' : null),
      professionalName: (value) => (!value ? 'Nome profissional é obrigatório' : null),
      miniBio: (value) => (!value ? 'Mini bio é obrigatória' : null),
      professionalLocation: (value) => (!value ? 'Localização profissional é obrigatória' : null),
      professionalPhone: (value) => (!value ? 'Telefone profissional é obrigatório' : null),
      professionalEmail: (value) => (!value ? 'Email profissional é obrigatório' : null),
      website: (value) => (!value ? null : /^https?:\/\/.+/.test(value) ? null : 'URL inválida'),
      instagram: (value) => (!value ? null : /^@?[a-zA-Z0-9._]{1,30}$/.test(value) ? null : 'Nome de usuário do Instagram inválido'),
      facebook: (value) => (!value ? null : /^[a-zA-Z0-9.]{5,50}$/.test(value) ? null : 'Nome de usuário do Facebook inválido'),
      linkedin: (value) => (!value ? null : /^[a-zA-Z0-9-]{5,100}$/.test(value) ? null : 'Nome de usuário do LinkedIn inválido'),
    },
  });

  console.log(form.values, 'fom da silva')

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      id: user.id,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <ProfilePictureUpload 
          onUploadComplete={(url) => form.setFieldValue('profilePicture', url)}
        />

        <TextInput
          label="Nome Completo"
          placeholder="Seu nome completo"
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Nome Profissional"
          placeholder="Seu nome profissional"
          {...form.getInputProps('professionalName')}
        />

        <Textarea
          label="Mini Bio"
          placeholder="Uma breve descrição sobre você"
          {...form.getInputProps('miniBio')}
        />

        <TextInput
          label="Localização Profissional"
          placeholder="Sua localização profissional"
          {...form.getInputProps('professionalLocation')}
        />

        <TextInput
          label="Telefone Profissional"
          placeholder="Seu telefone profissional"
          {...form.getInputProps('professionalPhone')}
        />

        <TextInput
          label="Email Profissional"
          placeholder="Seu email profissional"
          {...form.getInputProps('professionalEmail')}
        />

        <TextInput
          label="Website"
          placeholder="https://seu-site.com"
          {...form.getInputProps('website')}
        />

        <TextInput
          label="Instagram"
          placeholder="@seu_usuario"
          {...form.getInputProps('instagram')}
        />

        <TextInput
          label="Facebook"
          placeholder="seu.usuario"
          {...form.getInputProps('facebook')}
        />

        <TextInput
          label="LinkedIn"
          placeholder="seu-usuario"
          {...form.getInputProps('linkedin')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 