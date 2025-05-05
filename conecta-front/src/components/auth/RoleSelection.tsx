import { Card, Text, Radio, Stack, Button, Group } from '@mantine/core';
import { useState } from 'react';

interface Role {
  id: string;
  title: string;
  description: string;
}

const roles: Role[] = [
  {
    id: 'fornecedor',
    title: 'Fornecedor',
    description: 'Você representa um fabricante de matérias primas, aviamentos, estamparia, embalagens, etiquetas ou outros insumos, na região nordeste, e deseja ter o seu perfil ativo em nossa plataforma? Selecione essa opção.',
  },
  {
    id: 'profissional',
    title: 'Profissional de Moda',
    description: 'Você atua como profissional de moda, prestando serviços como: costureiro, pilotista, modelista, estilista, designer de estampas, ou outros, na região nordeste, e deseja ter o seu perfil ativo em nossa plataforma? Selecione essa opção.',
  },
  {
    id: 'marca',
    title: 'Marca de Moda',
    description: 'Você é empresário(a) de uma marca de moda do nordeste e deseja se conectar com os perfis dos fornecedores e profissionais de moda disponíveis em nossa plataforma? Selecione essa opção.',
  },
];

interface RoleSelectionProps {
  onSelect: (roleId: string) => void;
}

export function RoleSelection({ onSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleSubmit = () => {
    if (selectedRole) {
      onSelect(selectedRole);
    }
  };

  return (
    <Stack>
      <Radio.Group
        value={selectedRole}
        onChange={setSelectedRole}
        name="role"
        label="Selecione seu perfil"
        description="Escolha a opção que mais se identifica com você"
      >
        <Stack mt="xs">
          {roles.map((role) => (
            <Card key={role.id} withBorder p="md" radius="md">
              <Radio
                value={role.id}
                label={
                  <div>
                    <Text fw={500} size="sm">
                      {role.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {role.description}
                    </Text>
                  </div>
                }
              />
            </Card>
          ))}
        </Stack>
      </Radio.Group>

      <Group justify="space-between" mt="xl">
        <Button variant="outline" onClick={() => window.history.back()} color="#0E4B82">
          Voltar
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedRole} color="#0E4B82">
          Próximo
        </Button>
      </Group>
    </Stack>
  );
} 