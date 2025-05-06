'use client'

import { useRouter } from 'next/navigation';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { useRegistration } from '@/contexts/RegistrationContext';

export default function ChooseRolePage() {
    const router = useRouter();
    const { updateRegistrationData } = useRegistration();

    const handleRoleSelect = (roleId: string) => {
        updateRegistrationData({ role: roleId });
        router.push('/cadastro/aboutYou');
    };

    return (
        <RegistrationLayout
            currentStep={0}
            title="Selecione seu perfil"
            description="Selecione a opção que mais se identifica com você"
        >
            <RoleSelection onSelect={handleRoleSelect} />
        </RegistrationLayout>
    );
}