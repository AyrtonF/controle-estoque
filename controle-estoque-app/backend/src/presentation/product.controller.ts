
import { Request, Response } from 'express';
import { ProductService } from '../application/product.service';
import { ProductInput } from '../domain/product.entity';

export class ProductController {
  constructor(private productService: ProductService) {}

  async create(req: Request, res: Response) {
    try {
      const input: ProductInput = req.body;
      const product = await this.productService.create(input);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const product = await this.productService.update(id as string, updates);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.productService.delete(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const filters = req.query;
      const products = await this.productService.list(filters);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.get(id as string);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
