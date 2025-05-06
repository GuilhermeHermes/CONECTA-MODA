import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates'; // ✅ Aqui
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { RegistrationProvider } from '@/contexts/RegistrationContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

dayjs.locale('pt-br'); // ✅ Set locale

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export const metadata: Metadata = {
  title: 'Conecta Moda - Login',
  description: 'Sistema de gerenciamento Conecta Moda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <MantineProvider theme={theme}>
            <Notifications />
            <AuthProvider>
              <RegistrationProvider>
                {children}
              </RegistrationProvider>
            </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
