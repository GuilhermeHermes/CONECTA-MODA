'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { TextInput, Button, Group, Stack, Select, PasswordInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useRegistration } from '@/contexts/RegistrationContext';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { AddressForm } from '../address/AddressForm';

import '@mantine/dates/styles.css';

dayjs.locale('pt-br');

export interface PersonalFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  documentType: 'cpf' | 'cnpj';
  documentNumber: string;
  birthDate: Date | null;
  phone: string;
  gender: string;
  address: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface RegistrationFormProps {
  onSubmit: (values: PersonalFormData) => Promise<void>;
  initialValues: PersonalFormData;
  loading?: boolean; // Adicionando a propriedade como opcional
}

export function RegistrationForm({ onSubmit, initialValues }: RegistrationFormProps) {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [loading, setLoading] = useState(false);

  const form = useForm<PersonalFormData>({
    initialValues: {
      ...initialValues,
    },
    validate: {
      name: (value) => (!value ? 'Nome é obrigatório' : null),
      email: (value) => {
        if (!value) return 'Email é obrigatório';
        if (!/^\S+@\S+$/.test(value)) return 'Email inválido';
        return null;
      },
      password: (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Confirmação de senha é obrigatória';
        if (value !== values.password) return 'As senhas não coincidem';
        return null;
      },
      documentNumber: (value, values) => {
        if (!value) return 'Documento é obrigatório';
        const cleanDoc = value.replace(/\D/g, '');
        if (values.documentType === 'cpf' && cleanDoc.length !== 11) {
          return 'CPF inválido';
        }
        if (values.documentType === 'cnpj' && cleanDoc.length !== 14) {
          return 'CNPJ inválido';
        }
        return null;
      },
      birthDate: (value) => {
        if (!value) return 'Data de nascimento é obrigatória';
        const age = dayjs().diff(dayjs(value), 'year');
        if (age < 18) return 'Você deve ter pelo menos 18 anos';
        return null;
      },
      phone: (value) => {
        if (!value) return 'Telefone é obrigatório';
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length < 10) return 'Telefone inválido';
        return null;
      },
    },
  });

  // Função para formatar documento sem causar loops infinitos
  const formatDocumentNumber = useCallback((value: string, type: 'cpf' | 'cnpj') => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'cpf') {
      // Limita a 11 dígitos para CPF
      const limitedCpf = numbers.slice(0, 11);
      
      if (limitedCpf.length <= 3) return limitedCpf;
      if (limitedCpf.length <= 6) return `${limitedCpf.slice(0, 3)}.${limitedCpf.slice(3)}`;
      if (limitedCpf.length <= 9) return `${limitedCpf.slice(0, 3)}.${limitedCpf.slice(3, 6)}.${limitedCpf.slice(6)}`;
      return `${limitedCpf.slice(0, 3)}.${limitedCpf.slice(3, 6)}.${limitedCpf.slice(6, 9)}-${limitedCpf.slice(9, 11)}`;
    } 
    else { // CNPJ
      // Limita a 14 dígitos para CNPJ
      const limitedCnpj = numbers.slice(0, 14);
      
      if (limitedCnpj.length <= 2) return limitedCnpj;
      if (limitedCnpj.length <= 5) return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2)}`;
      if (limitedCnpj.length <= 8) return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2, 5)}.${limitedCnpj.slice(5)}`;
      if (limitedCnpj.length <= 12) return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2, 5)}.${limitedCnpj.slice(5, 8)}/${limitedCnpj.slice(8)}`;
      return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2, 5)}.${limitedCnpj.slice(5, 8)}/${limitedCnpj.slice(8, 12)}-${limitedCnpj.slice(12)}`;
    }
  }, []);

  // Manipulador para mudança no documento - CORRIGIDO para evitar loops infinitos
  const handleDocumentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Formatação direta sem dependência de form.values.documentNumber
    const formatted = formatDocumentNumber(inputValue, form.values.documentType);
    form.setFieldValue('documentNumber', formatted);
  }, [form.values.documentType, formatDocumentNumber, form]);

  // Manipulador para mudança no tipo de documento
  const handleDocumentTypeChange = useCallback((value: string | null) => {
    if (!value) return;
    
    // Primeiro, definimos o tipo
    form.setFieldValue('documentType', value as 'cpf' | 'cnpj');
    
    // Em seguida, reformatar o número do documento existente para o novo tipo
    const currentDocNumber = form.values.documentNumber;
    const onlyNumbers = currentDocNumber.replace(/\D/g, '');
    
    // Reformatar o valor existente com base no novo tipo
    if (onlyNumbers) {
      const formatted = formatDocumentNumber(onlyNumbers, value as 'cpf' | 'cnpj');
      form.setFieldValue('documentNumber', formatted);
    } else {
      // Se não houver número, apenas limpe o campo
      form.setFieldValue('documentNumber', '');
    }
  }, [form, formatDocumentNumber]);

  // Função para formatar telefone
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    
    let formatted;
    if (value.length <= 2) {
      formatted = value;
    } else if (value.length <= 7) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }
    
    form.setFieldValue('phone', formatted);
  }, [form]);

  // Handler para endereço - modificado para evitar loops infinitos
  const handleAddressChange = useCallback((address: any) => {
    // Verifica se o endereço realmente mudou antes de atualizar
    if (JSON.stringify(address) !== JSON.stringify(form.values.address)) {
      form.setFieldValue('address', address);
    }
  }, [form]);

  const handleSubmit = async (values: PersonalFormData) => {
    try {
      setLoading(true);
      
      // Atualiza o contexto global se disponível
      if (updateRegistrationData) {
        updateRegistrationData(values);
      }
      
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      notifications.show({
        title: 'Erro ao registrar',
        message: 'Ocorreu um erro ao processar o registro. Tente novamente mais tarde.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Title order={2}>Informações Pessoais</Title>

        <TextInput
          label="Nome Completo"
          placeholder="Seu nome completo"
          {...form.getInputProps('name')}
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

        <Group grow>
          <Select
            label="Tipo de Documento"
            data={[
              { value: 'cpf', label: 'CPF' },
              { value: 'cnpj', label: 'CNPJ' },
            ]}
            defaultValue={form.values.documentType}
            onChange={handleDocumentTypeChange}
            required
          />
          <TextInput
            label={form.values.documentType === 'cpf' ? 'CPF' : 'CNPJ'}
            placeholder={form.values.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
            value={form.values.documentNumber}
            onChange={handleDocumentChange}
            error={form.errors.documentNumber}
            required
          />
        </Group>

        <Group grow>
          <DateInput
            label="Data de Nascimento"
            placeholder="Selecione sua data de nascimento"
            {...form.getInputProps('birthDate')}
            maxDate={new Date()}
            required
          />
          <TextInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={form.values.phone}
            onChange={handlePhoneChange}
            error={form.errors.phone}
            required
          />
        </Group>

        <Select
          label="Gênero"
          placeholder="Selecione seu gênero"
          data={[
            { value: 'male', label: 'Masculino' },
            { value: 'female', label: 'Feminino' },
            { value: 'other', label: 'Outro' },
            { value: 'prefer_not_to_say', label: 'Prefiro não dizer' },
          ]}
          {...form.getInputProps('gender')}
          required
        />

        <Title order={2} mt="md">Endereço</Title>
        {/* AddressForm com memoização para evitar re-renders desnecessários */}
        {React.useMemo(() => (
          <AddressForm
            initialValues={form.values.address}
            onChange={handleAddressChange}
          />
        ), [handleAddressChange, form.values.address])}

        <Button type="submit" loading={loading} mt="xl">
          Continuar
        </Button>
      </Stack>
    </form>
  );
}