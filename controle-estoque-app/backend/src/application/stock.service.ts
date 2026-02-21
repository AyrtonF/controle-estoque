
import { v4 as uuidv4 } from 'uuid';
import { IProductRepository, IAuditLogRepository } from '../domain/repository.interface';
import { getStockStatus } from '../domain/product.entity';

export class StockService {
  constructor(
    private productRepo: IProductRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async restock(productId: string, quantity: number, userId: string = 'system'): Promise<void> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('Product not found');

    const newStock = product.currentStock + quantity;
    
    await this.productRepo.update(productId, { 
      currentStock: newStock,
      lastRestockAt: new Date(),
      lastModifiedBy: userId,
      updatedAt: new Date(),
    });

    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'product',
      entityId: productId,
      action: 'RESTOCK',
      previousValue: product.currentStock,
      newValue: newStock,
      timestamp: new Date(),
      user: userId,
    });
  }

  async removeStock(productId: string, quantity: number, userId: string = 'system'): Promise<void> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('Product not found');

    if (product.currentStock < quantity) {
      throw new Error('Insufficient stock');
    }

    const newStock = product.currentStock - quantity;
    
    await this.productRepo.update(productId, { 
      currentStock: newStock,
      totalRemoved: (product.totalRemoved || 0) + quantity,
      lastModifiedBy: userId,
      updatedAt: new Date(),
    });

    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'product',
      entityId: productId,
      action: 'REMOVE_STOCK',
      previousValue: product.currentStock,
      newValue: newStock,
      timestamp: new Date(),
      user: userId,
    });
  }
}
