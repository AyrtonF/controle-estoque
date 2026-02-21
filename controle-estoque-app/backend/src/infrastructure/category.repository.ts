
import { Category } from '../domain/category.entity';
import { ICategoryRepository } from '../domain/repository.interface';
import { JsonDbHelper } from './json-db.helper';

export class FileSystemCategoryRepository implements ICategoryRepository {
  private db: JsonDbHelper<Category>;

  constructor() {
    this.db = new JsonDbHelper<Category>('categories.json');
  }

  async create(category: Category): Promise<Category> {
    const categories = this.db.read();
    categories.push(category);
    this.db.write(categories);
    return category;
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = this.db.read();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCategory = { ...categories[index], ...updates, updatedAt: new Date() };
    
    // Se parentId for null ou undefined, remover a propriedade
    if ('parentId' in updates && (updates.parentId === null || updates.parentId === undefined)) {
      delete updatedCategory.parentId;
    }
    
    categories[index] = updatedCategory;
    this.db.write(categories);
    return updatedCategory;
  }

  async delete(id: string): Promise<boolean> {
    const categories = this.db.read();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    categories.splice(index, 1); // Hard delete for categories as per spec logic implies soft delete for products
    this.db.write(categories);
    return true;
  }

  async findById(id: string): Promise<Category | null> {
    return this.db.read().find(c => c.id === id) || null;
  }

  async findAll(): Promise<Category[]> {
    return this.db.read();
  }

  async findByParent(parentId: string): Promise<Category[]> {
    return this.db.read().filter(c => c.parentId === parentId);
  }
}
