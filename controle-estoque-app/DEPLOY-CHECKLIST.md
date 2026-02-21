# ✅ Checklist de Deploy

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-Deploy

### Código
- [ ] Todo o código foi testado localmente
- [ ] Não há erros no console do navegador
- [ ] Backend e frontend se comunicam corretamente
- [ ] Arquivos `.gitignore` configurados
- [ ] Arquivos `.env` NÃO estão no Git

### Git
- [ ] Repositório criado no GitHub/GitLab
- [ ] Todo o código foi commitado
- [ ] Push para o repositório remoto completo

---

## 🚂 Deploy Backend (Railway)

- [ ] Conta criada no [railway.app](https://railway.app)
- [ ] Projeto criado a partir do repositório
- [ ] **Root Directory** configurado: `controle-estoque-app/backend`
- [ ] Variáveis de ambiente adicionadas:
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `CORS_ORIGIN=` (deixe em branco por enquanto, voltaremos aqui)
- [ ] Deploy iniciado e concluído com sucesso ✅
- [ ] URL do backend copiada (ex: `https://seu-app.up.railway.app`)

**URL do Backend**: _________________________

---

## ▲ Deploy Frontend (Vercel)

- [ ] Conta criada no [vercel.com](https://vercel.com)
- [ ] Projeto criado a partir do repositório
- [ ] **Root Directory** configurado: `controle-estoque-app/frontend`
- [ ] Framework Preset: Next.js (auto-detectado ✅)
- [ ] Variável de ambiente adicionada:
  - [ ] `NEXT_PUBLIC_API_URL=[URL do backend]/api`
- [ ] Deploy iniciado e concluído com sucesso ✅
- [ ] URL do frontend copiada (ex: `https://seu-app.vercel.app`)

**URL do Frontend**: _________________________

---

## 🔄 Configuração Final de CORS

Agora que você tem a URL do frontend, volte ao Railway:

- [ ] No Railway, vá em: **Variables** → Editar `CORS_ORIGIN`
- [ ] Cole a URL do frontend Vercel (ex: `https://seu-app.vercel.app`)
- [ ] **NÃO adicione barra no final** ❌ `https://app.vercel.app/`
- [ ] **CERTIFIQUE-SE de incluir https://** ✅ `https://app.vercel.app`
- [ ] Salve e aguarde o redeploy automático do Railway

---

## ✅ Testes Pós-Deploy

### Teste 1: Backend está no ar?
- [ ] Acesse `[URL do backend]/api` no navegador
- [ ] Deve retornar algo (mesmo que 404 ou lista vazia está OK)

### Teste 2: Frontend carrega?
- [ ] Acesse a URL do frontend no navegador
- [ ] A página deve carregar sem erros

### Teste 3: CORS funciona?
- [ ] Abra DevTools (F12) no frontend
- [ ] Vá até a aba **Console**
- [ ] Verifique se NÃO há erros de CORS
- [ ] Se houver erro de CORS, revise o `CORS_ORIGIN` no backend

### Teste 4: Operações CRUD
Teste as seguintes operações no frontend:

- [ ] **Dashboard**: Estatísticas aparecem corretamente
- [ ] **Categorias**:
  - [ ] Criar nova categoria
  - [ ] Editar categoria existente
  - [ ] Deletar categoria
- [ ] **Produtos**:
  - [ ] Criar novo produto
  - [ ] Editar produto existente
  - [ ] Adicionar estoque (entrada)
  - [ ] Remover estoque (saída)
  - [ ] Deletar produto
- [ ] **Auditoria**: Logs aparecem corretamente
- [ ] **Relatórios**: Dados aparecem corretamente

---

## 🐛 Troubleshooting

### ❌ Erro: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa**: Backend não está permitindo requisições do frontend

**Solução**:
1. Vá no Railway → Variables
2. Verifique se `CORS_ORIGIN` está correto
3. Deve ser exatamente a URL do Vercel (com https://, sem barra final)
4. Aguarde o redeploy

### ❌ Erro: "Failed to fetch" ou "Network Error"

**Causa**: URL da API está incorreta no frontend

**Solução**:
1. Vá no Vercel → Settings → Environment Variables
2. Verifique se `NEXT_PUBLIC_API_URL` está correto
3. Deve terminar com `/api`
4. Exemplo: `https://seu-app.railway.app/api`
5. Faça redeploy do frontend

### ❌ Dados não persistem (aparecem e somem)

**Causa**: Backend está na Vercel (Serverless)

**Solução**:
- Migre para Railway ou Render (mantém arquivos)
- OU migre para usar um banco de dados real (PostgreSQL/MongoDB)

### ❌ Build falhou

**Backend**:
- Verifique se o script `build` existe no `package.json`
- Verifique se não há erros de TypeScript

**Frontend**:
- Verifique se todas as dependências estão no `package.json`
- Verifique se não há erros de build localmente (`npm run build`)

---

## 🎉 Deploy Concluído!

Se todos os testes passaram, parabéns! Seu sistema está no ar! 🚀

**URLs para compartilhar**:
- Frontend: _________________________
- API: _________________________

**Próximos passos**:
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar monitoramento (Sentry, LogRocket, etc)
- [ ] Configurar backup dos dados JSON (se usando Railway/Render)
- [ ] Implementar autenticação (se necessário)
- [ ] Migrar para banco de dados real (PostgreSQL/MongoDB)

---

## 📞 Suporte

Problemas? Consulte:
- [DEPLOY.md](DEPLOY.md) - Guia completo
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
