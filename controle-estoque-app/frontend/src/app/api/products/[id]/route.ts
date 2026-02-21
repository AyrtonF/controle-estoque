
import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/infrastructure/services';

// Força o uso do Node.js runtime para permitir acesso ao sistema de arquivos
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[id]
 * Busca um produto específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.get(id);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    const { id } = await params;
    console.error(`Error fetching product ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Product not found' },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Atualiza um produto
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || 'system';

    const product = await productService.update(id, body, userId);
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    const { id } = await params;
    console.error(`Error updating product ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Deleta (soft delete) um produto
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id') || 'system';
    
    await productService.delete(id, userId);
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const { id } = await params;
    console.error(`Error deleting product ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
