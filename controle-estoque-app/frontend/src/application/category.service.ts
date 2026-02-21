
import { v4 as uuidv4 } from 'uuid';
import { Category, CategoryInput } from '../domain/category.entity';
import { ICategoryRepository, IAuditLogRepository } from '../domain/repository.interface';

export class CategoryService {
  constructor(
    private categoryRepo: ICategoryRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async create(input: CategoryInput, userId: string = 'system'): Promise<Category> {
    console.log('🔍 [CategoryService] create - Starting...');
    console.log('📦 [CategoryService] Input:', input);
    console.log('👤 [CategoryService] User ID:', userId);
    
    const category: Category = {
      id: uuidv4(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('📝 [CategoryService] Generated category:', category);

    console.log('💾 [CategoryService] Calling repository.create...');
    const created = await this.categoryRepo.create(category);
    console.log('✅ [CategoryService] Repository returned:', created);

    console.log('📋 [CategoryService] Creating audit log...');
    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'category',
      entityId: created.id,
      action: 'CREATE',
      newValue: created,
      timestamp: new Date(),
      user: userId,
    });
    console.log('✅ [CategoryService] Audit log created');

    return created;
  }

  async update(id: string, updates: Partial<CategoryInput>, userId: string = 'system'): Promise<Category> {
    const current = await this.categoryRepo.findById(id);
    if (!current) throw new Error('Category not found');

    const updated = await this.categoryRepo.update(id, updates);
    
    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'category',
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
    const current = await this.categoryRepo.findById(id);
    if (!current) throw new Error('Category not found');

    await this.categoryRepo.delete(id);

    await this.auditRepo.create({
      id: uuidv4(),
      entityType: 'category',
      entityId: id,
      action: 'DELETE',
      previousValue: current,
      timestamp: new Date(),
      user: userId,
    });
  }

  async list(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  async get(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  }
}
