'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function chooseRole() {


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
                <div className='w-full pl-12 py-3 flex items-center '>
                    <div className='rounded-full bg-blue-100 text-blue-800 w-6 h-6 flex items-center justify-center mr-3'>
                    <span className='font-medium'>2</span>
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
                        <h2 className='text-2xl font-bold text-blue-800'>Selecione seu perfil</h2>
                        <p className='text-gray-600'>
                            Selecione a opção que mais se identifica
                        </p>
                    </div>
                    <div className='grid-col-2'>
                        <span className='flex-items-center font-xs font-bold text-blue-800'>Fornecedor</span>
                        <p className='flex-items-center grid-span-1 text-[10px] font-bold text-blue-800'>Você representa um fabricante de matérias primas, aviamentos, estamparia, embalagens, etiquetas ou outros insumos, na região nordeste, e deseja teu o seu perfil ativo em nossa plataforma? Selecione essa opção.</p>
                        <input type='checkbox' id='checkbox'></input>
                    </div>
                    <div className='grid-col-2'>
                        <span className='flex-items-center font-xs font-bold text-blue-800'>Profissional de Moda</span>
                        <p className='flex-items-center grid-span-1 text-[10px] font-bold text-blue-800'>Você atua como profissional de moda, prestando serviços como: costureiro, pilotista, modelista, estilista, designer de estampas, ou outros, na região nordeste, e deseja teu o seu perfil ativo em nossa plataforma? Selecione essa opção.</p>
                        <input type='checkbox' id='checkbox'></input>
                    </div>
                    <div className='grid-col-2'>
                        <span className='flex-items-center font-xs font-bold text-blue-800'>Marca de Moda</span>
                        <p className='flex-items-center grid-span-1 text-[10px] font-bold text-blue-800'>Você é empresário(a) de uma marca de moda do nordeste e deseja se conectar com os perfis dos fornecedores e profissionais de moda disponíveis em nossa plataforma? Selecione essa opção.</p>
                        <input type='checkbox' id='checkbox'></input>
                    </div>
                </div>
            </div>
        </div>
    );
}