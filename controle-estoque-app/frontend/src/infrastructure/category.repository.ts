
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
    
    const serializedCategory = {
      ...category,
      createdAt: category.createdAt instanceof Date ? category.createdAt : new Date(category.createdAt),
      updatedAt: category.updatedAt instanceof Date ? category.updatedAt : new Date(category.updatedAt),
    };
    
    categories.push(serializedCategory);
    this.db.write(categories);
    return serializedCategory;
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = this.db.read();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCategory = { 
      ...categories[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    categories[index] = updatedCategory;
    this.db.write(categories);
    return updatedCategory;
  }

  async delete(id: string): Promise<boolean> {
    const categories = this.db.read();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    // Hard delete para categorias
    categories.splice(index, 1);
    this.db.write(categories);
    return true;
  }

  async findById(id: string): Promise<Category | null> {
    const categories = this.db.read();
    const category = categories.find(c => c.id === id);
    return category || null;
  }

  async findAll(): Promise<Category[]> {
    return this.db.read();
  }

  async findByParent(parentId: string): Promise<Category[]> {
    return this.db.read().filter(c => c.parentId === parentId);
  }
}
