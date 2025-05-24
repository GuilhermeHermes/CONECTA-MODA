'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { useRegistration } from '@/contexts/RegistrationContext';
import { notifications } from '@mantine/notifications';

export default function ChooseRolePage() {
    const router = useRouter();
    const { registrationData, updateRegistrationData } = useRegistration();

    console.log('ChooseRole - Current Registration Data:', registrationData);

    const handleRoleSelect = (roleId: string) => {
        console.log('ChooseRole - Selected Role:', roleId);
        
        if (!roleId || roleId === 'user') {
            notifications.show({
                title: 'Erro na seleção',
                message: 'Por favor, selecione um perfil válido',
                color: 'red',
            });
            return;
        }

        updateRegistrationData({ role: roleId });
        console.log('ChooseRole - Updated Registration Data:', { ...registrationData, role: roleId });
        router.push('/cadastro/aboutYou');
    };

    return (
        <RegistrationLayout
            currentStep={1}
            title="Selecione seu perfil"
            description="Selecione a opção que mais se identifica com você"
        >
            <RoleSelection onSelect={handleRoleSelect} />
        </RegistrationLayout>
    );
}