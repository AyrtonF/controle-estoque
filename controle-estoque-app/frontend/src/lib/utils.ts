// Tradução de ações
export const translateAction = (action: string): string => {
  const translations: Record<string, string> = {
    'CREATE': 'Criado',
    'UPDATE': 'Atualizado',
    'DELETE': 'Deletado',
    'RESTOCK': 'Reabastecido',
    'REMOVE_STOCK': 'Retirada',
  };
  return translations[action] || action;
};

// Tradução de status de estoque
export const translateStockStatus = (status: string): string => {
  const translations: Record<string, string> = {
    'LOW': 'Baixo',
    'MEDIUM': 'Médio',
    'GOOD': 'Bom',
  };
  return translations[status] || status;
};

// Tradução de entity type
export const translateEntityType = (entityType: string): string => {
  const translations: Record<string, string> = {
    'product': 'Produto',
    'category': 'Categoria',
  };
  return translations[entityType] || entityType;
};

// Formatar data
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calcular status do estoque
export const getStockStatus = (current: number, min: number): 'LOW' | 'MEDIUM' | 'GOOD' => {
  if (current <= min) return 'LOW';
  if (current <= min * 2) return 'MEDIUM';
  return 'GOOD';
};
