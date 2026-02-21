
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductInput } from '../domain/product.entity';
import { IProductRepository, IAuditLogRepository } from '../domain/repository.interface';
import { AuditLog } from '../domain/audit-log.entity';

export class ProductService {
  constructor(
    private productRepo: IProductRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async create(input: ProductInput, userId: string = 'system'): Promise<Product> {
    const { initialStock, ...productData } = input;
    const product: Product = {
      id: uuidv4(),
      ...productData,
      currentStock: initialStock || 0,
      totalRemoved: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedBy: userId,
    };

    const created = await this.productRepo.create(product);

    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'product',
      entityId: created.id,
      action: 'CREATE',
      newValue: created,
      timestamp: new Date(),
      user: userId,
    });

    return created;
  }

  async update(id: string, updates: Partial<ProductInput>, userId: string = 'system'): Promise<Product> {
    const current = await this.productRepo.findById(id);
    if (!current) throw new Error('Product not found');

    const updated = await this.productRepo.update(id, { ...updates, lastModifiedBy: userId });
    
    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'product',
      entityId: id,
      action: 'UPDATE',
      previousValue: current,
      newValue: updated,
      timestamp: new Date(),
      user: userId,
    });

    return updated!;
  }

  async delete(id: string, userId: string = 'system'): Promise<void> {
    const current = await this.productRepo.findById(id);
    if (!current) throw new Error('Product not found');

    await this.productRepo.delete(id);

    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'product',
      entityId: id,
      action: 'DELETE',
      previousValue: current,
      timestamp: new Date(),
      user: userId,
    });
  }

  async get(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async list(filters?: any): Promise<Product[]> {
    let products = await this.productRepo.findAll();
    
    if (filters) {
       // Apply filters in memory for now as per requirements
       if (filters.categoryId) {
         products = products.filter(p => p.categoryId === filters.categoryId);
       }
       if (filters.stockStatus) {
         // Logic for stock status filtering
         // LOW -> current <= min
         // MEDIUM -> current > min && current <= 2*min
         // GOOD -> current > 2*min
       }
       // Other filters...
    }
    return products;
  }
}
