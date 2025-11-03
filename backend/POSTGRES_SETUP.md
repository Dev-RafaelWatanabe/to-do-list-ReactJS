# 🐘 Configuração do PostgreSQL para Windows

## Opção 1: Usar PostgreSQL Instalado Localmente (Recomendado para Desenvolvimento)

### Passo 1: Verificar se o PostgreSQL está instalado

Abra o PowerShell e execute:

```powershell
psql --version
```

Se aparecer a versão (ex: `psql (PostgreSQL) 14.x`), o PostgreSQL já está instalado. Pule para o **Passo 3**.

### Passo 2: Instalar o PostgreSQL (se necessário)

1. **Download:**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe o instalador do PostgreSQL (versão 14 ou superior)

2. **Instalação:**
   - Execute o instalador
   - **IMPORTANTE:** Anote a senha que você criar para o usuário `postgres`
   - Porta padrão: `5432` (deixe como está)
   - Aceite as configurações padrão

3. **Verificar instalação:**
   - O instalador criará um atalho "SQL Shell (psql)"
   - Também instalará o pgAdmin (interface gráfica)

### Passo 3: Criar o Banco de Dados

#### Opção A: Usando SQL Shell (psql)

1. Abra o **SQL Shell (psql)** no menu iniciar
2. Pressione ENTER para aceitar as opções padrão:

   ```
   Server [localhost]:          (pressione ENTER)
   Database [postgres]:         (pressione ENTER)
   Port [5432]:                 (pressione ENTER)
   Username [postgres]:         (pressione ENTER)
   Password for user postgres:  (digite sua senha)
   ```

3. Execute o comando para criar o banco:

   ```sql
   CREATE DATABASE todolist;
   ```

4. Verifique se foi criado:

   ```sql
   \l
   ```

   Você deve ver `todolist` na lista de bancos.

5. Saia do psql:
   ```sql
   \q
   ```

#### Opção B: Usando pgAdmin (Interface Gráfica)

1. Abra o **pgAdmin 4** no menu iniciar
2. Digite a senha master do pgAdmin (se pedido)
3. Expanda **Servers** → **PostgreSQL 14** (ou sua versão)
4. Digite a senha do usuário `postgres`
5. Clique com botão direito em **Databases** → **Create** → **Database...**
6. Em "Database", digite: `todolist`
7. Clique em **Save**

### Passo 4: Configurar o arquivo .env

1. Na pasta `backend`, copie o arquivo de exemplo:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Abra o arquivo `.env` e edite com suas credenciais:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=SUA_SENHA_AQUI
   DB_DATABASE=todolist

   # JWT Configuration
   JWT_SECRET=minha_chave_secreta_super_segura_123
   JWT_EXPIRATION=7d

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

   **Substitua `SUA_SENHA_AQUI`** pela senha que você definiu durante a instalação do PostgreSQL.

### Passo 5: Testar a Conexão

Execute o backend:

```powershell
npm run start:dev
```

Se tudo estiver correto, você verá:

```
🚀 Aplicação rodando na porta 3000
```

E o TypeORM criará automaticamente as tabelas `users` e `tasks` no banco de dados.

---

## Opção 2: Usar Docker (Alternativa)

Se preferir usar Docker ao invés de instalar o PostgreSQL:

### Pré-requisitos

- Docker Desktop instalado e rodando

### Comandos

1. **Criar e iniciar container PostgreSQL:**

```powershell
docker run --name postgres-todolist `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=todolist `
  -p 5432:5432 `
  -d postgres:14
```

2. **Configurar o .env:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=todolist
```

3. **Comandos úteis:**

```powershell
# Ver containers rodando
docker ps

# Parar o container
docker stop postgres-todolist

# Iniciar o container novamente
docker start postgres-todolist

# Ver logs do container
docker logs postgres-todolist

# Remover o container (cuidado: apaga os dados!)
docker rm -f postgres-todolist
```

---

## 🔍 Solução de Problemas

### Erro: "password authentication failed"

**Causa:** Senha incorreta no arquivo `.env`

**Solução:**

1. Verifique a senha que você definiu durante a instalação
2. Se esqueceu, você pode redefinir:
   - Abra o pgAdmin
   - Clique com botão direito em **PostgreSQL** → **Properties**
   - Vá em **Connection** e redefina a senha

### Erro: "could not connect to server"

**Causa:** PostgreSQL não está rodando

**Solução no Windows:**

1. Pressione `Win + R`
2. Digite `services.msc` e pressione ENTER
3. Procure por **postgresql-x64-14** (ou sua versão)
4. Clique com botão direito → **Iniciar**
5. Configure para iniciar automaticamente: **Propriedades** → **Tipo de inicialização** → **Automático**

### Erro: "database todolist does not exist"

**Causa:** Banco não foi criado

**Solução:**

- Siga o **Passo 3** acima para criar o banco

### Erro: "port 5432 already in use"

**Causa:** Outro PostgreSQL está rodando na porta 5432

**Solução:**

1. Pare outros processos PostgreSQL
2. Ou altere a porta no `.env` e na instalação do PostgreSQL

---

## ✅ Verificação Final

Para confirmar que tudo está funcionando:

1. **Backend deve iniciar sem erros:**

   ```powershell
   npm run start:dev
   ```

2. **Verificar tabelas criadas:**
   - Abra o pgAdmin
   - Navegue até: **PostgreSQL** → **Databases** → **todolist** → **Schemas** → **public** → **Tables**
   - Você deve ver as tabelas: `users` e `tasks`

3. **Testar o endpoint de registro:**
   - Use o Postman, Insomnia, ou curl:
   ```powershell
   curl -X POST http://localhost:3000/auth/register `
     -H "Content-Type: application/json" `
     -d '{"email":"teste@teste.com","password":"123456"}'
   ```

Se você receber uma resposta com `access_token`, está tudo funcionando! 🎉

---

## 📚 Recursos Úteis

- **pgAdmin:** Interface gráfica para gerenciar o PostgreSQL
- **SQL Shell (psql):** Linha de comando do PostgreSQL
- **Documentação PostgreSQL:** https://www.postgresql.org/docs/
- **TypeORM Documentação:** https://typeorm.io/

---

**Dica:** Sempre mantenha o PostgreSQL rodando quando estiver desenvolvendo o backend! 🚀
