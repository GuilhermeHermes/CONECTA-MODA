'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { RegistrationProvider } from '@/contexts/RegistrationContext';

const inter = Inter({ subsets: ['latin'] });

dayjs.locale('pt-br');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <MantineProvider>
          <DatesProvider settings={{ locale: 'pt-br' }}>
            <Notifications />
            <AuthProvider>
              <RegistrationProvider>
                <RouteGuard>
                  {children}
                </RouteGuard>
              </RegistrationProvider>
            </AuthProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
