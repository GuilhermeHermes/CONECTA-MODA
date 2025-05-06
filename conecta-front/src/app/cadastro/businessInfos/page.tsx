'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { ProfessionalForm } from '@/components/auth/ProfessionalForm';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export default function BusinessInfosPage() {
    const router = useRouter();
    const { registrationData, updateRegistrationData, clearRegistrationData } = useRegistration();
    const { register } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);
            
            // Se tiver upload de imagem, converter para base64 para armazenar
            let imageBase64 = values.profileImageUrl;
            
            // Atualizar dados de cadastro no contexto
            updateRegistrationData({
                ...values,
                profileImageUrl: imageBase64
            });
            
            // Combinar os dados de todos os passos
            const completeRegistrationData = {
                ...registrationData,
                ...values,
                profileImageUrl: imageBase64,
                // Garantir que temos uma senha (para caso de login social)
                password: registrationData.password || Math.random().toString(36).slice(-8),
            };

            // Registrar o usuário com o sistema de autenticação
            await register(completeRegistrationData);

            // Mostrar notificação de sucesso
            notifications.show({
                title: 'Cadastro realizado com sucesso!',
                message: 'Você será redirecionado para o dashboard.',
                color: 'green',
            });

            // Limpar os dados de registro do contexto
            clearRegistrationData();

            // O redirecionamento é tratado pelo contexto de autenticação
        } catch (error: any) {
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
        router.push('/cadastro');
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
                initialValues={registrationData}
            />
        </RegistrationLayout>
    );
} 