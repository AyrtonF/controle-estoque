
import { Request, Response } from 'express';
import { StockService } from '../application/stock.service';

export class StockController {
  constructor(private stockService: StockService) {}

  async restock(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid productId or quantity' });
      }
      await this.stockService.restock(productId, quantity);
      res.status(200).json({ message: 'Restocked successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeStock(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid productId or quantity' });
      }
      await this.stockService.removeStock(productId, quantity);
      res.status(200).json({ message: 'Stock removed successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
