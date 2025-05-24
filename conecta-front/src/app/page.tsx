'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Text, Anchor, Paper, Title, Container, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      notifications.show({
        title: 'Login bem sucedido!',
        message: 'Bem-vindo de volta.',
        color: 'green',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Erro no login',
        message: error.response?.data?.message || 'Credenciais inválidas. Tente novamente.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Image
            src="/assets/conecta-img.svg"
            alt="Background image"
            width={800}
            height={1024}
            className="mx-auto"
          />
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Container size="xs" w="100%">
          <Paper radius="md" p="xl" withBorder>
            <div className="text-center">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
              <Title order={2} mt="md" mb="xs">
                Bem-vindo de volta
              </Title>
              <Text c="dimmed" size="sm">
                Entre com suas credenciais para acessar sua conta
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                mt="md"
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                mt="md"
              />

              <Anchor component="button" type="button" c="dimmed" size="sm" mt="xs">
                Esqueceu sua senha?
              </Anchor>

              <Button fullWidth mt="xl" type="submit" loading={isSubmitting}>
                Entrar
              </Button>

              {/* <Divider label="ou continue com" labelPosition="center" my="lg" />

              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => loginWithGoogle()}
                leftSection={
                  <Image src="/assets/google.svg" width={20} height={20} alt="Google" />
                }
              >
                Google
              </Button> */}

              <Text ta="center" mt="md">
                Não tem uma conta?{' '}
                <Anchor component="button" type="button" onClick={() => router.push('/cadastro/chooseRole')}>
                  Cadastre-se
                </Anchor>
              </Text>
            </form>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
