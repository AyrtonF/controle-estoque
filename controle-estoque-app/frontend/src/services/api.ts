
import axios from 'axios';

/**
 * Cliente API configurado para consumir o backend Next.js
 * 
 * Como o backend agora está no mesmo domínio (Next.js API Routes),
 * usamos rotas relativas iniciando com /api
 * 
 * Não há mais necessidade de CORS ou variáveis de ambiente separadas.
 */
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar user ID (pode ser substituído por autenticação real)
api.interceptors.request.use((config) => {
  // Por padrão usa 'system', mas pode ser substituído por um user ID real
  if (!config.headers['x-user-id']) {
    config.headers['x-user-id'] = 'system';
  }
  return config;
});
