
import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/infrastructure/services';

/**
 * GET /api/categories/[id]
 * Busca uma categoria específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryService.get(id);
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    const { id } = await params;
    console.error(`Error fetching category ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Category not found' },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 * Atualiza uma categoria
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || 'system';

    const category = await categoryService.update(id, body, userId);
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    const { id } = await params;
    console.error(`Error updating category ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Deleta uma categoria
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id') || 'system';
    
    await categoryService.delete(id, userId);
    
    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const { id } = await params;
    console.error(`Error deleting category ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: 500 }
    );
  }
}
