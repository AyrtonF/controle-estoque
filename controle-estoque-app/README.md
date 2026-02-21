
# ⚓ Sistema de Controle de Estoque Náutico

Sistema completo para gerenciamento de estoque baseado em Clean Architecture, Next.js e Node.js.

## 🚀 Tecnologias
- **Frontend**: Next.js 15+, Tailwind CSS v4, Lucide React, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript (Strict), UUID.
- **Persistência**: Arquivos JSON (FileSystem).
- **Arquitetura**: Clean Architecture (Domain, Application, Infrastructure, Presentation).

## 🏗️ Estrutura do Projeto
- `/backend`: API REST com lógica de negócios e persistência.
- `/frontend`: Interface do usuário moderna e responsiva.
- `/database`: Arquivos JSON gerados automaticamente.

## 🎨 Design System
- Baseado na identidade visual do **Náutico**.
- **Vermelho principal**: #C8102E
- **Vermelho escuro**: #8A0F1E
- **Branco**: #FFFFFF
- **Cinza claro**: #F4F4F4
- **Cinza neutro**: #E5E5E5
- **Preto texto**: #111111

## ⚙️ Como Executar

1. **Pré-requisitos**: Node.js v18+.
2. **Instalar Dependências**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Executar em modo Desenvolvimento**:
   No diretório raiz (`controle-estoque-app`):
   ```bash
   npm run dev
   ```
   Ou inicie separadamente:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:3000`

## 📊 Funcionalidades
- Dashboard com indicadores de desempenho.
- Cadastro e edição de produtos com regras de estoque mínimo.
- Gestão hierárquica de categorias.
- Sistema de Auditoria completo (Log de ações).
- Relatórios de movimentações e baixo estoque.
- Soft delete de produtos.

## 🛡️ Regras de Negócio
- Não permite estoque negativo.
- Alerta automático de estoque baixo (LOW / MEDIUM / GOOD).
- Toda movimentação gera log de auditoria automático.
## 🔐 Variáveis de Ambiente

### Backend (`.env`)
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```
Ver [backend/ENV.md](backend/ENV.md) para documentação completa.

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```
Ver [frontend/ENV.md](frontend/ENV.md) para documentação completa.

## 🚀 Deploy em Produção

### Opção Recomendada
- **Frontend**: Vercel (grátis, otimizado para Next.js)
- **Backend**: Railway (mantém arquivos JSON, grátis durante trial)

### Guias Detalhados
- 📘 **[DEPLOY.md](DEPLOY.md)** - Guia completo com todas as opções
- 🚂 **[backend/RAILWAY.md](backend/RAILWAY.md)** - Configuração Railway
- ▲ **[frontend/VERCEL.md](frontend/VERCEL.md)** - Configuração Vercel

### Resumo Rápido

1. **Deploy Backend**:
   ```bash
   # Railway ou Render
   Root Directory: controle-estoque-app/backend
   Build: npm install && npm run build
   Start: npm start
   ```

2. **Deploy Frontend**:
   ```bash
   # Vercel
   Root Directory: controle-estoque-app/frontend
   Framework: Next.js (auto-detectado)
   ```

3. **Configurar variáveis**:
   - Backend: `CORS_ORIGIN=https://seu-frontend.vercel.app`
   - Frontend: `NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api`

**⚠️ Importante**: Como o projeto usa arquivos JSON, recomenda-se Railway/Render para o backend. Vercel Serverless não persiste arquivos entre requisições.