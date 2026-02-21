
import { Product } from '../domain/product.entity';
import { IProductRepository } from '../domain/repository.interface';
import { JsonDbHelper } from './json-db.helper';

export class FileSystemProductRepository implements IProductRepository {
  private db: JsonDbHelper<Product>;

  constructor() {
    this.db = new JsonDbHelper<Product>('products.json');
  }

  async create(product: Product): Promise<Product> {
    const products = this.db.read();
    
    // Serializa as datas antes de salvar
    const serializedProduct = {
      ...product,
      createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt),
    };
    
    products.push(serializedProduct);
    this.db.write(products);
    return serializedProduct;
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = this.db.read();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct = { 
      ...products[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    products[index] = updatedProduct;
    this.db.write(products);
    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    const products = this.db.read();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    // Soft delete
    const updatedProduct = { ...products[index], deletedAt: new Date() };
    products[index] = updatedProduct;
    this.db.write(products);
    return true;
  }

  async findById(id: string): Promise<Product | null> {
    const products = this.db.read();
    const product = products.find(p => p.id === id && !p.deletedAt);
    return product || null;
  }

  async findAll(): Promise<Product[]> {
    return this.db.read().filter(p => !p.deletedAt);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.db.read().filter(p => p.categoryId === categoryId && !p.deletedAt);
  }
}
