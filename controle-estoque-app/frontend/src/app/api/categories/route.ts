
import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/infrastructure/services';
import { CategoryInput } from '@/domain/category.entity';

// Força o uso do Node.js runtime para permitir acesso ao sistema de arquivos
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/categories
 * Lista todas as categorias
 */
export async function GET() {
  try {
    console.log('🔍 [API] GET /api/categories - Starting...');
    const categories = await categoryService.list();
    console.log('✅ [API] GET /api/categories - Success:', categories.length, 'categories');
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('❌ [API] Error fetching categories:', error);
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
    console.log('🔍 [API] POST /api/categories - Starting...');
    const body = await request.json();
    console.log('📦 [API] Request body:', body);
    
    const userId = request.headers.get('x-user-id') || 'system';
    console.log('👤 [API] User ID:', userId);

    // Validação básica
    if (!body.name) {
      console.log('❌ [API] Validation error: Name is required');
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const categoryInput: CategoryInput = {
      name: body.name,
      parentId: body.parentId,
    };
    console.log('📝 [API] Category input:', categoryInput);

    console.log('🔄 [API] Calling categoryService.create...');
    const category = await categoryService.create(categoryInput, userId);
    console.log('✅ [API] Category created:', category);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('❌ [API] Error creating category:', error);
    console.error('❌ [API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    );
  }
}
