'use client';

import { Group, FileInput, Image, Button, ActionIcon, Stack, Text } from '@mantine/core';
import { IconUpload, IconTrash, IconPhoto } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

interface ImageUploadProps {
  initialImage?: string;
  onChange: (file: File | null, imageUrl: string | null) => void;
}

export function ProfileImageUpload({ initialImage, onChange }: ImageUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        onChange(file, preview);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      onChange(null, null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    onChange(null, null);
  };

  return (
    <Stack>
      <Text fw={500} size="sm">Foto de Perfil</Text>
      
      {imagePreview ? (
        <Stack>
          <Image
            radius="md"
            src={imagePreview}
            alt="Preview da imagem"
            maw={200}
            mx="auto"
          />
          <Group justify="center">
            <Button 
              variant="outline" 
              leftSection={<IconTrash size={16} />}
              onClick={handleRemoveImage}
              color="red"
              size="xs"
            >
              Remover
            </Button>
          </Group>
        </Stack>
      ) : (
        <FileInput
          placeholder="Selecione uma imagem"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          leftSection={<IconPhoto size={16} />}
          description="Recomendado: Imagem quadrada com pelo menos 300x300 pixels"
        />
      )}
    </Stack>
  );
} 