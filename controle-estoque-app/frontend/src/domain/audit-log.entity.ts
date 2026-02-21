
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTOCK' | 'REMOVE_STOCK';

export interface AuditLog {
  id: string;
  entityType: 'product' | 'category';
  entityId: string;
  action: AuditAction;
  previousValue?: unknown;
  newValue?: unknown;
  timestamp: Date;
  user?: string;
}
