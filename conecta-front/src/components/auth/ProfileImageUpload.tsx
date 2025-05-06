import { useState, useRef, useEffect } from 'react';
import { Group, Text, Button, Avatar, rem, Image, Paper } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';

interface ProfileImageUploadProps {
  onChange: (file: File | null, imageUrl: string | null) => void;
  initialImage?: string;
}

export function ProfileImageUpload({ onChange, initialImage }: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const openRef = useRef<() => void>(null);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleDrop = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: 'Arquivo muito grande',
        message: 'O tamanho máximo permitido é 5MB',
        color: 'red',
      });
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    onChange(file, imageUrl);
  };

  const clearImage = () => {
    setPreview(null);
    onChange(null, null);
  };

  return (
    <Paper radius="md" p="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text size="sm" fw={500}>Foto de Perfil</Text>
        {preview && (
          <Button 
            variant="light" 
            color="red" 
            onClick={clearImage}
            leftSection={<IconX size={16} />}
            size="xs"
          >
            Remover
          </Button>
        )}
      </Group>

      {preview ? (
        <Group justify="center">
          <Paper
            p={8}
            radius="md"
            style={{ overflow: 'hidden', width: 180, height: 180 }}
          >
            <Avatar
              src={preview}
              alt="Imagem de perfil"
              size={160}
              radius={80}
              mx="auto"
            />
          </Paper>
        </Group>
      ) : (
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          className="dropzone"
          accept={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
          maxSize={5 * 1024 * 1024}
          styles={{
            root: { 
              border: '1px dashed #ced4da', 
              padding: '20px', 
              borderRadius: '8px',
              minHeight: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }
          }}
        >
          <Group justify="center">
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(50), height: rem(50) }}
                color="var(--mantine-color-blue-6)"
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(50), height: rem(50) }}
                color="var(--mantine-color-red-6)"
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{ width: rem(50), height: rem(50) }}
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <div style={{ textAlign: 'center' }}>
            <Text ta="center" fw={700} fz="lg" mt="md">
              Clique ou arraste a imagem
            </Text>
            <Text ta="center" fz="sm" c="dimmed" mt={7}>
              Adicione uma foto de perfil (tamanho máximo: 5mb)
            </Text>
          </div>
        </Dropzone>
      )}
      
      {preview && (
        <Group justify="center" mt="sm">
          <Button 
            onClick={() => openRef.current?.()} 
            size="xs" 
            radius="md"
            leftSection={<IconUpload size={16} />}
          >
            Alterar foto
          </Button>
        </Group>
      )}
    </Paper>
  );
} 