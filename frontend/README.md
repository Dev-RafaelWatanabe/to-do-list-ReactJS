# Frontend - To-Do List

Interface web desenvolvida com React + TypeScript + Vite para o sistema de gerenciamento de tarefas (To-Do List).

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para UI
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento client-side
- **Axios** - Cliente HTTP

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
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

# Edite o arquivo .env com suas configurações (opcional)
# Por padrão, a API deve estar em http://localhost:3000
```

## 🎯 Executando o projeto

### Modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Preview do build de produção

```bash
npm run preview
```

## 📚 Estrutura do Projeto

```
src/
├── contexts/         # Contextos do React
│   ├── AuthContext.tsx    # Contexto de autenticação
│   └── ThemeContext.tsx   # Contexto de tema (dark/light)
├── pages/           # Páginas da aplicação
│   ├── Login.tsx           # Página de login
│   ├── Register.tsx        # Página de registro
│   └── Dashboard.tsx       # Dashboard principal
├── services/        # Serviços e API
│   └── api.ts              # Cliente Axios e endpoints
├── routes/          # Configuração de rotas
│   └── index.tsx           # Rotas da aplicação
├── App.tsx          # Componente principal
├── main.tsx         # Arquivo de entrada
└── index.css        # Estilos globais (Tailwind)
```

## 🎨 Funcionalidades

### Autenticação

- ✅ Login de usuário
- ✅ Registro de novo usuário
- ✅ Proteção de rotas privadas
- ✅ Logout

### Gerenciamento de Tarefas

- ✅ Listar todas as tarefas
- ✅ Criar nova tarefa
- ✅ Editar tarefa existente
- ✅ Excluir tarefa
- ✅ Marcar/desmarcar como concluída
- ✅ Adicionar data planejada

### Métricas

- ✅ Total de tarefas
- ✅ Taxa de conclusão
- ✅ Taxa de conclusão no prazo

### Tema

- ✅ Modo claro (Light Mode)
- ✅ Modo escuro (Dark Mode)
- ✅ Persistência da preferência

## 🌐 Localização

A interface está completamente em **Português do Brasil (pt-BR)**.

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação. O token é armazenado no `localStorage` e enviado automaticamente em todas as requisições através de interceptors do Axios.

## 🎭 Temas

O sistema possui suporte para temas claro e escuro. A preferência do usuário é salva no `localStorage` e aplicada automaticamente em visitas futuras.

## 📱 Responsividade

A interface é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- 📱 Mobile (smartphones)
- 📱 Tablet
- 💻 Desktop

## 🧪 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📄 Licença

Este projeto está sob a licença MIT.
