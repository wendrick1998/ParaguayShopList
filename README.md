# SEC+ 🛒

**Sistema de Gestão de Estoque e Vendas**

Sistema completo para gerenciar estoque, vendas, caixa e produtos de lojas e comércios.

---

## 📁 Estrutura do Projeto

```
sec-plus/
├── frontend/          # React + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── pages/     # Páginas da aplicação
│   │   ├── components/# Componentes reutilizáveis
│   │   ├── store/     # Estado global (Zustand)
│   │   └── utils/     # Funções utilitárias
│   └── package.json
│
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/    # Rotas da API
│   │   ├── middleware/# Middlewares (auth, validation)
│   │   └── prisma/    # Schema do banco
│   └── package.json
│
└── README.md
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js v18 ou superior
- PostgreSQL instalado e rodando
- npm ou yarn

### 1️⃣ Clonar o Repositório

```bash
git clone <seu-repositorio>
cd sec-plus
```

### 2️⃣ Configurar o Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações do PostgreSQL

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em: `http://localhost:3000`

### 3️⃣ Configurar o Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env se necessário

# Iniciar aplicação
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

---

## 🗄️ Banco de Dados

### Schema PostgreSQL

O projeto utiliza **Prisma ORM** com as seguintes tabelas:

- **usuarios** - Usuários do sistema
- **lojas** - Lojas/estabelecimentos
- **produtos** - Catálogo de produtos
- **estoques** - Controle de estoque por produto/loja
- **vendas** - Registro de vendas
- **itens_venda** - Itens de cada venda
- **movimentacoes_estoque** - Histórico de movimentações
- **caixas** - Controle de caixa (abertura/fechamento)

### Comandos Úteis do Prisma

```bash
# Visualizar banco de dados no navegador
npm run prisma:studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset
```

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação.

### Endpoints de Auth

```
POST /api/auth/login      # Fazer login
POST /api/auth/register   # Criar nova conta
```

O token deve ser enviado no header `Authorization: Bearer <token>`

---

## 📚 API Endpoints

### Produtos

```
GET    /api/produtos           # Listar produtos
GET    /api/produtos/:id       # Buscar produto
POST   /api/produtos           # Criar produto
PUT    /api/produtos/:id       # Atualizar produto
DELETE /api/produtos/:id       # Deletar produto
```

### Estoque

```
GET    /api/estoque                 # Listar estoque
POST   /api/estoque/movimentacao    # Adicionar movimentação
GET    /api/estoque/movimentacoes   # Listar movimentações
```

### Vendas

```
GET    /api/vendas       # Listar vendas
POST   /api/vendas       # Criar venda
```

### Caixa

```
GET    /api/caixa           # Listar caixas
GET    /api/caixa/aberto    # Buscar caixa aberto
POST   /api/caixa/abrir     # Abrir caixa
POST   /api/caixa/fechar/:id # Fechar caixa
```

---

## 🛠️ Stack Tecnológico

### Frontend

- ⚛️ React 18
- 📘 TypeScript
- 🎨 TailwindCSS
- 🚦 React Router v6
- 🐻 Zustand (State Management)
- 📡 Axios
- ⚡ Vite

### Backend

- 🟢 Node.js
- 🚂 Express
- 📘 TypeScript
- 🗄️ PostgreSQL
- 🔷 Prisma ORM
- 🔐 JWT + bcryptjs
- ✅ Zod (Validation)

---

## 📝 Próximos Passos

- [ ] Instalar dependências: `npm install` em ambas as pastas
- [ ] Configurar banco PostgreSQL
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Rodar migrations: `npm run prisma:migrate`
- [ ] Criar primeira loja e usuário no banco
- [ ] Testar login e funcionalidades

---

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ para facilitar a gestão de pequenos comércios**
