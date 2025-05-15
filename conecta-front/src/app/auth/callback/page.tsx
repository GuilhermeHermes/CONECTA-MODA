'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Text, Center, Loader } from '@mantine/core';
import Cookies from 'js-cookie';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Save the token to cookies
      Cookies.set('auth_token', token, { expires: 1 }); // 1 day
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      // Redirect to login if no token
      setTimeout(() => {
        console.log('Redirecting to login');  
        router.push('/');
      }, 2000);
    }
  }, [token, router]);

  return (
    <Center style={{ height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" />
        <Text mt="md">
          {token ? 'Login successful! Redirecting...' : 'Authentication failed. Redirecting to login...'}
        </Text>
      </div>
    </Center>
  );
} 