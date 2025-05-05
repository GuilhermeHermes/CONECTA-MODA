'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { useRegistration } from '@/contexts/RegistrationContext';
import { notifications } from '@mantine/notifications';

export default function CadastroPage() {
    const router = useRouter();
    const { registrationData, updateRegistrationData, clearRegistrationData } = useRegistration();

    console.log('Registration data:', registrationData);
    

    const handleSubmit = async (values: any) => {
        try {
            // Combine the role from the first step with the form data
            const completeRegistrationData = {
                ...registrationData,
                ...values,
            };

            // Here you would typically send the data to your API
            console.log('Complete registration data:', completeRegistrationData);

            // Show success notification
            notifications.show({
                title: 'Cadastro realizado com sucesso!',
                message: 'Você será redirecionado para o dashboard.',
                color: 'green',
            });

            // Clear the registration data from context
            clearRegistrationData();

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            notifications.show({
                title: 'Erro no cadastro',
                message: 'Ocorreu um erro ao realizar o cadastro. Tente novamente.',
                color: 'red',
            });
        }
    };

    return (
        <RegistrationLayout
            currentStep={1}
            title="Sobre você"
            description="Informe alguns detalhes sobre você para avançar no cadastro"
        >
            <RegistrationForm 
                onSubmit={handleSubmit}
                initialValues={registrationData}
            />
        </RegistrationLayout>
    );
}