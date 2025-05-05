'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        cnpj: '',
        dataNascimento: '',
        genero: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        pais: '',
        estado: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de cadastro aqui
    };

    return (
        <div className='grid grid-cols-6 min-h-screen'>
            {/* Sidebar */}
            <div className='flex flex-col items-start space-y-6 pt-12 col-span-2 bg-blue-800 text-white'>
                <div className='w-full pl-12 py-3 flex items-center'>
                    <div className='bg-white rounded-full p-1 mr-3'>
                        <svg className='w-5 h-5 text-blue-800' fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className='font-medium'>Selecione seu perfil</span>
                </div>
                <div className='w-full pl-12 py-3 flex items-center bg-blue-900'>
                    <div className='bg-white rounded-full p-1 mr-3'>
                        <svg className='w-5 h-5 text-blue-800' fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className='font-medium'>Sobre você</span>
                </div>
                <div className='w-full pl-12 py-3 flex items-center'>
                    <div className='rounded-full bg-blue-100 text-blue-800 w-6 h-6 flex items-center justify-center mr-3'>
                        <span className='font-medium'>3</span>
                    </div>
                    <span className='font-medium'>Cadastre seu perfil</span>
                </div>
            </div>
            
            {/* Content */}
            <div className='col-span-4 flex flex-col items-center p-8 bg-white'>
                <div className='w-full max-w-3xl'>
                    <div className='mb-8'>
                        <h2 className='text-2xl font-bold text-blue-800'>Sobre você</h2>
                        <p className='text-gray-600'>
                            Informe alguns detalhes sobre você para avançar no cadastro
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='grid grid-cols-1 gap-4'>
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
                                <div className="flex">
                                    <div className="bg-gray-100 border border-gray-300 rounded-l-md p-2 flex items-center">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        className='flex-grow px-4 py-2 border border-gray-300 border-l-0 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="telefone" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    value={formData.telefone}
                                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cpf" className='block text-sm font-medium text-gray-700 mb-1'>
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        id="cpf"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cnpj" className='block text-sm font-medium text-gray-700 mb-1'>
                                        CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        id="cnpj"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="dataNascimento" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Data de nascimento
                                </label>
                                <input
                                    type="date"
                                    id="dataNascimento"
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    value={formData.dataNascimento}
                                    onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="genero" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Gênero
                                </label>
                                <select
                                    id="genero"
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    value={formData.genero}
                                    onChange={(e) => setFormData({...formData, genero: e.target.value})}
                                >
                                    <option value="">Selecione</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="outro">Outro</option>
                                    <option value="prefiro-nao-informar">Prefiro não informar</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-4">
                                    <label htmlFor="endereco" className='block text-sm font-medium text-gray-700 mb-1'>
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        id="endereco"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.endereco}
                                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="numero" className='block text-sm font-medium text-gray-700 mb-1'>
                                        Nº
                                    </label>
                                    <input
                                        type="text"
                                        id="numero"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.numero}
                                        onChange={(e) => setFormData({...formData, numero: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="bairro" className='block text-sm font-medium text-gray-700 mb-1'>
                                        Bairro
                                    </label>
                                    <input
                                        type="text"
                                        id="bairro"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.bairro}
                                        onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cidade" className='block text-sm font-medium text-gray-700 mb-1'>
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        id="cidade"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.cidade}
                                        onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="pais" className='block text-sm font-medium text-gray-700 mb-1'>
                                        País
                                    </label>
                                    <select
                                        id="pais"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.pais}
                                        onChange={(e) => setFormData({...formData, pais: e.target.value})}
                                    >
                                        <option value="">Selecione</option>
                                        <option value="brasil">Brasil</option>
                                        <option value="portugal">Portugal</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="estado" className='block text-sm font-medium text-gray-700 mb-1'>
                                        Estado
                                    </label>
                                    <select
                                        id="estado"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        value={formData.estado}
                                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                    >
                                        <option value="">Selecione</option>
                                        <option value="sp">São Paulo</option>
                                        <option value="rj">Rio de Janeiro</option>
                                        <option value="mg">Minas Gerais</option>
                                        <option value="rs">Rio Grande do Sul</option>
                                        <option value="pr">Paraná</option>
                                        <option value="sc">Santa Catarina</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors'
                            >
                                Voltar
                            </button>
                            <button
                                type="submit"
                                className='px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors'
                            >
                                Próximo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}