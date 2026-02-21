
import { Product } from './product.entity';
import { Category } from './category.entity';
import { AuditLog } from './audit-log.entity';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
}

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  update(id: string, category: Partial<Category>): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByParent(parentId: string): Promise<Category[]>;
}

export interface IAuditLogRepository {
  create(log: AuditLog): Promise<AuditLog>;
  findAll(): Promise<AuditLog[]>;
  findByEntity(entityId: string): Promise<AuditLog[]>;
}
