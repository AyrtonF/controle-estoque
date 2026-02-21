
import { AuditLog } from '../domain/audit-log.entity';
import { IAuditLogRepository } from '../domain/repository.interface';
import { JsonDbHelper } from './json-db.helper';

export class FileSystemAuditLogRepository implements IAuditLogRepository {
  private db: JsonDbHelper<AuditLog>;

  constructor() {
    this.db = new JsonDbHelper<AuditLog>('audit-logs.json');
  }

  async create(log: AuditLog): Promise<AuditLog> {
    const logs = this.db.read();
    
    const serializedLog = {
      ...log,
      timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
    };
    
    logs.push(serializedLog);
    this.db.write(logs);
    return serializedLog;
  }

  async findAll(): Promise<AuditLog[]> {
    return this.db.read()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 1000); // Limita a 1000 registros mais recentes
  }

  async findByEntity(entityId: string): Promise<AuditLog[]> {
    return this.db.read()
      .filter(log => log.entityId === entityId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
