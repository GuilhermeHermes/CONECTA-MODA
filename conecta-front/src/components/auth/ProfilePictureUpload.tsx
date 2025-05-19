'use client';

import { FileInput, Group, Image, Text, Box } from '@mantine/core';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface ProfilePictureUploadProps {
  onUploadComplete?: (url: string) => void;
}

export function ProfilePictureUpload({ onUploadComplete }: ProfilePictureUploadProps) {
  const { user, updateUser } = useUser();
  const { isAuthenticated } = useAuth();
  const [preview, setPreview] = useState<string | null>(user?.profilePicture || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Use different endpoints based on authentication status
      const endpoint = isAuthenticated ? '/users/me/profile-picture' : '/users/upload-profile-picture';
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { profilePicture } = response.data;
      setPreview(profilePicture);
      
      if (updateUser) {
        updateUser({ ...user, profilePicture });
      }
      
      if (onUploadComplete) {
        onUploadComplete(profilePicture);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Group align="flex-start">
      <Box
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile picture preview"
            width={120}
            height={120}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <Text size="sm" c="dimmed" ta="center" p="md">
            Sem foto
          </Text>
        )}
      </Box>
      <div style={{ flex: 1 }}>
        <FileInput
          label="Foto de Perfil"
          placeholder="Clique para fazer upload"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleFileChange}
          disabled={loading}
          clearable
        />
        <Text size="xs" c="dimmed" mt={4}>
          Formatos aceitos: PNG, JPEG, GIF
        </Text>
      </div>
    </Group>
  );
} 