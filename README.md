# CONECTA-MODA

Sistema de gestão para a indústria da moda, com autenticação JWT e OAuth integrados.

## Estrutura do Projeto

- **conecta-front**: Frontend desenvolvido com Next.js e Mantine UI
- **conecta-backend**: Backend desenvolvido com NestJS e PostgreSQL

## Requisitos

- Node.js v18+
- Docker e Docker Compose
- PostgreSQL

## Instalação

### 1. Banco de Dados

Inicie o banco de dados PostgreSQL com Docker:

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd conecta-backend
npm install
npm run start:dev
```

O backend estará disponível em: http://localhost:3001

### 3. Frontend

```bash
cd conecta-front
npm install
npm run dev
```

O frontend estará disponível em: http://localhost:3000

## Funcionalidades

- Autenticação JWT e Google OAuth
- Cadastro de usuários
- Perfis de usuários
- Dashboard protegido

## Configuração OAuth

Para configurar o OAuth do Google:

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Configure o OAuth Consent Screen
3. Crie credenciais OAuth para Web
4. Adicione os redirecionamentos URLs:
   - http://localhost:3001/auth/google/callback
5. Copie o Client ID e Client Secret para o arquivo `.env` do backend
