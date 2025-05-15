'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { useRegistration } from '@/contexts/RegistrationContext';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';

export default function AboutYouPage() {
    const router = useRouter();
    const { registrationData, updateRegistrationData } = useRegistration();
    const [loading, setLoading] = useState(false);

    // Verifica se o usuário tem permissão para estar nesta página
    useEffect(() => {
        console.log('AboutYou - Verificando dados do contexto:', registrationData);
        
        if (!registrationData.role) {
            console.log('AboutYou - Role não encontrada, redirecionando para chooseRole');
            notifications.show({
                title: 'Acesso negado',
                message: 'Por favor, selecione um perfil primeiro',
                color: 'red',
            });
            router.push('/cadastro/chooseRole');
            return;
        }
    }, [registrationData.role, router]);

    console.log('AboutYou - Current Registration Data:', registrationData);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            console.log('AboutYou - Form Values:', values);

            // Validate required fields
            const requiredFields = ['name', 'email', 'phone', 'documentType', 'documentNumber', 'birthDate'];
            const missingFields = requiredFields.filter(field => !values[field]);

            if (missingFields.length > 0) {
                console.log('AboutYou - Missing Required Fields:', missingFields);
                notifications.show({
                    title: 'Campos obrigatórios',
                    message: 'Por favor, preencha todos os campos obrigatórios',
                    color: 'red',
                });
                return;
            }

            // Validate address
            if (!values.address?.cep || !values.address?.street || !values.address?.number) {
                console.log('AboutYou - Incomplete Address:', values.address);
                notifications.show({
                    title: 'Endereço incompleto',
                    message: 'Por favor, preencha todos os campos do endereço',
                    color: 'red',
                });
                return;
            }

            // Ensure address values are properly formatted
            const formattedAddress = {
                ...values.address,
                cep: values.address.cep.replace(/\D/g, ''),
                street: values.address.street || '',
                number: values.address.number || '',
                neighborhood: values.address.neighborhood || '',
                city: values.address.city || '',
                state: values.address.state || '',
                complement: values.address.complement || ''
            };

            // Update registration data
            const updatedData = {
                ...values,
                address: formattedAddress
            };
            console.log('AboutYou - Updating Registration Data:', updatedData);
            
            updateRegistrationData(updatedData);
            console.log('AboutYou - Updated Registration Data:', { ...registrationData, ...updatedData });

            await router.push('/cadastro/businessInfos');
        } catch (error: any) {
            console.error('AboutYou - Error:', error);
            notifications.show({
                title: 'Erro no cadastro',
                message: error.response?.data?.message || 'Ocorreu um erro ao salvar seus dados. Tente novamente.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    // Ensure initial values have proper address structure
    const initialValues = {
        ...registrationData,
        address: {
            cep: registrationData.address?.cep || '',
            street: registrationData.address?.street || '',
            number: registrationData.address?.number || '',
            neighborhood: registrationData.address?.neighborhood || '',
            city: registrationData.address?.city || '',
            state: registrationData.address?.state || '',
            complement: registrationData.address?.complement || ''
        }
    };

    return (
        <RegistrationLayout
            currentStep={2}
            title="Sobre Você"
            description="Complete seu cadastro com suas informações pessoais"
        >
            <RegistrationForm 
                onSubmit={handleSubmit}
                initialValues={initialValues}
                loading={loading}
            />
        </RegistrationLayout>
    );
}