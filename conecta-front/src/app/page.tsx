'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Text, Anchor, Paper, Title, Container } from '@mantine/core';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Login bem-sucedido
        console.log('Login realizado com sucesso:', data.user);
        router.push('/dashboard'); // Redireciona para o dashboard
      } else {
        // Login falhou
        setError(data.message || 'Erro ao realizar login. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
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
              {error && (
                <Text c="red" size="sm" ta="center" mb="md">
                  {error}
                </Text>
              )}

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

              <Button fullWidth mt="xl" type="submit">
                Entrar
              </Button>

              <Text ta="center" mt="md">
                Não tem uma conta?{' '}
                <Anchor component="button" type="button" onClick={() => router.push('/chooseRole')}>
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
