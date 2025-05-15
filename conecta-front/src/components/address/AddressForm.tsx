'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TextInput, Select, Stack, Group, Loader, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';

const ESTADOS_BRASIL = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

interface AddressFormData {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

interface AddressFormProps {
  initialValues?: Partial<AddressFormData>;
  onChange: (values: AddressFormData) => void;
}

export function AddressForm({ initialValues, onChange }: AddressFormProps) {
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Inicializa o formulário com memoization
  const form = useForm<AddressFormData>({
    initialValues: useMemo(() => ({
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      complement: '',
      ...initialValues,
    }), [initialValues]),
    validate: {
      cep: (value) => {
        if (!value) return 'CEP é obrigatório';
        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length !== 8) return 'CEP inválido';
        return null;
      },
      street: (value) => (!value ? 'Rua é obrigatória' : null),
      number: (value) => (!value ? 'Número é obrigatório' : null),
      neighborhood: (value) => (!value ? 'Bairro é obrigatório' : null),
      city: (value) => (!value ? 'Cidade é obrigatória' : null),
      state: (value) => (!value ? 'Estado é obrigatório' : null),
    },
  });

  // Função memoizada para formatar CEP
  const formatCep = useCallback((cep: string): string => {
    const onlyNumbers = cep.replace(/\D/g, '').slice(0, 8);
    if (onlyNumbers.length <= 5) {
      return onlyNumbers;
    } else {
      return `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(5)}`;
    }
  }, []);

  // Função memoizada para buscar endereço por CEP
  const fetchAddressByCEP = useCallback(async (cep: string) => {
    console.log('Buscando endereço para o CEP:', cep);
    const cleanCep = cep.replace(/\D/g, '');
    console.log('cleanCep', cleanCep);
    if (cleanCep.length !== 8) {
      setCepError('CEP deve conter 8 dígitos');
      return;
    }

    setLoadingCep(true);
    setCepError(null);

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (response.data.erro) {
        setCepError('CEP não encontrado');
        return;
      }

      // Sempre formate o CEP corretamente para o campo do formulário
      const formattedCep = `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;

      const newValues = {
        street: response.data.logradouro || '',
        neighborhood: response.data.bairro || '',
        city: response.data.localidade || '',
        state: response.data.uf || '',
        number: form.values.number,
        complement: form.values.complement,
        cep: formattedCep,
      };

      form.setValues(newValues);
      console.log('form values after CEP search', newValues);
      onChange(newValues);

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCepError('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setLoadingCep(false);
    }
  }, [form, onChange]);

  // Handler para mudança de CEP memoizado
  const handleCEPChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const formattedValue = formatCep(rawValue);
    form.setFieldValue('cep', formattedValue);
    
    // Busca endereço automaticamente ao completar o CEP
    const cleanCep = formattedValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetchAddressByCEP(formattedValue);
    }
  }, [form, formatCep, fetchAddressByCEP]);

  // Notifica mudanças no formulário
  const handleFieldChange = useCallback((field: keyof AddressFormData, value: string) => {
    form.setFieldValue(field, value);
    onChange(form.values);
  }, [form, onChange]);

  // Busca cidades quando o estado muda
  useEffect(() => {
    const fetchCities = async () => {
      const state = form.values.state;
      if (!state) {
        setCities([]);
        return;
      }

      setLoadingCities(true);
      try {
        const response = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
        );
        const citiesList = response.data.map((city: any) => ({
          value: city.nome,
          label: city.nome,
        }));
        setCities(citiesList);
        
        // Se mudar o estado e a cidade atual não existir na nova lista, limpa o campo cidade
        const cityExists = citiesList.some((city: any) => city.value === form.values.city);
        if (!cityExists && form.values.city) {
          form.setFieldValue('city', '');
        }
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    if (form.values.state) {
      fetchCities();
    }
  }, [form.values.state]);

  return (
    <Stack>
      <Group grow>
        <TextInput
          label="CEP"
          placeholder="00000-000"
          maxLength={9}
          value={form.values.cep}
          onChange={handleCEPChange}
          error={cepError || form.errors.cep}
          rightSection={loadingCep ? <Loader size="xs" /> : null}
          required
        />
        <TextInput
          label="Número"
          placeholder="123"
          value={form.values.number}
          onChange={(event) => handleFieldChange('number', event.target.value)}
          error={form.errors.number}
          required
        />
      </Group>

      <TextInput
        label="Rua"
        placeholder="Rua Exemplo"
        value={form.values.street}
        onChange={(event) => handleFieldChange('street', event.target.value)}
        error={form.errors.street}
        required
      />

      <TextInput
        label="Bairro"
        placeholder="Bairro Exemplo"
        value={form.values.neighborhood}
        onChange={(event) => handleFieldChange('neighborhood', event.target.value)}
        error={form.errors.neighborhood}
        required
      />

      <TextInput
        label="Complemento"
        placeholder="Apto 101, Bloco B, etc. (opcional)"
        value={form.values.complement || ''}
        onChange={(event) => handleFieldChange('complement', event.target.value)}
      />

      <Group grow>
        <Select
          label="Estado"
          placeholder="Selecione o estado"
          data={ESTADOS_BRASIL}
          value={form.values.state}
          onChange={(value) => handleFieldChange('state', value || '')}
          error={form.errors.state}
          required
        />
        <Select
          label="Cidade"
          placeholder="Selecione a cidade"
          data={cities}
          value={form.values.city}
          onChange={(value) => handleFieldChange('city', value || '')}
          error={form.errors.city}
          rightSection={loadingCities ? <Loader size="xs" /> : null}
          required
        />
      </Group>
      
      {/* Mensagem de ajuda */}
      {loadingCep && <Text size="sm" c="dimmed">Buscando endereço pelo CEP...</Text>}
    </Stack>
  );
}