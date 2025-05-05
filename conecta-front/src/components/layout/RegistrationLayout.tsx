import { ReactNode } from 'react';
import { Paper, Container, Title, Text, Stepper, Group } from '@mantine/core';

interface RegistrationLayoutProps {
  children: ReactNode;
  currentStep: number;
  title: string;
  description: string;
}

const steps = [
  { label: 'Selecione seu perfil', description: 'Escolha o tipo de perfil' },
  { label: 'Sobre você', description: 'Informações pessoais' },
  { label: 'Cadastre seu perfil', description: 'Finalize seu cadastro' },
];

export function RegistrationLayout({ children, currentStep, title, description }: RegistrationLayoutProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Paper bg="blue.8" p="xl" style={{ color: 'white' }}>
        <Stepper
          active={currentStep}
          orientation="vertical"
          color="white"
          styles={{
            stepBody: { color: 'white' },
            stepDescription: { color: 'white' },
            stepLabel: { color: 'white' },
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
          <Title order={2} c="blue.8" mb="xs">
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