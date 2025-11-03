# Backend - To-Do List API

API RESTful desenvolvida com NestJS para gerenciamento de tarefas (To-Do List) com autenticação JWT.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hashing de senhas
- **Class Validator** - Validação de dados

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (v14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

3. Configure o banco de dados PostgreSQL:

```sql
CREATE DATABASE todolist;
```

## 🎯 Executando o projeto

### Modo desenvolvimento

```bash
npm run start:dev
```

### Modo produção

```bash
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação
│   ├── dto/          # Data Transfer Objects
│   ├── guards/       # Guards de autenticação
│   ├── strategies/   # Estratégias Passport
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/            # Módulo de usuários
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── tasks/            # Módulo de tarefas
│   ├── dto/
│   ├── entities/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── app.module.ts     # Módulo principal
└── main.ts           # Arquivo de entrada
```

## 🔑 Endpoints da API

### Autenticação

- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login de usuário

### Tarefas (Requer autenticação)

- `GET /tasks` - Lista todas as tarefas do usuário
- `GET /tasks/:id` - Busca uma tarefa específica
- `GET /tasks/metrics` - Busca métricas das tarefas
- `POST /tasks` - Cria uma nova tarefa
- `PATCH /tasks/:id` - Atualiza uma tarefa
- `DELETE /tasks/:id` - Remove uma tarefa

### Usuários (Requer autenticação)

- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca um usuário específico
- `PATCH /users/:id` - Atualiza um usuário
- `DELETE /users/:id` - Remove um usuário

## 📝 Exemplos de Requisição

### Registro

```json
POST /auth/register
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Login

```json
POST /auth/login
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Criar Tarefa

```json
POST /tasks
Authorization: Bearer {token}
{
  "title": "Minha tarefa",
  "description": "Descrição da tarefa",
  "plannedDate": "2025-11-10"
}
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📄 Licença

Este projeto está sob a licença MIT.
