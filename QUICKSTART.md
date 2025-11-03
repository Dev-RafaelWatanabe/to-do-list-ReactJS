# 🚀 Guia Rápido - Iniciar o Projeto

## Método 1: Docker Compose (Recomendado) 🐳

### Passo 1: Parar containers existentes (se houver)

```powershell
# Parar o postgres que você já tinha rodando
docker stop postgres-todolist
docker rm postgres-todolist
```

### Passo 2: Iniciar Backend + PostgreSQL com Docker

```powershell
cd backend
docker-compose -f docker-compose.dev.yml up --build
```

**Aguarde ver as mensagens:**

```
postgres    | database system is ready to accept connections
backend     | 🚀 Aplicação rodando na porta 3000
backend     | 📚 Documentação Swagger: http://localhost:3000/api
```

### Passo 3: Iniciar o Frontend (em outro terminal)

```powershell
cd frontend
npm run dev
```

### Passo 4: Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Swagger/API**: http://localhost:3000/api
- **Backend API**: http://localhost:3000

---

## Método 2: Rodar Localmente (Sem Docker) 💻

### Passo 1: PostgreSQL no Docker (apenas o banco)

```powershell
docker run --name todolist-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=todolist `
  -p 5432:5432 `
  -d postgres:14-alpine
```

### Passo 2: Backend Local

```powershell
cd backend
npm run start:dev
```

### Passo 3: Frontend Local

```powershell
cd frontend
npm run dev
```

---

## 🔍 Verificar se está Funcionando

### 1. Verificar Backend

```powershell
curl http://localhost:3000/auth/register
```

Deve retornar erro de validação (isso é bom, significa que está funcionando!)

### 2. Acessar Swagger

Abra: http://localhost:3000/api

Você verá a documentação interativa da API!

### 3. Criar uma Conta no Frontend

Acesse: http://localhost:5173/register

---

## 📝 Comandos Úteis

### Docker

```powershell
# Ver logs do backend
docker logs -f todolist-backend-dev

# Ver logs do postgres
docker logs -f todolist-postgres-dev

# Parar tudo
docker-compose -f docker-compose.dev.yml down

# Parar e remover volumes (apaga dados)
docker-compose -f docker-compose.dev.yml down -v

# Ver containers rodando
docker ps
```

### Desenvolvimento

```powershell
# Backend em modo dev (com hot-reload)
cd backend
npm run start:dev

# Frontend em modo dev
cd frontend
npm run dev

# Build do backend
cd backend
npm run build

# Build do frontend
cd frontend
npm run build
```

---

## 🎯 Testar a API com Swagger

1. Acesse: http://localhost:3000/api
2. Clique em **POST /auth/register**
3. Clique em **"Try it out"**
4. Preencha o JSON:

```json
{
  "email": "teste@teste.com",
  "password": "123456"
}
```

5. Clique em **Execute**
6. Copie o `access_token` da resposta
7. Clique no botão **Authorize** (cadeado no topo)
8. Cole o token e clique em **Authorize**
9. Agora você pode testar os endpoints protegidos de tasks!

---

## 🐛 Problemas Comuns

### Erro: "Port 3000 already in use"

```powershell
# Ver o que está usando a porta
netstat -ano | findstr :3000

# Parar o container do backend
docker stop todolist-backend-dev
docker rm todolist-backend-dev
```

### Erro: "Port 5432 already in use"

```powershell
# Parar o postgres anterior
docker stop postgres-todolist
docker rm postgres-todolist
```

### Erro: "Cannot find module '@nestjs/swagger'"

```powershell
cd backend
npm install
```

### Hot-reload não funciona no Docker

Isso é normal. O hot-reload funciona, mas pode levar alguns segundos para sincronizar.

---

## ✅ Checklist de Funcionamento

- [ ] PostgreSQL rodando na porta 5432
- [ ] Backend rodando na porta 3000
- [ ] Frontend rodando na porta 5173
- [ ] Swagger acessível em http://localhost:3000/api
- [ ] Consegue criar conta no frontend
- [ ] Consegue fazer login
- [ ] Dashboard carrega corretamente

---

## 🎉 Pronto!

Seu ambiente está configurado! Qualquer dúvida, consulte:

- `DOCKER.md` - Documentação completa do Docker
- `POSTGRES_SETUP.md` - Setup do PostgreSQL
- `README.md` - Documentação geral do projeto

**Boa codificação! 🚀**
