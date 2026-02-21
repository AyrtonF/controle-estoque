
import { Router } from 'express';
import { FileSystemProductRepository } from '../infrastructure/product.repository';
import { FileSystemCategoryRepository } from '../infrastructure/category.repository';
import { FileSystemAuditLogRepository } from '../infrastructure/audit-log.repository';
import { ProductService } from '../application/product.service';
import { CategoryService } from '../application/category.service';
import { StockService } from '../application/stock.service';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';
import { StockController } from './stock.controller';

const router = Router();

// Dependencies
const productRepo = new FileSystemProductRepository();
const categoryRepo = new FileSystemCategoryRepository();
const auditRepo = new FileSystemAuditLogRepository();

const productService = new ProductService(productRepo, auditRepo);
const categoryService = new CategoryService(categoryRepo, auditRepo);
const stockService = new StockService(productRepo, auditRepo);

const productController = new ProductController(productService);
const categoryController = new CategoryController(categoryService);
const stockController = new StockController(stockService);

// Product Routes
router.post('/products', (req, res) => productController.create(req, res));
router.put('/products/:id', (req, res) => productController.update(req, res));
router.delete('/products/:id', (req, res) => productController.delete(req, res));
router.get('/products', (req, res) => productController.list(req, res));
router.get('/products/:id', (req, res) => productController.get(req, res));

// Category Routes
router.post('/categories', (req, res) => categoryController.create(req, res));
router.put('/categories/:id', (req, res) => categoryController.update(req, res));
router.delete('/categories/:id', (req, res) => categoryController.delete(req, res));
router.get('/categories', (req, res) => categoryController.list(req, res));

// Stock Routes
router.post('/stock/restock', (req, res) => stockController.restock(req, res));
router.post('/stock/remove', (req, res) => stockController.removeStock(req, res));

// Audit Logs (Simple direct access for now, or add controller)
router.get('/audit-logs', async (req, res) => {
  const logs = await auditRepo.findAll();
  res.json(logs);
});

// Export/Backup Routes
router.get('/export', async (req, res) => {
  try {
    const products = await productRepo.findAll();
    const categories = await categoryRepo.findAll();
    const auditLogs = await auditRepo.findAll();
    
    res.json({
      products,
      categories,
      auditLogs,
      exportedAt: new Date().toISOString(),
      totalProducts: products.length,
      totalCategories: categories.length,
      totalAuditLogs: auditLogs.length
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

router.get('/backup/products', async (req, res) => {
  try {
    const products = await productRepo.findAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=products.json');
    res.json(products);
  } catch (error) {
    console.error('Backup products error:', error);
    res.status(500).json({ error: 'Failed to backup products' });
  }
});

router.get('/backup/categories', async (req, res) => {
  try {
    const categories = await categoryRepo.findAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.json');
    res.json(categories);
  } catch (error) {
    console.error('Backup categories error:', error);
    res.status(500).json({ error: 'Failed to backup categories' });
  }
});

router.get('/backup/audit-logs', async (req, res) => {
  try {
    const logs = await auditRepo.findAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.json');
    res.json(logs);
  } catch (error) {
    console.error('Backup audit logs error:', error);
    res.status(500).json({ error: 'Failed to backup audit logs' });
  }
});

export { router };
