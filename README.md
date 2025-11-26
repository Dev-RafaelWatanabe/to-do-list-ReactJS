# Sistema Web: To-Do List com Métricas (Full-Stack)

Sistema completo de gerenciamento de tarefas (To-Do List) com métricas de produtividade, desenvolvido com stack moderna full-stack.

## 🎯 Sobre o Projeto

Este é um sistema web completo para gerenciamento de tarefas pessoais, permitindo aos usuários criar, editar, excluir e acompanhar suas tarefas diárias. O sistema oferece métricas detalhadas sobre produtividade, incluindo taxa de conclusão e cumprimento de prazos.

## 🏗️ Arquitetura

O projeto está estruturado em duas partes principais:

### Backend (`/backend`)

- **Framework**: NestJS (Node.js/TypeScript)
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT (JSON Web Token)
- **Arquitetura**: Orientada a Objetos (POO)

### Frontend (`/frontend`)

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router v6
- **Cliente HTTP**: Axios

## ✨ Funcionalidades

### 🔐 Autenticação

- Registro de novos usuários com validação
- Login seguro com JWT
- Hashing de senhas com bcrypt
- Proteção de rotas

### ✅ Gerenciamento de Tarefas

- Criar tarefas com título, descrição e data planejada
- Editar tarefas existentes
- Excluir tarefas
- Marcar tarefas como concluídas
- Visualizar histórico de tarefas

### 📊 Métricas e Estatísticas

- Total de tarefas criadas
- Taxa de conclusão de tarefas
- Tarefas concluídas no prazo
- Taxa de cumprimento de prazos

### 🎨 Interface

- Design moderno e responsivo
- Modo claro e escuro (Dark Mode / Light Mode)
- Interface em Português do Brasil (pt-BR)
- Experiência otimizada para mobile e desktop

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn

### 1. Configurar o Banco de Dados

```sql
-- Conecte-se ao PostgreSQL e crie o banco de dados
CREATE DATABASE todolist;
```

### 2. Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# Execute o servidor em modo desenvolvimento
npm run start:dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure o arquivo .env (opcional)
cp .env.example .env

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📖 Documentação da API

### Endpoints de Autenticação

#### Registro

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Endpoints de Tarefas (Requer autenticação)

#### Listar Tarefas

```http
GET /tasks
Authorization: Bearer {token}
```

#### Criar Tarefa

```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título da tarefa",
  "description": "Descrição opcional",
  "plannedDate": "2025-11-10"
}
```

#### Atualizar Tarefa

```http
PATCH /tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Novo título",
  "isCompleted": true
}
```

#### Excluir Tarefa

```http
DELETE /tasks/:id
Authorization: Bearer {token}
```

#### Obter Métricas

```http
GET /tasks/metrics
Authorization: Bearer {token}
```

## 🗂️ Estrutura do Projeto

```
to-do-list/
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── auth/            # Módulo de autenticação
│   │   ├── users/           # Módulo de usuários
│   │   ├── tasks/           # Módulo de tarefas
│   │   ├── app.module.ts    # Módulo raiz
│   │   └── main.ts          # Arquivo principal
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   ├── package.json
│   └── README.md
│
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── contexts/        # Contextos React (Auth, Theme)
│   │   ├── pages/           # Páginas (Login, Register, Dashboard)
│   │   ├── services/        # Serviços de API
│   │   ├── routes/          # Configuração de rotas
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── README.md                 # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### Backend

- NestJS 10
- TypeORM 0.3
- PostgreSQL
- JWT & Passport
- Bcrypt
- Class Validator

### Frontend

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- React Router 6
- Axios

## 📝 Princípios de Desenvolvimento

### Backend

- ✅ Programação Orientada a Objetos (POO)
- ✅ Classes, Interfaces e Classes Abstratas
- ✅ Injeção de Dependência
- ✅ Tratamento de Exceções
- ✅ Validação de Dados
- ✅ Segurança (JWT, Hashing)

### Frontend

- ✅ Componentização
- ✅ Hooks do React
- ✅ Context API
- ✅ TypeScript estrito
- ✅ Responsividade
- ✅ Acessibilidade

## 🎨 Screenshots

### Tela de Login

Interface de login com suporte a tema claro/escuro

### Dashboard

Dashboard principal com lista de tarefas e métricas em tempo real

### Modo Escuro

Tema escuro para melhor experiência visual noturna

## 🔒 Segurança

- Senhas criptografadas com bcrypt (salt rounds: 10)
- Autenticação via JWT com expiração configurável
- Validação de dados em todas as requisições
- Proteção contra injeção SQL (TypeORM)
- CORS configurado para desenvolvimento local

## 🚧 Próximas Funcionalidades

- [x] Categorias/Tags para tarefas
- [] Filtros e ordenação avançada
- [] Notificações de prazos
- [] Anexos em tarefas
- [] Compartilhamento de tarefas
- [] Exportar dados (PDF, CSV)
- [] Gráficos de produtividade
- [] API de webhooks

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
