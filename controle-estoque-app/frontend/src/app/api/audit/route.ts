
import { NextRequest, NextResponse } from 'next/server';
import { FileSystemAuditLogRepository } from '@/infrastructure/audit-log.repository';

const auditLogRepository = new FileSystemAuditLogRepository();

/**
 * GET /api/audit
 * Lista todos os logs de auditoria (ou por entidade)
 * 
 * Query params:
 * - entityId: filtra por ID da entidade
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    
    let logs;
    if (entityId) {
      logs = await auditLogRepository.findByEntity(entityId);
    } else {
      logs = await auditLogRepository.findAll();
    }
    
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
