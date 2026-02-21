
export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  currentStock: number;
  totalRemoved: number;
  minimumStockAlert: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  lastRestockAt?: Date | null;
  lastModifiedBy?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  minimumStockAlert: number;
  initialStock?: number;
}

export type StockStatus = 'LOW' | 'MEDIUM' | 'GOOD';

export const getStockStatus = (current: number, min: number): StockStatus => {
  if (current <= min) return 'LOW';
  if (current <= min * 2) return 'MEDIUM';
  return 'GOOD';
};
