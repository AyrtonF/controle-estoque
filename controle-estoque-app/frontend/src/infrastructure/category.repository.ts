
import { Category } from '../domain/category.entity';
import { ICategoryRepository } from '../domain/repository.interface';
import { JsonDbHelper } from './json-db.helper';

export class FileSystemCategoryRepository implements ICategoryRepository {
  private db: JsonDbHelper<Category>;

  constructor() {
    this.db = new JsonDbHelper<Category>('categories.json');
  }

  async create(category: Category): Promise<Category> {
    console.log('🔍 [CategoryRepo] create - Starting...');
    console.log('📦 [CategoryRepo] Input category:', category);
    
    const categories = this.db.read();
    console.log('📚 [CategoryRepo] Current categories:', categories.length);
    
    const serializedCategory = {
      ...category,
      createdAt: category.createdAt instanceof Date ? category.createdAt : new Date(category.createdAt),
      updatedAt: category.updatedAt instanceof Date ? category.updatedAt : new Date(category.updatedAt),
    };
    console.log('💾 [CategoryRepo] Serialized category:', serializedCategory);
    
    categories.push(serializedCategory);
    console.log('✏️ [CategoryRepo] Writing to database...');
    this.db.write(categories);
    console.log('✅ [CategoryRepo] Category created successfully');
    
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
