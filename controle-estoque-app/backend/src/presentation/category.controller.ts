
import { Request, Response } from 'express';
import { CategoryService } from '../application/category.service';
import { CategoryInput } from '../domain/category.entity';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async create(req: Request, res: Response) {
    try {
      const input: CategoryInput = req.body;
      const category = await this.categoryService.create(input);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const category = await this.categoryService.update(id as string, updates);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.categoryService.delete(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.list();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
