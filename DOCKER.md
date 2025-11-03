# 🐳 Guia Docker - To-Do List

Este guia mostra como rodar o projeto usando Docker.

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (já vem com Docker Desktop)

## 🚀 Opções de Execução

### Opção 1: Desenvolvimento (Recomendado para desenvolvimento local)

Esta opção roda o backend em modo desenvolvimento com **hot-reload** (recarrega automaticamente quando você edita o código).

```powershell
# Na raiz do projeto
cd backend
docker-compose -f docker-compose.dev.yml up --build
```

O que isso faz:

- ✅ Cria container PostgreSQL na porta 5432
- ✅ Cria container Backend na porta 3000
- ✅ Hot-reload ativado (suas alterações são detectadas automaticamente)
- ✅ Volumes compartilhados (seu código local sincroniza com o container)

**Para parar:**

```powershell
# Pressione Ctrl+C e depois:
docker-compose -f docker-compose.dev.yml down
```

### Opção 2: Produção (Build otimizado)

Esta opção cria uma imagem otimizada para produção.

```powershell
# Na raiz do projeto
docker-compose up --build
```

O que isso faz:

- ✅ Cria container PostgreSQL
- ✅ Cria container Backend otimizado (menor e mais rápido)
- ✅ Modo produção (sem hot-reload)

**Para parar:**

```powershell
# Pressione Ctrl+C e depois:
docker-compose down
```

### Opção 3: Apenas PostgreSQL (Desenvolvimento local do backend)

Se você quer rodar apenas o PostgreSQL no Docker e o backend localmente:

```powershell
# Rodar apenas o PostgreSQL
docker run --name todolist-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=todolist `
  -p 5432:5432 `
  -d postgres:14-alpine

# Depois rode o backend localmente
cd backend
npm run start:dev
```

## 📦 Comandos Úteis

### Ver containers rodando

```powershell
docker ps
```

### Ver logs do backend

```powershell
docker logs -f todolist-backend-dev
```

### Ver logs do PostgreSQL

```powershell
docker logs -f todolist-postgres-dev
```

### Parar todos os containers

```powershell
docker-compose -f docker-compose.dev.yml down
```

### Parar e remover volumes (apaga dados do banco)

```powershell
docker-compose -f docker-compose.dev.yml down -v
```

### Reconstruir containers

```powershell
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

### Acessar shell do container backend

```powershell
docker exec -it todolist-backend-dev sh
```

### Acessar PostgreSQL do container

```powershell
docker exec -it todolist-postgres-dev psql -U postgres -d todolist
```

## 🔧 Estrutura dos Arquivos Docker

```
to-do-list/
├── docker-compose.yml              # Produção (backend + postgres)
├── backend/
│   ├── Dockerfile                  # Build otimizado para produção
│   ├── Dockerfile.dev              # Build para desenvolvimento
│   ├── docker-compose.dev.yml      # Dev (backend + postgres + hot-reload)
│   └── .dockerignore               # Arquivos ignorados no build
```

## 🌐 Acessar a Aplicação

Depois de iniciar os containers:

1. **Backend API:** http://localhost:3000
2. **Frontend:** Continue rodando localmente com `npm run dev` na pasta `frontend`

## 🐛 Solução de Problemas

### Erro: "port is already allocated"

**Causa:** Outro container ou processo está usando a porta.

**Solução:**

```powershell
# Ver o que está usando a porta 3000
netstat -ano | findstr :3000

# Ou pare o container existente
docker stop todolist-backend-dev
docker rm todolist-backend-dev
```

### Erro: "Cannot connect to database"

**Causa:** PostgreSQL não está pronto ainda.

**Solução:** Aguarde alguns segundos. O backend tem um healthcheck que espera o PostgreSQL ficar pronto.

### Container não atualiza código (dev mode)

**Solução:**

```powershell
# Reconstrua o container
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

### Erro: "no such file or directory"

**Solução:** Certifique-se de estar na pasta correta:

```powershell
# Para modo dev
cd backend
docker-compose -f docker-compose.dev.yml up

# Para modo produção
cd "c:\trabalho faculdade\to-do list"
docker-compose up
```

## 📊 Monitoramento

### Ver uso de recursos

```powershell
docker stats
```

### Ver volumes criados

```powershell
docker volume ls
```

### Inspecionar container

```powershell
docker inspect todolist-backend-dev
```

## 🗑️ Limpeza

### Remover containers parados

```powershell
docker container prune
```

### Remover imagens não usadas

```powershell
docker image prune
```

### Limpeza completa (cuidado!)

```powershell
docker system prune -a --volumes
```

## 🎯 Recomendações

### Para Desenvolvimento:

- Use `docker-compose.dev.yml` (tem hot-reload)
- Mantenha os logs visíveis
- Use volumes para sincronizar código

### Para Produção:

- Use `docker-compose.yml` (otimizado)
- Configure variáveis de ambiente seguras
- Use volumes nomeados para dados persistentes

## 📝 Variáveis de Ambiente

As variáveis são definidas diretamente no `docker-compose.yml`. Para produção, considere usar um arquivo `.env`:

```env
# .env (criar na raiz do projeto)
DB_PASSWORD=senha_super_segura
JWT_SECRET=chave_jwt_super_segura_longa
```

E no `docker-compose.yml`:

```yaml
environment:
  DB_PASSWORD: ${DB_PASSWORD}
  JWT_SECRET: ${JWT_SECRET}
```

---

**🎉 Pronto! Seu ambiente Docker está configurado!**

Para começar, use:

```powershell
cd backend
docker-compose -f docker-compose.dev.yml up
```
