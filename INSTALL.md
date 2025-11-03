# 🚀 Guia de Instalação e Configuração

Este guia fornece instruções passo a passo para configurar e executar o projeto To-Do List.

## 📋 Requisitos do Sistema

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **PostgreSQL** versão 14 ou superior ([Download](https://www.postgresql.org/download/))
- **npm** (vem com Node.js) ou **yarn**
- Um editor de código (recomendado: VS Code)

## 🗄️ Passo 1: Configurar o Banco de Dados PostgreSQL

### Windows (usando pgAdmin ou linha de comando)

1. Abra o pgAdmin ou o terminal do PostgreSQL
2. Conecte-se ao servidor PostgreSQL
3. Execute o seguinte comando SQL:

```sql
CREATE DATABASE todolist;
```

### Linux/Mac (usando terminal)

```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Criar o banco de dados
CREATE DATABASE todolist;

# Sair
\q
```

## 🔧 Passo 2: Configurar o Backend

1. **Navegue até a pasta do backend:**

```bash
cd backend
```

2. **Instale as dependências:**

```bash
npm install
```

Isso pode levar alguns minutos. O npm irá baixar todas as dependências necessárias.

3. **Configure as variáveis de ambiente:**

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

4. **Edite o arquivo `.env`** com suas configurações do PostgreSQL:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=todolist

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt_aqui
JWT_EXPIRATION=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Importante:**

- Substitua `sua_senha_aqui` pela senha do seu PostgreSQL
- Substitua `sua_chave_secreta_jwt_aqui` por uma string aleatória segura

5. **Inicie o servidor backend:**

```bash
npm run start:dev
```

Você deverá ver a mensagem:

```
🚀 Aplicação rodando na porta 3000
```

✅ **Backend configurado com sucesso!** Deixe este terminal aberto.

## 🎨 Passo 3: Configurar o Frontend

1. **Abra um NOVO terminal** e navegue até a pasta do frontend:

```bash
cd frontend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente (opcional):**

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` deve conter:

```env
VITE_API_URL=http://localhost:3000
```

**Nota:** Se você não alterar a porta do backend (3000), não precisa modificar este arquivo.

4. **Inicie o servidor frontend:**

```bash
npm run dev
```

Você deverá ver algo como:

```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend configurado com sucesso!**

## 🌐 Passo 4: Acessar a Aplicação

1. Abra seu navegador
2. Acesse: `http://localhost:5173`
3. Você verá a tela de login

## 👤 Passo 5: Criar sua Primeira Conta

1. Na tela de login, clique em "criar uma nova conta"
2. Preencha:
   - E-mail: seu-email@exemplo.com
   - Senha: mínimo 6 caracteres
3. Clique em "Criar conta"
4. Você será redirecionado automaticamente para o Dashboard

## ✅ Passo 6: Testar a Aplicação

No Dashboard, você pode:

1. **Criar uma tarefa:**

   - Clique em "+ Nova Tarefa"
   - Preencha o título (obrigatório)
   - Adicione descrição e data planejada (opcional)
   - Clique em "Salvar"

2. **Marcar como concluída:**

   - Clique na checkbox ao lado da tarefa

3. **Editar uma tarefa:**

   - Clique no botão "Editar"
   - Modifique os campos desejados
   - Clique em "Salvar"

4. **Excluir uma tarefa:**

   - Clique no botão "Excluir"
   - Confirme a exclusão

5. **Ver métricas:**

   - As métricas são atualizadas automaticamente
   - Total de tarefas, taxa de conclusão, e tarefas no prazo

6. **Alternar tema:**
   - Clique no ícone 🌙 (modo escuro) ou ☀️ (modo claro)
   - A preferência é salva automaticamente

## 🔧 Comandos Úteis

### Backend

```bash
# Modo desenvolvimento (com hot reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod

# Executar testes
npm run test

# Ver lint
npm run lint
```

### Frontend

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Executar lint
npm run lint
```

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"

**Solução:**

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env` do backend
- Certifique-se de que o banco `todolist` foi criado

### Erro: "Port 3000 already in use"

**Solução:**

- Outra aplicação está usando a porta 3000
- Mate o processo:
  - Windows: `netstat -ano | findstr :3000` e depois `taskkill /PID [número] /F`
  - Linux/Mac: `lsof -ti:3000 | xargs kill -9`
- Ou altere a porta no arquivo `.env` do backend

### Erro: "Port 5173 already in use"

**Solução:**

- Outra aplicação está usando a porta 5173
- Mate o processo ou o Vite sugerirá automaticamente outra porta

### Erro de módulos não encontrados (após clonar)

**Solução:**

```bash
# Delete node_modules e reinstale
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

### Backend não sincroniza tabelas automaticamente

**Solução:**

- Certifique-se de que `synchronize: true` está no `app.module.ts`
- Em produção, use migrations ao invés de synchronize

### Erro de CORS no frontend

**Solução:**

- Verifique se o backend está rodando na porta 3000
- Confirme a configuração de CORS no `main.ts` do backend
- Verifique o `VITE_API_URL` no `.env` do frontend

## 📚 Próximos Passos

Agora que você tem o projeto rodando:

1. Explore o código fonte
2. Customize os estilos no Tailwind CSS
3. Adicione novas funcionalidades
4. Configure Docker para deploy
5. Implemente testes automatizados

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs no terminal do backend e frontend
2. Consulte a documentação do NestJS e React
3. Abra uma issue no repositório do projeto

---

**Parabéns! 🎉 Seu sistema To-Do List está pronto para uso!**
