'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
            <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={150}
                height={150}
                className="mx-auto"
                />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                Entre com suas credenciais para acessar sua conta
            </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
                )}
            
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                <label htmlFor="email" className="sr-only">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                <label htmlFor="password" className="sr-only">
                    Senha
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Esqueceu sua senha?
                </a>
            </div>
            
            <div>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Cadastre-se aqui
                </a>
            </div>
            

            <div>
                <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                Entrar
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
  );
}
