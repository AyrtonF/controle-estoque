
import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/infrastructure/services';

// Força o uso do Node.js runtime para permitir acesso ao sistema de arquivos
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/products/[id]/stock
 * Adiciona ou remove estoque de um produto
 * 
 * Body: { action: 'add' | 'remove', quantity: number }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || 'system';

    if (!body.action || !body.quantity) {
      return NextResponse.json(
        { error: 'Action and quantity are required' },
        { status: 400 }
      );
    }

    if (body.quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (body.action === 'add') {
      await stockService.restock(id, body.quantity, userId);
      return NextResponse.json(
        { message: 'Stock added successfully' },
        { status: 200 }
      );
    } else if (body.action === 'remove') {
      await stockService.removeStock(id, body.quantity, userId);
      return NextResponse.json(
        { message: 'Stock removed successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "add" or "remove"' },
        { status: 400 }
      );
    }
  } catch (error) {
    const { id } = await params;
    console.error(`Error updating stock for product ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update stock' },
      { status: 500 }
    );
  }
}
