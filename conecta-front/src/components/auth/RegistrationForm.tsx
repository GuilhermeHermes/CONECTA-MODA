'use client';

import { useState, useEffect } from 'react';
import { TextInput, Button, Group, Stack, Select, NumberInput, PasswordInput, Radio, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useRegistration } from '@/contexts/RegistrationContext';

import '@mantine/dates/styles.css';

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

interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormData) => void;
  initialValues?: Partial<RegistrationFormData>;
}

export function RegistrationForm({ onSubmit, initialValues }: RegistrationFormProps) {
  const { registrationData } = useRegistration();
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>(
    (initialValues?.cpf && !initialValues?.cnpj) ? 'cpf' : 
    (initialValues?.cnpj && !initialValues?.cpf) ? 'cnpj' : 'cpf'
  );

  const form = useForm<RegistrationFormData>({
    initialValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      cnpj: '',
      documentType: 'cpf',
      dataNascimento: null,
      genero: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      pais: '',
      estado: '',
      password: '',
      confirmPassword: '',
      ...initialValues,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      telefone: (value) => {
        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        return phoneRegex.test(value) ? null : 'Telefone deve estar no formato (00) 00000-0000';
      },
      cpf: (value, values) => {
        if (values.documentType === 'cnpj') return null;
        if (!value) return 'CPF é obrigatório quando selecionado';
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return cpfRegex.test(value) ? null : 'CPF deve estar no formato 000.000.000-00';
      },
      cnpj: (value, values) => {
        if (values.documentType === 'cpf') return null;
        if (!value) return 'CNPJ é obrigatório quando selecionado';
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        return cnpjRegex.test(value) ? null : 'CNPJ deve estar no formato 00.000.000/0000-00';
      },
      nome: (value) => (value.length < 3 ? 'Nome deve ter pelo menos 3 caracteres' : null),
      endereco: (value) => (value.length < 5 ? 'Endereço deve ter pelo menos 5 caracteres' : null),
      numero: (value) => (!value ? 'Número é obrigatório' : null),
      bairro: (value) => (value.length < 3 ? 'Bairro deve ter pelo menos 3 caracteres' : null),
      cidade: (value) => (value.length < 3 ? 'Cidade deve ter pelo menos 3 caracteres' : null),
      pais: (value) => (!value ? 'País é obrigatório' : null),
      estado: (value) => (!value ? 'Estado é obrigatório' : null),
      password: (value) => (value.length < 6 ? 'A senha deve ter pelo menos 6 caracteres' : null),
      confirmPassword: (value, values) => 
        value !== values.password ? 'As senhas não coincidem' : null,
    },
  });

  useEffect(() => {
    form.setFieldValue('documentType', documentType);
    if (documentType === 'cpf') {
      form.setFieldValue('cnpj', '');
    } else {
      form.setFieldValue('cpf', '');
    }
  }, [documentType]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const handleSubmit = (values: RegistrationFormData) => {
    try {
      onSubmit(values);
    } catch (error) {
      notifications.show({
        title: 'Erro ao enviar formulário',
        message: 'Ocorreu um erro ao processar o formulário. Tente novamente.',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Nome"
          placeholder="Seu nome completo"
          {...form.getInputProps('nome')}
          required
        />

        <TextInput
          label="Email"
          placeholder="seu@email.com"
          {...form.getInputProps('email')}
          required
        />

        <Group grow>
          <PasswordInput
            label="Senha"
            placeholder="Sua senha"
            {...form.getInputProps('password')}
            required
          />
          <PasswordInput
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            {...form.getInputProps('confirmPassword')}
            required
          />
        </Group>

        <TextInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          {...form.getInputProps('telefone')}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            form.setFieldValue('telefone', formatted);
          }}
          required
        />

        <DateInput
          label="Data de nascimento"
          placeholder="Selecione a data"
          {...form.getInputProps('dataNascimento')}
          maxDate={new Date()}
        />

        <Select
          label="Gênero"
          placeholder="Selecione"
          data={[
            { value: 'masculino', label: 'Masculino' },
            { value: 'feminino', label: 'Feminino' },
            { value: 'outro', label: 'Outro' },
            { value: 'prefiro-nao-informar', label: 'Prefiro não informar' },
          ]}
          {...form.getInputProps('genero')}
        />

        <Title order={5} mt="lg">Documento</Title>
        <Radio.Group
          label="Tipo de documento"
          description="Escolha apenas um tipo de documento"
          value={documentType}
          onChange={(value) => setDocumentType(value as 'cpf' | 'cnpj')}
          name="documentType"
          withAsterisk
        >
          <Group mt="xs">
            <Radio value="cpf" label="CPF (Pessoa Física)" />
            <Radio value="cnpj" label="CNPJ (Pessoa Jurídica)" />
          </Group>
        </Radio.Group>

        {documentType === 'cpf' ? (
          <TextInput
            label="CPF"
            placeholder="000.000.000-00"
            {...form.getInputProps('cpf')}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              form.setFieldValue('cpf', formatted);
            }}
            required
          />
        ) : (
          <TextInput
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            {...form.getInputProps('cnpj')}
            onChange={(e) => {
              const formatted = formatCNPJ(e.target.value);
              form.setFieldValue('cnpj', formatted);
            }}
            required
          />
        )}

        <Title order={5} mt="lg">Endereço</Title>
        <Group grow>
          <TextInput
            label="Endereço"
            placeholder="Rua, Avenida, etc"
            {...form.getInputProps('endereco')}
            required
          />
          <NumberInput
            label="Número"
            placeholder="Nº"
            {...form.getInputProps('numero')}
            required
          />
        </Group>

        <Group grow>
          <TextInput
            label="Bairro"
            placeholder="Seu bairro"
            {...form.getInputProps('bairro')}
            required
          />
          <TextInput
            label="Cidade"
            placeholder="Sua cidade"
            {...form.getInputProps('cidade')}
            required
          />
        </Group>

        <Group grow>
          <Select
            label="País"
            placeholder="Selecione"
            data={[
              { value: 'brasil', label: 'Brasil' },
              { value: 'portugal', label: 'Portugal' },
              { value: 'outro', label: 'Outro' },
            ]}
            {...form.getInputProps('pais')}
            required
          />
          <Select
            label="Estado"
            placeholder="Selecione"
            data={[
              { value: 'ac', label: 'Acre' },
              { value: 'al', label: 'Alagoas' },
              { value: 'ap', label: 'Amapá' },
              { value: 'am', label: 'Amazonas' },
              { value: 'ba', label: 'Bahia' },
              { value: 'ce', label: 'Ceará' },
              { value: 'df', label: 'Distrito Federal' },
              { value: 'es', label: 'Espírito Santo' },
              { value: 'go', label: 'Goiás' },
              { value: 'ma', label: 'Maranhão' },
              { value: 'mt', label: 'Mato Grosso' },
              { value: 'ms', label: 'Mato Grosso do Sul' },
              { value: 'mg', label: 'Minas Gerais' },
              { value: 'pa', label: 'Pará' },
              { value: 'pb', label: 'Paraíba' },
              { value: 'pr', label: 'Paraná' },
              { value: 'pe', label: 'Pernambuco' },
              { value: 'sp', label: 'São Paulo' },
              { value: 'rj', label: 'Rio de Janeiro' },
              { value: 'rn', label: 'Rio Grande do Norte' },
              { value: 'rs', label: 'Rio Grande do Sul' },
              { value: 'se', label: 'Sergipe' },
              { value: 'to', label: 'Tocantins' },
            ]}
            {...form.getInputProps('estado')}
            required
          />
        </Group>

        <Group justify="flex-end" mt="xl">
          <Button type="submit">
            Próximo
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 