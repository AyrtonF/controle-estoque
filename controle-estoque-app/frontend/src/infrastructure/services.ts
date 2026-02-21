
/**
 * Inicialização dos services e repositories
 * 
 * Este arquivo é um singleton que garante que temos apenas uma instância
 * de cada repository e service durante a execução da aplicação.
 */

import { FileSystemProductRepository } from './product.repository';
import { FileSystemCategoryRepository } from './category.repository';
import { FileSystemAuditLogRepository } from './audit-log.repository';
import { ProductService } from '../application/product.service';
import { CategoryService } from '../application/category.service';
import { StockService } from '../application/stock.service';

// Repositories (singleton instances)
const productRepository = new FileSystemProductRepository();
const categoryRepository = new FileSystemCategoryRepository();
const auditLogRepository = new FileSystemAuditLogRepository();

// Services (singleton instances)
export const productService = new ProductService(productRepository, auditLogRepository);
export const categoryService = new CategoryService(categoryRepository, auditLogRepository);
export const stockService = new StockService(productRepository, auditLogRepository);
