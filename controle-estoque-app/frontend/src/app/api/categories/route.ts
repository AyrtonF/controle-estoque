
import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/infrastructure/services';
import { CategoryInput } from '@/domain/category.entity';

/**
 * GET /api/categories
 * Lista todas as categorias
 */
export async function GET() {
  try {
    const categories = await categoryService.list();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Cria uma nova categoria
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || 'system';

    // Validação básica
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const categoryInput: CategoryInput = {
      name: body.name,
      parentId: body.parentId,
    };

    const category = await categoryService.create(categoryInput, userId);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    );
  }
}
