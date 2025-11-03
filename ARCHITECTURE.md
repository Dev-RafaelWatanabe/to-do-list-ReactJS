# 🏗️ Arquitetura do Sistema To-Do List

## Visão Geral

Este documento descreve a arquitetura técnica do sistema To-Do List, um aplicativo web full-stack desenvolvido com NestJS (backend) e React (frontend).

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + TypeScript)                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Login     │  │   Register   │  │  Dashboard   │      │
│  │    Page      │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              React Router (Routes)                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌──────────────┐           ┌──────────────┐               │
│  │    Theme     │           │     Auth     │               │
│  │   Context    │           │   Context    │               │
│  └──────────────┘           └──────────────┘               │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │            API Service (Axios)                      │     │
│  │  - Interceptors (JWT, Error Handling)              │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                  (NestJS + TypeScript)                       │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │                   Controllers                       │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │   Auth   │  │  Users   │  │  Tasks   │        │     │
│  │  │Controller│  │Controller│  │Controller│        │     │
│  │  └──────────┘  └──────────┘  └──────────┘        │     │
│  └────────────────────────────────────────────────────┘     │
│                              │                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │                     Guards                          │     │
│  │              (JWT Authentication)                   │     │
│  └────────────────────────────────────────────────────┘     │
│                              │                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │                    Services                         │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │   Auth   │  │  Users   │  │  Tasks   │        │     │
│  │  │ Service  │  │ Service  │  │ Service  │        │     │
│  │  └──────────┘  └──────────┘  └──────────┘        │     │
│  └────────────────────────────────────────────────────┘     │
│                              │                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │                   TypeORM                           │     │
│  │  ┌──────────┐  ┌──────────┐                       │     │
│  │  │   User   │  │   Task   │                       │     │
│  │  │  Entity  │  │  Entity  │                       │     │
│  │  └──────────┘  └──────────┘                       │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
              ┌──────────────────────────┐
              │      PostgreSQL          │
              │   (Banco de Dados)       │
              └──────────────────────────┘
```

## Camadas da Aplicação

### 1. Camada de Apresentação (Frontend)

#### Componentes Principais

- **Pages**: Login, Register, Dashboard
- **Contexts**: AuthContext, ThemeContext
- **Services**: API service com Axios
- **Routes**: Configuração de rotas públicas e privadas

#### Responsabilidades

- Interface do usuário
- Validação de formulários
- Gerenciamento de estado local
- Comunicação com API
- Roteamento client-side
- Gerenciamento de tema (dark/light)

### 2. Camada de API (Backend)

#### Estrutura por Módulos

##### Auth Module

- **Responsabilidade**: Autenticação e autorização
- **Controllers**: `AuthController`
- **Services**: `AuthService`
- **Estratégias**: JWT Strategy
- **Guards**: JWT Auth Guard

##### Users Module

- **Responsabilidade**: Gerenciamento de usuários
- **Controllers**: `UsersController`
- **Services**: `UsersService`
- **Entities**: `User`
- **DTOs**: CreateUserDto, UpdateUserDto

##### Tasks Module

- **Responsabilidade**: Gerenciamento de tarefas
- **Controllers**: `TasksController`
- **Services**: `TasksService`
- **Entities**: `Task`
- **DTOs**: CreateTaskDto, UpdateTaskDto

### 3. Camada de Dados

#### Banco de Dados PostgreSQL

##### Tabela: users

```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

##### Tabela: tasks

```sql
- id (UUID, PK)
- title (VARCHAR)
- description (TEXT, NULLABLE)
- is_completed (BOOLEAN)
- planned_date (DATE, NULLABLE)
- completion_date (TIMESTAMP, NULLABLE)
- user_id (UUID, FK -> users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Relacionamentos

- User 1:N Tasks (Um usuário pode ter múltiplas tarefas)
- Cascade delete (ao deletar usuário, suas tarefas são deletadas)

## Fluxo de Dados

### Fluxo de Autenticação

```
1. Usuário preenche formulário → Frontend
2. Frontend envia POST /auth/register ou /auth/login → Backend
3. Backend valida dados (Class Validator)
4. Backend verifica credenciais
5. Backend gera JWT token
6. Backend retorna token + dados do usuário
7. Frontend armazena token no localStorage
8. Frontend redireciona para Dashboard
9. Todas as requisições subsequentes incluem o token
```

### Fluxo de CRUD de Tarefas

```
1. Usuário interage com UI → Frontend
2. Frontend envia requisição HTTP com JWT → Backend
3. Backend valida JWT (Guard)
4. Backend valida dados (DTO + Class Validator)
5. Backend executa lógica de negócio (Service)
6. Backend acessa banco de dados (TypeORM)
7. Backend retorna resposta
8. Frontend atualiza UI
```

## Padrões de Projeto Utilizados

### Backend (NestJS)

1. **Dependency Injection (DI)**

   - Injeção de serviços em controladores
   - Injeção de repositórios em serviços

2. **Repository Pattern**

   - TypeORM repositories para acesso a dados
   - Abstração da camada de persistência

3. **DTO (Data Transfer Object)**

   - Validação de entrada
   - Transformação de dados
   - Type safety

4. **Guard Pattern**

   - Proteção de rotas
   - Validação de JWT

5. **Strategy Pattern**

   - Passport JWT Strategy
   - Autenticação modular

6. **Module Pattern**
   - Organização por funcionalidade
   - Encapsulamento de código

### Frontend (React)

1. **Context API**

   - Gerenciamento de estado global
   - AuthContext, ThemeContext

2. **Custom Hooks**

   - useAuth, useTheme
   - Reutilização de lógica

3. **Higher-Order Components**

   - PrivateRoute, PublicRoute
   - Controle de acesso a rotas

4. **Service Layer**
   - API service centralizado
   - Axios interceptors

## Segurança

### Medidas Implementadas

1. **Autenticação JWT**

   - Tokens com expiração configurável
   - Assinatura com chave secreta

2. **Hashing de Senhas**

   - Bcrypt com salt rounds
   - Senhas nunca armazenadas em texto plano

3. **Validação de Dados**

   - Class Validator no backend
   - Validação HTML5 no frontend

4. **Proteção de Rotas**

   - Guards no backend
   - Route guards no frontend

5. **CORS**

   - Configurado para permitir apenas origens confiáveis

6. **SQL Injection Protection**
   - TypeORM com prepared statements

## Escalabilidade

### Considerações para Crescimento

1. **Backend**

   - Arquitetura modular permite adicionar novos módulos
   - Serviços independentes facilitam microserviços
   - TypeORM suporta múltiplos bancos de dados

2. **Frontend**

   - Componentização permite reutilização
   - Code splitting com React lazy loading
   - Context API pode ser migrado para Redux/Zustand

3. **Banco de Dados**
   - Indexes em campos frequentemente consultados
   - Paginação para grandes volumes de dados
   - Possibilidade de implementar cache (Redis)

## Performance

### Otimizações

1. **Backend**

   - Lazy loading de relacionamentos
   - Query optimization com TypeORM
   - Validação eficiente com class-validator

2. **Frontend**
   - Vite para builds rápidos
   - Tree shaking automático
   - CSS purging com Tailwind
   - Axios interceptors para cache

## Monitoramento e Logs

### Backend

- Console logs em desenvolvimento
- Possibilidade de integrar Winston/Pino
- Error tracking com Sentry (futuro)

### Frontend

- Console logs em desenvolvimento
- Error boundaries React (futuro)
- Analytics (futuro)

## Testes

### Estratégia de Testes (Futuro)

1. **Backend**

   - Unit tests: Services
   - Integration tests: Controllers
   - E2E tests: Fluxos completos

2. **Frontend**
   - Unit tests: Components
   - Integration tests: Pages
   - E2E tests: Cypress

## Deploy

### Opções de Deploy

1. **Backend**

   - Heroku
   - AWS (EC2, ECS, Lambda)
   - DigitalOcean
   - Vercel (com serverless)

2. **Frontend**

   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

3. **Banco de Dados**
   - AWS RDS
   - Heroku Postgres
   - DigitalOcean Managed Database
   - Supabase

## Tecnologias e Versões

### Backend

- Node.js 18+
- NestJS 10
- TypeScript 5
- TypeORM 0.3
- PostgreSQL 14+
- JWT & Passport

### Frontend

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- React Router 6
- Axios 1.6

## Manutenção

### Atualizações Regulares

- Dependências de segurança mensalmente
- Framework updates trimestralmente
- Node.js LTS quando disponível

### Backup

- Backup diário do banco de dados
- Versionamento de código (Git)
- Environment variables documentadas

---

**Documento mantido e atualizado pela equipe de desenvolvimento**
