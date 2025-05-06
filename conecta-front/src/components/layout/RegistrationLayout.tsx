import { ReactNode } from 'react';
import { Paper, Container, Title, Text, Stepper, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

interface RegistrationLayoutProps {
  children: ReactNode;
  currentStep: number;
  title: string;
  description: string;
  onBack?: () => void;
}

const steps = [
  { label: 'Selecione seu perfil', description: 'tipo de perfil no Conecta' },
  { label: 'Sobre você', description: 'Informações pessoais' },
  { label: 'Cadastre seu perfil', description: 'Finalize seu cadastro com as informações específicas' },
];
export function RegistrationLayout({ children, currentStep, title, description, onBack }: RegistrationLayoutProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Paper bg="#0E4B82" p="xl" style={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Stepper
          active={currentStep}
          orientation="vertical"
          color="white"
          styles={{
            stepBody: { color: 'white' },
            stepDescription: { color: 'white' },
            stepLabel: { color: 'white' },
            stepCompletedIcon: { color: '#008adb' }, // Use a hex color code here
          }}
        >
          {steps.map((step, index) => (
            <Stepper.Step
              key={index}
              label={step.label}
              description={step.description}
            />
          ))}
        </Stepper>
      </Paper>

      {/* Content */}
      <Container size="lg" py="xl">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {onBack && (
            <Group mb="md">
              <Button 
                variant="subtle" 
                leftSection={<IconArrowLeft size={16} />} 
                onClick={onBack}
                color="gray"
              >
                Voltar
              </Button>
            </Group>
          )}
          
          <Title order={2} c="#0E4B82" mb="xs">
            {title}
          </Title>
          <Text c="dimmed" mb="xl">
            {description}
          </Text>
          {children}
        </div>
      </Container>
    </div>
  );
}
