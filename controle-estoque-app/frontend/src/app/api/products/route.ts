
import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/infrastructure/services';
import { ProductInput } from '@/domain/product.entity';

/**
 * GET /api/products
 * Lista todos os produtos (com filtros opcionais)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    const filters = categoryId ? { categoryId } : undefined;
    const products = await productService.list(filters);
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Cria um novo produto
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || 'system';

    // Validação básica
    if (!body.name || !body.categoryId) {
      return NextResponse.json(
        { error: 'Name and categoryId are required' },
        { status: 400 }
      );
    }

    const productInput: ProductInput = {
      name: body.name,
      description: body.description || '',
      categoryId: body.categoryId,
      subcategoryId: body.subcategoryId,
      minimumStockAlert: body.minimumStockAlert || 0,
      initialStock: body.initialStock || 0,
    };

    const product = await productService.create(productInput, userId);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}
