# Variáveis de Ambiente - Frontend

## Configuração de Desenvolvimento

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

## Variáveis Disponíveis

### NEXT_PUBLIC_API_URL
- **Descrição**: URL base da API backend
- **Desenvolvimento**: `http://localhost:3001/api`
- **Produção**: URL do seu servidor backend + `/api`
- **Exemplo**: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

**Nota**: Todas as variáveis que começam com `NEXT_PUBLIC_` são expostas ao browser.

## Produção

Para produção, crie um arquivo `.env.production.local` ou configure as variáveis no seu serviço de hospedagem (Vercel, Netlify, etc).

Exemplo para produção:
```env
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com/api
```

**⚠️ IMPORTANTE**: 
- O arquivo `.env.local` não é commitado no Git (já está no `.gitignore`)
- Use `.env.example` como referência para criar seus arquivos de ambiente
