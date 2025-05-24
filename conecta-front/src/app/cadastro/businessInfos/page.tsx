'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { ProfessionalForm } from '@/components/auth/ProfessionalForm';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';

export default function BusinessInfosPage() {
    const router = useRouter();
    const { registrationData, updateRegistrationData, clearRegistrationData } = useRegistration();
    const { register } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verifica se o usuário tem permissão para estar nesta página
    useEffect(() => {
        console.log('BusinessInfos - Verificando dados do contexto:', registrationData);
        
        // Verifica se tem role
        if (!registrationData.role) {
            console.log('BusinessInfos - Role não encontrada, redirecionando para chooseRole');
            notifications.show({
                title: 'Acesso negado',
                message: 'Por favor, selecione um perfil primeiro',
                color: 'red',
            });
            router.push('/cadastro/chooseRole');
            return;
        }

        // Verifica se tem dados pessoais básicos
        const requiredPersonalFields = ['name', 'email', 'phone', 'documentType', 'documentNumber', 'birthDate'];
        const missingPersonalFields = requiredPersonalFields.filter(field => !registrationData[field as keyof typeof registrationData]);

        if (missingPersonalFields.length > 0) {
            console.log('BusinessInfos - Dados pessoais incompletos:', missingPersonalFields);
            notifications.show({
                title: 'Dados incompletos',
                message: 'Por favor, complete seus dados pessoais primeiro',
                color: 'red',
            });
            router.push('/cadastro/aboutYou');
            return;
        }

        // Verifica se tem endereço completo
        if (!registrationData.address?.cep || !registrationData.address?.street || !registrationData.address?.number) {
            console.log('BusinessInfos - Endereço incompleto:', registrationData.address);
            notifications.show({
                title: 'Endereço incompleto',
                message: 'Por favor, complete seu endereço primeiro',
                color: 'red',
            });
            router.push('/cadastro/aboutYou');
            return;
        }
    }, [registrationData, router]);

    console.log('BusinessInfos - Current Registration Data:', registrationData);

    const handleSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);
            console.log('BusinessInfos - Form Values:', values);
            
            // Validate required fields
            const requiredFields = ['professionalName', 'professionalEmail', 'professionalPhone'];
            const missingFields = requiredFields.filter(field => !values[field]);

            if (missingFields.length > 0) {
                console.log('BusinessInfos - Missing Required Fields:', missingFields);
                notifications.show({
                    title: 'Campos obrigatórios',
                    message: 'Por favor, preencha todos os campos obrigatórios',
                    color: 'red',
                });
                return;
            }

            // Validate role
            if (!registrationData.role) {
                console.log('BusinessInfos - Missing Role:', registrationData.role);
                notifications.show({
                    title: 'Perfil não selecionado',
                    message: 'Por favor, volte e selecione um perfil válido',
                    color: 'red',
                });
                return;
            }
            
            // Se tiver upload de imagem, converter para base64 para armazenar
            let imageBase64 = values.profileImageUrl;
            console.log('BusinessInfos - Profile Image:', imageBase64 ? 'Present' : 'Not Present');
            
            // Atualizar dados de cadastro no contexto
            const updatedData = {
                ...values,
                profileImageUrl: imageBase64
            };
            console.log('BusinessInfos - Updating Registration Data:', updatedData);
            
            updateRegistrationData(updatedData);
            
            // Combinar os dados de todos os passos
            const completeRegistrationData = {
                ...registrationData,
                ...values,
                profileImageUrl: imageBase64,
                // Garantir que temos uma senha (para caso de login social)
                password: registrationData.password || Math.random().toString(36).slice(-8),
                // Garantir que a role está presente
                role: registrationData.role,
                // Garantir que o endereço está presente
                address: registrationData.address ? {
                    ...registrationData.address,
                    zipCode: registrationData.address.cep,
                    neighborhood: registrationData.address.neighborhood,
                    street: registrationData.address.street,
                    number: registrationData.address.number,
                    complement: registrationData.address.complement,
                    city: registrationData.address.city,
                    state: registrationData.address.state,
                    country: 'Brasil'
                } : null
            };
            console.log('BusinessInfos - Complete Registration Data:', completeRegistrationData);

            try {
                // Registrar o usuário com o sistema de autenticação
                await register(completeRegistrationData);

                // Mostrar notificação de sucesso
                notifications.show({
                    title: 'Cadastro realizado com sucesso!',
                    message: 'Você será redirecionado para o dashboard.',
                    color: 'green',
                });

                // Limpar os dados de registro do contexto APÓS o sucesso
                clearRegistrationData();
                console.log('BusinessInfos - Registration Data Cleared');
            } catch (error) {
                throw error;
            }

            // O redirecionamento é tratado pelo contexto de autenticação
        } catch (error: any) {
            console.error('BusinessInfos - Error:', error);
            notifications.show({
                title: 'Erro no cadastro',
                message: error.response?.data?.message || 'Ocorreu um erro ao finalizar seu cadastro. Tente novamente.',
                color: 'red',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.push('/cadastro/aboutYou');
    };

    return (
        <RegistrationLayout
            currentStep={3}
            title="Perfil Profissional"
            description="Complete seu perfil com informações profissionais"
            onBack={handleBack}
        >
            <ProfessionalForm 
                onSubmit={handleSubmit}
                initialValues={{
                    professionalName: registrationData.name,
                    professionalEmail: registrationData.email,
                    professionalPhone: registrationData.phone,
                    miniBio: '',
                    professionalLocation: '',
                    website: '',
                    instagram: '',
                    facebook: '',
                    linkedin: '',
                    segments: [],
                    skills: [],
                    products: [],
                    hasPhysicalStore: false,
                    hasEcommerce: false,
                    profileImageUrl: null,
                    socialLinks: {
                        website: '',
                        instagram: '',
                        facebook: '',
                        linkedin: ''
                    }
                }}
                loading={isSubmitting}
            />
        </RegistrationLayout>
    );
} 