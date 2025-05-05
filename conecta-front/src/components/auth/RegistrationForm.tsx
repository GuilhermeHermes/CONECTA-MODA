'use client';

import { TextInput, Button, Group, Stack, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput, DatePicker, DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import '@mantine/dates/styles.css';

interface RegistrationFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cnpj: string;
  dataNascimento: Date | null;
  genero: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  pais: string;
  estado: string;
}

interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormData) => void;
  initialValues?: Partial<RegistrationFormData>;
}

export function RegistrationForm({ onSubmit, initialValues }: RegistrationFormProps) {
  const form = useForm<RegistrationFormData>({
    initialValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      cnpj: '',
      dataNascimento: null,
      genero: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      pais: '',
      estado: '',
      ...initialValues,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      telefone: (value) => {
        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        return phoneRegex.test(value) ? null : 'Telefone deve estar no formato (00) 00000-0000';
      },
      cpf: (value) => {
        if (!value) return null;
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return cpfRegex.test(value) ? null : 'CPF deve estar no formato 000.000.000-00';
      },
      cnpj: (value) => {
        if (!value) return null;
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
    },
  });

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
  
  const [value, setValue] = useState<string | null>(null);

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

        <Group grow>
          <TextInput
            label="CPF"
            placeholder="000.000.000-00"
            {...form.getInputProps('cpf')}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              form.setFieldValue('cpf', formatted);
            }}
          />
          <TextInput
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            {...form.getInputProps('cnpj')}
            onChange={(e) => {
              const formatted = formatCNPJ(e.target.value);
              form.setFieldValue('cnpj', formatted);
            }}
          />
        </Group>

<DatePickerInput
  label="Data de Nascimento"
  placeholder="Selecione sua data de nascimento"
  {...form.getInputProps('dataNascimento')}
  required
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

        <Group justify="space-between" mt="xl">
          <Button variant="outline" onClick={() => window.history.back()} color="#0E4B82"> 
            Voltar
          </Button>
          <Button type="submit" color="#0E4B82">
            Próximo
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 