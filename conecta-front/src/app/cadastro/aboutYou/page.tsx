'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';

export default function AboutYouPage() {
    const router = useRouter();
    const { registrationData, updateRegistrationData } = useRegistration();

    const handleSubmit = async (values: any) => {
        try {
            // Atualizar dados de cadastro no contexto
            updateRegistrationData(values);
            
            // Navegar para o próximo passo
            router.push('/cadastro/businessInfos');
        } catch (error: any) {
            notifications.show({
                title: 'Erro ao salvar dados',
                message: 'Ocorreu um erro ao salvar seus dados. Tente novamente.',
                color: 'red',
            });
        }
    };

    return (
        <RegistrationLayout
            currentStep={2}
            title="Sobre você"
            description="Informe seus dados pessoais e documentação"
        >
            <RegistrationForm 
                onSubmit={handleSubmit}
                initialValues={registrationData}
            />
        </RegistrationLayout>
    );
}