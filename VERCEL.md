# Vercel Deploy Configuration - Frontend

## Configurações no Dashboard da Vercel

### Framework Preset
**Next.js** (detectado automaticamente ✅)

### Root Directory
⚠️ **IMPORTANTE**: Configure manualmente para:
```
controle-estoque-app/frontend
```

### Build Settings
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

### Environment Variables

Adicione no dashboard (Settings → Environment Variables):

#### Development & Preview
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Production
```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api
```

⚠️ Substitua `seu-backend.railway.app` pela URL real do seu backend

---

## Ordem de Deploy

1. **Primeiro**: Faça deploy do backend (Railway/Render)
2. **Copie a URL** gerada pelo backend
3. **Depois**: Configure e faça deploy do frontend na Vercel
4. **Adicione** a variável `NEXT_PUBLIC_API_URL` com a URL do backend
5. **Redeploy** se necessário

---

## Verificação Pós-Deploy

1. Acesse a URL do frontend gerada pela Vercel
2. Abra o DevTools (F12) → Console
3. Verifique se não há erros de CORS
4. Teste criar/editar/deletar produtos e categorias

---

## Domínio Customizado (Opcional)

1. Vá em Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções da Vercel
4. Atualize `CORS_ORIGIN` no backend com o novo domínio
