'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de cadastro aqui
    };

    return (
        <div className='grid grid-cols-5 min-h-screen'>
            {/* Lado esquerdo - Formulário */}
            <div className='col-span-2 flex flex-col items-center justify-center p-8 bg-white'>
                <div className='w-full max-w-md'>
                    <div className='mb-8 text-center'>
                        <Image 
                            src="/logo.png" 
                            alt="Logo Conecta Moda" 
                            width={200} 
                            height={60}
                            className='mx-auto'
                        />
                    </div>
                    
                    <div className='flex flex-col items-center space-y-2 mb-8'>
                        <div className='text-center'>
                            <span className='text-gray-600'>Selecione seu Perfil</span>
                        </div>
                        <div className='text-center'>
                            <span className='text-gray-600'>Sobre você</span>
                        </div>
                        <div className='text-center'>
                            <span className='text-gray-600'>Cadastre seu perfil</span>
                        </div>
                    </div>
                    
                    <h1 className='text-2xl font-bold text-center mb-6'>Criar Conta</h1>
                    
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label htmlFor="nome" className='block text-sm font-medium text-gray-700 mb-1'>
                                Nome
                            </label>
                            <input
                                type="text"
                                id="nome"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                value={formData.nome}
                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="senha" className='block text-sm font-medium text-gray-700 mb-1'>
                                Senha
                            </label>
                            <input
                                type="password"
                                id="senha"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                value={formData.senha}
                                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmarSenha" className='block text-sm font-medium text-gray-700 mb-1'>
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                id="confirmarSenha"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                value={formData.confirmarSenha}
                                onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                            />
                        </div>

                        <button
                            type="submit"
                            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
                        >
                            Cadastrar
                        </button>
                    </form>

                    <p className='mt-4 text-center text-sm text-gray-600'>
                        Já tem uma conta?{' '}
                        <a href="/login" className='text-blue-600 hover:text-blue-800'>
                            Faça login
                        </a>
                    </p>
                </div>
            </div>

            {/* Lado direito - Imagem decorativa */}
            <div className='col-span-3 relative hidden lg:block'>
                <Image
                    src="/cadastro-image.jpg"
                    alt="Imagem decorativa"
                    fill
                    className='object-cover'
                    priority
                />
            </div>
        </div>
    );
} 